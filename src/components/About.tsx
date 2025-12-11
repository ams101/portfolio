import React, { useState } from 'react';
import { Lightbulb, TrendingUp, CreditCard, Building2, Award, Database, Target, Brain, Handshake, User, Briefcase } from 'lucide-react';

const About = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'highlights' | 'approach'>('overview');

  const highlights = [
    {
      icon: Lightbulb,
      title: '0→1 Product Launch',
      description: 'Built Zo-Trips as an AI-powered trips business for Zostel, scaling to ~₹12 Cr annual GMV with ~15% MoM growth.',
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      icon: TrendingUp,
      title: 'Growth & Monetization',
      description: 'Ran 15+ A/B tests and owned pricing, plans and paywalls at Shaadi.com to increase revenue and ARPO.',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: CreditCard,
      title: 'Payments & FinOps',
      description: 'Led auto-renewals, payment gateways, Direct-OTP and FinOps dashboards across Shaadi.com and Careismatic.',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Building2,
      title: 'Enterprise SaaS',
      description: 'Implemented Procure-to-Pay and vendor onboarding solutions driving 5%+ savings on ₹500 Cr+ spend at Mavenvista.',
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      icon: Award,
      title: 'Recognition',
      description: 'MBA (Gold Medalist), IIM Sambalpur · CEO Award (Shaadi.com) · OPJEMS Top-10 national finalist.',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
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
      description: 'Use AI where it clearly improves decisions, UX or operations — not just as a buzzword.',
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
    <section id="about" className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-100 to-blue-50 rounded-full text-slate-700 font-semibold text-sm mb-4 border border-slate-200/50 shadow-sm">
            <User className="w-4 h-4" />
            About
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
            About Atib
          </h2>
          <p className="text-lg text-slate-600">Product leader focused on <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">AI, Growth & FinOps</span></p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200'
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
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
                <p className="text-xl text-slate-700 leading-relaxed">
                  I'm a Senior Product Manager focused on <span className="font-semibold text-slate-900">AI, growth and FinOps</span>. Over the last 5+ years, I've shipped products across travel, consumer internet and B2B SaaS — from building Zo-Trips at Zostel (0→1, ~₹12 Cr annual GMV) to running the monetization and payments engine for Shaadi.com's premium subscriptions, to improving B2B e-commerce for US & Americas customers at Careismatic and implementing Procure-to-Pay SaaS for large enterprises at Mavenvista. I enjoy working where <span className="font-semibold text-slate-900">product strategy, experimentation, payments and data all collide</span>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500`}></div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className={`relative inline-flex p-4 ${highlight.bgColor} rounded-2xl mb-4 shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500`}></div>
                      <highlight.icon className={`w-7 h-7 ${highlight.iconColor} relative z-10`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {highlight.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
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
                  className="group bg-white rounded-xl p-6 border-2 border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="relative p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-500"></div>
                        <principle.icon className="w-6 h-6 text-blue-600 relative z-10" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {principle.title}
                      </h4>
                      <p className="text-slate-600 leading-relaxed">
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
