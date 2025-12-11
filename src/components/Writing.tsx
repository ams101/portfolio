import React from 'react';
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
      description: 'A practical take on chatbots: what they are, why businesses use them and how to make them genuinely helpful. I cover tone of voice, UX simplicity, predictive search, testing, feedback loops, resolution tracking and why chatbots should augment — not replace — human support.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      id: 'gamestop',
      icon: TrendingUp,
      title: 'GameStop: The big short squeeze',
      subtitle: 'Why Reddit could pull it off in the US - and why it\'s harder in India',
      description: 'An explainer of how GameStop went from $10 to $483 on the back of short squeezes, options and Reddit coordination. I walk through how shorting works, why hedge funds got trapped and how India\'s SEBI rules, circuit filters and weak stock-lending culture make a replay much tougher.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <section id="writing" className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-100 to-blue-50 rounded-full text-slate-700 font-semibold text-sm mb-4 border border-slate-200/50 shadow-sm">
            <BookOpen className="w-4 h-4" />
            Featured Writing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
            Writing & product thinking
          </h2>
          <p className="text-lg text-slate-600">Thoughts on <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">product, technology and markets</span></p>
        </div>

        <div className="space-y-6">
          {articles.map((article) => (
            <div
              key={article.id}
              id={article.id}
              className="group relative bg-white rounded-2xl shadow-lg border-2 border-slate-100 overflow-hidden transition-all duration-500 hover:border-slate-200 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="p-8">
                <div className={`absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl ${article.color} opacity-5 rounded-full translate-x-32 translate-y-32 group-hover:opacity-[0.12] transition-opacity duration-500`}></div>

                <div className="relative flex items-start gap-6 mb-6">
                  <div className={`relative flex-shrink-0 inline-flex p-4 ${article.bgColor} rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${article.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500`}></div>
                    <article.icon className={`w-8 h-8 ${article.iconColor} relative z-10`} />
                  </div>

                  <div className="flex-1">
                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 rounded-lg text-xs font-bold mb-3 uppercase tracking-wide border border-slate-200">
                      {article.subtitle}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-blue-600 transition-colors duration-300">
                      {article.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed mb-6">
                      {article.description}
                    </p>

                    <button
                      onClick={() => onReadArticle(article.id)}
                      className="group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
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
