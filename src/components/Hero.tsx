import { ArrowRight } from 'lucide-react';
import { hrefFor } from '../routes';
import TaraCall from './TaraCall';

// ₹18 Cr is in the line under the headline, so it is not repeated here.
const NUMBERS = [
  { value: '~15%', label: 'Month-on-month growth on that trips business' },
  { value: '+5%', label: 'ARPO from pricing and paywall work at Shaadi.com' },
  { value: '50%', label: 'Fewer tickets needing a person, after a WhatsApp AI agent' },
];

// ₹18 Cr is Indian notation; a recruiter in Dubai or London shouldn't have to look it up.
// Hover, focus or tap shows the conversion in a note that doesn't move the text.
const Crore = () => (
  <span className="relative inline-block group/cr">
    <button
      type="button"
      aria-describedby="crore-note"
      className="text-ink underline decoration-dotted decoration-1 underline-offset-4 decoration-ink-soft rounded-sm"
    >
      ₹18 Cr
    </button>
    <span
      id="crore-note"
      role="tooltip"
      className="crore-note pointer-events-none absolute left-0 top-full mt-2 z-10 whitespace-nowrap rounded-lg bg-ink px-3 py-2 font-sans text-[14px] font-normal leading-5 tracking-normal text-paper tabular-nums shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
    >
      ₹18 crore = ₹180 million ≈ US$2 million
    </span>
  </span>
);

const Hero = () => (
  <>
    <section className="pt-16 md:pt-24 pb-16 md:pb-24 grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_360px] items-center">
      <div className="flex flex-col gap-6">
        <h1 className="m-0 font-display font-medium text-[40px] md:text-[64px] leading-[1.02] tracking-[-0.03em] [text-wrap:balance]">
          Product judgement, grounded in data and proven in revenue
        </h1>
        <p className="m-0 text-lg md:text-xl leading-[1.5] text-ink-soft max-w-[36rem]">
          I&apos;m a senior product manager across payments, growth and applied AI. From a <Crore /> trips business built
          from zero to pricing and payments at Shaadi.com, my work is measured in what customers pay for.
        </p>
        <div className="flex flex-wrap items-center gap-6 pt-2">
          <a href={hrefFor.built()} className="btn-primary">
            See what I&apos;ve built <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
          </a>
          <a href="/resume.pdf" download="Atib_Shaikh_Resume.pdf" className="link text-base">
            Download my resume
          </a>
        </div>
      </div>
      <TaraCall className="w-full max-w-[360px] min-h-[340px]" />
    </section>

    <section
      aria-label="Results"
      className="grid gap-x-6 gap-y-8 py-10 border-t border-ink border-b border-rule grid-cols-1 sm:grid-cols-3"
    >
      {NUMBERS.map(n => (
        <div key={n.value} className="flex flex-col gap-2">
          <p className="m-0 font-display font-medium text-[40px] leading-none tracking-[-0.02em] tabular-nums">{n.value}</p>
          <p className="m-0 text-sm text-muted max-w-[28ch]">{n.label}</p>
        </div>
      ))}
    </section>
  </>
);

export default Hero;
