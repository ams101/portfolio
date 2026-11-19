import { useState } from 'react';
import { MessageCircle, Search, CreditCard, FlaskConical, ArrowRight, X } from 'lucide-react';
import TaraDemo from './TaraDemo';
import ProductDemo from './ProductDemo';
import ABExperiment from './ABExperiment';
import WhatsAppDemo from './WhatsAppDemo';
import RAGPlayground from './RAGPlayground';

interface ProductDemoPageProps {
  onBack: () => void;
}

const DEMOS = [
  {
    id: 'whatsapp',
    icon: MessageCircle,
    title: 'WhatsApp Booking Assistant',
    description: 'Book, change and cancel a stay over chat, with payments, moderation and a human handoff.',
    tags: ['Conversation design', 'Guardrails', 'Handoff'],
    Component: WhatsAppDemo
  },
  {
    id: 'rag',
    icon: Search,
    title: 'How RAG works',
    description: 'An interactive walkthrough of retrieval-augmented generation, using a movie recommender.',
    tags: ['Retrieval', 'Embeddings', 'Grounding'],
    Component: RAGPlayground
  },
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Payment Flow Simulator',
    description: 'The in-centre card payment flow I designed for Shaadi.com, from tap to settlement.',
    tags: ['Payments', 'Shaadi.com'],
    Component: ProductDemo
  },
  {
    id: 'abtest',
    icon: FlaskConical,
    title: 'A/B Testing Simulator',
    description: 'Pick a metric, choose a lever, and see what happens. Including when not to ship.',
    tags: ['Experimentation', 'Decisions'],
    Component: ABExperiment
  }
];

const ProductDemoPage = ({ onBack: _onBack }: ProductDemoPageProps) => {
  const [openDemo, setOpenDemo] = useState<string | null>(null);
  const active = DEMOS.find(d => d.id === openDemo);

  const open = (id: string) => {
    const next = openDemo === id ? null : id;
    setOpenDemo(next);
    if (next) {
      requestAnimationFrame(() =>
        document.getElementById('demo-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    }
  };

  return (
    <div className="pt-20 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Things I&apos;ve built</h1>
          <p className="text-slate-400 text-lg">Give them a go.</p>
        </div>

        <TaraDemo />

        <div>
          <h2 className="text-xl font-bold text-white mb-5">More to try</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {DEMOS.map(d => (
              <button
                key={d.id}
                onClick={() => open(d.id)}
                aria-expanded={openDemo === d.id}
                className={`group text-left bg-slate-900/50 rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 ${
                  openDemo === d.id ? 'border-teal-500/60' : 'border-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                    <d.icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1">{d.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">{d.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {d.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[11px] text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-400 group-hover:text-teal-300">
                      {openDemo === d.id ? 'Close' : 'Try it'}
                      {openDemo === d.id ? <X className="w-4 h-4" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {active && (
          <div id="demo-panel" className="scroll-mt-24 bg-slate-900/50 rounded-3xl border border-slate-800/50 overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-slate-800/50">
              <h3 className="text-lg font-bold text-white">{active.title}</h3>
              <button
                onClick={() => setOpenDemo(null)}
                aria-label="Close demo"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <active.Component />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDemoPage;
