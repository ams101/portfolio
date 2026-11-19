import { useEffect, useRef, useState } from 'react';
import type Vapi from '@vapi-ai/web';
import {
  Mic, MicOff, PhoneOff, Phone, Loader2, ChevronDown, ShieldCheck, Footprints,
  Users, Ban, Languages, Clock, ArrowRight, AlertCircle, RotateCcw, Sparkles
} from 'lucide-react';

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
    icon: Footprints,
    title: 'One step per call',
    body: 'The goal is a card in use, not a finished script. Tara finds where you are and moves you one step, rather than reciting the whole process.',
    tradeoff: 'Shorter calls, sometimes more of them.'
  },
  {
    icon: Sparkles,
    title: 'Effort, not persuasion',
    body: "People stuck on KYC aren't unconvinced, they just haven't got round to it. So Tara makes the step smaller instead of selling harder. Activation is different: that's doubt, so she reassures first.",
    tradeoff: 'No hard sell, even when it might work.'
  },
  {
    icon: Users,
    title: 'Two of the same means a person',
    body: 'Two mishears, two refusals of the same thing or two rounds of confusion go straight to a human, with context.',
    tradeoff: 'A lower automation rate, in exchange for fewer frustrated customers.'
  },
  {
    icon: Ban,
    title: 'Hard limits build trust',
    body: "She can't waive fees, change limits or activate cards, and never asks for a PAN, OTP or card number. A plain no with the path that works beats a soft maybe.",
    tradeoff: 'Some requests always end with a human.'
  },
  {
    icon: ShieldCheck,
    title: 'Disclose once, then sound human',
    body: 'Automated and recorded are said once, early in the call. After that it is natural speech: verdict first, short turns, no performed enthusiasm.',
    tradeoff: 'Compliance lines are fixed; everything else is generated fresh.'
  },
  {
    icon: Languages,
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
    <section id="tara" className="scroll-mt-24">
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 md:px-10 pt-8 pb-6 border-b border-slate-800/50">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
              <Mic className="w-3.5 h-3.5" /> Voice AI agent
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
              Real agent · Concept company
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Tara</h2>
          <p className="text-slate-400 text-base md:text-lg max-w-3xl">
            A voice agent that calls approved credit-card customers and gets them to an active card, one step at a time. In Hindi or English.
          </p>
        </div>

        {/* Body */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 px-6 md:px-10 py-8">
          {/* Left: scenario picker */}
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">1 · Pick a situation</p>
            <div className="flex lg:grid lg:grid-cols-3 gap-3 overflow-x-auto pb-2 -mx-6 px-6 lg:mx-0 lg:px-0 snap-x">
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => !inCall && setScenarioId(s.id)}
                  disabled={inCall}
                  className={`snap-start shrink-0 w-40 lg:w-auto text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all disabled:cursor-not-allowed ${
                    s.id === scenarioId
                      ? 'bg-teal-500/15 border-teal-500/60 text-white'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:text-white disabled:opacity-50'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-7 mb-3">2 · Your role</p>
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 space-y-4">
              <p className="text-white text-base leading-relaxed">{scenario.role}</p>

              <div>
                <p className="text-xs text-slate-500 mb-2">Tara starts the call knowing:</p>
                <div className="flex flex-wrap gap-2">
                  {knows.map(k => (
                    <span key={k} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <p className="text-xs text-slate-500 mb-1">She&apos;s designed to:</p>
                <p className="text-sm text-teal-300 leading-relaxed">{scenario.designedTo}</p>
              </div>
            </div>

            <div className="mt-5 max-w-xs">
              <label htmlFor="tara-name" className="block text-xs text-slate-500 mb-1.5">
                Your first name <span className="text-slate-600">(optional)</span>
              </label>
              <input
                id="tara-name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                disabled={inCall}
                maxLength={30}
                placeholder="So Tara can confirm she's got the right person"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Right: call panel */}
          <div className={inCall ? 'fixed inset-x-0 bottom-0 z-40 p-3 lg:static lg:p-0' : ''}>
            <div className="bg-slate-950 border border-slate-800 rounded-[2rem] p-5 shadow-2xl flex flex-col h-[420px] lg:h-[520px]">
              {/* Call header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className={`relative w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center ${taraSpeaking ? 'ring-4 ring-teal-500/30' : ''}`}>
                  <span className="text-white font-bold">T</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold leading-tight">Tara</p>
                  <p className="text-xs text-slate-500">
                    {status === 'idle' && 'Live call · 1 minute'}
                    {status === 'connecting' && 'Connecting…'}
                    {status === 'live' && (taraSpeaking ? 'Speaking' : 'Listening')}
                    {status === 'ended' && 'Call ended'}
                    {status === 'error' && "Couldn't connect"}
                  </p>
                </div>
                {status === 'live' && (
                  <div className={`flex items-center gap-1 text-sm font-mono tabular-nums ${secondsLeft <= 10 ? 'text-amber-400' : 'text-slate-400'}`}>
                    <Clock className="w-4 h-4" />
                    0:{String(secondsLeft).padStart(2, '0')}
                  </div>
                )}
              </div>

              {/* Middle */}
              <div ref={transcriptRef} className="flex-1 overflow-y-auto py-4 space-y-3">
                {status === 'idle' && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <p className="text-slate-300 text-sm mb-1">Tara will call you right here in the browser.</p>
                    <p className="text-slate-500 text-xs">Captions appear as you talk.</p>
                  </div>
                )}
                {status === 'connecting' && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
                    Connecting to Tara…
                  </div>
                )}
                {status === 'error' && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4 gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-400" />
                    <p className="text-slate-300 text-sm">{errorText}</p>
                  </div>
                )}
                {(status === 'live' || status === 'ended') && (
                  <>
                    {lines.length === 0 && !partial && status === 'live' && (
                      <p className="text-center text-xs text-slate-500 pt-8">Tara is about to speak…</p>
                    )}
                    {[...lines, ...(partial ? [partial] : [])].map((l, i) => (
                      <div key={i} className={`flex ${l.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          l.role === 'user'
                            ? 'bg-teal-600/80 text-white rounded-br-sm'
                            : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                        } ${partial && i === lines.length ? 'opacity-70' : ''}`}>
                          {l.text}
                        </div>
                      </div>
                    ))}
                    {status === 'ended' && (
                      <p className="text-center text-xs text-slate-500 pt-2">That&apos;s the minute. Try another situation?</p>
                    )}
                  </>
                )}
              </div>

              {/* Waveform */}
              {status === 'live' && (
                <div className="flex items-end justify-center gap-1 h-8 mb-3" aria-hidden>
                  {Array.from({ length: 16 }).map((_, i) => {
                    const h = taraSpeaking ? Math.max(0.15, Math.min(1, volume * 2.5 * (0.5 + Math.abs(Math.sin(i * 1.7))))) : 0.12;
                    return (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-100 ${taraSpeaking ? 'bg-teal-400' : 'bg-slate-700'}`}
                        style={{ height: `${h * 100}%` }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Controls */}
              <div className="pt-3 border-t border-slate-800">
                {inCall ? (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={toggleMute}
                      disabled={status !== 'live'}
                      aria-label={muted ? 'Unmute' : 'Mute'}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors disabled:opacity-40 ${
                        muted ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={endCall}
                      aria-label="End call"
                      className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center shadow-lg shadow-red-500/30 transition-colors"
                    >
                      <PhoneOff className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={startCall}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
                    >
                      {status === 'idle' ? <Phone className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
                      {status === 'idle' ? 'Start call' : 'Call again'}
                    </button>
                    <p className="text-[11px] text-slate-500 text-center mt-2 leading-snug">
                      Uses your microphone · processed by Vapi · don&apos;t share real personal details
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* How I designed it */}
        <div className="border-t border-slate-800/50">
          <button
            onClick={() => setShowDesign(!showDesign)}
            className="w-full px-6 md:px-10 py-5 flex items-center justify-between hover:bg-slate-800/20 transition-colors"
            aria-expanded={showDesign}
          >
            <span className="text-white font-semibold">How I designed it</span>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showDesign ? 'rotate-180' : ''}`} />
          </button>

          {showDesign && (
            <div className="px-6 md:px-10 pb-10 space-y-10 animate-fadeIn">
              {/* Brief */}
              <div className="max-w-3xl">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">The brief</p>
                <p className="text-slate-300 leading-relaxed">
                  Plenty of customers get approved for a card and never use it. They stall at one of three steps:
                  the KYC in the app, the video KYC, or activation. Every one of them is acquisition spend with no return,
                  and human callers don&apos;t scale. Tara calls them, finds the step they&apos;re on, and gets them through it.
                </p>
                <p className="text-slate-500 text-sm mt-3">
                  A real-life project: built and run end to end on a live voice stack, for a brand created for the exercise.
                </p>
              </div>

              {/* Decisions */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Key decisions</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DECISIONS.map(d => (
                    <div key={d.title} className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                      <d.icon className="w-5 h-5 text-teal-400 mb-3" />
                      <h4 className="text-white font-semibold mb-2">{d.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed mb-3">{d.body}</p>
                      <p className="text-xs text-slate-500">
                        <span className="text-slate-400 font-semibold">Trade-off:</span> {d.tradeoff}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call flow */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">How a call flows</p>
                <div className="flex flex-col md:flex-row md:items-stretch gap-2">
                  {FLOW.map((f, i) => (
                    <div key={f.title} className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                      <div className="flex-1 bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3">
                        <p className="text-white font-semibold text-sm">{i + 1}. {f.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{f.body}</p>
                      </div>
                      {i < FLOW.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-slate-600 self-center rotate-90 md:rotate-0 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs text-slate-500 self-center mr-1">Ways out, at any point:</span>
                  {EXITS.map(e => (
                    <span key={e} className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">What Tara can actually do</p>
                <p className="text-sm text-slate-400 mb-3">
                  Six tools, and nothing else. She never says something is done until the tool confirms it.
                </p>
                <div className="flex flex-wrap gap-2">
                  {TOOLS.map(t => (
                    <span key={t} className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Keeps the page from jumping under the fixed call panel on mobile */}
      {inCall && <div className="h-[440px] lg:hidden" aria-hidden />}
    </section>
  );
};

export default TaraDemo;
