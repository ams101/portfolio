import { useEffect, useRef, useState } from 'react';

// The call plays once when it scrolls into view: each line arrives from its
// speaker's side, the status follows whose turn it is, the clock runs 0:36 → 0:42.
const CALL = [
  { at: 0, stamp: '0:36', from: 'tara', text: 'You’re on the video KYC. It takes about three minutes. Can you do it now?' },
  { at: 2600, stamp: '0:39', from: 'caller', text: 'I’m driving right now.' },
  { at: 4000, stamp: '0:40', from: 'tara', text: 'No problem. What time works for you later today?' },
] as const;
const START_SEC = 36;
const END_SEC = 42;

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const TaraCall = ({ className = '' }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const skip = reducedMotion() || typeof IntersectionObserver === 'undefined';
  const [shown, setShown] = useState(skip ? CALL.length : 0);
  const [sec, setSec] = useState(skip ? END_SEC : START_SEC);
  const [started, setStarted] = useState(skip);

  useEffect(() => {
    if (skip || !ref.current) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [skip]);

  useEffect(() => {
    if (!started || skip) return;
    const timers = CALL.map((line, i) => window.setTimeout(() => setShown(i + 1), line.at));
    const clock = window.setInterval(() => setSec(s => (s < END_SEC ? s + 1 : s)), 1000);
    const stop = window.setTimeout(() => window.clearInterval(clock), (END_SEC - START_SEC) * 1000 + 50);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearInterval(clock);
      window.clearTimeout(stop);
    };
  }, [started, skip]);

  const speaking = shown > 0 && CALL[shown - 1].from === 'tara' && sec < END_SEC;
  const status = !started ? 'Ringing' : speaking ? 'Speaking' : 'Listening';

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`bg-[#141415] text-[#EDEDED] rounded-[20px] p-6 flex flex-col gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] ${className}`}
    >
      <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
        <span className="w-9 h-9 rounded-full bg-[#EDEDED] text-ink flex items-center justify-center font-display font-medium text-lg">T</span>
        <span className="flex flex-col leading-tight">
          <span className="text-[15px]">Tara</span>
          <span className="font-mono text-xs text-[#A1A1A6] tabular-nums">
            {status} · 0:{String(sec).padStart(2, '0')}
          </span>
        </span>
      </div>
      {CALL.map((line, i) => (
        <div
          key={i}
          data-on={i < shown ? '' : undefined}
          className={`call-line flex flex-col gap-1 max-w-[85%] ${line.from === 'tara' ? 'self-start' : 'call-line--caller self-end items-end'}`}
        >
          <span className="font-mono text-xs text-[#85858B] tabular-nums">
            {line.from === 'tara' ? 'Tara' : 'Customer'} · {line.stamp}
          </span>
          <p
            className={`m-0 px-3 py-2 rounded-xl text-sm leading-[1.45] ${
              line.from === 'tara' ? 'bg-[#232325]' : 'bg-[#EDEDED] text-ink'
            }`}
          >
            {line.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TaraCall;
