import { useState } from 'react';
import TaraDemo from './TaraDemo';
import Section from './Section';
import ProductDemo from './ProductDemo';
import ABExperiment from './ABExperiment';
import WhatsAppDemo from './WhatsAppDemo';
import RAGPlayground from './RAGPlayground';

const DEMOS = [
  {
    id: 'whatsapp',
    title: 'WhatsApp booking assistant',
    description: 'Book, change and cancel a stay over chat, and see what it decided on every message.',
    tags: 'Conversation design · guardrails · handoff',
    Component: WhatsAppDemo
  },
  {
    id: 'rag',
    title: 'How RAG works',
    description: 'An interactive walkthrough of retrieval-augmented generation, using a movie recommender.',
    tags: 'Retrieval · embeddings · grounding',
    Component: RAGPlayground
  },
  {
    id: 'payment',
    title: 'Payment flow simulator',
    description: 'The in-centre card payment flow I designed for Shaadi.com, from tap to settlement.',
    tags: 'Payments · Shaadi.com',
    Component: ProductDemo
  },
  {
    id: 'abtest',
    title: 'A/B testing simulator',
    description: 'Pick a metric, choose a lever, and see what happens. Including when not to ship.',
    tags: 'Experimentation · decisions',
    Component: ABExperiment
  }
];

const ProductDemoPage = () => {
  const [openDemo, setOpenDemo] = useState<string | null>(null);

  const toggle = (id: string) => {
    const next = openDemo === id ? null : id;
    setOpenDemo(next);
    if (next) {
      requestAnimationFrame(() =>
        document.getElementById(`demo-panel-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    }
  };

  return (
    <div>
      <header className="pt-16 md:pt-[72px] pb-12 flex flex-col gap-4">
        <h1 className="m-0 font-serif font-normal text-[44px] md:text-[60px] leading-[1.05] tracking-[-0.015em]">
          Things I&apos;ve built
        </h1>
        <p className="m-0 text-lg md:text-xl text-ink-soft">Give them a go.</p>
      </header>

      <TaraDemo />

      <Section label="More to try" className="pt-24 pb-24">
        <ul className="m-0 p-0 list-none">
          {DEMOS.map((d, i) => {
            const isOpen = openDemo === d.id;
            return (
              <li key={d.id} id={`demo-${d.id}`} className="scroll-mt-6">
                <button
                  onClick={() => toggle(d.id)}
                  aria-expanded={isOpen}
                  aria-controls={`demo-panel-${d.id}`}
                  className={`group w-full text-left flex flex-wrap items-baseline gap-x-6 gap-y-2 py-6 border-t ${
                    i === 0 ? 'border-ink' : 'border-rule'
                  } ${i === DEMOS.length - 1 && !isOpen ? 'border-b border-b-rule' : ''}`}
                >
                  <span className="flex-[1_1_420px] flex flex-col gap-1">
                    <span className="font-serif text-[26px] md:text-[28px] leading-[1.2]">{d.title}</span>
                    <span className="text-base text-muted">{d.description}</span>
                    <span className="font-mono text-xs text-muted pt-1">{d.tags}</span>
                  </span>
                  <span className="text-[15px] font-medium text-accent">
                    {isOpen ? 'Close ×' : <>Try it <span className="row-arrow inline-block">→</span></>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Section>

      {DEMOS.filter(d => d.id === openDemo).map(d => (
        <div
          key={d.id}
          id={`demo-panel-${d.id}`}
          className="scroll-mt-6 mb-24 border-t-2 border-ink"
        >
          <div className="flex items-center justify-between py-3 border-b border-rule">
            <span className="label">Now playing · {d.title}</span>
            <button onClick={() => setOpenDemo(null)} className="font-mono text-[13px] text-muted hover:text-ink min-h-[44px]">
              Close ×
            </button>
          </div>
          <d.Component />
        </div>
      ))}
    </div>
  );
};

export default ProductDemoPage;
