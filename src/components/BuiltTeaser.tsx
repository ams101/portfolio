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
        <span className="font-display font-medium text-[22px] md:text-[24px] leading-[1.2] tracking-[-0.01em] group-hover:underline decoration-1 underline-offset-4 decoration-rule-strong">
          {item.title}
        </span>
        <span className="text-[15px] text-muted">{item.line}</span>
      </span>
      <span className="flex items-baseline gap-5 sm:flex-col sm:items-end sm:gap-2 whitespace-nowrap">
        <span className="text-[13px] text-muted">{item.kind}</span>
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

const BuiltTeaser = () => (
  <Section id="built" label="Things I’ve built" note={`${MORE.length + 1} you can try`} className="py-20 md:py-24 border-t border-rule">
    <div className="pt-8 border-t border-ink">
      <div className="flex flex-col gap-4 max-w-[640px]">
        <h3 className="m-0 font-display font-medium text-[32px] leading-[1.1] tracking-[-0.02em]">Talk to Tara</h3>
        <p className="m-0 text-ink-soft">
          A real voice AI agent, working for a concept company. She calls approved credit-card customers and gets them to
          an active card, one step at a time, in Hindi or English. Pick a situation and try to trip her up.
        </p>
        <div className="pt-2">
          <a href={hrefFor.built('tara')} className="btn-accent">Start a 1-minute call</a>
        </div>
    </div>
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
