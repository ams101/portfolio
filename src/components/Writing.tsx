import { BookOpen, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';

interface WritingProps {
  onReadArticle: (id: string) => void;
}

const Writing = ({ onReadArticle }: WritingProps) => {
  const articles = [
    {
      id: 'chatbots',
      icon: MessageSquare,
      title: 'Chatbots: What they are and how to get them right',
      subtitle: 'Designing chatbots as assistants, not annoying robots',
      description: 'A practical take on chatbots: what they are, why businesses use them and how to make them genuinely helpful. I cover tone of voice, UX simplicity, predictive search, testing, feedback loops, resolution tracking and why chatbots should augment - not replace - human support.',
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      id: 'gamestop',
      icon: TrendingUp,
      title: 'GameStop: The big short squeeze',
      subtitle: "Why Reddit could pull it off in the US - and why it's harder in India",
      description: "An explainer of how GameStop went from $10 to $483 on the back of short squeezes, options and Reddit coordination. I walk through how shorting works, why hedge funds got trapped and how India's SEBI rules, circuit filters and weak stock-lending culture make a replay much tougher.",
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section id="writing" className="py-24 px-6 bg-slate-950 relative">
      <div className="absolute inset-0 bg-grid-white"></div>

      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] animate-floatSlow"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 rounded-full text-teal-400 font-semibold text-sm mb-4 border border-teal-500/30 backdrop-blur-sm">
            <BookOpen className="w-4 h-4" />
            Featured Writing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Writing & product thinking
          </h2>
          <p className="text-lg text-slate-400">Thoughts on <span className="font-bold text-teal-400">product, technology and markets</span></p>
        </div>

        <div className="space-y-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden transition-all duration-500 hover:border-slate-700 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="p-8">
                <div className={`absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl ${article.gradient} opacity-5 rounded-full translate-x-32 translate-y-32 group-hover:opacity-10 transition-opacity duration-500`}></div>

                <div className="relative flex items-start gap-6 mb-6">
                  <div className={`relative flex-shrink-0 inline-flex p-4 rounded-2xl bg-gradient-to-br ${article.gradient} shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110`}>
                    <article.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="inline-block px-3 py-1 bg-slate-800/50 text-slate-400 rounded-lg text-xs font-bold mb-3 uppercase tracking-wide border border-slate-700/50">
                      {article.subtitle}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 leading-snug group-hover:text-teal-400 transition-colors duration-300">
                      {article.title}
                    </h3>

                    <p className="text-slate-400 leading-relaxed mb-6">
                      {article.description}
                    </p>

                    <button
                      onClick={() => onReadArticle(article.id)}
                      className="group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-105 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">Read full article</span>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform relative z-10" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Writing;
