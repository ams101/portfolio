import { BRAND } from '../data/genricTravel';

const APP = '/apps/supply/';

const TRY = [
  { label: 'Assign a vendor to a batch', href: `${APP}#/trips/vietnam/vendors?batch=vn-0123`, note: 'Licence and route warnings show as you choose' },
  { label: 'Onboard “Kaza Jeep” and watch the duplicate check', href: `${APP}#/supply/onboarding`, note: 'Same name in the same area, or the same phone' },
  { label: 'Open a vendor brief', href: `${APP}#/public/vendor/vietnam/vn-0123`, note: 'What a supplier sees: no phone numbers or medical details' },
  { label: 'Hand a batch over to WhatsApp', href: `${APP}#/trips/vietnam/batches/vn-0123`, note: 'Group name, numbers and intro ready to paste' },
];

const DECISIONS = [
  {
    title: 'One vendor record for supply and trips',
    body: 'A hotel, a coach company and a cruise operator are all vendors with the same lifecycle, licences and payouts. What differs is what they supply: stay, transfer, activity or rental.',
  },
  {
    title: 'Sell by room, bed or the whole place',
    body: 'Hostels sell beds, villas sell the whole property. The unit of sale lives on each room type, so one system handles both.',
  },
  {
    title: 'Compliance where decisions happen',
    body: 'Licences carry expiry dates. An expired permit doesn’t block anything; it shows up as a warning at the moment someone assigns that vendor to a batch.',
  },
  {
    title: 'Share the minimum with suppliers',
    body: 'The vendor brief has arrivals, rooming and dietary needs. Guest phone numbers and medical notes stay with the trip captain.',
  },
  {
    title: 'Work with WhatsApp, not against it',
    body: 'WhatsApp groups can’t be created through a link, so the handover prepares the group name, numbers and intro message to paste.',
  },
  {
    title: 'Pay vendors the way they’re paid locally',
    body: 'UPI and bank transfer for Indian vendors, IBAN and SWIFT for international partners like the Vietnam coach and cruise operators.',
  },
];

const OpsSection = () => (
  <section id="ops" aria-labelledby="ops-title" className="scroll-mt-24 border-t-2 border-ink pt-10 mt-24">
    <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
      <div className="flex flex-col gap-2.5 max-w-[680px]">
        <h2 id="ops-title" className="m-0 font-display font-medium text-[40px] md:text-[48px] leading-[1.05] tracking-[-0.02em]">{BRAND.name} Ops</h2>
        <p className="m-0 text-lg md:text-[19px] text-ink-soft">
          The back office behind the trips at {BRAND.name}, a fictional company: who the company buys from, and how each departure gets run. Two prototypes
          merged into one working app, with supply management on one side and trip operations on the other.
        </p>
      </div>
      <a href={APP} target="_blank" rel="noopener" className="btn-accent">
        Open the app <span aria-hidden="true">↗</span>
      </a>
    </div>

    {/* Structure */}
    <div className="grid gap-6 lg:grid-cols-3">
      {[
        {
          title: 'Vendors',
          sub: 'One directory',
          items: ['Stay · Transfer · Activity · Rental', 'Lifecycle: draft → under approval → active', 'Licences with expiry dates', 'Payouts: UPI, bank, IBAN, SWIFT', 'Guided onboarding with duplicate check'],
        },
        {
          title: 'Supply',
          sub: 'What we can sell',
          items: ['Properties → room types', 'Unit of sale: room, bed or entire place', 'Rates with date overrides', 'Availability calendar', 'Media library'],
        },
        {
          title: 'Trip operations',
          sub: 'Running each departure',
          items: ['Trip → itineraries → batches', 'Captains and guests (diet, medical)', 'Vendors assigned per batch and service', 'Handover to WhatsApp', 'Vendor brief and traveller welcome pack'],
        },
      ].map((col, i) => (
        <div key={col.title} className="bg-white border border-rule p-5 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="m-0 font-display font-normal text-2xl">{col.title}</h3>
            <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <p className="m-0 text-sm text-muted">{col.sub}</p>
          <ul className="m-0 pl-5 list-disc marker:text-rule-strong flex flex-col gap-1.5 text-[15px]">
            {col.items.map(it => <li key={it}>{it}</li>)}
          </ul>
        </div>
      ))}
    </div>
    <p className="mt-3 mb-0 font-mono text-[12px] text-muted">
      Vendors connect the two sides: a stay vendor’s properties live in Supply, and the same vendor is assigned to a batch in Trips.
    </p>

    {/* Try it */}
    <div className="mt-10">
      <p className="label m-0 mb-3">Try it</p>
      <ul className="m-0 p-0 list-none">
        {TRY.map((t, i) => (
          <li key={t.label}>
            <a
              href={t.href}
              target="_blank"
              rel="noopener"
              className={`group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 border-t ${i === 0 ? 'border-ink' : 'border-rule'} ${i === TRY.length - 1 ? 'border-b border-b-rule' : ''}`}
            >
              <span className="flex flex-col">
                <span className="font-display text-[22px] leading-tight">{t.label}</span>
                <span className="text-[14px] text-muted">{t.note}</span>
              </span>
              <span className="row-arrow text-[15px] font-medium">Open ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* Decisions */}
    <div className="mt-10">
      <p className="label m-0 mb-4">Decisions that mattered</p>
      <ol className="m-0 p-0 list-none grid gap-x-8 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        {DECISIONS.map((d, i) => (
          <li key={d.title} className="flex gap-4 py-5 border-t border-rule">
            <span className="font-mono text-[13px] text-accent pt-1.5">{i + 1}</span>
            <div className="flex flex-col gap-1.5">
              <h3 className="m-0 font-display font-normal text-[22px] leading-[1.25]">{d.title}</h3>
              <p className="m-0 text-[15px] text-ink-soft leading-relaxed">{d.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
    <p className="mt-6 mb-0 font-mono text-[12px] text-muted">
      Runs in your browser on fictional data; changes you make stay in this browser. Built with React and TypeScript.
    </p>
  </section>
);

export default OpsSection;
