import Section from './Section';

interface BuiltTeaserProps {
  onTryTara: () => void;
  onSeeAll: () => void;
}

const BuiltTeaser = ({ onTryTara, onSeeAll }: BuiltTeaserProps) => (
  <Section id="built" label="02 — Things I've built" className="pt-16 pb-24">
    <div className="flex flex-wrap items-center gap-10 pt-6 border-t border-ink">
      <div className="flex-[1_1_340px] flex flex-col gap-4">
        <p className="m-0 font-mono text-xs text-muted">Voice AI agent · real agent, concept company</p>
        <h2 className="m-0 font-serif font-normal text-[40px] leading-[1.1]">Talk to Tara</h2>
        <p className="m-0 text-ink-soft">
          She calls approved credit-card customers and gets them to an active card, one step at a time, in Hindi or
          English. Pick a situation and try to trip her up.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <button onClick={onTryTara} className="btn-accent">Start a 1-minute call</button>
          <button onClick={onSeeAll} className="link text-base">See everything I&apos;ve built</button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="flex-[0_1_300px] bg-ink text-[#EDEAE3] rounded-[28px] p-[22px] flex flex-col gap-3.5 min-h-[300px]"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-[#34322E]">
          <span className="w-9 h-9 rounded-full bg-[#EDEAE3] text-ink flex items-center justify-center font-serif text-lg">T</span>
          <span className="flex flex-col leading-tight">
            <span className="text-[15px]">Tara</span>
            <span className="font-mono text-[11px] text-[#A8A397]">Listening · 0:42</span>
          </span>
        </div>
        <p className="m-0 self-start max-w-[85%] bg-[#2A2825] px-3 py-2 rounded-[14px] text-sm leading-[1.45]">
          You&apos;re on the video KYC. It takes about three minutes. Can you do it now?
        </p>
        <p className="m-0 self-end max-w-[85%] bg-[#EDEAE3] text-ink px-3 py-2 rounded-[14px] text-sm leading-[1.45]">
          I&apos;m driving right now.
        </p>
        <p className="m-0 self-start max-w-[85%] bg-[#2A2825] px-3 py-2 rounded-[14px] text-sm leading-[1.45]">
          No problem. What time works for you later today?
        </p>
      </div>
    </div>
  </Section>
);

export default BuiltTeaser;
