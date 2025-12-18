import { ArrowRight, Download, Sparkles, Zap, TrendingUp, Layers } from 'lucide-react';

const Hero = () => {
  const scrollToCaseStudies = () => {
    document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 pt-32 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-grid-white opacity-100"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[120px] animate-floatSlow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[100px] animate-floatSlow delay-300"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] animate-morphBlob"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-teal-400 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-6 animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 font-semibold text-sm mb-4 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Senior Product Manager
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
              Atib Shaikh
            </h1>
            <p className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-gradient">AI, Growth, Payments, and Consumer UX</span>
            </p>
          </div>

          <p className="text-lg md:text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed animate-fadeInUp delay-200">
            Senior Product Manager owning product strategy and roadmap across B2C consumer internet, travel tech, and B2B SaaS, with a strong bias for execution and AI-first product thinking. Built and scaled Zo Trips from 0 to 1 into an 18 Cr INR annual GMV business, and shipped AI products including Zobu, an AI WhatsApp agent on ElizaOS that reduced tickets needing human resolution by 50%, along with LLM features improving discovery and conversion. Grew through high-ownership monetization roles at Shaadi.com, delivering pricing, paywall, and checkout improvements and launching LLM-based merchandising, including a hackathon-winning build. Earlier at Mavenvista, delivered enterprise Procure-to-Pay workflows across PR, RFQ, and PO with SAP integration for large clients and on-time go-lives. Gold Medalist and scholarship awardee from IIM Sambalpur MBA. Skilled in PRDs, Agile delivery, and data-driven decision making using SQL, GA4, Looker, and MoEngage.
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center text-sm animate-fadeInUp delay-300">
            <div className="group flex items-center gap-3 px-5 py-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-teal-500/50 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">5+ years</span>
            </div>
            <div className="group flex items-center gap-3 px-5 py-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">Rs. 12 Cr+ GMV built</span>
            </div>
            <div className="group flex items-center gap-3 px-5 py-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">15+ A/B tests</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fadeInUp delay-400">
            <button
              onClick={scrollToCaseStudies}
              className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/40 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">View case studies</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
            <a
              href="/resume.pdf"
              download="Atib_Shaikh_Resume.pdf"
              className="group px-8 py-4 bg-slate-800/50 text-white rounded-2xl font-semibold text-lg border border-slate-700 hover:border-teal-500/50 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm hover:scale-105"
            >
              <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              Download resume
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
          <div className="w-1.5 h-2.5 bg-teal-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
