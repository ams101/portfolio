import { ArrowRight } from 'lucide-react';
import Section from './Section';
import { hrefFor } from '../routes';
import { articles } from '../data/articles';

const Writing = () => (
  <Section id="writing" label="Writing" className="py-20 md:py-24 border-t border-rule">
    <ul className="m-0 p-0 list-none">
      {articles.map((article, i) => (
        <li key={article.id}>
          <a
            href={hrefFor.article(article.id)}
            className={`group w-full text-left text-ink no-underline flex flex-wrap items-baseline gap-x-6 gap-y-2 py-6 border-t ${
              i === 0 ? 'border-ink' : 'border-rule'
            }`}
          >
            <span className="flex-[1_1_420px] flex flex-col gap-1">
              <span className="font-display font-medium text-[22px] md:text-[24px] leading-[1.2] tracking-[-0.01em] group-hover:underline decoration-1 underline-offset-4 decoration-rule-strong">
                {article.title}
              </span>
              <span className="text-base text-muted">{article.subtitle}</span>
            </span>
            <span className="inline-flex items-center gap-2 text-[15px] font-medium text-accent">
              Read <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} className="row-arrow" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  </Section>
);

export default Writing;
