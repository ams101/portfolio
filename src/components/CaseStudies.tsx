import { ArrowRight } from 'lucide-react';
import Section from './Section';
import { hrefFor } from '../routes';
import { caseStudies } from '../data/caseStudies';

const CaseStudies = () => (
  <Section id="work" label="Work" className="py-20 md:py-24">
    <ul className="m-0 p-0 list-none">
      {caseStudies.map((study, i) => (
        <li key={study.id}>
          <a
            href={hrefFor.caseStudy(study.id)}
            className={`group w-full text-left text-ink no-underline flex flex-wrap items-baseline gap-x-6 gap-y-2 py-6 border-t ${
              i === 0 ? 'border-ink' : 'border-rule'
            }`}
          >
            <span className="label flex-[0_0_170px]">{study.company}</span>
            <span className="flex-[1_1_380px] flex flex-col gap-1">
              <span className="font-serif text-[26px] md:text-[28px] leading-[1.2] group-hover:underline decoration-1 underline-offset-4 decoration-rule-strong">
                {study.listTitle}
              </span>
              <span className="text-base text-muted">{study.listLine}</span>
            </span>
            <ArrowRight aria-hidden="true" size={20} strokeWidth={1.5} className="row-arrow hidden sm:block self-center shrink-0" />
          </a>
        </li>
      ))}
    </ul>
  </Section>
);

export default CaseStudies;
