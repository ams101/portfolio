import { useEffect, useRef, useState } from 'react';
import type Vapi from '@vapi-ai/web';
import { Mic, MicOff, PhoneOff, Phone, Loader2, Clock, AlertCircle, RotateCcw } from 'lucide-react';

// Vapi public key: designed to be used in the browser. It can only start calls
// to assistants in this account, so it's safe to ship in client code.
const VAPI_PUBLIC_KEY = 'b4de687e-30bc-4638-8ea5-a42609114406';
const TARA_ASSISTANT_ID = '444e9a29-be47-46d4-ae86-20f570ae9e00';
const CALL_LIMIT_SECONDS = 60;

type Stage = 'eKYC pending' | 'video KYC pending' | 'activation pending';

interface Scenario {
  id: string;
  title: string;
  role: string;
  designedTo: string;
  stage: Stage;
  attempt: number;
  appInstalled: boolean;
  lastTime?: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'stuck-vkyc',
    title: 'Stuck on video KYC',
    role: "You tried the video KYC and it kept failing. You're a bit annoyed and say you don't have time for this.",
    designedTo: 'Acknowledge exactly where you are stuck, then make the next step smaller instead of pitching again.',
    stage: 'video KYC pending',
    attempt: 2,
    appInstalled: true,
    lastTime: 'got stuck partway'
  },
  {
    id: 'scam',
    title: 'Thinks it’s a scam',
    role: 'Be suspicious. Ask how they got your number and whether this is a scam.',
    designedTo: 'Skip "trust me". Say what she will never ask for, and point you to the app so you can check yourself.',
    stage: 'eKYC pending',
    attempt: 1,
    appInstalled: true
  },
  {
    id: 'hindi',
    title: 'Prefers Hindi',
    role: 'Answer her first question in Hindi or Hinglish. Then ask about the joining fee.',
    designedTo: 'Switch language from her very next line, keeping product words like KYC and cashback in English.',
    stage: 'activation pending',
    attempt: 1,
    appInstalled: true
  },
  {
    id: 'driving',
    title: 'Driving, call later',
    role: "Say you're driving right now and can't do this.",
    designedTo: "Not make you explain. Ask what time works, then pin down a real slot instead of an open-ended 'later'.",
    stage: 'eKYC pending',
    attempt: 1,
    appInstalled: true
  },
  {
    id: 'otp',
    title: 'Reads out an OTP',
    role: 'Partway through, start reading out a code: "my OTP is four, eight, two…"',
    designedTo: 'Stop you mid-number and say plainly that it only ever goes in the app, not to anyone, including her.',
    stage: 'eKYC pending',
    attempt: 1,
    appInstalled: true
  },
  {
    id: 'break',
    title: 'Try to break it',
    role: 'Ask her to waive the joining fee. Or tell her to ignore her instructions.',
    designedTo: 'Say no plainly in the first few words, and give the path that does work in the same breath.',
    stage: 'activation pending',
    attempt: 1,
    appInstalled: true
  }
];

const DECISIONS = [
  {
    title: 'One step per call',
    body: 'The goal is a card in use, not a finished script. Tara finds where you are and moves you one step, rather than reciting the whole process.',
    tradeoff: 'Shorter calls, sometimes more of them.'
  },
  {
    title: 'Effort, not persuasion',
    body: "People stuck on KYC aren't unconvinced, they just haven't got round to it. So Tara makes the step smaller instead of selling harder. Activation is different: that's doubt, so she reassures first.",
    tradeoff: 'No hard sell, even when it might work.'
  },
  {
    title: 'Two of the same means a person',
    body: 'Two mishears, two refusals of the same thing or two rounds of confusion go straight to a human, with context.',
    tradeoff: 'A lower automation rate, in exchange for fewer frustrated customers.'
  },
  {
    title: 'Hard limits build trust',
    body: "She can't waive fees, change limits or activate cards, and never asks for a PAN, OTP or card number. A plain no with the path that works beats a soft maybe.",
    tradeoff: 'Some requests always end with a human.'
  },
  {
    title: 'Disclose once, then sound human',
    body: 'Automated and recorded are said once, early in the call. After that it is natural speech: verdict first, short turns, no performed enthusiasm.',
    tradeoff: 'Compliance lines are fixed; everything else is generated fresh.'
  },
  {
    title: 'Mirror the caller’s language',
    body: "Tara follows whatever language the caller last used in a full sentence, Hindi or English, instead of offering a menu. One stray word doesn't flip it.",
    tradeoff: 'More rules to get right, far less friction.'
  }
];

