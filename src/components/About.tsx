import Section from './Section';

const RECOGNITION = [
  'MBA, gold medalist, IIM Sambalpur',
  'CEO Award, Shaadi.com',
  'OPJEMS top-10 national finalist',
];

const TOOLS = ['SQL', 'GA4', 'Looker', 'MoEngage', 'PRDs', 'Agile delivery'];

const About = () => (
  <Section id="about" label="About" className="py-20 md:py-24 border-t border-rule">
    <div className="flex flex-col gap-6 max-w-[680px]">
      <p className="m-0 font-display text-[22px] md:text-[24px] leading-[1.4] tracking-[-0.01em]">
        I&apos;ve worked across enterprise procurement software, B2B commerce for US buyers, subscriptions and payments at
        Shaadi.com, and a travel business I helped build from scratch at Zostel.
      </p>
      <p className="m-0 text-ink-soft max-w-[62ch]">
        In every one of those jobs I looked for where people get stuck, fixed the smallest thing that unblocked them, then
        checked the numbers. I&apos;m comfortable in SQL and dashboards, so I answer most of my own questions. Lately that fix is often a model, used only
        where it beats the simpler option.
      </p>

      <dl className="grid gap-6 pt-4 m-0 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        <div className="flex flex-col gap-2">
          <dt className="label">Recognition</dt>
          {RECOGNITION.map(r => (
            <dd key={r} className="m-0 text-[15px]">{r}</dd>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <dt className="label">Day to day</dt>
          <dd className="m-0 text-[15px]">{TOOLS.join(' · ')}</dd>
        </div>
      </dl>
    </div>
  </Section>
);

export default About;
