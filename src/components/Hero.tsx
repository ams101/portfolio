import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { hrefFor } from '../routes';
import TaraCall from './TaraCall';
import { DEMO_COUNT } from '../data/demos';

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

// "proven in revenue" carries the claim's payoff: crimson, with an accountant's double
// underline that draws in once, and the evidence on hover, focus or tap.
const RECEIPT = [
  { value: '₹18 Cr', label: 'a year, from a trips business built from zero at Zostel' },
  { value: '+5%', label: 'ARPO from pricing and paywall work at Shaadi.com' },
  { value: '50%', label: 'fewer tickets needing a person, after a WhatsApp AI agent' },
];

const Payoff = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span
        tabIndex={0}
        aria-describedby="proof-note"
        className="payoff"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={e => e.key === 'Escape' && setOpen(false)}
      >
        proven in revenue
      </span>
      <span id="proof-note" role="tooltip" data-open={open ? '' : undefined} className="receipt">
        <span className="block text-[13px] text-[#A1A1A6]">The revenue behind it</span>
        {RECEIPT.map(r => (
          <span key={r.value} className="receipt-row">
            <span className="font-display font-semibold text-[22px] tracking-[-0.02em] tabular-nums">{r.value}</span>
            <span>{r.label}</span>
          </span>
        ))}
      </span>
    </>
  );
};

// Hover or keyboard focus fans out the demos you're about to see. Tara is already on screen.
const PEEK = [
  { src: '/thumbs/ops.jpg', w: 600, h: 375 },
  { src: '/thumbs/comparator.jpg', w: 634, h: 392 },
  { src: '/thumbs/id-check.jpg', w: 634, h: 396 },
  { src: '/thumbs/copilot.jpg', w: 634, h: 344 },
];

const Hero = () => (
  <>
    <section className="pt-12 md:pt-16 pb-16 md:pb-20 grid gap-12 lg:gap-14 lg:grid-cols-[minmax(0,1fr)_320px] items-center">
      <div className="flex flex-col gap-8 md:gap-10 min-w-0">
        <h1 className="relative m-0 max-w-[14ch] font-display font-semibold [font-stretch:88%] text-[44px] sm:text-[64px] lg:text-[76px] xl:text-[92px] leading-[0.95] tracking-[-0.04em] [text-wrap:balance]">
          Product judgement, grounded in data and <Payoff />
        </h1>
        <div className="flex flex-col gap-6">
          <p className="m-0 text-lg md:text-xl leading-[1.5] text-ink-soft max-w-[36rem]">
            I&apos;m a senior product manager across payments, growth and applied AI. From a <Crore /> trips business built
            from zero to pricing and payments at Shaadi.com, my work is measured in what customers pay for.
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <span className="cta-wrap">
              <span className="peek" aria-hidden="true">
                {PEEK.map(t => (
                  <img key={t.src} src={t.src} alt="" width={t.w} height={t.h} loading="lazy" decoding="async" />
                ))}
              </span>
              <a href={hrefFor.built()} className="btn-accent cta">
                See what I&apos;ve built <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} className="cta-arrow" />
                <span className="cta-count">{DEMO_COUNT} live demos</span>
              </a>
            </span>
            <a href="/resume.pdf" download="Atib_Shaikh_Resume.pdf" className="link text-base">
              Download my resume
            </a>
          </div>
        </div>
      </div>
      <TaraCall className="w-full max-w-[360px] lg:max-w-none min-h-[340px]" />
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
