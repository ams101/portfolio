import { Target, Lightbulb, CheckCircle2, TrendingUp, Briefcase, ArrowLeft } from 'lucide-react';

interface CaseStudyDetailProps {
  caseStudyId: string;
  onBack: () => void;
}

const CaseStudyDetail = ({ caseStudyId, onBack }: CaseStudyDetailProps) => {
  const studies = [
    {
      id: 'zo-trips',
      title: 'Zo-Trips at Zostel: building an AI-powered trips business from 0 to Rs. 12 Cr GMV',
      subtitle: '0-to-1 AI-powered trips business',
      context: 'Zostel is a leading youth travel and hostel brand with a strong footprint in India and growing demand from Middle Eastern (GCC) travellers. Trips started as small upsell cards on hostel pages with low visibility, minimal differentiation and heavy manual operations.',
      role: [
        'Strategy and roadmap for Zo-Trips',
        'Top-of-funnel growth (social, onsite real estate, reactivation)',
        'Product & UX for discovery, comparison and booking',
        'Vendor and inventory infrastructure',
        'Analytics, experiments and operational tooling',
      ],
      initiatives: [
        {
          title: 'Turned a widget into a product line',
          description: 'Redefined Zo-Trips as a curated trips business with its own funnels, pages and metrics. Gave trips prime real estate on hostel pages, destination pages and other high-intent surfaces.',
        },
        {
          title: 'Grew top-of-funnel with targeted campaigns',
          description: 'Ran segment-specific social media campaigns for Indian and GCC travellers (e.g., solo trips vs group trips, budget vs premium). Directed traffic into high-intent trip landing experiences rather than generic homepage flows. Used trip upsell cards contextually along the user journey to capture warm intent.',
        },
        {
          title: 'Built personalised destination and hostel pages',
          description: 'Used past stays, searches, budget, group type, season and location to personalise content. Improved click-to-book rates and reduced time-to-decision by making trips feel tailored to each traveller.',
        },
        {
          title: 'Reduced decision friction with an AI comparator',
          description: 'Built an AI-based trip comparison tool that explains differences (amenities, vibe, walkability, access, activities) in simple language. Helped users choose in-session, reducing cart abandonment and reliance on aggressive retargeting.',
        },
        {
          title: 'Reactivated existing demand with WATI',
          description: 'Used WATI-powered WhatsApp campaigns based on past searches and stays to bring back old users. Opened a second top-of-funnel lane from returning users, boosting trip-page visits and leads.',
        },
        {
          title: 'Scaled operations with tech and LLMs',
          description: 'Designed vendor management and trip infrastructure for onboarding, contracts, inventory, pricing and availability. Implemented LLM-based audit checks for content and data quality, cutting manual QA and keeping ops lean as volume scaled.',
        },
        {
          title: 'Owned analytics and experimentation',
          description: 'Defined tracking for the full trip funnel: views, clicks, leads, bookings, cancellations. Used GA, Looker and SQL to monitor performance and run A/B tests on layouts, copy, pricing formats and placements. Supported a broader UX refresh that improved funnel completion and app adoption.',
        },
      ],
      impact: [
        'Grew Zo-Trips from a small upsell widget into a curated trips business doing ~Rs. 12 Cr in annual GMV with ~15% MoM growth',
        'Increased trip discovery and qualified leads through targeted campaigns and onsite placements',
        'Improved decision-making and reduced abandonment via personalised pages and an AI comparator, driving ~15% more leads from existing traffic',
        'Reactivated lapsed users using WATI campaigns, strengthening top-of-funnel from returning travellers',
        'Scaled operations using automation and LLM-based audits instead of linearly scaling the operations team',
      ],
      metrics: 'Rs. 12 Cr+ GMV | 15% MoM growth',
    },
    {
      id: 'shaadi',
      title: "Designing the monetization & FinOps engine for Shaadi.com's premium subscriptions",
      subtitle: 'Premium subscription engine',
      context: 'Shaadi.com runs a large B2C subscription business where small conversion and payment improvements compound into meaningful revenue. Monetization levers (plans, add-ons, discounts) and payment performance were under-optimized, and FinOps visibility across gateways was fragmented.',
      role: [
        'Pricing and plan packaging',
        'Auto-renewals and billing flows',
        'Payment gateways and payment success',
        'Experimentation pipeline for monetization',
        'FinOps dashboards and reporting',
      ],
      roleIntro: 'As Associate Product Manager, I acted as product owner for monetization and payments:',
      initiatives: [
        {
          title: 'Built and launched an auto-renewal engine',
          description: 'Designed eligibility rules, consent flows, retry logic and communication journeys. Rolled out auto-renewals to targeted cohorts, lifting recurring revenue by ~1% and improving retention while staying within evolving card/UPI regulations.',
        },
        {
          title: 'Ran a structured experimentation program (15+ A/B tests)',
          description: 'Tested pricing, plan hierarchy, trials/discount strategies and funnel UX. Defined hypotheses and metrics (conversion, ARPO, renewal rate, paywall CTR), and analysed outcomes using SQL and Looker. Contributed to a 2.75% uplift in quarterly revenue and a 5% increase in Monetization ARPO.',
        },
        {
          title: 'Reworked plans, value communication and monetization features',
          description: 'Optimised the Silver plan and other tiers: clearer benefits, refined discounting and stronger visual hierarchy. Used a psychovisual approach to pricing (pre-GST display until payment) and introduced "lightning deals" at the paywall. Launched gated contact filters and a "recent visitors" surface that improved perceived value and added ~12 extra orders/day.',
        },
        {
          title: 'Treated the payment funnel as a product',
          description: 'Mapped paywall, gateway, bank flows to identify UX and technical breakpoints. Shipped Direct-OTP with Razorpay (auto-reading OTP in-app) to reduce friction and boost payment success rates. Reduced last-mile drop-offs and improved reliability at the most sensitive part of the funnel.',
        },
        {
          title: 'Led FinOps initiatives with gateways and finance',
          description: 'Analysed gateway performance, approval rates, MDR/fee structures and operational overhead. Renegotiated contracts and optimised routing to reduce operational/fixed costs by ~3%, cut dropped orders and unlock ~1% additional revenue from the same traffic.',
        },
        {
          title: 'Unified MIS and FinOps analytics',
          description: 'Built dashboards in Looker, Kibana and SQL for revenue, orders, gateway performance, refunds and cohort behaviour. Rationalised metrics and tracking so product, analytics and finance had a single source of truth and much less manual reconciliation.',
        },
      ],
      impact: [
        'Improved monetization performance: +2.75% quarterly revenue uplift and +5% Monetization ARPO',
        'Increased recurring revenue via auto-renewals while maintaining user trust and regulatory compliance',
        'Boosted plan conversion and daily orders through better paywall UX and monetization features',
        'Reduced payment funnel drop-offs and improved gateway economics, adding ~1% additional revenue and lowering costs',
        'Gave product and finance teams a unified, real-time view of monetization and payment health',
      ],
      metrics: '+2.75% revenue | +5% ARPO',
    },
    {
      id: 'careismatic',
      title: 'B2B e-commerce & payments for US & Americas customers at Careismatic',
      subtitle: 'US & Americas medical apparel buyers',
      context: 'Careismatic Brands serves healthcare professionals and organisations with medical apparel. The B2B e-commerce experience for US & Americas customers had unclear KPIs, UX friction and payment issues tied to legacy integrations.',
      role: [
        'B2B website KPIs and UX for US & Americas buyers',
        'Payments experience and gateway integration',
        'Marketplace transition and coordination with US stakeholders, design, engineering and FinOps',
      ],
      roleIntro: 'As Product Manager, I owned:',
      initiatives: [
        {
          title: 'Defined KPIs and fixed UX for B2B buyers',
          description: 'Conducted user interviews and cohort analysis to understand buying patterns and pain points. Clarified KPIs (CSAT, repeat orders, online order volume) and aligned stakeholders around those metrics. Simplified navigation and flows for bulk, repeat and corporate orders.',
        },
        {
          title: 'Stabilised global checkouts',
          description: 'Implemented an international Barclays payment gateway and integrated it with JESTA billing. Reduced payment failures by 16% and improved checkout reliability for US & Americas B2B customers.',
        },
        {
          title: 'Shifted towards a marketplace model',
          description: 'Led a 5-person cross-functional team to build an OLX-style marketplace experience to replace a legacy Salesforce-based solution. Reduced platform and operating costs by ~10% and created a more flexible, extensible foundation.',
        },
      ],
      impact: [
        '+28% increase in B2B CSAT and +15% growth in online orders from US & Americas buyers',
        'More reliable international payments and fewer failed transactions',
        'Lower platform and operating costs with a more future-proof marketplace experience',
      ],
      metrics: '+28% CSAT | +15% orders',
    },
    {
      id: 'mavenvista',
      title: 'Enterprise Procure-to-Pay and vendor onboarding at Mavenvista',
      subtitle: 'Enterprise procurement & vendor onboarding',
      context: 'Mavenvista provides enterprise Procure-to-Pay (P2P) and e-procurement solutions. Large clients needed better vendor onboarding, spend visibility and decision support to extract tangible savings from procurement.',
      role: [
        'Led end-to-end P2P and vendor onboarding implementations',
        'Worked directly with enterprise clients (e.g., Ultratech Cement, GHCL)',
        'Helped design and launch new add-ons and analytics capabilities',
      ],
      roleIntro: 'As SaaS Product Implementation Executive, I:',
      initiatives: [
        {
          title: 'Launched a Vendor Onboarding & Management add-on',
          description: 'Defined requirements from client workshops and internal strategy. Delivered a SaaS module for vendor onboarding, compliance and lifecycle management. Drove a 22% increase in revenue from existing accounts.',
        },
        {
          title: 'Implemented P2P modules for large enterprises',
          description: 'Ran implementations for Ultratech Cement and GHCL, from discovery to rollout. Configured workflows and policies to match complex procurement processes. Helped clients achieve 5%+ procurement savings on combined spends exceeding Rs. 500 Cr.',
        },
        {
          title: 'Added analytics and recommendations',
          description: 'Rolled out an analytics dashboard on VendX with data security and automated reporting. Integrated recommendation logic to suggest optimised purchases based on historical data and market trends. Improved visibility, decision quality and user adoption.',
        },
      ],
      impact: [
        'New recurring revenue stream via the vendor onboarding add-on (+22% from existing accounts)',
        '5%+ savings on large procurement bases, directly impacting client margins',
        'Higher adoption and satisfaction through better analytics and decision support',
      ],
      metrics: '5%+ savings on Rs. 500 Cr+',
    },
  ];

  const selectedStudy = studies.find(s => s.id === caseStudyId);

  if (!selectedStudy) {
    return null;
  }

  return (
    <section className="pt-24 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 px-6 py-3 bg-slate-800/50 text-white rounded-xl font-medium hover:bg-slate-800 transition-all duration-300 border border-slate-700/50"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to all case studies
        </button>

        <div key={selectedStudy.id} id={selectedStudy.id} className="scroll-mt-32">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-800/50">
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-16 md:px-12 md:py-20 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.15),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.1),transparent_50%)]"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px]"></div>

              <div className="relative">
                <div className="inline-block px-3 py-1 bg-teal-500/10 border border-teal-400/30 text-teal-400 rounded-lg text-xs font-bold mb-6 uppercase tracking-wider">
                  Case Study
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {selectedStudy.title}
                </h2>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 backdrop-blur-sm text-white rounded-xl font-bold border border-teal-500/30 shadow-lg">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  {selectedStudy.metrics}
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-10">
            {'context' in selectedStudy && (
                <>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-teal-500/20 rounded-lg">
                        <Target className="w-6 h-6 text-teal-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Context</h3>
                    </div>
                    <p className="text-lg text-slate-400 leading-relaxed pl-12">
                      {selectedStudy.context}
                    </p>
                  </div>

                  {'role' in selectedStudy && (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-teal-500/20 rounded-lg">
                          <Briefcase className="w-6 h-6 text-teal-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Role</h3>
                      </div>
                      <p className="text-lg text-slate-400 leading-relaxed pl-12 mb-3">
                        {'roleIntro' in selectedStudy ? selectedStudy.roleIntro : 'As Senior Product Manager, I owned the Zo-Trips business end-to-end:'}
                      </p>
                      <ul className="space-y-2 pl-12">
                        {selectedStudy.role.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-lg text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-1" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {'initiatives' in selectedStudy && (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          <Lightbulb className="w-6 h-6 text-orange-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">What I did</h3>
                      </div>
                      <div className="space-y-6 pl-12">
                        {selectedStudy.initiatives.map((initiative, i) => (
                          <div key={i} className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                            <h4 className="text-lg font-bold text-white mb-2">
                              {initiative.title}
                            </h4>
                            <p className="text-lg text-slate-400 leading-relaxed">
                              {initiative.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {'challenge' in selectedStudy && (
                <>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-teal-500/20 rounded-lg">
                        <Target className="w-6 h-6 text-teal-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Challenge</h3>
                    </div>
                    <p className="text-lg text-slate-400 leading-relaxed pl-12">
                      {selectedStudy.challenge}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Lightbulb className="w-6 h-6 text-orange-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Solution</h3>
                    </div>
                    <p className="text-lg text-slate-400 leading-relaxed pl-12">
                      {selectedStudy.solution}
                    </p>
                  </div>
                </>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Impact</h3>
                </div>
                <ul className="space-y-3 pl-12">
                  {selectedStudy.impact.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg text-slate-400">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyDetail;
