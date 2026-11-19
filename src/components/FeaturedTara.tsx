import { Mic, ArrowRight } from 'lucide-react';

interface FeaturedTaraProps {
  onTry: () => void;
}

const FeaturedTara = ({ onTry }: FeaturedTaraProps) => (
  <section className="relative px-6 pb-4 bg-slate-950">
    <div className="max-w-7xl mx-auto">
      <button
        onClick={onTry}
        className="group w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left bg-gradient-to-r from-teal-500/10 via-slate-900/60 to-slate-900/60 border border-teal-500/30 hover:border-teal-500/60 rounded-2xl px-6 py-5 transition-all duration-300"
      >
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-0.5">Featured</p>
          <p className="text-white font-semibold text-lg leading-snug">Talk to Tara, a voice AI agent I designed</p>
          <p className="text-slate-400 text-sm">Live call in your browser · 1 minute · Hindi or English</p>
        </div>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 group-hover:bg-teal-400 text-white text-sm font-bold transition-colors shrink-0">
          Try it
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </button>
    </div>
  </section>
);

export default FeaturedTara;
