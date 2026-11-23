import type { ReactNode } from 'react';

// Hand-drawn-style flow diagrams for the case studies, in the site's palette.
// Built only from facts in the case-study text; no real screenshots or data.

const INK = '#171717';
const MUTED = '#6B6B6B';
const RULE = '#D4D4D4';
const ACCENT = '#B42318';
const SERIF = '"Anek Latin", "IBM Plex Sans", sans-serif';
const SANS = '"IBM Plex Sans", system-ui, sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, monospace';

type Tone = 'plain' | 'accent' | 'muted';

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  tone?: Tone;
  dashed?: boolean;
}

const Box = ({ x, y, w, h, title, lines = [], tone = 'plain', dashed = false }: BoxProps) => {
  const stroke = tone === 'accent' ? ACCENT : tone === 'muted' ? RULE : INK;
  const fill = tone === 'accent' ? '#F7E9E4' : tone === 'muted' ? '#F4F4F5' : '#FFFFFF';
  const titleColor = tone === 'muted' ? MUTED : INK;
  const blockH = 22 + lines.length * 17;
  const top = y + (h - blockH) / 2 + 16;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.25} strokeDasharray={dashed ? '5 4' : undefined} />
      <text x={x + w / 2} y={top} textAnchor="middle" fontFamily={SERIF} fontSize={19} fill={titleColor}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={l} x={x + w / 2} y={top + 22 + i * 17} textAnchor="middle" fontFamily={SANS} fontSize={13} fill={MUTED}>
          {l}
        </text>
      ))}
    </g>
  );
};

const Arrow = ({ d, id, color = INK, dashed = false }: { d: string; id: string; color?: string; dashed?: boolean }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? '4 4' : undefined} markerEnd={`url(#${id})`} />
);

const Note = ({ x, y, lines, anchor = 'middle' }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end' }) => (
  <g>
    {lines.map((l, i) => (
      <text key={l} x={x} y={y + i * 17} textAnchor={anchor} fontFamily={SANS} fontSize={13} fill={ACCENT}>
        {l}
      </text>
    ))}
  </g>
);

const Label = ({ x, y, text }: { x: number; y: number; text: string }) => (
  <text x={x} y={y} fontFamily={MONO} fontSize={12} fill={MUTED} letterSpacing="0.04em">
    {text}
  </text>
);

