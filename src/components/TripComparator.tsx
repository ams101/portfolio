import { AlertTriangle } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  BENCHMARK,
  BRAND,
  COMPARATOR_PROMPT,
  FX_INR_PER_USD,
  RAW_PAGE_EXCERPTS,
  VIETNAM,
  type TripVariant,
} from '../data/genricTravel';

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

const fmtRange = (start: string, end: string) => {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  const d = (x: Date) => x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${d(s)} – ${d(e)} ${e.getFullYear()}`;
};

const sameList = (a: string[], b: string[]) => a.length === b.length && a.every(x => b.includes(x));

type Tab = 'page' | 'team';

const TripComparator = () => {
  const [tab, setTab] = useState<Tab>('page');
  const [variantId, setVariantId] = useState(VIETNAM.variants[0].id);
  const [comparing, setComparing] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [showHow, setShowHow] = useState(false);

  const variant = VIETNAM.variants.find(v => v.id === variantId)!;
  const [a, b] = VIETNAM.variants;

  return (
    <section id="comparator" aria-labelledby="comparator-title" className="scroll-mt-24 border-t-2 border-ink pt-10 mt-24">
      <div className="flex flex-col gap-2.5 max-w-[680px] pb-8">
        <h2 id="comparator-title" className="m-0 font-display font-medium text-[40px] md:text-[48px] leading-[1.05] tracking-[-0.02em]">Trip comparator</h2>
        <p className="m-0 text-lg md:text-[19px] text-ink-soft">
          Every travel page lists the same things differently. For {BRAND.name}, a fictional company, a model turns each page into one fixed structure, so trips
          can be compared side by side: by travellers on the trip page, and by the product team against competitors.
        </p>
      </div>

      <div role="tablist" aria-label="Comparator views" className="flex gap-6 border-b border-rule mb-8">
        {([
          ['page', 'On the trip page'],
          ['team', 'For the product team'],
        ] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`pb-3 -mb-px text-[15px] border-b-2 transition-colors ${
              tab === id ? 'border-accent text-ink font-medium' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'page' ? (
        <TripPageTab
          variant={variant}
          onPick={id => setVariantId(id)}
          comparing={comparing}
          setComparing={setComparing}
          a={a}
          b={b}
        />
      ) : (
        <TeamTab openRow={openRow} setOpenRow={setOpenRow} />
      )}

      {/* How it was generated */}
      <div className="mt-12">
        <button
          onClick={() => setShowHow(!showHow)}
          aria-expanded={showHow}
          className="w-full flex flex-wrap justify-between items-center gap-2 min-h-[64px] border-t border-ink border-b border-rule text-left"
        >
          <span className="font-display text-2xl">How this was generated</span>
          <span className="font-mono text-[13px] text-muted">Page text · prompt · structured output {showHow ? '−' : '+'}</span>
        </button>
        {showHow && <HowItWorks variant={variant} />}
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------

interface TripPageTabProps {
  variant: TripVariant;
  onPick: (id: string) => void;
  comparing: boolean;
  setComparing: (v: boolean) => void;
  a: TripVariant;
  b: TripVariant;
}

const TripPageTab = ({ variant, onPick, comparing, setComparing, a, b }: TripPageTabProps) => {
  const p = variant.parsed;
  const cheapest = Math.min(...variant.batches.map(x => x.priceInr));

  return (
    <div className="flex flex-col gap-8">
      {/* Mock trip page */}
      <div className="bg-white border border-rule">
        <div className="flex items-center justify-between px-5 md:px-7 py-3 border-b border-rule">
          <span className="font-display text-lg">{BRAND.name}</span>
          <span className="font-mono text-[11px] text-muted">Sample trip page</span>
        </div>
        <div className="px-5 md:px-7 py-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h3 className="m-0 font-display font-normal text-[30px] leading-[1.15]">{VIETNAM.name}</h3>
            <p className="m-0 text-sm text-muted">
              {p.pickup} → {p.drop} · {p.duration} · up to {VIETNAM.groupSize} travellers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Trip variants">
            {[a, b].map(v => (
              <button
                key={v.id}
                onClick={() => onPick(v.id)}
                aria-pressed={v.id === variant.id}
                className={`min-h-[40px] px-4 rounded border text-[15px] transition-colors ${
                  v.id === variant.id ? 'bg-ink border-ink text-paper' : 'border-rule-strong hover:border-ink'
                }`}
              >
                {v.name}
              </button>
            ))}
            <button onClick={() => setComparing(!comparing)} className="btn-accent ml-auto min-h-[40px] text-[15px]">
              {comparing ? 'Hide comparison' : 'Compare variants'}
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_280px]">
            <div className="flex flex-col gap-4 min-w-0">
              <p className="m-0 text-ink-soft">{p.whatYouDo}</p>
              <div>
                <p className="label m-0 mb-2">Day by day</p>
                <ol className="m-0 p-0 list-none grid gap-x-6 gap-y-1 sm:grid-cols-2 text-[15px]">
                  {p.dayPlan.map(d => (
                    <li key={d.day}>
                      <span className="font-mono text-xs text-muted mr-2">Day {d.day}</span>
                      {d.title}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="bg-paper border border-rule p-4 flex flex-col gap-2 self-start">
              <p className="m-0 text-sm text-muted">From</p>
              <p className="m-0 font-display text-[30px] leading-none">
                {inr(cheapest)} <span className="text-sm font-sans text-muted">/ person</span>
              </p>
              {variant.batches.map(bt => (
                <div key={bt.id} className="flex justify-between gap-2 text-[13px] border-t border-rule pt-2">
                  <span>{fmtRange(bt.start, bt.end)}</span>
                  <span className="text-muted text-right">
                    {bt.wasPriceInr && <s className="mr-1">{inr(bt.wasPriceInr)}</s>}
                    {bt.seatsLeft} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {comparing && <VariantComparison a={a} b={b} />}
    </div>
  );
};

const VariantComparison = ({ a, b }: { a: TripVariant; b: TripVariant }) => {
  const pa = a.parsed;
  const pb = b.parsed;
  const priceA = Math.min(...a.batches.map(x => x.priceInr));
  const priceB = Math.min(...b.batches.map(x => x.priceInr));
  const diff = priceB - priceA;
  const pct = Math.round((diff / priceA) * 100);

  const rows: { label: string; a: string; b: string; same: boolean }[] = [
    { label: 'Route', a: `${pa.pickup} → ${pa.drop}`, b: `${pb.pickup} → ${pb.drop}`, same: pa.pickup === pb.pickup && pa.drop === pb.drop },
    { label: 'Duration', a: pa.duration, b: pb.duration, same: pa.duration === pb.duration },
    {
      label: 'Day-by-day plan',
      a: `${pa.dayPlan.length} days`,
      b: `${pb.dayPlan.length} days`,
      same: pa.dayPlan.map(d => d.title).join() === pb.dayPlan.map(d => d.title).join(),
    },
    { label: 'Inclusions', a: `${pa.inclusions.length} items`, b: `${pb.inclusions.length} items`, same: sameList(pa.inclusions, pb.inclusions) },
    { label: 'Exclusions', a: `${pa.exclusions.length} items`, b: `${pb.exclusions.length} items`, same: sameList(pa.exclusions, pb.exclusions) },
    { label: 'Price per person', a: inr(priceA), b: `${inr(priceB)} (was ${inr(b.batches[0].wasPriceInr ?? priceB)})`, same: false },
    { label: 'Dates', a: `${a.batches.length} batches, Dec – Mar`, b: '25 Dec – 1 Jan only', same: false },
    {
      label: 'Seats left',
      a: a.batches.map(x => x.seatsLeft).join(' · '),
      b: String(b.batches[0].seatsLeft),
      same: false,
    },
  ];

  return (
    <div className="print-area flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="label m-0">Comparison · {VIETNAM.name}</p>
        <button onClick={() => window.print()} className="link text-[15px] no-print">
          Save as PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-[15px]">
          <thead>
            <tr className="border-b border-ink text-left">
              <th className="py-2 pr-4 font-mono text-xs font-normal text-muted w-[28%]">Field</th>
              <th className="py-2 pr-4 font-display text-lg font-normal">{a.name}</th>
              <th className="py-2 font-display text-lg font-normal">{b.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.label} className="border-b border-rule align-top">
                <td className="py-2.5 pr-4 text-muted">{r.label}</td>
                {r.same ? (
                  <td colSpan={2} className="py-2.5 text-muted">
                    Same in both <span className="text-[13px]">({r.a})</span>
                  </td>
                ) : (
                  <>
                    <td className="py-2.5 pr-4 font-medium">{r.a}</td>
                    <td className="py-2.5 font-medium">{r.b}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-rule p-5 flex flex-col gap-1.5">
        <p className="label m-0">What actually differs</p>
        <p className="m-0 font-display text-[22px] leading-[1.4]">
          Same route, same plan, same inclusions. The {b.name} variant costs {inr(diff)} ({pct}%) more for the
          festive dates.
        </p>
        <p className="m-0 text-ink-soft text-[15px]">
          If the dates don’t matter, the January to March batches are the same trip for less, with more seats left. The
          inclusions only look different on the two pages because they’re listed in a different order.
        </p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------

const TeamTab = ({ openRow, setOpenRow }: { openRow: string | null; setOpenRow: (id: string | null) => void }) => {
  const rows = useMemo(() => BENCHMARK.map(r => ({ ...r, perNight: r.priceInr / r.nights })), []);
  const ours = rows.find(r => r.ours)!;

  return (
    <div className="flex flex-col gap-6">
      <p className="m-0 text-ink-soft max-w-[680px]">
        The same extraction, pointed at competitors’ pages for a similar Vietnam trip. Each page is turned into the same
        fields, prices are normalised to rupees per night, and anything the model can’t pin down is flagged rather than
        guessed.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-ink text-left font-mono text-xs text-muted">
              <th className="py-2 pr-3 font-normal">Package</th>
              <th className="py-2 pr-3 font-normal">Nights</th>
              <th className="py-2 pr-3 font-normal">Price as shown</th>
              <th className="py-2 pr-3 font-normal text-right">In ₹</th>
              <th className="py-2 pr-3 font-normal text-right">Per night</th>
              <th className="py-2 pr-3 font-normal">Flights</th>
              <th className="py-2 pr-3 font-normal">Meals</th>
              <th className="py-2 font-normal">Flags</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const open = openRow === r.id;
              const warns = r.flags.filter(f => f.level === 'warn').length;
              return (
                <tr key={r.id} className={`border-b border-rule align-top ${r.ours ? 'bg-white' : ''}`}>
                  <td className="py-3 pr-3">
                    <button
                      onClick={() => setOpenRow(open ? null : r.id)}
                      aria-expanded={open}
                      className="text-left"
                    >
                      <span className={`block ${r.ours ? 'font-medium' : ''}`}>{r.name}</span>
                      <span className="block text-[13px] text-muted">{r.format}</span>
                      <span className="block text-[13px] text-accent mt-1">{open ? 'Hide page text −' : 'See page text +'}</span>
                    </button>
                    {open && (
                      <div className="mt-2 flex flex-col gap-2 max-w-[340px]">
                        <p className="m-0 font-mono text-[11px] leading-relaxed text-muted bg-paper-deep p-2">{r.rawExcerpt}</p>
                        {r.flightsNote && <p className="m-0 text-[13px] text-ink-soft">{r.flightsNote}</p>}
                        <p className="m-0 text-[13px] text-ink-soft">Route: {r.route}</p>
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-3 font-mono">{r.nights}</td>
                  <td className="py-3 pr-3">{r.priceShown}</td>
                  <td className="py-3 pr-3 text-right font-mono">{inr(r.priceInr)}</td>
                  <td className="py-3 pr-3 text-right font-mono font-medium">{inr(r.perNight)}</td>
                  <td className="py-3 pr-3">{r.flights === 'Unclear' ? <span className="text-amber-700">Unclear</span> : r.flights}</td>
                  <td className="py-3 pr-3">
                    {r.mealsCount === null ? <span className="text-amber-700">Unclear</span> : `${r.id === 'b' ? '≈' : ''}${r.mealsCount}`}
                    {r.mealsCount !== null && <span className="block text-[12px] text-muted">{r.meals}</span>}
                  </td>
                  <td className="py-3">
                    {r.flags.length === 0 ? (
                      <span className="text-muted">—</span>
                    ) : (
                      <ul className="m-0 p-0 list-none flex flex-col gap-1">
                        {r.flags.map(f => (
                          <li key={f.text} className={`text-[12px] leading-snug ${f.level === 'warn' ? 'text-amber-700' : 'text-muted'}`}>
                            {f.level === 'warn' && <AlertTriangle aria-hidden="true" size={12} strokeWidth={1.5} className="inline mr-1 align-[-1px]" />}
                            {f.text}
                          </li>
                        ))}
                      </ul>
                    )}
                    {warns > 0 && <span className="sr-only">{warns} warnings</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="m-0 font-mono text-[12px] text-muted">
        Normalised at ₹{FX_INR_PER_USD} = $1. Per night = price in ₹ ÷ nights, before adding anything the page lists as
        extra. Competitors anonymised; figures illustrative.
      </p>

      <div className="bg-white border border-rule p-5 flex flex-col gap-3">
        <p className="label m-0">Where we stand</p>
        <ul className="m-0 pl-5 list-disc marker:text-accent flex flex-col gap-2 text-[15px]">
          <li>
            <strong className="font-medium">Cheapest fixed-date group trip</strong> at about {inr(ours.priceInr / ours.nights)} a night,
            with no internal flights to add.
          </li>
          <li>
            <strong className="font-medium">Competitor A looks cheaper</strong> per night, but it’s a private tour that
            leaves out both internal flights and the visa. Like for like, the gap closes or reverses.
          </li>
          <li>
            <strong className="font-medium">Competitor B isn’t comparable on price:</strong> it includes return flights
            from Mumbai, every meal and a tour manager. Benchmark it on inclusions instead.
          </li>
          <li>
            <strong className="font-medium">Competitor C needs a human check</strong> before it goes in any report: the
            “Buy 1 Get 1” offer isn’t explained, and it’s a shorter, Hanoi-only trip.
          </li>
          <li>
            <strong className="font-medium">Our gap is dinners:</strong> we include 10 meals and no dinners; A includes 13
            and B every meal.
          </li>
        </ul>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------

const HowItWorks = ({ variant }: { variant: TripVariant }) => {
  const steps = [
    { n: 1, title: 'Paste or scrape the page', body: 'The page text as a browser sees it: menus, offers and footers included.' },
    { n: 2, title: 'Model + fixed schema', body: 'One prompt, one schema, strict rules: short bullets, JSON only.' },
    { n: 3, title: 'Structured output', body: 'Every trip lands in the same fields, whatever the source page looked like.' },
    { n: 4, title: 'Compare and flag', body: 'Code, not the model, does the maths, spots identical fields and flags anything uncertain.' },
  ];

  return (
    <div className="pt-10 pb-4 flex flex-col gap-10">
      <ol className="m-0 p-0 list-none grid gap-x-8 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {steps.map(s => (
          <li key={s.n} className="flex gap-3 py-4 border-t border-rule">
            <span className="font-mono text-[13px] text-accent pt-1">{s.n}</span>
            <div className="flex flex-col gap-1">
              <h3 className="m-0 font-display font-normal text-xl">{s.title}</h3>
              <p className="m-0 text-[14px] text-ink-soft">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2 min-w-0">
          <p className="label m-0">1 · Page text ({variant.name})</p>
          <pre className="m-0 bg-paper-deep border border-rule p-4 text-[12px] leading-relaxed font-mono whitespace-pre-wrap max-h-[340px] overflow-auto">
            {RAW_PAGE_EXCERPTS[variant.id]}
          </pre>
        </div>
        <div className="flex flex-col gap-2 min-w-0">
          <p className="label m-0">2 · The prompt (from the original prototype)</p>
          <pre className="m-0 bg-paper-deep border border-rule p-4 text-[12px] leading-relaxed font-mono whitespace-pre-wrap max-h-[340px] overflow-auto">
            {COMPARATOR_PROMPT}
          </pre>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="label m-0">3 · Structured output ({variant.name})</p>
        <pre className="m-0 bg-paper-deep border border-rule p-4 text-[12px] leading-relaxed font-mono whitespace-pre-wrap max-h-[360px] overflow-auto">
          {JSON.stringify(variant.parsed, null, 2)}
        </pre>
        <p className="m-0 text-[13px] text-muted">
          Illustrative output, written to match the pipeline’s schema. The prompt and schema are the real ones; the live
          version scraped each page with a headless browser and called GPT-4o.
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-[680px]">
        <p className="label m-0">What I’d improve next</p>
        <ul className="m-0 pl-5 list-disc marker:text-accent flex flex-col gap-1.5 text-[15px] text-ink-soft">
          <li>Use the model’s structured-output mode instead of asking for JSON in the prompt, and validate against the schema.</li>
          <li>Retry once on invalid output, then flag the page for a person rather than show a broken comparison.</li>
          <li>Lower the temperature from 0.4: this is extraction, not writing.</li>
          <li>Add fields that matter across sellers: currency, flights, meal counts, group format.</li>
        </ul>
      </div>
    </div>
  );
};

export default TripComparator;
