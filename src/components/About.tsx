import { useState } from 'react';
import { Lightbulb, TrendingUp, CreditCard, Building2, Award, Database, Target, Brain, Handshake, User, Briefcase } from 'lucide-react';

const About = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'highlights' | 'approach'>('overview');

  const highlights = [
    {
      icon: Lightbulb,
      title: '0-to-1 Product Launch',
      description: 'Built Zo-Trips as an AI-powered trips business for Zostel, scaling to ₹18 Cr annual GMV with ~15% MoM growth.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: TrendingUp,
      title: 'Growth & Monetization',
      description: 'Ran 15+ A/B tests and owned pricing, plans and paywalls at Shaadi.com to increase revenue and ARPO.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: CreditCard,
      title: 'Payments & FinOps',
      description: 'Led auto-renewals, payment gateways, Direct-OTP and FinOps dashboards across Shaadi.com and Careismatic.',
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      icon: Building2,
      title: 'Enterprise SaaS',
      description: 'Implemented Procure-to-Pay and vendor onboarding solutions driving 5%+ savings on Rs. 500 Cr+ spend at Mavenvista.',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Award,
      title: 'Recognition',
      description: 'MBA (Gold Medalist), IIM Sambalpur. CEO Award (Shaadi.com). OPJEMS Top-10 national finalist.',
      gradient: 'from-rose-500 to-pink-500',
    },
  ];

  const workingPrinciples = [
    {
      icon: Target,
      title: 'Hypothesis-first',
      description: 'Start with a clear problem statement and hypothesis, then validate through data and experiments.',
    },
    {
      icon: TrendingUp,
      title: 'Funnel-obsessed',
      description: 'Think holistically from acquisition and activation to payments, retention and expansion.',
    },
    {
      icon: Database,
      title: 'Hands-on with data',
      description: 'Comfortable in SQL, Looker, GA and experimentation tools to answer my own questions.',
    },
    {
      icon: Brain,
      title: 'Pragmatic about AI',
      description: 'Use AI where it clearly improves decisions, UX or operations - not just as a buzzword.',
    },
    {
      icon: Handshake,
      title: 'Collaborative',
      description: 'Work closely with design, engineering, marketing, ops and finance, especially on monetization and FinOps topics.',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'highlights', label: 'Highlights', icon: Award },
    { id: 'approach', label: 'How I Work', icon: Briefcase },
  ] as const;

  return (
    <section id="about" className="py-24 px-6 bg-slate-950">
      <div className="absolute inset-0 bg-grid-white"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 rounded-full text-teal-400 font-semibold text-sm mb-4 border border-teal-500/30 backdrop-blur-sm">
            <User className="w-4 h-4" />
            About
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Atib
          </h2>
          <p className="text-lg text-slate-400">Product leader focused on <span className="font-bold text-teal-400">AI, Growth & FinOps</span></p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/25'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="animate-fadeIn">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-800/50 shadow-2xl">
                <p className="text-xl text-slate-300 leading-relaxed">
                  I'm a Senior Product Manager specializing in <span className="font-semibold text-white">AI, growth, and FinOps</span>. Over the past 5+ years, I've built and scaled products across travel, consumer internet, and B2B SaaS—driving impact at every stage of the product lifecycle.
                </p>
                <p className="text-xl text-slate-300 leading-relaxed mt-6">
                  I've taken products from 0-to-1 (Zo-Trips at Zostel, scaling to ₹18 Cr annual GMV), owned monetization engines for millions of users (Shaadi.com's premium subscriptions and payments platform), optimized cross-border B2B e-commerce experiences for US customers at Careismatic, and delivered enterprise-grade Procure-to-Pay SaaS solutions at Mavenvista.
                </p>
                <p className="text-xl text-slate-300 leading-relaxed mt-6">
                  I thrive at the intersection of <span className="font-semibold text-white">product strategy, growth experimentation, payments infrastructure, and data-driven decision making</span>—shipping products that users love and businesses depend on.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50 hover:border-slate-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="relative">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${highlight.gradient} mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                      <highlight.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors duration-300">
                      {highlight.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'approach' && (
            <div className="animate-fadeIn space-y-4">
              {workingPrinciples.map((principle, index) => (
                <div
                  key={index}
                  className="group bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50 hover:border-teal-500/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="relative p-4 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-xl border border-teal-500/20 group-hover:border-teal-500/40 transition-all duration-500 group-hover:scale-110">
                        <principle.icon className="w-6 h-6 text-teal-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-teal-400 transition-colors duration-300">
                        {principle.title}
                      </h4>
                      <p className="text-slate-400 leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
