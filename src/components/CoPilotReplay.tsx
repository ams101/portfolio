import { Check, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

// Replay of one real session through the Intraday Co-Pilot's own rules.
// Indicators were computed offline with the same maths as ticker_daemon.py;
// scoring below is engine.plan() with the policy.json threshold.

interface Series {
  prevClose: number;
  c: (number | null)[];
  vd: (number | null)[]; // % from 60-minute VWAP
  vx: (number | null)[]; // volume vs 20-minute average
  e9: (number | null)[];
  e21: (number | null)[];
  rsi: (number | null)[];
  oh: (number | null)[];
  ol: (number | null)[];
  bu: (number | null)[];
  bl: (number | null)[];
}

interface Replay {
  date: string;
  times: string[];
  nifty: { prevClose: number; c: (number | null)[] };
  stocks: Record<string, Series>;
  source: string;
}

const NAMES: Record<string, string> = {
  RELIANCE: 'Reliance Industries',
  HDFCBANK: 'HDFC Bank',
  ICICIBANK: 'ICICI Bank',
  INFY: 'Infosys',
  TCS: 'TCS',
  SBIN: 'State Bank of India',
  BHARTIARTL: 'Bharti Airtel',
  ITC: 'ITC',
  LT: 'Larsen & Toubro',
};

const DEFAULT_VOLX = 1.4; // policy.json thresholds.min_volx
const ORB_END = 30; // minutes after 09:15

interface Row {
  sym: string;
  price: number;
  chg: number;
  side: 'long' | 'short';
  score: number;
  ready: boolean;
  vwapOk: boolean;
  volOk: boolean;
  vd: number;
  vx: number;
  e9: number;
  e21: number;
  rsi: number;
  orb: 'above' | 'below' | 'inside' | 'forming';
}

function rowAt(sym: string, s: Series, i: number, minVolx: number): Row | null {
  const c = s.c[i];
  if (c == null) return null;
  const vd = s.vd[i] ?? 0;
  const vx = s.vx[i] ?? 0;
  const e9 = s.e9[i] ?? c;
  const e21 = s.e21[i] ?? c;
  const side = e9 > e21 ? 'long' : 'short';
  // engine.plan(): 50, +10 / -5 on the volume surge, +5 / -2 on holding VWAP
  const score = 50 + (vx >= minVolx ? 10 : -5) + (vd >= 0 ? 5 : -2);
  const oh = s.oh[i];
  const ol = s.ol[i];
  const orb = i < ORB_END ? 'forming' : oh != null && c > oh ? 'above' : ol != null && c < ol ? 'below' : 'inside';
  return {
    sym,
    price: c,
    chg: ((c - s.prevClose) / s.prevClose) * 100,
    side,
    score,
    ready: vx >= minVolx,
    vwapOk: vd >= 0,
    volOk: vx >= minVolx,
    vd,
    vx,
    e9,
    e21,
    rsi: s.rsi[i] ?? 50,
    orb,
  };
}

/** Plain-English read built from the same numbers the rules use. */
function readOut(r: Row): string {
  const vw = `${Math.abs(r.vd).toFixed(2)}% ${r.vd >= 0 ? 'above' : 'below'} its 60-minute VWAP`;
  const vol = `volume is ${r.vx.toFixed(1)}× the last 20 minutes`;
  const ema = `the 9-minute EMA is ${r.e9 > r.e21 ? 'above' : 'below'} the 21, so the bias is ${r.side}`;
  const orb =
    r.orb === 'forming'
      ? 'The opening range is still forming.'
      : r.orb === 'inside'
      ? 'Price is still inside the opening range.'
      : `Price has broken ${r.orb === 'above' ? 'above' : 'below'} the opening range.`;
  const rsi = r.rsi >= 70 ? ` RSI ${r.rsi.toFixed(0)} is stretched; chasing here is risky.` : r.rsi <= 30 ? ` RSI ${r.rsi.toFixed(0)} is stretched to the downside.` : '';
  const aligned = (r.side === 'long' && r.vd >= 0) || (r.side === 'short' && r.vd < 0);
  const verdict = r.ready
    ? aligned
      ? 'Setup ready, and price agrees with the bias: worth a look.'
      : 'Volume says go, but price is on the wrong side of VWAP for this bias: a reason to wait.'
    : 'No volume surge yet: wait.';
  return `${NAMES[r.sym] ?? r.sym} is ${vw}, ${vol}, and ${ema}. ${orb}${rsi} ${verdict}`;
}

const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

const Spark = ({ s, i }: { s: Series; i: number }) => {
  const W = 520;
  const H = 140;
  const n = s.c.length;
  const pts = s.c.map((c, k) => (c == null ? null : { k, c, vwap: c / (1 + (s.vd[k] ?? 0) / 100) }));
  const vals = pts.flatMap(p => (p ? [p.c, p.vwap] : []));
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const x = (k: number) => (k / (n - 1)) * W;
  const y = (v: number) => H - 8 - ((v - lo) / (hi - lo || 1)) * (H - 16);
  const path = (key: 'c' | 'vwap', upto: number) =>
    pts
      .slice(0, upto + 1)
      .filter(Boolean)
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'}${x(p!.k).toFixed(1)},${y(p![key]).toFixed(1)}`)
      .join(' ');
  const oh = s.oh[i];
  const ol = s.ol[i];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Price and VWAP through the session">
      {i >= ORB_END && oh != null && <line x1={x(ORB_END)} x2={W} y1={y(oh)} y2={y(oh)} stroke="#D4D4D4" strokeDasharray="4 4" />}
      {i >= ORB_END && ol != null && <line x1={x(ORB_END)} x2={W} y1={y(ol)} y2={y(ol)} stroke="#D4D4D4" strokeDasharray="4 4" />}
      <path d={path('vwap', i)} fill="none" stroke="#6B6B6B" strokeWidth={1} strokeDasharray="2 3" />
      <path d={path('c', i)} fill="none" stroke="#171717" strokeWidth={1.75} />
      <line x1={x(i)} x2={x(i)} y1={0} y2={H} stroke="#B42318" strokeWidth={1} />
    </svg>
  );
};