const Frame = ({ id, label, h, children }: { id: string; label: string; h: number; children: ReactNode }) => (
  <svg viewBox={`0 0 960 ${h}`} role="img" aria-label={label} className="block w-full min-w-[760px] h-auto">
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill={INK} />
      </marker>
      <marker id={`${id}-a`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill={ACCENT} />
      </marker>
    </defs>
    {children}
  </svg>
);

const ZoTrips = () => (
  <Frame
    id="zt"
    h={400}
    label="Diagram: three demand sources (social campaigns, hostel and destination pages, WhatsApp reactivation) lead to a personalised trip page, then an AI comparator, then a booked trip, supported by vendor tooling and LLM checks."
  >
    <Box x={20} y={30} w={230} h={72} title="Social campaigns" lines={['India and GCC, by segment']} />
    <Box x={20} y={124} w={230} h={72} title="Hostel and destination pages" lines={['trips get prime space']} />
    <Box x={20} y={218} w={230} h={72} title="WhatsApp reactivation" lines={['WATI, from past stays']} />
    <Arrow id="zt" d="M250 66 C 285 66, 285 140, 318 140" />
    <Arrow id="zt" d="M250 160 L318 160" />
    <Arrow id="zt" d="M250 254 C 285 254, 285 180, 318 180" />
    <Box x={320} y={105} w={190} h={110} title="Trip page" lines={['personalised by past stays,', 'budget and group type']} />
    <Arrow id="zt" d="M510 160 L558 160" />
    <Box x={560} y={105} w={190} h={110} tone="accent" title="AI comparator" lines={['explains the difference', 'between trips in plain', 'language']} />
    <Arrow id="zt" d="M750 160 L798 160" />
    <Box x={800} y={105} w={140} h={110} title="Booked trip" />
    <Note x={535} y={40} lines={['Together: ~15% more leads from the same traffic']} />
    <Arrow id="zt-a" color={ACCENT} dashed d="M480 50 L415 102" />
    <Arrow id="zt-a" color={ACCENT} dashed d="M590 50 L655 102" />
    <Box x={320} y={300} w={620} h={70} dashed tone="muted" title="Behind the scenes" lines={['vendor, inventory and pricing tooling · LLM checks on content and data quality']} />
  </Frame>
);

const Shaadi = () => (
  <Frame
    id="sh"
    h={380}
    label="Diagram: the payment funnel from paywall to checkout, gateway, bank OTP and paid, with the changes made at each step and an auto-renewal loop back to the gateway."
  >
    <Note x={95} y={70} lines={['Plan page redesign,', '15+ A/B tests']} />
    <Arrow id="sh-a" color={ACCENT} dashed d="M95 96 L95 146" />
    <Note x={485} y={70} lines={['Routing and contract', 'changes: ~3% lower costs']} />
    <Arrow id="sh-a" color={ACCENT} dashed d="M485 96 L485 146" />
    <Note x={680} y={70} lines={['Direct-OTP reads', 'the code in the app']} />
    <Arrow id="sh-a" color={ACCENT} dashed d="M680 96 L680 146" />

    <Box x={20} y={150} w={150} h={90} title="Paywall" lines={['plans and pricing']} />
    <Arrow id="sh" d="M170 195 L213 195" />
    <Box x={215} y={150} w={150} h={90} title="Checkout" lines={['plan chosen']} />
    <Arrow id="sh" d="M365 195 L408 195" />
    <Box x={410} y={150} w={150} h={90} title="Gateway" lines={['routed across PGs']} />
    <Arrow id="sh" d="M560 195 L603 195" />
    <Box x={605} y={150} w={150} h={90} title="Bank OTP" lines={['card or bank auth']} />
    <Arrow id="sh" d="M755 195 L798 195" />
    <Box x={800} y={150} w={140} h={90} title="Paid" lines={['plan active']} />

    <Arrow id="sh-a" color={ACCENT} d="M870 240 L870 300 L485 300 L485 244" />
    <Note x={678} y={326} lines={['Auto-renewal engine: renews at the next cycle', 'without a new checkout']} />
  </Frame>
);

const Careismatic = () => (
  <Frame
    id="cm"
    h={360}
    label="Diagram: before, US buyers ordered through a legacy Salesforce-based flow with frequent payment failures; after, they use a marketplace with a Barclays gateway and JESTA billing."
  >
    <Label x={20} y={80} text="BEFORE" />
    <Box x={130} y={40} w={170} h={72} tone="muted" title="US buyer" lines={['B2B, medical apparel']} />
    <Arrow id="cm" d="M300 76 L353 76" />
    <Box x={355} y={40} w={190} h={72} tone="muted" title="Legacy ordering" lines={['Salesforce-based']} />
    <Arrow id="cm" d="M545 76 L598 76" />
    <Box x={600} y={40} w={190} h={72} tone="muted" title="Checkout" lines={['frequent payment failures']} />

    <line x1={20} y1={150} x2={940} y2={150} stroke={RULE} strokeWidth={1} />

    <Label x={20} y={230} text="AFTER" />
    <Box x={130} y={190} w={170} h={72} title="US buyer" lines={['B2B, medical apparel']} />
    <Arrow id="cm" d="M300 226 L353 226" />
    <Box x={355} y={190} w={190} h={72} tone="accent" title="Marketplace" lines={['OLX-style, 5-person team']} />
    <Arrow id="cm" d="M545 226 L598 226" />
    <Box x={600} y={190} w={160} h={72} title="Barclays gateway" lines={['international cards']} />
    <Arrow id="cm" d="M760 226 L783 226" />
    <Box x={785} y={190} w={155} h={72} title="JESTA billing" />

    <Note x={450} y={295} lines={['~10% lower platform', 'and operating costs']} />
    <Note x={680} y={295} lines={['16% fewer', 'payment failures']} />
  </Frame>
);

const Mavenvista = () => (
  <Frame
    id="mv"
    h={380}
    label="Diagram: the procure-to-pay flow from requisition to quotes, purchase order, vendor delivery and invoice, with analytics and recommendations over quotes and orders, a vendor onboarding add-on over the vendor step, and SAP integration underneath."
  >
    <Box x={205} y={30} w={355} h={70} tone="accent" title="Analytics and recommendations" lines={['VendX: suggests purchases from history and trends']} />
    <Box x={575} y={30} w={365} h={70} tone="accent" title="Vendor onboarding add-on" lines={['+22% revenue from existing accounts']} />
    <Arrow id="mv-a" color={ACCENT} dashed d="M280 100 L280 156" />
    <Arrow id="mv-a" color={ACCENT} dashed d="M465 100 L465 156" />
    <Arrow id="mv-a" color={ACCENT} dashed d="M650 100 L650 156" />

    <Box x={20} y={160} w={150} h={84} title="Requisition" lines={['PR']} />
    <Arrow id="mv" d="M170 202 L203 202" />
    <Box x={205} y={160} w={150} h={84} title="Quotes" lines={['RFQ']} />
    <Arrow id="mv" d="M355 202 L388 202" />
    <Box x={390} y={160} w={150} h={84} title="Purchase order" lines={['PO']} />
    <Arrow id="mv" d="M540 202 L573 202" />
    <Box x={575} y={160} w={150} h={84} title="Vendor" lines={['delivers']} />
    <Arrow id="mv" d="M725 202 L758 202" />
    <Box x={760} y={160} w={180} h={84} title="Invoice and payment" />

    <Box x={390} y={290} w={550} h={56} tone="muted" dashed title="SAP integration" />
    <Note x={20} y={318} anchor="start" lines={['5%+ savings on', '₹500 Cr+ of spend']} />
  </Frame>
);

export const CASE_DIAGRAMS: Record<string, { Diagram: () => JSX.Element; caption: string }> = {
  'zo-trips': { Diagram: ZoTrips, caption: 'How a traveller reaches a booked trip after the rebuild.' },
  shaadi: { Diagram: Shaadi, caption: 'The payment funnel, and what changed at each step.' },
  careismatic: { Diagram: Careismatic, caption: 'Ordering and payments for US buyers, before and after.' },
  mavenvista: { Diagram: Mavenvista, caption: 'Procure-to-pay, and where the add-ons plug in.' },
};
