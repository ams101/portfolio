import { useMemo, useState } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import type { ServiceType } from '../../types';
import { SERVICE_TYPES, type Trip } from '../../data/opsData';
import { assignVendor, unassignVendor, useBatches, useVendors } from '../../data/store';
import { Card, ServiceChip, btn, fmtRange } from '../../components/ui';

export function TripVendorsTab() {
  const trip = useOutletContext<Trip>();
  const [params, setParams] = useSearchParams();
  const batches = useBatches().filter(b => b.tripId === trip.id).sort((a, b) => a.start.localeCompare(b.start));
  const vendors = useVendors();
  const batch = batches.find(b => b.id === params.get('batch')) ?? batches[0];
  const [service, setService] = useState<ServiceType>('Transfer');
  const [query, setQuery] = useState('');
  const [note, setNote] = useState('');

  const tripAreas = useMemo(() => trip.route.map(r => r.toLowerCase()), [trip]);
  const candidates = vendors
    .filter(v => v.serviceTypes.includes(service))
    .filter(v => !query || (v.legalName + ' ' + v.servicedAreas.join(' ')).toLowerCase().includes(query.toLowerCase()))
    .map(v => ({ v, local: v.servicedAreas.some(a => tripAreas.some(t => t.includes(a.toLowerCase()) || a.toLowerCase().includes(t))) }))
    .sort((a, b) => Number(b.local) - Number(a.local) || Number(!!b.v.preferred) - Number(!!a.v.preferred));

  if (!batch) return <p className="text-gray-400">No batches yet.</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Card className="p-3 h-fit">
        <p className="px-2 pb-2 text-xs text-gray-400 uppercase tracking-wider">Batches</p>
        <div className="space-y-1">
          {batches.map(b => (
            <button
              key={b.id}
              onClick={() => setParams({ batch: b.id })}
              className={`w-full text-left px-2 py-2 rounded-md text-sm ${b.id === batch.id ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              {b.name}
              <span className="block text-xs text-gray-400">{fmtRange(b.start, b.end)}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-5">
          <h2 className="text-white font-semibold mb-3">Current assignments · {batch.name}</h2>
          {batch.assignments.length === 0 ? (
            <p className="text-sm text-gray-400">No vendors assigned to this batch yet.</p>
          ) : (
            <ul className="divide-y divide-gray-700">
              {batch.assignments.map(a => {
                const v = vendors.find(x => x.id === a.vendorId);
                return (
                  <li key={a.service + a.vendorId} className="flex flex-wrap items-center gap-3 py-2.5">
                    <ServiceChip service={a.service} />
                    <Link to={`/supply/vendors/${a.vendorId}`} className="text-gray-100 hover:underline">{v?.legalName ?? a.vendorId}</Link>
                    {a.note && <span className="text-sm text-gray-400 flex-1">{a.note}</span>}
                    <button onClick={() => unassignVendor(batch.id, a.service, a.vendorId)} className="text-sm text-red-300 hover:text-red-200 ml-auto">Remove</button>
                  </li>
                );
              })}
            </ul>
          )}
          <Link to={`/public/vendor/${trip.id}/${batch.id}`} target="_blank" className="inline-block mt-4 text-sm text-emerald-300 hover:text-emerald-200">
            See what vendors see for this batch ↗
          </Link>
        </Card>

        <Card className="p-5 space-y-4">
          <h2 className="text-white font-semibold">Assign a vendor</h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Service type">
            {SERVICE_TYPES.map(s => (
              <button
                key={s}
                onClick={() => setService(s)}
                aria-pressed={s === service}
                className={`px-3 py-1.5 rounded-lg text-sm border ${s === service ? 'bg-gray-700 border-gray-500 text-white' : 'border-gray-700 text-gray-300 hover:border-gray-500'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search vendor name or area" className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note, e.g. 2 coaches, AM window" className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <ul className="divide-y divide-gray-700">
            {candidates.length === 0 && <li className="py-3 text-sm text-gray-400">No {service.toLowerCase()} vendors match. <Link to="/supply/onboarding" className="text-emerald-300">Onboard one</Link>.</li>}
            {candidates.map(({ v, local }) => {
              const assigned = batch.assignments.some(a => a.vendorId === v.id && a.service === service);
              const lapsed = v.licenses.some(l => l.status === 'Expired');
              return (
                <li key={v.id} className="flex flex-wrap items-center gap-3 py-2.5">
                  <div className="flex-1 min-w-[200px]">
                    <div className="text-gray-100">
                      {v.legalName} {v.preferred && <span className="text-xs text-emerald-300 ml-1">Preferred</span>}
                    </div>
                    <div className="text-xs text-gray-400">
                      {v.servicedAreas.join(', ')}
                      {v.rating ? ` · ★ ${v.rating}` : ''}
                      {!local && ' · outside this route'}
                    </div>
                    {lapsed && <div className="text-xs text-amber-300 mt-0.5">Licence expired: check before confirming</div>}
                  </div>
                  <button
                    disabled={assigned}
                    onClick={() => {
                      assignVendor(batch.id, { service, vendorId: v.id, note: note || undefined });
                      setNote('');
                    }}
                    className={`${btn.secondary} disabled:opacity-40`}
                  >
                    {assigned ? 'Assigned' : 'Assign'}
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
