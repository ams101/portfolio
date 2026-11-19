import Section from './Section';

const RECOGNITION = [
  'MBA, gold medalist, IIM Sambalpur',
  'CEO Award, Shaadi.com',
  'OPJEMS top-10 national finalist',
];

const TOOLS = ['SQL', 'GA4', 'Looker', 'MoEngage', 'PRDs', 'Agile delivery'];

const About = () => (
  <Section id="about" label="03 — About" className="py-24 border-t border-rule">
    <div className="flex flex-col gap-6 max-w-[680px]">
      <p className="m-0 font-serif text-[24px] md:text-[26px] leading-[1.45]">
        I&apos;ve worked across enterprise procurement software, B2B commerce for US buyers, subscriptions and payments at
        Shaadi.com, and a travel business I helped build from scratch at Zostel.
      </p>
      <p className="m-0 text-ink-soft">
        The thread through all of it: find where people get stuck, fix the smallest thing that unblocks them, and measure
        whether it worked. I&apos;m comfortable in SQL and dashboards, so I answer most of my own questions. Lately the
        thing that unblocks people is often a model, but only where it clearly beats the simpler option.
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
