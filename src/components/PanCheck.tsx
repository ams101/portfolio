import { Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BRAND, PAN_BOOKING, TEST_PANS, type BookingGuest } from '../data/genricTravel';
import {
  FLAG_FROM,
  VERIFY_AT,
  decideName,
  scoreNames,
  scoreNamesImproved,
  type ImprovedMatch,
  type NameMatch,
} from '../utils/nameMatch';

type Mode = 'original' | 'improved';
type Status = 'pending' | 'checking' | 'verified' | 'flagged' | 'failed' | 'not-required';

interface Submission {
  pan: string;
  dob: string;
}

interface OpsOverride {
  status: 'verified' | 'pending';
  note: string;
}

interface Outcome {
  status: Status;
  reason: string;
  score?: number;
  nameOnRecord?: string;
}

const PAN_FORMAT = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const maskPan = (pan: string) => pan.slice(0, 5) + '****' + pan.slice(9);

const score = (mode: Mode, a: string, b: string): NameMatch | ImprovedMatch =>
  mode === 'improved' ? scoreNamesImproved(a, b) : scoreNames(a, b);

/** The decision rules from the prototype: format → PAN → DOB → name score. */
function evaluate(guest: BookingGuest, sub: Submission, mode: Mode): Outcome {
  if (!PAN_FORMAT.test(sub.pan)) return { status: 'failed', reason: 'Invalid PAN format. Check and re-enter.' };
  const rec = TEST_PANS.find(t => t.pan === sub.pan);
  if (!rec) return { status: 'failed', reason: 'This demo only accepts the test PANs listed below.' };
  if (rec.dob !== sub.dob) return { status: 'failed', reason: 'Date of birth doesn’t match the PAN record.', nameOnRecord: rec.nameOnRecord };
  const m = score(mode, guest.name, rec.nameOnRecord);
  const d = decideName(m.score);
  const reason =
    d === 'verified'
      ? `Name matches the PAN record (score ${m.score}).`
      : d === 'flagged'
      ? `Name is close but not certain (score ${m.score}). Sent to ops for review.`
      : `Name doesn’t match the PAN record (score ${m.score}).`;
  return { status: d, reason, score: m.score, nameOnRecord: rec.nameOnRecord };
}

const STATUS_STYLE: Record<Status, string> = {
  pending: 'bg-paper-deep text-muted border-rule',
  checking: 'bg-paper-deep text-muted border-rule',
  verified: 'bg-positive-tint text-positive border-positive-line',
  flagged: 'bg-warning-tint text-warning border-warning-line',
  failed: 'bg-negative-tint text-negative border-negative-line',
  'not-required': 'bg-paper-deep text-muted border-rule',
};

const STATUS_LABEL: Record<Status, string> = {
  pending: 'Pending',
  checking: 'Checking…',
  verified: 'Verified',
  flagged: 'Flagged for review',
  failed: 'Failed',
  'not-required': 'Not required',
};

const Chip = ({ status, label }: { status: Status; label?: string }) => (
  <span className={`inline-flex items-center px-2 py-0.5 border rounded-md text-[12px] whitespace-nowrap ${STATUS_STYLE[status]}`}>
    {label ?? STATUS_LABEL[status]}
  </span>
);

