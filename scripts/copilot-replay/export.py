import sys, json, datetime as dt
sys.path.insert(0, sys.argv[3])
from replay import load, run_day, SYMS, IST
raw, out = sys.argv[1], sys.argv[2]
day = dt.date(2026, 10, 1)
data = {s: load(raw, s) for s in SYMS}
snaps = run_day(data, day)
# NIFTY: index has no volume, so only price is used (market context)
import pyarrow.parquet as pq
nifty = [r for r in pq.read_table(f"{raw}/NIFTY.parquet").to_pylist()]
nrows = [((r['timestamp'].replace(tzinfo=None) + IST), r['close']) for r in nifty]
prev_close = [c for t, c in nrows if t.date() < day][-1]
nday = {t.strftime('%H:%M'): round(c, 2) for t, c in nrows if t.date() == day and dt.time(9,15) <= t.time() <= dt.time(15,29)}
times = [s['t'] for s in snaps['RELIANCE']]
def prevc(s):
    return [r[4] for r in data[s] if r[0].date() < day][-1]
res = {
  "date": day.isoformat(),
  "times": times,
  "nifty": {"prevClose": round(prev_close, 2), "c": [nday.get(t) for t in times]},
  "stocks": {},
  "source": "Indian Stock Market Data (NSE) minute candles, Hugging Face dataset xxparthparekhxx/indian-stock-market-minute-data (MIT), sourced from Upstox",
}
for s, ss in snaps.items():
    by_t = {x['t']: x for x in ss}
    cols = {k: [] for k in ['c','vd','vx','e9','e21','rsi','bu','bl','oh','ol','v']}
    for t in times:
        x = by_t.get(t)
        for k in cols: cols[k].append(None if x is None else x[k])
    res["stocks"][s] = {"prevClose": round(prevc(s), 2), **cols}
json.dump(res, open(out, "w"), separators=(",", ":"))
print(len(times), "minutes;", round(len(open(out).read())/1024), "KB")
print("NIFTY", prev_close, "->", list(nday.values())[-1])
