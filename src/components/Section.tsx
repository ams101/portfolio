import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  label: string;
  children: ReactNode;
  className?: string;
}

// The editorial layout used across the site: a narrow mono label on the left,
// content on the right. Stacks on small screens.
const Section = ({ id, label, children, className = '' }: SectionProps) => (
  <section id={id} className={`scroll-mt-24 flex flex-wrap gap-x-8 gap-y-4 ${className}`}>
    <p className="label flex-[1_1_180px] m-0">{label}</p>
    <div className="flex-[999_1_640px] min-w-0">{children}</div>
  </section>
);

export default Section;
