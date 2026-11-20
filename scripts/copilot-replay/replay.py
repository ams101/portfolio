"""Replays the Intraday Co-Pilot's indicator engine (ticker_daemon.MinuteIndicators)
and scoring (engine.plan, policy.json thresholds) over historical one-minute candles."""
import sys, json, math, datetime as dt
from collections import deque, defaultdict
import pyarrow.parquet as pq

EMA_FAST, EMA_SLOW, RSI_LEN, BB_LEN, BB_STD = 9, 21, 14, 20, 2.0
ATR_LEN, DONCHIAN_LEN, VWAP_ROLL_MIN, VOL_BASELINE_MIN, ORB_WINDOW_MIN = 14, 20, 60, 20, 30
BACKFILL_MIN = 120
MIN_VOLX = 1.4  # policy.json thresholds.min_volx
IST = dt.timedelta(hours=5, minutes=30)
SYMS = ['RELIANCE','HDFCBANK','ICICIBANK','INFY','TCS','SBIN','BHARTIARTL','ITC','LT']

def load(raw, s):
    t = pq.read_table(f"{raw}/{s}.parquet").to_pylist()
    rows = []
    for r in t:
        ts = (r['timestamp'].replace(tzinfo=None) + IST)
        o, h, l, c, v = r['open'], r['high'], r['low'], r['close'], r['volume']
        if min(o, h, l, c) <= 0 or v < 0:  # bad rows in the source data
            continue
        rows.append((ts, o, h, l, c, v))
    return rows

class Ind:
    def __init__(s):
        s.bars=[]; s.close=deque(maxlen=max(BB_LEN,RSI_LEN,EMA_SLOW,ATR_LEN,DONCHIAN_LEN)); s.tr=deque(maxlen=ATR_LEN)
        s.vw=deque(maxlen=VWAP_ROLL_MIN); s.vol=deque(maxlen=VOL_BASELINE_MIN); s.ef=None; s.es=None; s.ag=None; s.al=None
        s.orb_hi=None; s.orb_lo=None
    def add(s, b, in_orb):
        ts,o,h,l,c,v=b; prev=s.bars[-1] if s.bars else None; s.bars.append(b); s.close.append(c)
        pcl = prev[4] if prev else c
        s.tr.append(max(h-l, abs(h-pcl), abs(l-pcl)))
        tp=(h+l+c)/3; s.vw.append((tp*v, v)); s.vol.append(v)
        if in_orb:
            s.orb_hi = h if s.orb_hi is None else max(s.orb_hi, h); s.orb_lo = l if s.orb_lo is None else min(s.orb_lo, l)
        for ln, attr in ((EMA_FAST,'ef'),(EMA_SLOW,'es')):
            k=2/(ln+1); pe=getattr(s,attr); pe=c if pe is None else pe; setattr(s,attr,pe+k*(c-pe))
        if prev:
            d=c-prev[4]; g=max(d,0.0); lo=max(-d,0.0)
            ag=g if s.ag is None else s.ag; al=lo if s.al is None else s.al
            s.ag=(ag*(RSI_LEN-1)+g)/RSI_LEN; s.al=(al*(RSI_LEN-1)+lo)/RSI_LEN
    def snap(s):
        ts,o,h,l,c,v=s.bars[-1]
        num=sum(n for n,_ in s.vw); den=sum(d for _,d in s.vw); vwap=num/den if den>0 else c
        closes=list(s.close)[-BB_LEN:]; mid=sum(closes)/len(closes); sd=math.sqrt(sum((x-mid)**2 for x in closes)/len(closes))
        base=sum(s.vol)/len(s.vol) if s.vol else 0
        al=s.al if s.al else 1e-9; rs=(s.ag or 0)/al if al>0 else 0
        return dict(c=round(c,2), vwap=round(vwap,2), vd=round((c-vwap)/vwap*100,2), vx=round(v/base,2) if base>0 else 0.0,
                    e9=round(s.ef,2), e21=round(s.es,2), rsi=round(100-100/(1+rs),1), bu=round(mid+BB_STD*sd,2), bl=round(mid-BB_STD*sd,2),
                    oh=None if s.orb_hi is None else round(s.orb_hi,2), ol=None if s.orb_lo is None else round(s.orb_lo,2), v=int(v))

def run_day(data, day):
    out={}
    for s, rows in data.items():
        today=[r for r in rows if r[0].date()==day and dt.time(9,15)<=r[0].time()<=dt.time(15,29)]
        if len(today) < 300: return None
        prev=[r for r in rows if r[0].date()<day][-BACKFILL_MIN:]
        ind=Ind()
        for b in prev: ind.add(b, False)
        snaps=[]
        for b in today:
            mins=(b[0].hour*60+b[0].minute)-(9*60+15)
            ind.add(b, mins < ORB_WINDOW_MIN)
            sn=ind.snap(); sn['t']=b[0].strftime('%H:%M'); snaps.append(sn)
        out[s]=snaps
    return out

def score(sn):  # engine.plan
    side='long' if sn['e9']>sn['e21'] else 'short'
    sc=50.0+(10 if sn['vx']>=MIN_VOLX else -5)+(5 if sn['vd']>=0 else -2)
    return side, sc, ('enter' if sn['vx']>=MIN_VOLX else 'wait')

if __name__=='__main__':
    raw=sys.argv[1]
    data={s:load(raw,s) for s in SYMS}
    days=sorted({r[0].date() for r in data['RELIANCE']})[1:]
    results=[]
    for d in days:
        snaps=run_day(data,d)
        if not snaps: continue
        # how instructive is this day: clean signals after the opening range, before 14:30,
        # where price is on the right side of VWAP for the EMA direction, and follows through 15 minutes later
        good=0; signals=0; follow=0
        for s, ss in snaps.items():
            for i,sn in enumerate(ss):
                if not ('09:45'<=sn['t']<='14:30'): continue
                side,sc,ready=score(sn)
                if ready!='enter': continue
                aligned=(side=='long' and sn['vd']>0) or (side=='short' and sn['vd']<0)
                if not aligned: continue
                signals+=1
                j=min(i+15,len(ss)-1); move=(ss[j]['c']-sn['c'])/sn['c']*100*(1 if side=='long' else -1)
                follow+= move>0.15
        results.append((d, signals, follow, round(follow/max(signals,1),2)))
    for r in sorted(results, key=lambda r: -r[2])[:10]: print(r)
    print('days scanned', len(results))
