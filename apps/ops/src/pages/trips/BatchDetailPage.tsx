import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { captains, guests, trips } from '../../data/opsData';
import { useBatches, useVendors } from '../../data/store';
import { BatchChip, Card, ServiceChip, btn, fmtRange } from '../../components/ui';
import { HandoverDrawer } from '../../components/HandoverDrawer';

export function BatchDetailPage() {
  const { tripId, batchId } = useParams();
  const trip = trips.find(t => t.id === tripId);
  const batch = useBatches().find(b => b.id === batchId);
  const vendors = useVendors();
  const [handover, setHandover] = useState(false);
  if (!trip || !batch) return <p className="text-gray-400">Batch not found.</p>;

  const cap = captains.find(c => c.id === batch.captainId);
  const backup = captains.find(c => c.id === batch.backupCaptainId);
  const list = batch.guestIds.map(id => guests.find(g => g.id === id)!).filter(Boolean);
  const variant = trip.variants.find(v => v.id === batch.variantId);

  return (
    <div className="space-y-6">
      <div>
        <Link to={`/trips/${trip.id}/batches`} className="text-sm text-gray-400 hover:text-white">← {trip.name}</Link>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl font-semibold text-white">{batch.name}</h1>
            <p className="text-sm text-gray-400 mt-1">
              {variant?.name} · {fmtRange(batch.start, batch.end)} · {batch.seatsSold}/{batch.seatsTotal} seats · <BatchChip status={batch.status} />
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setHandover(true)} disabled={list.length === 0} className={`${btn.primary} disabled:opacity-40`}>Handover to WhatsApp</button>
            <Link to={`/public/vendor/${trip.id}/${batch.id}`} target="_blank" className={btn.secondary}>Vendor view ↗</Link>
            <Link to={`/public/welcome/${trip.id}/${batch.id}`} target="_blank" className={btn.secondary}>Welcome pack ↗</Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Captains</p>
          {cap ? <p className="text-gray-100">{cap.name} <span className="text-gray-400 text-sm">· {cap.phone}</span></p> : <p className="text-amber-300 text-sm">No captain assigned</p>}
          {backup && <p className="text-gray-300 text-sm mt-1">Backup: {backup.name}</p>}
        </Card>
        <Card className="p-4 md:col-span-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Transfer plan</p>
          <p className="text-gray-100 text-sm">{batch.transferPlan ?? '—'}</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Vendors</p>
          <Link to={`/trips/${trip.id}/vendors?batch=${batch.id}`} className="text-sm text-emerald-300 hover:text-emerald-200">Manage</Link>
        </div>
        {batch.assignments.length === 0 ? (
          <p className="text-sm text-gray-400">None assigned.</p>
        ) : (
          <ul className="space-y-2">
            {batch.assignments.map(a => (
              <li key={a.service + a.vendorId} className="flex flex-wrap items-center gap-3 text-sm">
                <ServiceChip service={a.service} />
                <span className="text-gray-100">{vendors.find(v => v.id === a.vendorId)?.legalName}</span>
                {a.note && <span className="text-gray-400">{a.note}</span>}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
            <tr>
              {['Guest', 'Phone', 'Arrival', 'Room', 'Diet', 'Medical'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {list.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-4 text-gray-400">No guests yet.</td></tr>
            )}
            {list.map(g => (
              <tr key={g.id}>
                <td className="px-4 py-3 text-gray-100">{g.name}</td>
                <td className="px-4 py-3 text-gray-300">{g.phone}</td>
                <td className="px-4 py-3 text-gray-300">{g.arrival ?? '—'}</td>
                <td className="px-4 py-3 text-gray-300">{g.room ?? '—'}</td>
                <td className="px-4 py-3 text-gray-300">{g.diet ?? '—'}</td>
                <td className={`px-4 py-3 ${g.medical ? 'text-amber-200' : 'text-gray-500'}`}>{g.medical ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {handover && <HandoverDrawer trip={trip} batch={batch} onClose={() => setHandover(false)} />}
    </div>
  );
}
