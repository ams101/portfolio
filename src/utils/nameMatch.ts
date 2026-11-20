// Name matching from the original post-booking PAN prototype, ported to TypeScript.
// Same logic: strip titles and punctuation, accept a token subset ("Arif Khan" in
// "Mohammed Arif Khan"), otherwise Jaro-Winkler similarity plus a Soundex bonus.

export function normaliseName(n: string): string {
  if (!n) return '';
  return n
    .toLowerCase()
    .trim()
    .replace(/\b(mr|mrs|ms|dr|prof|shri|smt)\.?\b/gi, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenSubsetMatch(a: string, b: string): boolean {
  const ta = normaliseName(a).split(' ').filter(Boolean);
  const tb = normaliseName(b).split(' ').filter(Boolean);
  if (!ta.length || !tb.length) return false;
  const [short, long] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  return short.every(t => long.includes(t));
}

export function jaroWinkler(a: string, b: string): number {
  const s1 = normaliseName(a);
  const s2 = normaliseName(b);
  if (s1 === s2) return 1;
  const l1 = s1.length;
  const l2 = s2.length;
  if (!l1 || !l2) return 0;
  const md = Math.floor(Math.max(l1, l2) / 2) - 1;
  const m1 = new Array(l1).fill(false);
  const m2 = new Array(l2).fill(false);
  let matches = 0;
  let trans = 0;
  for (let i = 0; i < l1; i++) {
    for (let j = Math.max(0, i - md); j < Math.min(i + md + 1, l2); j++) {
      if (m2[j] || s1[i] !== s2[j]) continue;
      m1[i] = m2[j] = true;
      matches++;
      break;
    }
  }
  if (!matches) return 0;
  let k = 0;
  for (let i = 0; i < l1; i++) {
    if (!m1[i]) continue;
    while (!m2[k]) k++;
    if (s1[i] !== s2[k]) trans++;
    k++;
  }
  const jaro = (matches / l1 + matches / l2 + (matches - trans / 2) / matches) / 3;
  let p = 0;
  for (let i = 0; i < Math.min(4, Math.min(l1, l2)); i++) {
    if (s1[i] === s2[i]) p++;
    else break;
  }
  return jaro + p * 0.1 * (1 - jaro);
}

export function soundexCode(n: string): string {
  const first = normaliseName(n).replace(/\s.*/, '');
  if (!first) return '';
  const map: Record<string, number> = {
    b: 1, f: 1, p: 1, v: 1,
    c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
    d: 3, t: 3, l: 4, m: 5, n: 5, r: 6,
  };
  let code = first[0].toUpperCase();
  let prev = map[first[0]] || 0;
  for (let i = 1; i < first.length && code.length < 4; i++) {
    const c = map[first[i]];
    if (c && c !== prev) code += c;
    prev = c || 0;
  }
  return code.padEnd(4, '0');
}

export interface NameMatch {
  a: string;
  b: string;
  exact: boolean;
  tokenSubset: boolean;
  jaroWinkler: number; // 0..100
  soundexA: string;
  soundexB: string;
  soundexBonus: number;
  score: number; // 0..100
}

/** Same scoring as the prototype's fuzzyScore(), with each step exposed. */
export function scoreNames(a: string, b: string): NameMatch {
  const na = normaliseName(a);
  const nb = normaliseName(b);
  const exact = na === nb && na.length > 0;
  const tokenSubset = !exact && tokenSubsetMatch(na, nb);
  const jw = Math.round(jaroWinkler(na, nb) * 100);
  const soundexA = soundexCode(na);
  const soundexB = soundexCode(nb);
  const soundexBonus = soundexA && soundexA === soundexB ? 10 : 0;
  const score = exact ? 100 : tokenSubset ? 90 : Math.min(100, jw + soundexBonus);
  return { a: na, b: nb, exact, tokenSubset, jaroWinkler: jw, soundexA, soundexB, soundexBonus, score };
}

// Decision thresholds for the demo.
export const VERIFY_AT = 75;
export const FLAG_FROM = 60;

export type NameDecision = 'verified' | 'flagged' | 'failed';

export const decideName = (score: number): NameDecision =>
  score >= VERIFY_AT ? 'verified' : score >= FLAG_FROM ? 'flagged' : 'failed';

// ---------------------------------------------------------------------------
// Improved scoring
// Two fixes found by testing the original against realistic pairs:
//  1. A token-subset match needs at least two names, including the surname.
//     ("Khan" alone no longer matches "Mohammed Arif Khan".)
//  2. If the first names clearly differ, the score is capped below the verify
//     threshold, so a person reviews it. Short forms and initials still count as
//     the same first name. ("Rahul Verma" vs "Rakesh Kumar Verma" is flagged,
//     not verified.)
// ---------------------------------------------------------------------------

const FIRST_NAME_ALIASES: string[][] = [
  ['mohd', 'md', 'mohammed', 'mohammad', 'mohamed', 'muhammad', 'mohamad'],
  ['syed', 'sayed', 'saiyed'],
  ['shaikh', 'sheikh', 'shaik', 'sk'],
];

function sameFirstName(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length === 1 || b.length === 1) return a[0] === b[0]; // initials
  if (FIRST_NAME_ALIASES.some(g => g.includes(a) && g.includes(b))) return true;
  return jaroWinkler(a, b) >= 0.9; // small spelling slips: "pria" / "priya"
}

export interface ImprovedMatch extends NameMatch {
  subsetAllowed: boolean;
  firstNamesMatch: boolean;
  capped: boolean;
}

export function scoreNamesImproved(a: string, b: string): ImprovedMatch {
  const base = scoreNames(a, b);
  const ta = base.a.split(' ').filter(Boolean);
  const tb = base.b.split(' ').filter(Boolean);
  const [short, long] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  const subsetAllowed = base.tokenSubset && short.length >= 2 && short.includes(long[long.length - 1]);
  // A valid subset (e.g. a dropped leading name) already proves the names line up.
  const firstNamesMatch = subsetAllowed || sameFirstName(ta[0] ?? '', tb[0] ?? '');

  let score: number;
  if (base.exact) score = 100;
  else if (subsetAllowed) score = 90;
  else score = Math.min(100, base.jaroWinkler + base.soundexBonus);

  const capped = !base.exact && !firstNamesMatch && score >= VERIFY_AT;
  if (capped) score = VERIFY_AT - 1;

  return { ...base, score, subsetAllowed, firstNamesMatch, capped };
}
