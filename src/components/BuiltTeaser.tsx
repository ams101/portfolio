import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Section from './Section';

interface BuiltTeaserProps {
  onTryTara: () => void;
  onSeeAll: () => void;
  onOpenSection: (id: string) => void;
}

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

const Row = ({ item, onOpenSection }: { item: Item; onOpenSection: (id: string) => void }) => {
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
  const cls = 'group w-full text-left flex flex-wrap sm:flex-nowrap items-center gap-x-6 gap-y-2 py-5';
  return item.href ? (
    <a href={item.href} target="_blank" rel="noopener" className={cls}>
      {body}
    </a>
  ) : (
    <button onClick={() => onOpenSection(item.section!)} className={cls}>
      {body}
    </button>
  );
};

const BuiltTeaser = ({ onTryTara, onSeeAll, onOpenSection }: BuiltTeaserProps) => (
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
          <button onClick={onTryTara} className="btn-accent">Start a 1-minute call</button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="flex-[0_1_300px] bg-ink text-[#EDEAE3] rounded-[28px] p-6 flex flex-col gap-3 min-h-[300px]"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-[#34322E]">
          <span className="w-9 h-9 rounded-full bg-[#EDEAE3] text-ink flex items-center justify-center font-serif text-lg">T</span>
          <span className="flex flex-col leading-tight">
            <span className="text-[15px]">Tara</span>
            <span className="font-mono text-[11px] text-[#A8A397]">Listening · 0:42</span>
          </span>
        </div>
        <p className="m-0 self-start max-w-[85%] bg-[#2A2825] px-3 py-2 rounded-[14px] text-sm leading-[1.45]">
          You&apos;re on the video KYC. It takes about three minutes. Can you do it now?
        </p>
        <p className="m-0 self-end max-w-[85%] bg-[#EDEAE3] text-ink px-3 py-2 rounded-[14px] text-sm leading-[1.45]">
          I&apos;m driving right now.
        </p>
        <p className="m-0 self-start max-w-[85%] bg-[#2A2825] px-3 py-2 rounded-[14px] text-sm leading-[1.45]">
          No problem. What time works for you later today?
        </p>
      </div>
    </div>

    <ul className="m-0 p-0 list-none mt-12 border-t border-ink">
      {MORE.map(item => (
        <li key={item.title} className="border-b border-rule">
          <Row item={item} onOpenSection={onOpenSection} />
        </li>
      ))}
    </ul>

    <div className="flex justify-end pt-5">
      <button onClick={onSeeAll} className="group link inline-flex items-center gap-2 text-base">
        See all demos and side projects <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} className="row-arrow" />
      </button>
    </div>
  </Section>
);

export default BuiltTeaser;
