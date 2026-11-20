import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ServiceType, Vendor } from '../../types';
import { SERVICE_TYPES } from '../../data/opsData';
import { addVendor, findDuplicates, useVendors } from '../../data/store';
import { Card, PageHeader, btn } from '../../components/ui';

const STEPS = ['Basics', 'Contact', 'Documents', 'Payout', 'Review'];

interface Form {
  legalName: string;
  serviceTypes: ServiceType[];
  areas: string;
  contactName: string;
  phone: string;
  email: string;
  docType: string;
  docNumber: string;
  docExpiry: string;
  payoutMethod: 'UPI' | 'Bank' | 'IBAN' | 'SWIFT';
  beneficiary: string;
  taxId: string;
}

const EMPTY: Form = {
  legalName: '', serviceTypes: ['Transfer'], areas: '', contactName: '', phone: '', email: '',
  docType: 'Tourist Vehicle Permit', docNumber: '', docExpiry: '', payoutMethod: 'Bank', beneficiary: '', taxId: '',
};

const input = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm';

export function VendorOnboardingPage() {
  const all = useVendors();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(EMPTY);
  const [override, setOverride] = useState(false);
  const set = (patch: Partial<Form>) => setF(x => ({ ...x, ...patch }));

  const dupes = findDuplicates(all, f.legalName, f.areas, f.phone);
  const blockedByDupes = step === 0 && dupes.length > 0 && !override;
  const valid = [
    f.legalName.trim().length > 1 && f.serviceTypes.length > 0 && f.areas.trim().length > 1,
    f.contactName.trim().length > 1 && f.phone.trim().length > 6,
    true, // documents can follow later; the vendor stays "Under approval"
    f.beneficiary.trim().length > 1,
    true,
  ][step];

  const submit = () => {
    const v: Omit<Vendor, 'id' | 'updatedAt'> = {
      legalName: f.legalName.trim(),
      serviceTypes: f.serviceTypes,
      type: 'partner',
      servicedAreas: f.areas.split(',').map(a => a.trim()).filter(Boolean),
      languages: ['English'],
      contacts: { primary: { name: f.contactName, phone: f.phone, whatsapp: f.phone, email: f.email } },
      payout: { method: f.payoutMethod, beneficiary: f.beneficiary, taxId: f.taxId },
      status: 'Under approval',
      licenses: f.docNumber
        ? [{ id: 'lic_' + Date.now(), type: f.docType, number: f.docNumber, issuer: '—', issueDate: '', expiryDate: f.docExpiry, files: [], status: 'Needs review' }]
        : [],
      notes: 'Added through onboarding in this browser.',
    };
    const created = addVendor(v);
    navigate(`/supply/vendors/${created.id}`);
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Onboard a vendor" subtitle="Transfers, activities, rentals or stays. New vendors start as “Under approval”." />
      <ol className="flex flex-wrap gap-2 mb-6">
        {STEPS.map((s, i) => (
          <li key={s} className={`px-3 py-1 rounded-full text-xs border ${i === step ? 'border-emerald-500 text-white' : i < step ? 'border-gray-600 text-gray-300' : 'border-gray-700 text-gray-500'}`}>
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <Card className="p-5 space-y-4">
        {step === 0 && (
          <>
            <label className="block text-sm text-gray-300">Legal name<input className={`${input} mt-1`} value={f.legalName} onChange={e => set({ legalName: e.target.value })} placeholder="e.g. Kaza Jeep Co." /></label>
            <div>
              <p className="text-sm text-gray-300 mb-1">What do they supply?</p>
              <div className="flex flex-wrap gap-2">
                {SERVICE_TYPES.map(s => {
                  const on = f.serviceTypes.includes(s);
                  return (
                    <button key={s} type="button" aria-pressed={on} onClick={() => set({ serviceTypes: on ? f.serviceTypes.filter(x => x !== s) : [...f.serviceTypes, s] })}
                      className={`px-3 py-1.5 rounded-lg text-sm border ${on ? 'bg-gray-700 border-gray-500 text-white' : 'border-gray-700 text-gray-300'}`}>{s}</button>
                  );
                })}
              </div>
            </div>
            <label className="block text-sm text-gray-300">Areas served (comma separated)<input className={`${input} mt-1`} value={f.areas} onChange={e => set({ areas: e.target.value })} placeholder="e.g. Kaza, Tabo" /></label>
            {dupes.length > 0 && (
              <div className="rounded-lg border border-amber-700 bg-amber-900/30 p-3 text-sm">
                <p className="text-amber-200 font-medium">Possible duplicate</p>
                <ul className="mt-1 space-y-1">
                  {dupes.map(d => (
                    <li key={d.id} className="text-gray-200">
                      {d.legalName} · {d.servicedAreas.join(', ')} · <Link to={`/supply/vendors/${d.id}`} className="text-emerald-300">Open existing</Link>
                    </li>
                  ))}
                </ul>
                {!override && <button type="button" onClick={() => setOverride(true)} className="mt-2 text-amber-200 underline">Create anyway</button>}
              </div>
            )}
          </>
        )}
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-gray-300">Contact person<input className={`${input} mt-1`} value={f.contactName} onChange={e => set({ contactName: e.target.value })} /></label>
            <label className="block text-sm text-gray-300">Phone / WhatsApp<input className={`${input} mt-1`} value={f.phone} onChange={e => set({ phone: e.target.value })} placeholder="+91 …" /></label>
            <label className="block text-sm text-gray-300 sm:col-span-2">Email<input className={`${input} mt-1`} value={f.email} onChange={e => set({ email: e.target.value })} /></label>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm text-gray-300">Document<select className={`${input} mt-1`} value={f.docType} onChange={e => set({ docType: e.target.value })}>
              {['Tourist Vehicle Permit', 'Transport Permit', 'Trade Licence', 'Insurance', 'GST registration'].map(o => <option key={o}>{o}</option>)}
            </select></label>
            <label className="block text-sm text-gray-300">Number<input className={`${input} mt-1`} value={f.docNumber} onChange={e => set({ docNumber: e.target.value })} /></label>
            <label className="block text-sm text-gray-300">Expires<input type="date" className={`${input} mt-1`} value={f.docExpiry} onChange={e => set({ docExpiry: e.target.value })} /></label>
            <p className="sm:col-span-3 text-xs text-gray-400">Optional now. Licences with an expiry date get tracked on the Licences page, and expired ones are flagged when assigning the vendor to a batch.</p>
          </div>
        )}
        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm text-gray-300">Method<select className={`${input} mt-1`} value={f.payoutMethod} onChange={e => set({ payoutMethod: e.target.value as Form['payoutMethod'] })}>
              {['UPI', 'Bank', 'IBAN', 'SWIFT'].map(o => <option key={o}>{o}</option>)}
            </select></label>
            <label className="block text-sm text-gray-300">Beneficiary<input className={`${input} mt-1`} value={f.beneficiary} onChange={e => set({ beneficiary: e.target.value })} /></label>
            <label className="block text-sm text-gray-300">Tax ID<input className={`${input} mt-1`} value={f.taxId} onChange={e => set({ taxId: e.target.value })} /></label>
            <p className="sm:col-span-3 text-xs text-gray-400">IBAN and SWIFT cover international partners, like the transport and cruise vendors in Vietnam.</p>
          </div>
        )}
        {step === 4 && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {[
              ['Name', f.legalName], ['Supplies', f.serviceTypes.join(', ')], ['Areas', f.areas], ['Contact', `${f.contactName} · ${f.phone}`],
              ['Document', f.docNumber ? `${f.docType} ${f.docNumber}${f.docExpiry ? `, expires ${f.docExpiry}` : ''}` : 'To follow'],
              ['Payout', `${f.payoutMethod} · ${f.beneficiary}`], ['Status', 'Under approval'],
            ].map(([k, v]) => (
              <div key={k} className="contents"><dt className="text-gray-400">{k}</dt><dd className="text-gray-100">{v}</dd></div>
            ))}
          </dl>
        )}

        <div className="flex justify-between pt-4 border-t border-gray-700">
          <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0} className={`${btn.ghost} disabled:opacity-40`}>Back</button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep(s => s + 1)} disabled={!valid || blockedByDupes} className={`${btn.primary} disabled:opacity-40`}>Next</button>
          ) : (
            <button type="button" onClick={submit} className={btn.primary}>Submit for approval</button>
          )}
        </div>
      </Card>
    </div>
  );
}
