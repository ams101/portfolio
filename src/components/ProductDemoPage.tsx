import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import TaraDemo from './TaraDemo';
import TripComparator from './TripComparator';
import PanCheck from './PanCheck';
import OpsSection from './OpsSection';
import CoPilotReplay from './CoPilotReplay';
import Section from './Section';
import { MORE_DEMOS as DEMOS } from '../data/demos';

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
        <h1 className="m-0 font-display font-medium text-[44px] md:text-[60px] leading-[1.05] tracking-[-0.03em]">
          Things I&apos;ve built
        </h1>
        <p className="m-0 text-lg md:text-xl text-ink-soft">Give them a go.</p>
      </header>

      <TaraDemo />

      <TripComparator />

      <PanCheck />

      <OpsSection />

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
                    <span className="font-display text-[26px] md:text-[28px] leading-[1.2]">{d.title}</span>
                    <span className="text-base text-muted">{d.description}</span>
                    <span className="text-[13px] text-muted pt-1">{d.tags}</span>
                  </span>
                  <span className="inline-flex items-center gap-2 text-[15px] font-medium text-accent">
                    {isOpen ? (
                      <>Close <X aria-hidden="true" size={16} strokeWidth={1.5} /></>
                    ) : (
                      <>Try it <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} className="row-arrow" /></>
                    )}
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
            <button onClick={() => setOpenDemo(null)} className="inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-ink min-h-[44px]">
              Close <X aria-hidden="true" size={14} strokeWidth={1.5} />
            </button>
          </div>
          <d.Component />
        </div>
      ))}

      <div id="side-projects" className="scroll-mt-24 pt-8 pb-24">
        <header className="flex flex-col gap-2 pb-10">
          <h2 className="m-0 font-display font-medium text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">Built for my own problems</h2>
        </header>
        <CoPilotReplay />
      </div>
    </div>
  );
};

export default ProductDemoPage;
