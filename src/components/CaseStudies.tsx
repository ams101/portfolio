import React from 'react';
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
      subtitle: '0→1 AI-powered trips business',
      description: 'Turned simple hostel-trip upsells into a full trips business across India and the Middle East. Owned growth, product and ops for Zo-Trips — from targeted social campaigns and onsite real estate to personalised pages, an AI trip comparator, WATI reactivation and LLM-based ops checks — scaling to ~₹12 Cr annual GMV with ~15% MoM growth.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'shaadi',
      icon: Heart,
      title: 'Shaadi.com monetization & FinOps',
      subtitle: 'Premium subscription engine',
      description: 'Owned end-to-end monetization and payments for Shaadi.com\'s premium subscriptions: pricing, plan packaging, auto-renewals, payment funnels and FinOps reporting. Built a structured experimentation pipeline, redesigned paywalls and features, and treated payment success and gateway economics as a product to lift revenue, ARPO and reliability.',
      color: 'from-rose-500 to-pink-500',
    },
    {
      id: 'careismatic',
      icon: Building2,
      title: 'Careismatic B2B commerce',
      subtitle: 'US & Americas medical apparel buyers',
      description: 'Product Manager for Careismatic\'s B2B e-commerce experience serving US & Americas customers. Defined KPIs, improved UX, stabilised payments via Barclays–JESTA integration, and led an OLX-style marketplace launch that boosted B2B CSAT, orders and cost efficiency.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'mavenvista',
      icon: Package,
      title: 'Mavenvista Procure-to-Pay SaaS',
      subtitle: 'Enterprise procurement & vendor onboarding',
      description: 'Implemented Procure-to-Pay and vendor onboarding SaaS for large enterprises. Launched a Vendor Onboarding & Management add-on, integrated analytics and recommendations, and delivered measurable procurement savings and upsell revenue.',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <section id="case-studies" className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-100 to-blue-50 rounded-full text-slate-700 font-semibold text-sm mb-4 border border-slate-200/50 shadow-sm">
            <ArrowRight className="w-4 h-4" />
            Featured Work
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
            Case Studies
          </h2>
          <p className="text-xl text-slate-600">
            Product launches and growth initiatives that drove measurable impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((study, index) => (
            <button
              key={study.id}
              onClick={() => onViewDetails(study.id)}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-left border-2 border-slate-100 hover:border-slate-200 overflow-hidden hover:-translate-y-3"
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${study.color} opacity-5 rounded-full -mr-32 -mt-32 group-hover:opacity-[0.12] transition-opacity duration-500`}></div>

              <div className="absolute top-0 right-0 w-40 h-40 bg-white/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <div className={`relative inline-flex p-5 rounded-2xl bg-gradient-to-br ${study.color} mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <study.icon className="w-8 h-8 text-white relative z-10" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {study.title}
                </h3>
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 rounded-lg text-xs font-bold mb-4 uppercase tracking-wide border border-slate-200">
                  {study.subtitle}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {study.description}
                </p>

                <div className="flex items-center text-slate-900 font-bold group-hover:gap-3 gap-2 transition-all group-hover:text-blue-600">
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
