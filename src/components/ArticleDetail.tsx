import { ArrowLeft } from 'lucide-react';
import { articles } from '../data/articles';
import { hrefFor } from '../routes';

interface ArticleDetailProps {
  articleId: string;
}

// The essays are plain text with **bold** runs; render those as <strong> instead of
// showing the asterisks.
const renderInline = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );

const ArticleDetail = ({ articleId }: ArticleDetailProps) => {
  const article = articles.find(a => a.id === articleId);
  if (!article) return null;

  return (
    <article className="pb-24">
      <header className="pt-16 md:pt-[72px] pb-12 flex flex-col gap-6 max-w-[820px]">
        <a href={hrefFor.homeSection('writing')} className="self-start inline-flex items-center gap-2 min-h-[44px] text-[14px] text-muted no-underline transition-colors hover:text-ink">
          <ArrowLeft aria-hidden="true" size={14} strokeWidth={1.5} /> All writing
        </a>
        <h1 className="m-0 [text-wrap:balance] font-display font-medium text-[40px] md:text-[56px] leading-[1.08] tracking-[-0.03em]">
          {article.title}
        </h1>
        <p className="m-0 text-lg md:text-xl text-ink-soft">{article.subtitle}</p>
      </header>

      <div className="border-t border-ink pt-10 flex flex-wrap gap-x-8 gap-y-6">
        <aside className="flex-[1_1_220px] max-w-[300px] flex flex-col gap-2 self-start md:sticky md:top-8">
          <p className="label m-0">Why I wrote this</p>
          <p className="m-0 text-[15px] text-ink-soft leading-relaxed">{article.whyIWroteThis}</p>
        </aside>

        <div className="flex-[999_1_560px] min-w-0 max-w-[680px]">
          {article.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="font-display font-medium text-[28px] md:text-[30px] leading-[1.2] tracking-[-0.02em] mt-12 mb-4">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            // A paragraph that is bold from end to end is a small heading in the essay.
            const whole = paragraph.match(/^\*\*([^*]+)\*\*$/);
            if (whole) {
              return (
                <h3 key={index} className="font-display font-medium text-[22px] leading-[1.3] tracking-[-0.01em] mt-10 mb-3">
                  {whole[1].replace(/[.:]\s*$/, '')}
                </h3>
              );
            }
            return (
              <p key={index} className="mb-6 text-[18px] leading-[1.7] max-w-[60ch]">
                {renderInline(paragraph)}
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
