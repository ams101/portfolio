import Section from './Section';
import { articles } from '../data/articles';

interface WritingProps {
  onReadArticle: (id: string) => void;
}

const Writing = ({ onReadArticle }: WritingProps) => (
  <Section id="writing" label="Writing" className="py-20 md:py-24 border-t border-rule">
    <ul className="m-0 p-0 list-none">
      {articles.map((article, i) => (
        <li key={article.id}>
          <button
            onClick={() => onReadArticle(article.id)}
            className={`group w-full text-left flex flex-wrap items-baseline gap-x-6 gap-y-2 py-6 border-t ${
              i === 0 ? 'border-ink' : 'border-rule'
            } ${i === articles.length - 1 ? 'border-b border-b-rule' : ''}`}
          >
            <span className="flex-[1_1_420px] flex flex-col gap-1">
              <span className="font-serif text-[26px] leading-[1.2] group-hover:underline decoration-1 underline-offset-4 decoration-rule-strong">
                {article.title}
              </span>
              <span className="text-base text-muted">{article.subtitle}</span>
            </span>
            <span className="row-arrow text-[15px] font-medium">Read →</span>
          </button>
        </li>
      ))}
    </ul>
  </Section>
);

export default Writing;