const CoPilotReplay = () => {
  const [data, setData] = useState<Replay | null>(null);
  const [error, setError] = useState(false);
  const [i, setI] = useState(45);
  const [playing, setPlaying] = useState(false);
  const [minVolx, setMinVolx] = useState(DEFAULT_VOLX);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHow, setShowHow] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    fetch('/data/copilot-replay.json')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((d: Replay) => setData(d))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (!playing || !data) return;
    timer.current = window.setInterval(() => {
      setI(prev => {
        if (prev >= data.times.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 160);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [playing, data]);

  const rows = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.stocks)
      .map(([sym, s]) => rowAt(sym, s, i, minVolx))
      .filter((r): r is Row => r !== null)
      .sort((a, b) => b.score - a.score || Math.abs(b.vd) - Math.abs(a.vd));
  }, [data, i, minVolx]);

  // How often the volume rule fires across the whole session at this threshold.
  const fireRate = useMemo(() => {
    if (!data) return null;
    let fired = 0;
    let total = 0;
    for (const s of Object.values(data.stocks)) {
      s.vx.forEach(v => {
        if (v == null) return;
        total++;
        if (v >= minVolx) fired++;
      });
    }
    return { fired, total };
  }, [data, minVolx]);

  const sel = rows.find(r => r.sym === (selected ?? rows[0]?.sym));
  const niftyNow = data?.nifty.c[i];
  const niftyChg = data && niftyNow != null ? ((niftyNow - data.nifty.prevClose) / data.nifty.prevClose) * 100 : null;
  const dateLabel = data ? new Date(data.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <section id="copilot" aria-labelledby="copilot-title" className="scroll-mt-24 border-t-2 border-ink pt-10">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
        <div className="flex flex-col gap-2.5 max-w-[680px]">
          <p className="m-0 font-mono text-xs text-muted">Personal project · live market data · decision support</p>
          <h2 id="copilot-title" className="m-0 font-display font-medium text-[40px] md:text-[48px] leading-[1.05] tracking-[-0.02em]">Intraday Co-Pilot</h2>
          <p className="m-0 text-lg md:text-[19px] text-ink-soft">
            It suggests and explains; I decide and execute. The co-pilot watches a live feed of NSE stocks, scores intraday
            setups against rules I can tune, and explains each one in plain English.
          </p>
          <p className="m-0 text-[15px] text-muted">
            I used it in live sessions with my own capital for two months: it flagged the setups, I made the calls, and the
            journal kept me honest.
          </p>
        </div>
        <a href="https://github.com/ams101/intraday-copilot" target="_blank" rel="noopener noreferrer" className="link text-[15px]">
          Code on GitHub ↗
        </a>
      </div>

      {error && <p className="text-ink-soft">The replay data couldn’t be loaded. Try refreshing the page.</p>}
      {!data && !error && <p className="text-muted font-mono text-sm">Loading the session…</p>}

      {data && (
        <div className="flex flex-col gap-5">
          {/* Controls */}
          <div className="bg-white border border-rule p-4 md:p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <p className="m-0">
                <span className="font-mono text-xs text-muted block">Replay of a real session</span>
                <span className="font-display text-xl">{dateLabel}</span>
              </p>
              <p className="m-0">
                <span className="font-mono text-xs text-muted block">Time</span>
                <span className="font-mono text-2xl tabular-nums">{data.times[i]}</span>
              </p>
              {niftyChg != null && (
                <p className="m-0">
                  <span className="font-mono text-xs text-muted block">NIFTY 50</span>
                  <span className={`font-mono text-lg tabular-nums ${niftyChg >= 0 ? 'text-positive' : 'text-negative'}`}>{pct(niftyChg)}</span>
                </p>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => {
                    if (i >= data.times.length - 1) setI(0);
                    setPlaying(p => !p);
                  }}
                  className="btn-primary min-h-[40px]"
                >
                  {playing ? 'Pause' : 'Play the day'}
                </button>
              </div>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="sr-only">Time of day</span>
              <input
                type="range"
                min={0}
                max={data.times.length - 1}
                value={i}
                onChange={e => {
                  setPlaying(false);
                  setI(Number(e.target.value));
                }}
                className="w-full accent-[#B42318]"
                aria-valuetext={data.times[i]}
              />
              <span className="flex justify-between font-mono text-[11px] text-muted">
                <span>09:15</span>
                <span>Opening range until 09:45</span>
                <span>15:29</span>
              </span>
            </label>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr] items-start">
            {/* Setups table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-ink text-left font-mono text-[11px] text-muted">
                    <th className="py-2 pr-2 font-normal">Stock</th>
                    <th className="py-2 pr-2 font-normal text-right">Price</th>
                    <th className="py-2 pr-2 font-normal">Bias</th>
                    <th className="py-2 pr-2 font-normal text-right">Score</th>
                    <th className="py-2 pr-2 font-normal">VWAP</th>
                    <th className="py-2 pr-2 font-normal">Volume</th>
                    <th className="py-2 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => {
                    const active = sel?.sym === r.sym;
                    return (
                      <tr
                        key={r.sym}
                        onClick={() => setSelected(r.sym)}
                        className={`border-b border-rule cursor-pointer ${active ? 'bg-white' : 'hover:bg-paper-deep'}`}
                      >
                        <td className="py-2 pr-2">
                          <button className="text-left font-medium" aria-pressed={active}>{r.sym}</button>
                          <span className={`block font-mono text-[11px] ${r.chg >= 0 ? 'text-positive' : 'text-negative'}`}>{pct(r.chg)}</span>
                        </td>
                        <td className="py-2 pr-2 text-right font-mono tabular-nums">{r.price.toFixed(2)}</td>
                        <td className="py-2 pr-2 capitalize">{r.side}</td>
                        <td className="py-2 pr-2 text-right font-mono">{r.score}</td>
                        <td className="py-2 pr-2">
                          <span className={r.vwapOk ? 'text-positive' : 'text-muted'}>{r.vwapOk ? <Check aria-label="yes" size={14} strokeWidth={1.5} className="inline" /> : <X aria-label="no" size={14} strokeWidth={1.5} className="inline" />}</span>{' '}
                          <span className="font-mono text-[12px] text-muted">{pct(r.vd)}</span>
                        </td>
                        <td className="py-2 pr-2">
                          <span className={r.volOk ? 'text-positive' : 'text-muted'}>{r.volOk ? <Check aria-label="yes" size={14} strokeWidth={1.5} className="inline" /> : <X aria-label="no" size={14} strokeWidth={1.5} className="inline" />}</span>{' '}
                          <span className="font-mono text-[12px] text-muted">{r.vx.toFixed(1)}×</span>
                        </td>
                        <td className="py-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded border text-[12px] ${
                              r.ready ? 'bg-warning-tint text-warning border-warning-line' : 'bg-paper-deep text-muted border-rule'
                            }`}
                          >
                            {r.ready ? 'Enter?' : 'Wait'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-2 mb-0 text-[12px] text-muted">Click a stock to see its read. Ranked by the co-pilot’s score at this minute.</p>
            </div>

            {/* Selected stock */}
            {sel && (
              <div className="bg-white border border-rule p-4 md:p-5 flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="m-0 font-display text-2xl">{NAMES[sel.sym] ?? sel.sym}</p>
                  <span className="font-mono text-[12px] text-muted">{sel.sym}</span>
                </div>
                <Spark s={data.stocks[sel.sym]} i={i} />
                <p className="m-0 font-mono text-[11px] text-muted">
                  — price · ··· 60-minute VWAP · - - opening range · <span className="text-accent">|</span> now
                </p>
                <p className="m-0 text-[15px] leading-relaxed">{readOut(sel)}</p>
                <dl className="m-0 grid grid-cols-4 gap-2 text-[12px] border-t border-rule pt-3">
                  {[
                    ['EMA 9', sel.e9.toFixed(1)],
                    ['EMA 21', sel.e21.toFixed(1)],
                    ['RSI 14', sel.rsi.toFixed(0)],
                    ['Range', sel.orb === 'forming' ? 'forming' : sel.orb],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-mono text-muted">{k}</dt>
                      <dd className="m-0 font-mono">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="m-0 text-[12px] text-muted">
                  Read generated from the rules. The live tool asked a model for this sentence; the replay doesn’t call one.
                </p>
              </div>
            )}
          </div>

          {/* Threshold */}
          <div className="bg-white border border-rule p-4 md:p-5 grid gap-4 md:grid-cols-[1fr_1.2fr] items-center">
            <label className="flex flex-col gap-2">
              <span className="text-[15px]">
                Volume surge needed: <strong className="font-mono">{minVolx.toFixed(1)}×</strong>{' '}
                <span className="text-muted text-[13px]">(policy.json default 1.4×)</span>
              </span>
              <input
                type="range"
                min={1.2}
                max={3}
                step={0.1}
                value={minVolx}
                onChange={e => setMinVolx(Number(e.target.value))}
                className="w-full accent-[#B42318]"
              />
            </label>
            {fireRate && (
              <p className="m-0 text-[15px] text-ink-soft">
                At {minVolx.toFixed(1)}×, the volume rule fires in{' '}
                <strong className="font-medium text-ink">{Math.round((fireRate.fired / fireRate.total) * 100)}%</strong> of stock-minutes
                this session. One-minute bars are noisy, so the rules shortlist and a person decides.
              </p>
            )}
          </div>

          <p className="m-0 font-mono text-[12px] text-muted">
            Not investment advice. A replay of historical prices for illustration; no returns or performance are shown or
            implied. Data: NSE one-minute candles from the “Indian Stock Market Data (NSE)” dataset on Hugging Face (MIT),
            sourced from Upstox.
          </p>
        </div>
      )}

      {/* How it works */}
      <div className="mt-10">
        <button
          onClick={() => setShowHow(!showHow)}
          aria-expanded={showHow}
          className="w-full flex flex-wrap justify-between items-center gap-2 min-h-[64px] border-t border-ink border-b border-rule text-left"
        >
          <span className="font-display text-2xl">How it works</span>
          <span className="font-mono text-[13px] text-muted">Live feed · indicators · rules · explanations {showHow ? '−' : '+'}</span>
        </button>
        {showHow && (
          <div className="pt-8 pb-2 flex flex-col gap-8">
            <ol className="m-0 p-0 list-none flex flex-col md:flex-row gap-2 md:items-stretch">
              {[
                ['Live ticks', 'Zerodha KiteTicker stream for up to 200 NSE and BSE stocks'],
                ['Minute bars', 'Ticks rolled into one-minute candles; 120 minutes backfilled on start'],
                ['Indicators', 'VWAP (60 min), volume vs 20-min average, EMA 9/21, RSI, Bollinger, opening range'],
                ['Rules', 'Score and readiness from thresholds in policy.json, re-ranked every few seconds'],
                ['Explain + journal', 'A model explains each setup in one sentence; every action I take is journalled'],
              ].map(([t, b], k, arr) => (
                <li key={t} className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                  <div className="flex-1 bg-white border border-rule px-3 py-3">
                    <p className="m-0 font-display text-lg">{k + 1}. {t}</p>
                    <p className="m-0 text-[13px] text-muted">{b}</p>
                  </div>
                  {k < arr.length - 1 && <span className="self-center text-muted rotate-90 md:rotate-0" aria-hidden="true">→</span>}
                </li>
              ))}
            </ol>
            <div className="grid gap-x-8 gap-y-4 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
              {[
                ['Rules shortlist, people decide', 'The score is deliberately simple and transparent. The model never places a trade; it only explains what the rules saw.'],
                ['Cost and rate limits built in', 'Model answers are cached for one to five minutes and API calls go through a token bucket, so a busy market doesn’t mean a big bill.'],
                ['Stale data is visible', 'The dashboard counts stocks whose feed has gone quiet, so a frozen price never looks like a calm one.'],
              ].map(([t, b]) => (
                <div key={t} className="border-t border-rule pt-3">
                  <p className="m-0 font-display text-lg">{t}</p>
                  <p className="m-0 text-[14px] text-ink-soft">{b}</p>
                </div>
              ))}
            </div>
            <p className="m-0 text-[13px] text-muted">
              Stack: FastAPI, Redis, a Python ticker service and a Next.js dashboard, run with Docker Compose.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoPilotReplay;
