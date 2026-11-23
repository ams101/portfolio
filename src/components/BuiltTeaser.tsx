import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Section from './Section';
import { hrefFor } from '../routes';


type Item = {
  title: string;
  line: string;
  kind: string;
  thumb: string;
  alt: string;
  cta: string;
} & ({ section: string; href?: never } | { href: string; section?: never });

const MORE: Item[] = [
  {
    title: 'GenRicTravel Ops',
    line: 'The back office for a trips business: vendors, supply and trip operations in one app.',
    kind: 'Full app',
    thumb: '/thumbs/ops.jpg',
    alt: 'GenRicTravel Ops: assigning vendors to a trip batch',
    cta: 'Open',
    href: '/apps/supply/',
  },
  {
    title: 'Trip comparator',
    line: 'Messy trip pages in, a clean side-by-side out, for travellers and the pricing team.',
    kind: 'Interactive',
    thumb: '/thumbs/comparator.jpg',
    alt: 'Trip comparator: two trip variants compared side by side',
    cta: 'Try',
    section: 'comparator',
  },
  {
    title: 'ID check at checkout',
    line: 'Tax-compliance checks that don’t reject real customers over a “Mohd” vs “Mohammed”.',
    kind: 'Interactive',
    thumb: '/thumbs/id-check.jpg',
    alt: 'ID check: traveller view and ops review queue',
    cta: 'Try',
    section: 'id-check',
  },
  {
    title: 'Intraday Co-Pilot',
    line: 'Live-market decision support I used with my own capital, replayed on a real session.',
    kind: 'Replay',
    thumb: '/thumbs/copilot.jpg',
    alt: 'Intraday Co-Pilot: ranked setups and a stock read',
    cta: 'Play',
    section: 'copilot',
  },
];

const Row = ({ item }: { item: Item }) => {
  const body = (
    <>
      <span className="hidden sm:block flex-[0_0_168px] h-[104px] overflow-hidden border border-rule bg-paper-deep">
        <img src={item.thumb} alt={item.alt} loading="lazy" width={168} height={104} className="w-full h-full object-cover object-top" />
      </span>
      <span className="flex-[1_1_300px] min-w-0 flex flex-col gap-1">
        <span className="font-serif text-[24px] md:text-[26px] leading-[1.2] group-hover:underline decoration-1 underline-offset-4 decoration-rule-strong">
          {item.title}
        </span>
        <span className="text-[15px] text-muted">{item.line}</span>
      </span>
      <span className="flex items-baseline gap-5 sm:flex-col sm:items-end sm:gap-2 whitespace-nowrap">
        <span className="font-mono text-xs text-muted">{item.kind}</span>
        <span className="inline-flex items-center gap-2 text-[15px] font-medium text-accent">
          {item.cta}
          {item.href ? (
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} className="row-arrow" />
          ) : (
            <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} className="row-arrow" />
          )}
        </span>
      </span>
    </>
  );
  const cls = 'group w-full text-left text-ink no-underline flex flex-wrap sm:flex-nowrap items-center gap-x-6 gap-y-2 py-5';
  return item.href ? (
    <a href={item.href} target="_blank" rel="noopener" className={cls}>
      {body}
    </a>
  ) : (
    <a href={hrefFor.built(item.section)} className={cls}>
      {body}
    </a>
  );
};

// The call plays once when it scrolls into view: each line arrives from its
// speaker's side, the status follows whose turn it is, the clock runs 0:36 → 0:42.
const CALL = [
  { at: 0, from: 'tara', text: 'You’re on the video KYC. It takes about three minutes. Can you do it now?' },
  { at: 2600, from: 'caller', text: 'I’m driving right now.' },
  { at: 4000, from: 'tara', text: 'No problem. What time works for you later today?' },
] as const;
const START_SEC = 36;
const END_SEC = 42;

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const TaraCall = () => {
  const ref = useRef<HTMLDivElement>(null);
  const skip = reducedMotion() || typeof IntersectionObserver === 'undefined';
  const [shown, setShown] = useState(skip ? CALL.length : 0);
  const [sec, setSec] = useState(skip ? END_SEC : START_SEC);
  const [started, setStarted] = useState(skip);

  useEffect(() => {
    if (skip || !ref.current) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [skip]);

  useEffect(() => {
    if (!started || skip) return;
    const timers = CALL.map((line, i) => window.setTimeout(() => setShown(i + 1), line.at));
    const clock = window.setInterval(() => setSec(s => (s < END_SEC ? s + 1 : s)), 1000);
    const stop = window.setTimeout(() => window.clearInterval(clock), (END_SEC - START_SEC) * 1000 + 50);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearInterval(clock);
      window.clearTimeout(stop);
    };
  }, [started, skip]);

  const speaking = shown > 0 && CALL[shown - 1].from === 'tara' && sec < END_SEC;
  const status = !started ? 'Ringing' : speaking ? 'Speaking' : 'Listening';

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="flex-[0_1_300px] bg-ink text-[#EDEAE3] rounded-[28px] p-6 flex flex-col gap-3 min-h-[300px]"
    >
      <div className="flex items-center gap-3 pb-3 border-b border-[#34322E]">
        <span className="w-9 h-9 rounded-full bg-[#EDEAE3] text-ink flex items-center justify-center font-serif text-lg">T</span>
        <span className="flex flex-col leading-tight">
          <span className="text-[15px]">Tara</span>
          <span className="font-mono text-[11px] text-[#A8A397] tabular-nums">
            {status} · 0:{String(sec).padStart(2, '0')}
          </span>
        </span>
      </div>
      {CALL.map((line, i) => (
        <p
          key={i}
          data-on={i < shown ? '' : undefined}
          className={`call-line m-0 max-w-[85%] px-3 py-2 rounded-[14px] text-sm leading-[1.45] ${
            line.from === 'tara' ? 'self-start bg-[#2A2825]' : 'call-line--caller self-end bg-[#EDEAE3] text-ink'
          }`}
        >
          {line.text}
        </p>
      ))}
    </div>
  );
};

const BuiltTeaser = () => (
  <Section id="built" label="Things I’ve built" className="py-20 md:py-24 border-t border-rule">
    <div className="flex justify-end -mt-1 mb-2">
      <span className="font-mono text-xs text-muted">{MORE.length + 1} things you can try</span>
    </div>
    <div className="flex flex-wrap items-center gap-10 pt-6 border-t border-ink">
      <div className="flex-[1_1_340px] flex flex-col gap-4">
        <h3 className="m-0 font-serif font-normal text-[40px] leading-[1.1]">Talk to Tara</h3>
        <p className="m-0 text-ink-soft">
          A real voice AI agent, working for a concept company. She calls approved credit-card customers and gets them to an active card, one step at a time, in Hindi or
          English. Pick a situation and try to trip her up.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <a href={hrefFor.built('tara')} className="btn-accent">Start a 1-minute call</a>
        </div>
      </div>

      <TaraCall />
    </div>

    <ul className="m-0 p-0 list-none mt-12 border-t border-ink">
      {MORE.map(item => (
        <li key={item.title} className="border-t border-rule first:border-t-0">
          <Row item={item} />
        </li>
      ))}
    </ul>

    <div className="flex justify-end pt-5">
      <a href={hrefFor.built()} className="group link inline-flex items-center gap-2 text-base text-ink">
        See all demos and side projects <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} className="row-arrow" />
      </a>
    </div>
  </Section>
);

export default BuiltTeaser;
