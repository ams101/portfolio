import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ProductDemo from './ProductDemo';
import ABExperiment from './ABExperiment';
import WhatsAppDemo from './WhatsAppDemo';
import RAGPlayground from './RAGPlayground';

interface ProductDemoPageProps {
  onBack: () => void;
}

const ProductDemoPage = ({ onBack: _onBack }: ProductDemoPageProps) => {
  const [expandedDemo, setExpandedDemo] = useState<string | null>(null);

  const toggleDemo = (demoId: string) => {
    setExpandedDemo(expandedDemo === demoId ? null : demoId);
  };

  return (
    <div className="pt-20 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Interactive Product Demos</h1>
          <p className="text-slate-400 text-lg">Explore portfolio-ready demonstrations of product work</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden">
          <button
            onClick={() => toggleDemo('payment')}
            className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-800/30 transition-all duration-300"
          >
            <div>
              <h3 className="text-2xl font-bold text-white text-left">Payment Flow Simulator</h3>
              <p className="text-slate-400 text-sm mt-1 text-left">Experience the in-centre payment system I designed for Shaadi.com</p>
            </div>
            <ChevronDown
              className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${
                expandedDemo === 'payment' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedDemo === 'payment' && (
            <div className="border-t border-slate-800/50 animate-fadeIn">
              <ProductDemo />
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden">
          <button
            onClick={() => toggleDemo('abtest')}
            className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-800/30 transition-all duration-300"
          >
            <div>
              <h3 className="text-2xl font-bold text-white text-left">A/B Testing Simulator</h3>
              <p className="text-slate-400 text-sm mt-1 text-left">Pick a metric, choose a lever, and see what happens</p>
            </div>
            <ChevronDown
              className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${
                expandedDemo === 'abtest' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedDemo === 'abtest' && (
            <div className="border-t border-slate-800/50 animate-fadeIn">
              <ABExperiment />
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden">
          <button
            onClick={() => toggleDemo('whatsapp')}
            className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-800/30 transition-all duration-300"
          >
            <div>
              <h3 className="text-2xl font-bold text-white text-left">WhatsApp Travel Assistant</h3>
              <p className="text-slate-400 text-sm mt-1 text-left">Full-featured chatbot with booking, payments, and natural language processing</p>
            </div>
            <ChevronDown
              className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${
                expandedDemo === 'whatsapp' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedDemo === 'whatsapp' && (
            <div className="border-t border-slate-800/50 animate-fadeIn">
              <WhatsAppDemo />
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden">
          <button
            onClick={() => toggleDemo('rag')}
            className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-800/30 transition-all duration-300"
          >
            <div>
              <h3 className="text-2xl font-bold text-white text-left">RAG Playground: Movie Recommender</h3>
              <p className="text-slate-400 text-sm mt-1 text-left">Learn how Retrieval-Augmented Generation works, step by step</p>
            </div>
            <ChevronDown
              className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${
                expandedDemo === 'rag' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedDemo === 'rag' && (
            <div className="border-t border-slate-800/50 animate-fadeIn">
              <RAGPlayground />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDemoPage;
