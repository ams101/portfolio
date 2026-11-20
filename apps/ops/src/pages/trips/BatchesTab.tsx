import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { captains, type Batch, type Trip } from '../../data/opsData';
import { useBatches, useVendors } from '../../data/store';
import { BatchChip, Card, ServiceChip, fmtRange } from '../../components/ui';
import { HandoverDrawer } from '../../components/HandoverDrawer';

export function BatchesTab() {
  const trip = useOutletContext<Trip>();
  const batches = useBatches().filter(b => b.tripId === trip.id).sort((a, b) => a.start.localeCompare(b.start));
  const vendors = useVendors();
  const [handover, setHandover] = useState<Batch | null>(null);

  return (
    <>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Batch</th>
              <th className="px-4 py-3 text-left">Variant</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Seats</th>
              <th className="px-4 py-3 text-left">Captain</th>
              <th className="px-4 py-3 text-left">Vendors</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {batches.map(b => {
              const cap = captains.find(c => c.id === b.captainId);
              const variant = trip.variants.find(v => v.id === b.variantId);
              return (
                <tr key={b.id} className="hover:bg-gray-700/40">
                  <td className="px-4 py-3">
                    <div className="text-white">{b.name}</div>
                    <div className="text-xs text-gray-400">{fmtRange(b.start, b.end)}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{variant?.name}</td>
                  <td className="px-4 py-3"><BatchChip status={b.status} /></td>
                  <td className="px-4 py-3 text-gray-300">
                    {b.seatsSold}/{b.seatsTotal}
                    <div className="h-1 bg-gray-700 rounded mt-1 w-16"><div className="h-1 bg-emerald-500 rounded" style={{ width: `${(b.seatsSold / b.seatsTotal) * 100}%` }} /></div>
                  </td>
                  <td className="px-4 py-3">{cap ? <span className="text-gray-200">{cap.name}</span> : <span className="text-amber-300 text-xs">Not assigned</span>}</td>
                  <td className="px-4 py-3">
                    {b.assignments.length === 0 ? (
                      <span className="text-gray-500 text-xs">None yet</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {b.assignments.map(a => (
                          <span key={a.service + a.vendorId} title={vendors.find(v => v.id === a.vendorId)?.legalName}>
                            <ServiceChip service={a.service} />
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                    <Link to={`/trips/${trip.id}/batches/${b.id}`} className="inline-block px-3 py-1.5 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-700">Open</Link>
                    <Link to={`/trips/${trip.id}/vendors?batch=${b.id}`} className="inline-block px-3 py-1.5 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-700">Vendors</Link>
                    <button onClick={() => setHandover(b)} disabled={b.guestIds.length === 0} className="px-3 py-1.5 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">Handover</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      {handover && <HandoverDrawer trip={trip} batch={handover} onClose={() => setHandover(null)} />}
    </>
  );
}
