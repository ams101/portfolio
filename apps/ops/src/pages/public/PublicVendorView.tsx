import { useParams } from 'react-router-dom';
import { captains, guests, trips } from '../../data/opsData';
import { useBatches, useVendors } from '../../data/store';
import { fmtRange } from '../../components/ui';

// What a supplier sees for a batch: enough to deliver the service, nothing more.
// No guest phone numbers; medical notes stay with the captain.
export function PublicVendorView() {
  const { tripId, batchId } = useParams();
  const trip = trips.find(t => t.id === tripId);
  const batch = useBatches().find(b => b.id === batchId && b.tripId === tripId);
  const vendors = useVendors();
  if (!trip || !batch) return <div className="min-h-screen flex items-center justify-center bg-white text-gray-600">Invalid link.</div>;

  const list = batch.guestIds.map(id => guests.find(g => g.id === id)!).filter(Boolean);
  const cap = captains.find(c => c.id === batch.captainId);
  const arrivals = Object.entries(
    list.reduce<Record<string, number>>((m, g) => ({ ...m, [g.arrival ?? 'TBC']: (m[g.arrival ?? 'TBC'] ?? 0) + 1 }), {})
  ).sort();
  const diets = list.filter(g => g.diet).map(g => g.diet!);
  const medicalCount = list.filter(g => g.medical).length;
  const rooms = Object.entries(list.reduce<Record<string, string[]>>((m, g) => (g.room ? { ...m, [g.room]: [...(m[g.room] ?? []), g.name] } : m), {}));

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl p-6 space-y-6">
        <header className="border-b pb-4">
          <p className="text-sm text-gray-500">GenRicTravel · Vendor brief</p>
          <h1 className="text-2xl font-semibold mt-1">{trip.name} · {batch.name}</h1>
          <p className="text-gray-600">{fmtRange(batch.start, batch.end)} · {list.length || batch.seatsSold} travellers</p>
        </header>

        <section>
          <h2 className="font-semibold mb-2">Your services on this batch</h2>
          <ul className="space-y-1 text-gray-700">
            {batch.assignments.map(a => (
              <li key={a.service + a.vendorId}>
                <span className="font-medium">{a.service}</span> · {vendors.find(v => v.id === a.vendorId)?.legalName}
                {a.note && <span className="text-gray-500"> · {a.note}</span>}
              </li>
            ))}
            {batch.assignments.length === 0 && <li className="text-gray-500">To be confirmed.</li>}
          </ul>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="font-semibold mb-2">Arrivals on day 1</h2>
            <ul className="text-gray-700 space-y-1">
              {arrivals.map(([t, n]) => <li key={t}>{t}: {n} {n === 1 ? 'traveller' : 'travellers'}</li>)}
              {arrivals.length === 0 && <li className="text-gray-500">To be confirmed.</li>}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Meals</h2>
            <ul className="text-gray-700 space-y-1">
              {diets.map((d, i) => <li key={i}>{d}</li>)}
              {diets.length === 0 && <li className="text-gray-500">No special requirements.</li>}
            </ul>
            {medicalCount > 0 && <p className="text-sm text-gray-500 mt-2">{medicalCount} traveller(s) have medical notes; the trip captain has the details.</p>}
          </div>
        </section>

        {rooms.length > 0 && (
          <section>
            <h2 className="font-semibold mb-2">Rooming list</h2>
            <ul className="text-gray-700 space-y-1">
              {rooms.map(([room, names]) => <li key={room}><span className="font-medium">{room}</span>: {names.join(', ')}</li>)}
            </ul>
          </section>
        )}

        <section className="border-t pt-4 text-gray-700">
          <h2 className="font-semibold mb-1">Your contact on the ground</h2>
          <p>{cap ? `${cap.name}, trip captain · ${cap.phone}` : 'Captain to be confirmed.'}</p>
        </section>
        <p className="text-xs text-gray-400">Demo page with fictional data.</p>
      </div>
    </div>
  );
}
