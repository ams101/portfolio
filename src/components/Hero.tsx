import { ArrowRight } from 'lucide-react';
import { hrefFor } from '../routes';
import TaraCall from './TaraCall';

// ₹18 Cr is the headline, so it is not repeated here.
const NUMBERS = [
  { value: '~15%', label: 'Month-on-month growth on that trips business' },
  { value: '+5%', label: 'ARPO from pricing and paywall work at Shaadi.com' },
  { value: '50%', label: 'Fewer tickets needing a person, after a WhatsApp AI agent' },
];

const Hero = () => (
  <>
    <section className="pt-16 md:pt-24 pb-16 md:pb-24 grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_360px] items-center">
      <div className="flex flex-col gap-6">
        <h1 className="m-0 font-display font-medium text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.03em] [text-wrap:balance]">
          I took a trips business from zero to <span className="text-accent">₹18 Cr</span> a year
        </h1>
        <p className="m-0 text-lg md:text-xl leading-[1.5] text-ink-soft max-w-[36rem]">
          I&apos;m a senior product manager. Lately I build voice agents that get people unstuck, in Hindi and English.
          Before that, pricing, paywalls and payments for Shaadi.com&apos;s premium subscriptions.
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
