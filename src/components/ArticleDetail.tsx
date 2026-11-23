import { ArrowLeft } from 'lucide-react';
import { articles } from '../data/articles';
import { hrefFor } from '../routes';

interface ArticleDetailProps {
  articleId: string;
}

const ArticleDetail = ({ articleId }: ArticleDetailProps) => {
  const article = articles.find(a => a.id === articleId);
  if (!article) return null;

  return (
    <article className="pb-24">
      <header className="pt-16 md:pt-[72px] pb-12 flex flex-col gap-6 max-w-[820px]">
        <a href={hrefFor.homeSection('writing')} className="self-start inline-flex items-center gap-2 min-h-[44px] text-[14px] text-muted no-underline transition-colors hover:text-ink">
          <ArrowLeft aria-hidden="true" size={14} strokeWidth={1.5} /> All writing
        </a>
        <h1 className="m-0 font-display font-medium text-[40px] md:text-[56px] leading-[1.08] tracking-[-0.03em]">
          {article.title}
        </h1>
        <p className="m-0 text-lg md:text-xl text-ink-soft">{article.subtitle}</p>
      </header>

      <div className="border-t border-ink pt-10 flex flex-wrap gap-x-8 gap-y-6">
        <aside className="flex-[1_1_220px] max-w-[300px] flex flex-col gap-2">
          <p className="label m-0">Why I wrote this</p>
          <p className="m-0 text-[15px] text-ink-soft leading-relaxed">{article.whyIWroteThis}</p>
        </aside>

        <div className="flex-[999_1_560px] min-w-0 max-w-[680px]">
          {article.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="font-display font-normal text-[30px] leading-[1.2] mt-12 mb-4">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              const [bold, ...rest] = paragraph.replace(/\*\*/g, '').split(':');
              return (
                <p key={index} className="mb-4 pl-4 border-l-2 border-accent">
                  <strong className="font-semibold">{bold}:</strong>
                  {rest.join(':')}
                </p>
              );
            }
            return (
              <p
                key={index}
                className={`mb-6 text-[18px] leading-[1.7] ${
                  index === 0 ? 'first-letter:font-display first-letter:text-[64px] first-letter:leading-[0.8] first-letter:float-left first-letter:pr-2 first-letter:pt-2 first-letter:text-accent' : ''
                }`}
              >
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
