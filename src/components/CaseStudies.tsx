import Section from './Section';
import { caseStudies } from '../data/caseStudies';

interface CaseStudiesProps {
  onViewDetails: (id: string) => void;
}

const CaseStudies = ({ onViewDetails }: CaseStudiesProps) => (
  <Section id="work" label="01 — Work" className="pt-24 pb-10">
    <ul className="m-0 p-0 list-none">
      {caseStudies.map((study, i) => (
        <li key={study.id}>
          <button
            onClick={() => onViewDetails(study.id)}
            className={`group w-full text-left flex flex-wrap items-baseline gap-x-6 gap-y-2 py-6 border-t ${
              i === 0 ? 'border-ink' : 'border-rule'
            } ${i === caseStudies.length - 1 ? 'border-b border-b-rule' : ''}`}
          >
            <span className="label flex-[0_0_170px]">{study.company}</span>
            <span className="flex-[1_1_380px] flex flex-col gap-1">
              <span className="font-serif text-[26px] md:text-[28px] leading-[1.2] group-hover:underline decoration-1 underline-offset-4 decoration-rule-strong">
                {study.listTitle}
              </span>
              <span className="text-base text-muted">{study.listLine}</span>
            </span>
            <span className="row-arrow text-[22px]" aria-hidden="true">→</span>
          </button>
        </li>
      ))}
    </ul>
  </Section>
);

export default CaseStudies;
