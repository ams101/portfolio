export interface CaseStudy {
  id: string;
  company: string;
  listTitle: string;
  listLine: string;
  headline: string;
  roleTitle: string;
  stats: { value: string; label: string }[];
  title: string;
  subtitle: string;
  context: string;
  roleIntro?: string;
  role: string[];
  initiatives: { title: string; description: string }[];
  impact: string[];
  metrics: string;
  lesson?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'zo-trips',
    company: 'Zostel',
    listTitle: 'Zo-Trips: a trips business from zero',
    listLine: 'Growth, product and ops, an AI trip comparator and automated ops checks. ₹18 Cr a year.',
    headline: 'Turning a hostel upsell widget into a ₹18 Cr trips business',
    roleTitle: 'Senior Product Manager',
    stats: [{ value: '₹18 Cr', label: 'annual GMV' }, { value: '~15%', label: 'month-on-month growth' }],
    title: 'Zo-Trips at Zostel: building an AI-powered trips business from 0 to ₹18 Cr GMV',
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
      'Grew Zo-Trips from a small upsell widget into a curated trips business doing ~₹18 Cr in annual GMV with ~15% MoM growth',
      'Increased trip discovery and qualified leads through targeted campaigns and onsite placements',
      'Improved decision-making and reduced abandonment via personalised pages and an AI comparator, driving ~15% more leads from existing traffic',
      'Reactivated lapsed users using WATI campaigns, strengthening top-of-funnel from returning travellers',
      'Scaled operations using automation and LLM-based audits instead of linearly scaling the operations team',
    ],
    metrics: '₹18 Cr+ GMV | 15% MoM growth',
  },
  {
    id: 'shaadi',
    company: 'Shaadi.com',
    listTitle: 'The premium subscription engine',
    listLine: 'Pricing, plan packaging, auto-renewals and payment funnels. +2.75% quarterly revenue.',
    headline: 'The monetization and payments engine behind Shaadi.com\'s premium subscriptions',
    roleTitle: 'Associate Product Manager',
    stats: [{ value: '+2.75%', label: 'quarterly revenue' }, { value: '+5%', label: 'monetization ARPO' }],
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
    company: 'Careismatic',
    listTitle: 'B2B commerce for US medical apparel',
    listLine: 'Stabilised payments and launched a marketplace. +28% B2B CSAT, +15% online orders.',
    headline: 'B2B e-commerce and payments for US and Americas buyers',
    roleTitle: 'Product Manager',
    stats: [{ value: '+28%', label: 'B2B CSAT' }, { value: '+15%', label: 'online orders' }],
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
    company: 'Mavenvista',
    listTitle: 'Procure-to-pay for large enterprises',
    listLine: 'Vendor onboarding and SAP-integrated workflows. 5%+ savings on ₹500 Cr+ of spend.',
    headline: 'Enterprise procure-to-pay and vendor onboarding',
    roleTitle: 'SaaS Product Implementation Executive',
    stats: [{ value: '5%+', label: 'procurement savings' }, { value: '+22%', label: 'revenue from existing accounts' }],
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
        description: 'Ran implementations for Ultratech Cement and GHCL, from discovery to rollout. Configured workflows and policies to match complex procurement processes. Helped clients achieve 5%+ procurement savings on combined spends exceeding ₹500 Cr.',
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
    metrics: '5%+ savings on ₹500 Cr+',
  },
];