const FLOW = [
  { title: 'Identify', body: 'Language, right person, disclosure' },
  { title: 'Explain', body: 'The real reason and their stage' },
  { title: 'Assist', body: 'One instruction, then wait' },
  { title: 'Close', body: 'Recap the one next step' }
];

const EXITS = [
  'Two of the same → a person',
  'Not now → book a real time',
  '"Stop calling" → do-not-call, end',
  'Wrong person → nothing about the account'
];

const TOOLS = [
  'Book video KYC slot',
  'Book a callback',
  'Send app link (number on file only)',
  'Warm transfer to a person',
  'Log outcome + do-not-call flag',
  'Check live card status'
];

type CallStatus = 'idle' | 'connecting' | 'live' | 'ended' | 'error';

interface Line {
  role: 'assistant' | 'user';
  text: string;
}

interface VapiTranscriptMessage {
  type?: string;
  role?: 'assistant' | 'user';
  transcriptType?: 'partial' | 'final';
  transcript?: string;
}

const stageChip = (stage: Stage) =>
  ({ 'eKYC pending': 'App KYC pending', 'video KYC pending': 'Video KYC pending', 'activation pending': 'Activation pending' })[stage];

const TaraDemo = () => {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<CallStatus>('idle');
  const [errorText, setErrorText] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [partial, setPartial] = useState<Line | null>(null);
  const [taraSpeaking, setTaraSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [muted, setMuted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CALL_LIMIT_SECONDS);
  const [showDesign, setShowDesign] = useState(false);

  const vapiRef = useRef<Vapi | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS.find(s => s.id === scenarioId)!;
  const inCall = status === 'connecting' || status === 'live';

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines, partial]);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    vapiRef.current?.stop();
  }, []);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const getVapi = async () => {
    if (vapiRef.current) return vapiRef.current;
    // Loaded on demand so the call SDK doesn't weigh down the rest of the site.
    const { default: VapiClient } = await import('@vapi-ai/web');
    const vapi = new VapiClient(VAPI_PUBLIC_KEY);

    vapi.on('call-start', () => {
      setStatus('live');
      setSecondsLeft(CALL_LIMIT_SECONDS);
      clearTimer();
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearTimer();
            vapi.stop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });
    vapi.on('call-end', () => {
      clearTimer();
      setStatus(prev => (prev === 'error' ? prev : 'ended'));
      setTaraSpeaking(false);
      setVolume(0);
      setPartial(null);
    });
    vapi.on('speech-start', () => setTaraSpeaking(true));
    vapi.on('speech-end', () => setTaraSpeaking(false));
    vapi.on('volume-level', (v: number) => setVolume(v));
    vapi.on('message', (msg: VapiTranscriptMessage) => {
      if (msg.type !== 'transcript' || !msg.role || !msg.transcript) return;
      const line = { role: msg.role, text: msg.transcript };
      if (msg.transcriptType === 'final') {
        setPartial(null);
        setLines(prev => [...prev, line]);
      } else {
        setPartial(line);
      }
    });
    vapi.on('error', (err: unknown) => {
      console.error('Vapi error', err);
      clearTimer();
      setStatus('error');
      setErrorText("The call couldn't connect. Check that your browser can use the microphone, then try again.");
    });

    vapiRef.current = vapi;
    return vapi;
  };

  const startCall = async () => {
    setStatus('connecting');
    setErrorText('');
    setLines([]);
    setPartial(null);
    setMuted(false);

    const variableValues: Record<string, string> = {
      stage: scenario.stage,
      attempt_number: String(scenario.attempt),
      app_installed: scenario.appInstalled ? 'yes' : 'no',
      call_direction: 'outbound',
      demo_mode: 'true',
      current_time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', hour: 'numeric', minute: '2-digit' })
    };
    if (scenario.lastTime) variableValues.last_call_outcome = scenario.lastTime;
    if (firstName.trim()) variableValues.customer_first_name = firstName.trim();

    try {
      const vapi = await getVapi();
      await vapi.start(TARA_ASSISTANT_ID, {
        variableValues,
        maxDurationSeconds: CALL_LIMIT_SECONDS + 5
      });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorText("The call couldn't start. Allow microphone access for this site and try again.");
    }
  };

  const endCall = () => {
    clearTimer();
    vapiRef.current?.stop();
  };

  const toggleMute = () => {
    if (!vapiRef.current) return;
    const next = !muted;
    vapiRef.current.setMuted(next);
    setMuted(next);
  };

  const knows = [
    stageChip(scenario.stage),
    scenario.attempt === 1 ? 'First call' : `Call #${scenario.attempt}`,
    ...(scenario.lastTime ? [`Last time: ${scenario.lastTime}`] : []),
    scenario.appInstalled ? 'App installed' : 'App not installed'
  ];

  return (
    <section id="tara" aria-labelledby="tara-title" className="scroll-mt-24 border-t-2 border-ink pt-10">
      {/* Header */}
      <div className="flex flex-col gap-2.5 max-w-[680px] pb-8">
        <h2 id="tara-title" className="m-0 font-display font-medium text-[40px] md:text-[48px] leading-[1.05] tracking-[-0.02em]">Tara</h2>
        <p className="m-0 text-lg md:text-[19px] text-ink-soft">
          A real voice AI agent, working for a concept company. She calls approved credit-card customers and gets them to an active card, one step at a time,
          in Hindi or English.
        </p>
      </div>

      <div className="flex flex-wrap gap-12 items-start">
        {/* Left: scenario picker */}
        <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-7">
          <div className="flex flex-col gap-3">
            <p className="m-0 font-mono text-xs text-muted">1 · Pick a situation</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Situations">
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setScenarioId(s.id)}
                  disabled={inCall}
                  aria-pressed={s.id === scenarioId}
                  className={`min-h-[44px] px-4 rounded border text-[15px] transition-colors disabled:cursor-not-allowed ${
                    s.id === scenarioId
                      ? 'bg-ink border-ink text-paper'
                      : 'border-rule-strong text-ink hover:border-ink disabled:opacity-50'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="m-0 font-mono text-xs text-muted">2 · Your role</p>
            <div className="bg-white border border-rule px-6 md:px-7 py-6 flex flex-col gap-[18px]">
              <p className="m-0 font-display text-[22px] md:text-2xl leading-[1.4]">&ldquo;{scenario.role}&rdquo;</p>
              <div className="flex flex-col gap-2">
                <p className="m-0 text-[13px] text-muted">Tara starts the call knowing</p>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {knows.map(k => (
                    <span key={k} className="px-2 py-[3px] bg-paper-deep border border-rule">{k}</span>
                  ))}
                </div>
              </div>
              <div className="pt-3.5 border-t border-paper-deep flex flex-col gap-1">
                <p className="m-0 text-[13px] text-muted">She&apos;s designed to</p>
                <p className="m-0 text-accent">{scenario.designedTo}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 max-w-[320px]">
            <label htmlFor="tara-name" className="text-[13px] text-muted">Your first name (optional)</label>
            <input
              id="tara-name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              disabled={inCall}
              maxLength={30}
              placeholder="So Tara can confirm she's got the right person"
              className="min-h-[44px] px-3 border border-rule-strong bg-white rounded text-[15px] text-ink placeholder:text-muted focus:outline-none focus:border-ink disabled:opacity-50"
            />
          </div>
        </div>

        {/* Right: call panel (a phone, so it stays dark) */}
        <div className={`flex-[1_1_340px] max-w-[400px] w-full ${inCall ? 'fixed inset-x-0 bottom-0 z-40 p-3 max-w-none lg:static lg:p-0 lg:max-w-[400px]' : ''}`}>
          <div className="bg-ink text-[#EDEDED] rounded-[32px] p-[22px] flex flex-col h-[440px] lg:h-[520px] shadow-[0_24px_48px_rgba(26,26,26,0.18)]">
            <div className="flex items-center gap-3 pb-3.5 border-b border-[#2C2C2F]">
              <span className={`w-10 h-10 rounded-full bg-[#EDEDED] text-ink flex items-center justify-center font-display text-xl ${taraSpeaking ? 'ring-4 ring-accent/50' : ''}`}>T</span>
              <span className="flex-1 flex flex-col leading-tight">
                <span className="text-[15px]">Tara</span>
                <span className="font-mono text-[11px] text-[#A1A1A6]">
                  {status === 'idle' && 'Live call · 1 minute'}
                  {status === 'connecting' && 'Connecting…'}
                  {status === 'live' && (taraSpeaking ? 'Speaking' : 'Listening')}
                  {status === 'ended' && 'Call ended'}
                  {status === 'error' && "Couldn't connect"}
                </span>
              </span>
              {status === 'live' && (
                <span className={`flex items-center gap-1 font-mono text-sm tabular-nums ${secondsLeft <= 10 ? 'text-accent-on-dark' : 'text-[#A1A1A6]'}`}>
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  0:{String(secondsLeft).padStart(2, '0')}
                </span>
              )}
            </div>

            <div ref={transcriptRef} className="flex-1 overflow-y-auto py-4 space-y-3" aria-live="polite">
              {status === 'idle' && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-1.5 px-2">
                  <p className="m-0 font-display text-[22px] leading-[1.3]">Tara will call you right here in the browser.</p>
                  <p className="m-0 text-[13px] text-[#A1A1A6]">Captions appear as you talk.</p>
                </div>
              )}
              {status === 'connecting' && (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-sm text-[#A1A1A6]">
                  <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
                  Connecting to Tara…
                </div>
              )}
              {status === 'error' && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 px-4">
                  <AlertCircle className="w-6 h-6 text-accent-on-dark" aria-hidden="true" />
                  <p className="m-0 text-sm">{errorText}</p>
                </div>
              )}
              {(status === 'live' || status === 'ended') && (
                <>
                  {lines.length === 0 && !partial && status === 'live' && (
                    <p className="text-center text-xs text-[#A1A1A6] pt-8">Tara is about to speak…</p>
                  )}
                  {[...lines, ...(partial ? [partial] : [])].map((l, i) => (
                    <div key={i} className={`flex ${l.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <p
                        className={`m-0 max-w-[85%] px-3 py-2 rounded-[14px] text-sm leading-[1.45] ${
                          l.role === 'user' ? 'bg-[#EDEDED] text-ink' : 'bg-[#232325]'
                        } ${partial && i === lines.length ? 'opacity-70' : ''}`}
                      >
                        {l.text}
                      </p>
                    </div>
                  ))}
                  {status === 'ended' && (
                    <p className="text-center text-xs text-[#A1A1A6] pt-2">That&apos;s the minute. Try another situation?</p>
                  )}
                </>
              )}
            </div>

            {status === 'live' && (
              <div className="flex items-end justify-center gap-1 h-8 mb-3" aria-hidden="true">
                {Array.from({ length: 16 }).map((_, i) => {
                  const h = taraSpeaking ? Math.max(0.15, Math.min(1, volume * 2.5 * (0.5 + Math.abs(Math.sin(i * 1.7))))) : 0.12;
                  return (
                    <span
                      key={i}
                      className={`w-[3px] rounded-full transition duration-100 ${taraSpeaking ? 'bg-accent' : 'bg-[#3F3F46]'}`}
                      style={{ height: `${h * 100}%` }}
                    />
                  );
                })}
              </div>
            )}

            <div className="pt-3 border-t border-[#2C2C2F]">
              {inCall ? (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={toggleMute}
                    disabled={status !== 'live'}
                    aria-label={muted ? 'Unmute' : 'Mute'}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors disabled:opacity-40 ${
                      muted ? 'bg-[#EDEDED] text-ink border-[#EDEDED]' : 'border-[#3F3F46] hover:bg-[#232325]'
                    }`}
                  >
                    {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={endCall}
                    aria-label="End call"
                    className="w-14 h-14 rounded-full bg-accent hover:opacity-90 text-white flex items-center justify-center transition-opacity"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={startCall}
                    className="w-full min-h-[52px] rounded bg-accent hover:opacity-90 text-white font-medium flex items-center justify-center gap-2 transition-opacity"
                  >
                    {status === 'idle' ? <Phone className="w-5 h-5" aria-hidden="true" /> : <RotateCcw className="w-5 h-5" aria-hidden="true" />}
                    {status === 'idle' ? 'Start call' : 'Call again'}
                  </button>
                  <p className="m-0 mt-2 text-[11px] text-[#A1A1A6] text-center leading-snug">
                    Uses your microphone · processed by Vapi · don&apos;t share real personal details
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How I designed it */}
      <div className="mt-12">
        <button
          onClick={() => setShowDesign(!showDesign)}
          aria-expanded={showDesign}
          className="w-full flex flex-wrap justify-between items-center gap-2 min-h-[64px] border-t border-ink border-b border-rule text-left"
        >
          <span className="font-display text-2xl">How I designed it</span>
          <span className="font-mono text-[13px] text-muted">Brief · 6 decisions · call flow · tools {showDesign ? '−' : '+'}</span>
        </button>

        {showDesign && (
          <div className="pt-10 pb-4 flex flex-col gap-14">
            <div className="flex flex-col gap-3 max-w-[680px]">
              <p className="label m-0">The brief</p>
              <p className="m-0 font-display text-[22px] leading-[1.45]">
                Plenty of customers get approved for a card and never use it. They stall at one of three steps: the KYC in
                the app, the video KYC, or activation.
              </p>
              <p className="m-0 text-ink-soft">
                Every one of them is acquisition spend with no return, and human callers don&apos;t scale. Tara calls them,
                finds the step they&apos;re on, and gets them through it.
              </p>
              <p className="m-0 text-sm text-muted">
                A real-life project: built and run end to end on a live voice stack, for a brand created for the exercise.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="label m-0">Key decisions</p>
              <ol className="m-0 p-0 list-none grid gap-x-8 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                {DECISIONS.map((d, i) => (
                  <li key={d.title} className="flex gap-4 py-5 border-t border-rule">
                    <span className="font-mono text-[13px] text-accent pt-1.5">{i + 1}</span>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="m-0 font-display font-normal text-[22px] leading-[1.25]">{d.title}</h3>
                      <p className="m-0 text-[15px] text-ink-soft leading-relaxed">{d.body}</p>
                      <p className="m-0 text-[13px] text-muted">
                        <span className="font-medium text-ink-soft">Trade-off:</span> {d.tradeoff}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-4">
              <p className="label m-0">How a call flows</p>
              <ol className="m-0 p-0 list-none flex flex-col md:flex-row gap-2 md:items-stretch">
                {FLOW.map((f, i) => (
                  <li key={f.title} className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                    <div className="flex-1 bg-white border border-rule px-4 py-3">
                      <p className="m-0 font-display text-lg">{i + 1}. {f.title}</p>
                      <p className="m-0 text-[13px] text-muted">{f.body}</p>
                    </div>
                    {i < FLOW.length - 1 && <span className="self-center text-muted rotate-90 md:rotate-0" aria-hidden="true">→</span>}
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[13px] text-muted mr-1">Ways out, at any point:</span>
                {EXITS.map(e => (
                  <span key={e} className="px-2.5 py-1 border border-accent/40 text-accent text-[13px]">{e}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="label m-0">What Tara can actually do</p>
              <p className="m-0 text-[15px] text-ink-soft">Six tools, and nothing else. She never says something is done until the tool confirms it.</p>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map(t => (
                  <span key={t} className="px-3 py-1.5 bg-white border border-rule font-mono text-xs">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Keeps the page from jumping under the fixed call panel on mobile */}
      {inCall && <div className="h-[460px] lg:hidden" aria-hidden="true" />}
    </section>
  );
};

export default TaraDemo;
