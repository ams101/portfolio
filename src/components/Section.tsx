import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  label: string;
  note?: string;
  children: ReactNode;
  className?: string;
}

// A section heading in the display face, with an optional quiet note on the right.
const Section = ({ id, label, note, children, className = '' }: SectionProps) => (
  <section id={id} className={`scroll-mt-24 ${className}`}>
    <div className="flex items-baseline justify-between gap-4 mb-8">
      <h2 className="m-0 font-display font-medium text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.02em]">{label}</h2>
      {note && <span className="text-[13px] text-muted">{note}</span>}
    </div>
    <div className="min-w-0">{children}</div>
  </section>
);

export default Section;
