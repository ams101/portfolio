import React from 'react';
import { TrendingUp, Percent, ThumbsUp, DollarSign } from 'lucide-react';

const Metrics = () => {
  const metrics = [
    {
      icon: DollarSign,
      value: '₹12 Cr+',
      label: 'annual GMV',
      caption: 'Zo-Trips at Zostel, ~15% MoM growth',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Percent,
      value: '+2.75% / +5%',
      label: 'revenue impact',
      caption: 'Quarterly revenue uplift & Monetization ARPO at Shaadi.com',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: ThumbsUp,
      value: '+28% / +15%',
      label: 'growth metrics',
      caption: 'B2B CSAT and online orders (US & Americas) at Careismatic',
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      icon: TrendingUp,
      value: '5%+ on ₹500 Cr+',
      label: 'cost savings',
      caption: 'Procure-to-Pay savings at Mavenvista',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-30"></div>

      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-300"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full text-blue-700 font-semibold text-sm mb-4 border border-blue-200/50 shadow-sm">
            <TrendingUp className="w-4 h-4 animate-bounce" />
            Impact & Results
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-4">Impact at a glance</h2>
          <p className="text-lg text-slate-600">Measurable outcomes across products and companies</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="group relative overflow-hidden p-8 rounded-2xl bg-white border-2 border-slate-100 hover:border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500`}></div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/50 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <div className={`relative inline-flex p-4 ${metric.bgColor} rounded-2xl mb-5 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500`}></div>
                  <metric.icon className={`w-8 h-8 ${metric.iconColor} relative z-10`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2 group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-500">
                  {metric.value}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {metric.label}
                </div>
                <div className="text-sm text-slate-600 leading-relaxed">
                  {metric.caption}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Metrics;
