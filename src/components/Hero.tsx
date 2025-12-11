import React from 'react';
import { ArrowRight, Download, Sparkles, Zap, TrendingUp } from 'lucide-react';

const Hero = () => {
  const scrollToCaseStudies = () => {
    document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 pt-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white via-40% to-blue-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-200"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-slate-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float delay-400"></div>

        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4 animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border border-blue-200/50 rounded-full text-blue-700 font-semibold text-sm mb-4 shadow-lg shadow-blue-100/50">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Senior Product Manager
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
              Atib Shaikh
            </h1>
            <p className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent animate-gradient">AI, Growth & FinOps</span>
            </p>
          </div>

          <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed animate-fadeInUp delay-200">
            I build and scale revenue-focused products across travel, consumer internet and B2B SaaS — from 0→1 launches like Zo-Trips at Zostel to subscription monetization and payment systems at Shaadi.com, and B2B e-commerce for US & Americas customers at Careismatic.
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-slate-600 animate-fadeInUp delay-300">
            <div className="group flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold">5+ years</span>
            </div>
            <div className="group flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold">₹12 Cr+ GMV built</span>
            </div>
            <div className="group flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="p-1.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold">15+ A/B tests</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fadeInUp delay-400">
            <button
              onClick={scrollToCaseStudies}
              className="group relative px-8 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">View case studies</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
            <a
              href="/resume.pdf"
              download="Atib_Shaikh_Resume.pdf"
              className="group px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-blue-400 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              Download resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
