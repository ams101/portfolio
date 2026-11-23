import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onSeeBuilt: () => void;
}

const NUMBERS = [
  { value: '₹18 Cr', label: 'Annual GMV, Zo-Trips at Zostel, built from zero' },
  { value: '~15%', label: 'Month-on-month growth on that business' },
  { value: '+5%', label: 'ARPO from pricing and paywall work at Shaadi.com' },
  { value: '50%', label: 'Fewer tickets needing a person, after a WhatsApp AI agent' },
];

const Hero = ({ onSeeBuilt }: HeroProps) => (
  <>
    <section className="pt-20 md:pt-28 pb-20 md:pb-24 flex flex-col gap-7 max-w-[820px]">
      <h1 className="m-0 font-serif font-normal text-[44px] md:text-[64px] leading-[1.08] tracking-[-0.015em] [text-wrap:balance]">
        I build products where AI, money and people meet
      </h1>
      <p className="m-0 text-lg md:text-xl leading-[1.55] text-ink-soft max-w-[640px]">
        I&apos;m a senior product manager. Most recently, a trips business that grew from nothing to ₹18 Cr a year, and voice agents that get people unstuck.
        Before that, pricing, paywalls and payments for Shaadi.com&apos;s premium subscriptions.
      </p>
      <div className="flex flex-wrap items-center gap-7 pt-2">
        <button onClick={onSeeBuilt} className="btn-primary">
          See what I&apos;ve built <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
        </button>
        <a href="/resume.pdf" download="Atib_Shaikh_Resume.pdf" className="link text-base">
          Download my resume
        </a>
      </div>
    </section>

    <section
      aria-label="Results"
      className="grid gap-x-6 gap-y-8 py-10 border-t border-ink border-b border-rule grid-cols-2 lg:grid-cols-4"
    >
      {NUMBERS.map(n => (
        <div key={n.value} className="flex flex-col gap-2">
          <p className="m-0 font-serif text-[36px] sm:text-[44px] leading-none [font-variant-numeric:lining-nums]">{n.value}</p>
          <p className="m-0 text-sm text-muted">{n.label}</p>
        </div>
      ))}
    </section>
  </>
);

export default Hero;
