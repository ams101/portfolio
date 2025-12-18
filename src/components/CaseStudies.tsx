import { ArrowRight, Plane, Heart, Building2, Package } from 'lucide-react';

interface CaseStudiesProps {
  onViewDetails: (id: string) => void;
}

const CaseStudies = ({ onViewDetails }: CaseStudiesProps) => {
  const cases = [
    {
      id: 'zo-trips',
      icon: Plane,
      title: 'Zo-Trips at Zostel',
      subtitle: '0-to-1 AI-powered trips business',
      description: 'Turned simple hostel-trip upsells into a full trips business across India and the Middle East. Owned growth, product and ops for Zo-Trips - from targeted social campaigns and onsite real estate to personalised pages, an AI trip comparator, WATI reactivation and LLM-based ops checks - scaling to ~Rs. 12 Cr annual GMV with ~15% MoM growth.',
      gradient: 'from-teal-500 to-cyan-500',
      shadowColor: 'shadow-teal-500/30',
    },
    {
      id: 'shaadi',
      icon: Heart,
      title: 'Shaadi.com monetization & FinOps',
      subtitle: 'Premium subscription engine',
      description: "Owned end-to-end monetization and payments for Shaadi.com's premium subscriptions: pricing, plan packaging, auto-renewals, payment funnels and FinOps reporting. Built a structured experimentation pipeline, redesigned paywalls and features, and treated payment success and gateway economics as a product to lift revenue, ARPO and reliability.",
      gradient: 'from-rose-500 to-pink-500',
      shadowColor: 'shadow-rose-500/30',
    },
    {
      id: 'careismatic',
      icon: Building2,
      title: 'Careismatic B2B commerce',
      subtitle: 'US & Americas medical apparel buyers',
      description: "Product Manager for Careismatic's B2B e-commerce experience serving US & Americas customers. Defined KPIs, improved UX, stabilised payments via Barclays-JESTA integration, and led an OLX-style marketplace launch that boosted B2B CSAT, orders and cost efficiency.",
      gradient: 'from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-500/30',
    },
    {
      id: 'mavenvista',
      icon: Package,
      title: 'Mavenvista Procure-to-Pay SaaS',
      subtitle: 'Enterprise procurement & vendor onboarding',
      description: 'Implemented Procure-to-Pay and vendor onboarding SaaS for large enterprises. Launched a Vendor Onboarding & Management add-on, integrated analytics and recommendations, and delivered measurable procurement savings and upsell revenue.',
      gradient: 'from-amber-500 to-orange-500',
      shadowColor: 'shadow-amber-500/30',
    },
  ];

  return (
    <section id="case-studies" className="py-24 px-6 bg-slate-950 relative">
      <div className="absolute inset-0 bg-grid-white"></div>

      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] animate-floatSlow"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] animate-floatSlow delay-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 rounded-full text-teal-400 font-semibold text-sm mb-4 border border-teal-500/30 backdrop-blur-sm">
            <ArrowRight className="w-4 h-4" />
            Featured Work
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Case Studies
          </h2>
          <p className="text-xl text-slate-400">
            Product launches and growth initiatives that drove measurable impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((study) => (
            <button
              key={study.id}
              onClick={() => onViewDetails(study.id)}
              className={`group relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800/50 hover:border-slate-700 hover:shadow-2xl transition-all duration-500 text-left overflow-hidden hover:-translate-y-3`}
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${study.gradient} opacity-5 rounded-full -mr-32 -mt-32 group-hover:opacity-10 transition-opacity duration-500`}></div>

              <div className="relative">
                <div className={`relative inline-flex p-5 rounded-2xl bg-gradient-to-br ${study.gradient} mb-6 shadow-xl ${study.shadowColor} group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110`}>
                  <study.icon className="w-8 h-8 text-white relative z-10" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors duration-300">
                  {study.title}
                </h3>
                <div className="inline-block px-3 py-1 bg-slate-800/50 text-slate-400 rounded-lg text-xs font-bold mb-4 uppercase tracking-wide border border-slate-700/50">
                  {study.subtitle}
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {study.description}
                </p>

                <div className="flex items-center text-teal-400 font-bold group-hover:gap-3 gap-2 transition-all">
                  Read case study
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