const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const PanCheck = () => {
  const [mode, setMode] = useState<Mode>('improved');
  const [active, setActive] = useState(PAN_BOOKING.guests[0].id);
  const [drafts, setDrafts] = useState<Record<string, Submission>>(() =>
    Object.fromEntries(PAN_BOOKING.guests.map(g => [g.id, { pan: '', dob: g.dob }]))
  );
  const [submitted, setSubmitted] = useState<Record<string, Submission>>({});
  const [checking, setChecking] = useState<string | null>(null);
  const [ops, setOps] = useState<Record<string, OpsOverride>>({});
  const [log, setLog] = useState<{ t: string; text: string }[]>([]);
  const [labName, setLabName] = useState<string | null>(null);

  const addLog = (text: string) => setLog(l => [{ t: now(), text }, ...l].slice(0, 12));

  const outcomes = useMemo(() => {
    const out: Record<string, Outcome> = {};
    for (const g of PAN_BOOKING.guests) {
      if (g.nationality !== 'Indian') out[g.id] = { status: 'not-required', reason: 'PAN isn’t needed for foreign nationals.' };
      else if (checking === g.id) out[g.id] = { status: 'checking', reason: '' };
      else if (ops[g.id]) out[g.id] = { status: ops[g.id].status, reason: ops[g.id].note };
      else if (submitted[g.id]) out[g.id] = evaluate(g, submitted[g.id], mode);
      else out[g.id] = { status: 'pending', reason: '' };
    }
    return out;
  }, [submitted, ops, mode, checking]);

  const guest = PAN_BOOKING.guests.find(g => g.id === active)!;
  const draft = drafts[active];
  const outcome = outcomes[active];
  const indian = PAN_BOOKING.guests.filter(g => g.nationality === 'Indian');
  const doneCount = indian.filter(g => outcomes[g.id].status === 'verified').length;

  const setDraft = (patch: Partial<Submission>) => setDrafts(d => ({ ...d, [active]: { ...d[active], ...patch } }));

  const verify = () => {
    const sub = { pan: draft.pan.trim().toUpperCase(), dob: draft.dob };
    setChecking(active);
    setOps(o => {
      const n = { ...o };
      delete n[active];
      return n;
    });
    setLabName(null);
    window.setTimeout(() => {
      setSubmitted(s => ({ ...s, [active]: sub }));
      setChecking(null);
      const res = evaluate(guest, sub, mode);
      addLog(`${guest.name}: PAN ${PAN_FORMAT.test(sub.pan) ? maskPan(sub.pan) : 'invalid'} → ${STATUS_LABEL[res.status]}${res.score !== undefined ? ` (score ${res.score})` : ''}`);
    }, 900);
  };

  const opsAction = (g: BookingGuest, action: 'approve' | 'ask') => {
    if (action === 'approve') {
      setOps(o => ({ ...o, [g.id]: { status: 'verified', note: 'Approved by ops after review.' } }));
      addLog(`Ops approved ${g.name} after review`);
    } else {
      setOps(o => ({ ...o, [g.id]: { status: 'pending', note: 'Ops asked the traveller to re-submit.' } }));
      setSubmitted(s => {
        const n = { ...s };
        delete n[g.id];
        return n;
      });
      addLog(`Ops asked ${g.name} to re-submit their PAN`);
    }
  };

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    addLog(`Scoring switched to ${m}; open checks re-scored`);
  };

  // Name lab: compare the (editable) booking name with the name on the PAN record.
  const rec = submitted[active] ? TEST_PANS.find(t => t.pan === submitted[active].pan) : undefined;
  const labA = labName ?? guest.name;
  const labOrig = rec ? scoreNames(labA, rec.nameOnRecord) : null;
  const labNew = rec ? scoreNamesImproved(labA, rec.nameOnRecord) : null;
  const flagged = indian.filter(g => outcomes[g.id].status === 'flagged');

  return (
    <section id="id-check" aria-labelledby="id-check-title" className="scroll-mt-24 border-t-2 border-ink pt-10 mt-24">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
        <div className="flex flex-col gap-2.5 max-w-[680px]">
          <h2 id="id-check-title" className="m-0 font-display font-medium text-[40px] md:text-[48px] leading-[1.05] tracking-[-0.02em]">ID check at checkout</h2>
          <p className="m-0 text-lg md:text-[19px] text-ink-soft">
            At {BRAND.name}, a fictional company, international trips need each Indian traveller’s PAN for tax collection at source (TCS). Names on PAN cards
            rarely match booking names exactly, so close matches go to a person instead of being rejected.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-muted">Name scoring</span>
          <div role="group" aria-label="Name scoring" className="inline-flex border border-ink rounded-md overflow-hidden">
            {(['original', 'improved'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                aria-pressed={mode === m}
                className={`min-h-[40px] px-4 text-[14px] capitalize transition-colors ${mode === m ? 'bg-ink text-paper' : 'hover:bg-paper-deep'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* ------------------------------------------------ Traveller */}
        <div className="bg-white border border-rule">
          <div className="flex items-center justify-between px-5 py-3 border-b border-rule">
            <span className="font-display text-lg">{BRAND.name}</span>
            <span className="font-mono text-xs text-muted">Traveller view</span>
          </div>
          <div className="p-5 flex flex-col gap-5">
            <div>
              <p className="m-0 text-sm text-muted">Booking confirmed · {PAN_BOOKING.id}</p>
              <h3 className="m-0 font-display font-normal text-[26px] leading-tight">{PAN_BOOKING.trip}</h3>
              <p className="m-0 text-sm text-muted">
                {PAN_BOOKING.variant} · {PAN_BOOKING.batch}
              </p>
            </div>

            <div className="bg-paper border border-rule p-4 flex flex-col gap-1">
              <p className="m-0 font-medium">Add PAN for each Indian traveller</p>
              <p className="m-0 text-sm text-ink-soft">
                Needed to complete TCS (tax collected at source) for international trips. TCS as applicable is shown on
                your invoice.
              </p>
            </div>

            <div role="tablist" aria-label="Guests" className="flex flex-wrap gap-2">
              {PAN_BOOKING.guests.map(g => (
                <button
                  key={g.id}
                  role="tab"
                  aria-selected={g.id === active}
                  onClick={() => {
                    setActive(g.id);
                    setLabName(null);
                  }}
                  className={`flex items-center gap-2 min-h-[40px] px-3 rounded-lg border text-[14px] ${
                    g.id === active ? 'border-ink' : 'border-rule hover:border-rule-strong'
                  }`}
                >
                  {g.name}
                  <Chip status={outcomes[g.id].status} label={outcomes[g.id].status === 'pending' ? '·' : undefined} />
                </button>
              ))}
            </div>

            {guest.nationality !== 'Indian' ? (
              <p className="m-0 text-ink-soft">
                {guest.name} is travelling on a {guest.nationality} passport, so no PAN is needed.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-[13px] text-muted">
                    PAN
                    <input
                      value={draft.pan}
                      onChange={e => setDraft({ pan: e.target.value.toUpperCase().slice(0, 10) })}
                      placeholder="Use a test PAN below"
                      autoComplete="off"
                      spellCheck={false}
                      className="min-h-[44px] px-3 border border-rule-strong rounded-lg font-mono text-[15px] text-ink uppercase tracking-wider focus:outline-none focus:border-ink"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-[13px] text-muted">
                    Date of birth
                    <input
                      type="date"
                      value={draft.dob}
                      onChange={e => setDraft({ dob: e.target.value })}
                      className="min-h-[44px] px-3 border border-rule-strong rounded-lg text-[15px] text-ink focus:outline-none focus:border-ink"
                    />
                  </label>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] text-muted">Test PANs (fictional)</span>
                  <div className="flex flex-wrap gap-2">
                    {TEST_PANS.map(t => (
                      <button
                        key={t.pan}
                        onClick={() => setDraft({ pan: t.pan })}
                        className="text-left px-2.5 py-1.5 border border-rule hover:border-ink rounded-md"
                      >
                        <span className="block font-mono text-[12px]">{t.pan}</span>
                        <span className="block text-xs text-muted">{t.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={verify} disabled={!draft.pan || checking !== null} className="btn-primary self-start disabled:opacity-50">
                  {outcome.status === 'checking' ? 'Checking…' : 'Verify PAN'}
                </button>

                {outcome.status !== 'pending' && outcome.status !== 'checking' && (
                  <div className="border-t border-rule pt-4 flex flex-col gap-1.5">
                    <Chip status={outcome.status} />
                    <p className="m-0 text-[15px]">{outcome.reason}</p>
                    {outcome.status === 'flagged' && (
                      <p className="m-0 text-[13px] text-muted">Your booking stays confirmed while we check. Nothing else needed from you.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------ Ops */}
        <div className="bg-paper-deep border border-rule">
          <div className="flex items-center justify-between px-5 py-3 border-b border-rule">
            <span className="font-display text-lg">Ops · {PAN_BOOKING.id}</span>
            <span className="font-mono text-xs text-muted">Operations view</span>
          </div>
          <div className="p-5 flex flex-col gap-5">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="text-left font-mono text-xs text-muted border-b border-rule-strong">
                  <th className="py-1.5 pr-2 font-normal">Guest</th>
                  <th className="py-1.5 pr-2 font-normal">PAN</th>
                  <th className="py-1.5 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {PAN_BOOKING.guests.map(g => (
                  <tr key={g.id} className="border-b border-rule">
                    <td className="py-2 pr-2">
                      {g.name}
                      <span className="block text-[12px] text-muted">{g.nationality}</span>
                    </td>
                    <td className="py-2 pr-2 font-mono text-[12px]">{submitted[g.id] && PAN_FORMAT.test(submitted[g.id].pan) ? maskPan(submitted[g.id].pan) : '—'}</td>
                    <td className="py-2">
                      <Chip status={outcomes[g.id].status} />
                      {ops[g.id] && <span className="block text-xs text-muted mt-0.5">{ops[g.id].note}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col gap-2">
              <p className="label m-0">Review queue</p>
              {flagged.length === 0 ? (
                <p className="m-0 text-[14px] text-muted">Nothing to review. Flagged names appear here.</p>
              ) : (
                flagged.map(g => (
                  <div key={g.id} className="bg-white border border-warning-line p-3 flex flex-col gap-2">
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 text-[13px]">
                      <span className="text-muted">Booking</span>
                      <span>{g.name}</span>
                      <span className="text-muted">PAN record</span>
                      <span>{outcomes[g.id].nameOnRecord}</span>
                      <span className="text-muted">Score</span>
                      <span>
                        {outcomes[g.id].score} <span className="text-muted">(verify at {VERIFY_AT}, flag from {FLAG_FROM})</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => opsAction(g, 'approve')} className="btn-secondary min-h-[36px] text-[13px]">Approve</button>
                      <button onClick={() => opsAction(g, 'ask')} className="btn-secondary min-h-[36px] text-[13px]">Ask traveller to re-submit</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[14px] border-t border-rule-strong pt-4">
              <span className="text-muted">Trip total</span>
              <span>₹{(PAN_BOOKING.pricePerPerson * PAN_BOOKING.guests.length).toLocaleString('en-IN')}</span>
              <span className="text-muted">TCS</span>
              <span>As applicable</span>
              <span className="text-muted">Ready to file</span>
              <span>
                {doneCount} of {indian.length} Indian travellers verified{doneCount === indian.length && <Check aria-hidden="true" size={14} strokeWidth={1.5} className="inline ml-1 align-[-2px]" />}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="label m-0">Activity</p>
              {log.length === 0 ? (
                <p className="m-0 text-[13px] text-muted">Verify a PAN to see the audit trail.</p>
              ) : (
                <ol className="m-0 p-0 list-none flex flex-col gap-1 max-h-[160px] overflow-auto">
                  {log.map((l, i) => (
                    <li key={i} className="text-[12px]">
                      <span className="font-mono text-muted mr-2">{l.t}</span>
                      {l.text}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ Name lab */}
      {rec && labOrig && labNew && guest.nationality === 'Indian' && (
        <div className="mt-8 bg-white border border-rule p-5 md:p-6 flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="label m-0">Name lab · {guest.name}</p>
              <p className="m-0 text-[15px] text-ink-soft">Edit the booking name and watch both scorings react.</p>
            </div>
            <label className="flex flex-col gap-1 text-[13px] text-muted min-w-[260px]">
              Name on booking
              <input
                value={labA}
                onChange={e => setLabName(e.target.value)}
                className="min-h-[44px] px-3 border border-rule-strong rounded-lg text-[15px] text-ink focus:outline-none focus:border-ink"
              />
            </label>
          </div>
          <p className="m-0 text-[14px]">
            <span className="text-muted">PAN record:</span> {rec.nameOnRecord}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {([
              ['Original scoring', labOrig, false],
              ['Improved scoring', labNew, true],
            ] as [string, NameMatch | ImprovedMatch, boolean][]).map(([title, m, improved]) => {
              const d = decideName(m.score);
              const im = m as ImprovedMatch;
              const steps: [string, string][] = [
                ['Normalised', `“${m.a}” vs “${m.b}”`],
                [
                  'Token subset',
                  improved
                    ? m.tokenSubset
                      ? im.subsetAllowed
                        ? 'Yes, two or more names incl. surname → 90'
                        : 'Subset, but too thin (needs 2+ names incl. surname)'
                      : 'No'
                    : m.tokenSubset
                    ? 'Yes → 90'
                    : 'No',
                ],
                ['Jaro-Winkler', `${m.jaroWinkler}`],
                ['Soundex', `${m.soundexA} / ${m.soundexB}${m.soundexBonus ? ' → +10' : ''}`],
              ];
              if (improved) steps.push(['First names', im.firstNamesMatch ? 'Same (or short form / initial)' : im.capped ? `Differ → capped at ${VERIFY_AT - 1}` : 'Differ']);
              return (
                <div key={title} className={`border p-4 flex flex-col gap-3 ${improved === (mode === 'improved') ? 'border-ink' : 'border-rule'}`}>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="m-0 font-display text-xl">{title}</p>
                    {improved === (mode === 'improved') && <span className="font-mono text-xs text-muted">in use</span>}
                  </div>
                  <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px]">
                    {steps.map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-muted">{k}</dt>
                        <dd className="m-0">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="flex items-center gap-3 border-t border-rule pt-3">
                    <span className="font-display text-[32px] leading-none">{m.score}</span>
                    <Chip status={d} />
                  </div>
                </div>
              );
            })}
          </div>
          {decideName(labOrig.score) !== decideName(labNew.score) && (
            <p className="m-0 text-[14px] text-ink-soft">
              <strong className="font-medium">Why the fix:</strong> testing the original on real-world pairs showed it
              verifying the wrong person when only the surname matched. The improved rules send those to a person instead.
            </p>
          )}
        </div>
      )}

      {/* ------------------------------------------------ How it decides */}
      <div className="mt-10 grid gap-x-8 gap-y-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {[
          ['1. Format', 'Ten characters: five letters, four digits, one letter.'],
          ['2. PAN exists', 'A verification service confirms the PAN is valid.'],
          ['3. Date of birth', 'Must match exactly. A mismatch fails, with a clear message.'],
          ['4. Name score', `${VERIFY_AT}+ verified · ${FLAG_FROM}–${VERIFY_AT - 1} flagged for ops · below ${FLAG_FROM} failed.`],
        ].map(([t, b]) => (
          <div key={t} className="border-t border-rule pt-3">
            <p className="m-0 font-display text-lg">{t}</p>
            <p className="m-0 text-[14px] text-ink-soft">{b}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 mb-0 font-mono text-[12px] text-muted">
        Mock verification: no real PAN is checked or stored, and only the fictional test PANs are accepted.
      </p>
    </section>
  );
};

export default PanCheck;
