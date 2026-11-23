import { ArrowLeft, ArrowRight } from 'lucide-react';
import Section from './Section';
import { hrefFor } from '../routes';
import { caseStudies } from '../data/caseStudies';
import { CASE_DIAGRAMS } from './CaseDiagrams';

interface CaseStudyDetailProps {
  caseStudyId: string;
}

const CaseStudyDetail = ({ caseStudyId }: CaseStudyDetailProps) => {
  const index = caseStudies.findIndex(s => s.id === caseStudyId);
  if (index === -1) return null;
  const study = caseStudies[index];
  const next = caseStudies[(index + 1) % caseStudies.length];
  const diagram = CASE_DIAGRAMS[study.id];

  return (
    <article>
      <header className="pt-16 md:pt-[72px] pb-14 flex flex-col gap-6">
        <a href={hrefFor.homeSection('work')} className="self-start inline-flex items-center gap-2 min-h-[44px] text-[14px] text-muted no-underline transition-colors hover:text-ink">
          <ArrowLeft aria-hidden="true" size={14} strokeWidth={1.5} /> All work
        </a>
        <h1 className="m-0 font-display font-medium text-[40px] md:text-[60px] leading-[1.08] tracking-[-0.03em] max-w-[900px]">
          {study.headline}
        </h1>
        <p className="m-0 text-lg md:text-xl leading-[1.55] text-ink-soft max-w-[680px]">{study.context}</p>
      </header>

      <section
        aria-label="At a glance"
        className="grid gap-x-8 gap-y-6 py-7 border-t border-ink border-b border-rule grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"
      >
        <div className="flex flex-col gap-1">
          <span className="text-[13px] text-muted">Role</span>
          <span>{study.roleTitle}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[13px] text-muted">Company</span>
          <span>{study.company}</span>
        </div>
        {study.stats.map(s => (
          <div key={s.label} className="flex flex-col gap-1">
            <span className="text-[13px] text-muted first-letter:uppercase">{s.label}</span>
            <span className="font-display text-[28px] leading-[1.1]">{s.value}</span>
          </div>
        ))}
      </section>

      {diagram && (
        <figure className="mt-14 mx-0 flex flex-col gap-3">
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <div className="bg-paper-deep/60 border border-rule p-4 md:p-8">
              <diagram.Diagram />
            </div>
          </div>
          <figcaption className="text-[13px] text-muted">
            Fig. 1 — {diagram.caption} <span className="text-[#8A857C]">Simplified diagram.</span>
          </figcaption>
        </figure>
      )}

      <Section label="What I owned" className="pt-24">
        <div className="max-w-[680px] flex flex-col gap-4">
          {study.roleIntro && <p className="m-0 text-ink-soft">{study.roleIntro}</p>}
          <ul className="m-0 pl-5 list-disc flex flex-col gap-2 marker:text-accent">
            {study.role.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section label="What I did" className="pt-24">
        <ol className="m-0 p-0 list-none">
          {study.initiatives.map((item, i) => (
            <li
              key={item.title}
              className={`flex flex-wrap gap-x-6 gap-y-2 py-6 border-t ${i === 0 ? 'border-ink' : 'border-rule'} ${
                i === study.initiatives.length - 1 ? 'border-b border-b-rule' : ''
              }`}
            >
              <span className="flex-[0_0_40px] text-[14px] font-medium text-accent tabular-nums">{i + 1}</span>
              <div className="flex-[1_1_520px] flex flex-col gap-1.5">
                <h3 className="m-0 font-display font-medium text-[24px] md:text-[26px] leading-[1.2] tracking-[-0.02em]">{item.title}</h3>
                <p className="m-0 text-ink-soft">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {study.lesson && (
        <blockquote className="mt-24 mx-0 py-10 border-y border-ink flex flex-wrap gap-8">
          <span className="label flex-[1_1_180px]">The lesson</span>
          <p className="flex-[999_1_640px] m-0 font-display font-medium text-[26px] md:text-[32px] leading-[1.25] tracking-[-0.01em]">{study.lesson}</p>
        </blockquote>
      )}

      <Section label="What changed" className="pt-24">
        <div className="flex flex-col gap-8">
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
            {study.stats.map(s => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="font-display text-[48px] leading-none">{s.value}</span>
                <span className="text-sm text-muted">{s.label}</span>
              </div>
            ))}
          </div>
          <ul className="m-0 pl-5 list-disc flex flex-col gap-2.5 text-ink-soft max-w-[680px] marker:text-accent">
            {study.impact.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>

      <a
        href={hrefFor.caseStudy(next.id)}
        className="group w-full text-left text-ink no-underline flex flex-wrap justify-between items-baseline gap-4 mt-28 mb-20 py-8 border-t-2 border-ink"
      >
        <span className="label">Next case study</span>
        <span className="font-display text-[28px] md:text-[36px] leading-[1.2]">
          {next.listTitle} <ArrowRight aria-hidden="true" size={28} strokeWidth={1.5} className="row-arrow inline-block align-[-0.1em]" />
        </span>
      </a>
    </article>
  );
};

export default CaseStudyDetail;
