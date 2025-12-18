import { TrendingUp, Percent, ThumbsUp, DollarSign } from 'lucide-react';

const Metrics = () => {
  const metrics = [
    {
      icon: DollarSign,
      value: 'Rs. 12 Cr+',
      label: 'annual GMV',
      caption: 'Zo-Trips at Zostel, ~15% MoM growth',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Percent,
      value: '+2.75% / +5%',
      label: 'revenue impact',
      caption: 'Quarterly revenue uplift & Monetization ARPO at Shaadi.com',
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      icon: ThumbsUp,
      value: '+28% / +15%',
      label: 'growth metrics',
      caption: 'B2B CSAT and online orders (US & Americas) at Careismatic',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: TrendingUp,
      value: '5%+ on Rs. 500 Cr+',
      label: 'cost savings',
      caption: 'Procure-to-Pay savings at Mavenvista',
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <section id="metrics-section" className="relative py-20 px-6 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white"></div>

      <div className="absolute top-10 left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px] animate-floatSlow"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] animate-floatSlow delay-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 rounded-full text-teal-400 font-semibold text-sm mb-4 border border-teal-500/30 backdrop-blur-sm">
            <TrendingUp className="w-4 h-4" />
            Impact & Results
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Impact at a glance</h2>
          <p className="text-lg text-slate-400">Measurable outcomes across products and companies</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="group relative overflow-hidden p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 hover:border-slate-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

              <div className="relative">
                <div className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${metric.gradient} mb-5 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110`}>
                  <metric.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors duration-500">
                  {metric.value}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {metric.label}
                </div>
                <div className="text-sm text-slate-400 leading-relaxed">
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
