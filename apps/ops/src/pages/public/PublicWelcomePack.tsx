import { useParams } from 'react-router-dom';
import { captains, trips } from '../../data/opsData';
import { useBatches } from '../../data/store';
import { fmtRange } from '../../components/ui';

const PACKING: Record<string, string[]> = {
  vietnam: ['Light, breathable clothes and a rain jacket', 'Comfortable walking shoes and sandals', 'Swimwear for the bay', 'Passport with your e-visa printout'],
  ladakh: ['Warm layers: it drops below zero at Pangong', 'Riding gloves and a buff (bike group)', 'Sunscreen and sunglasses: the sun is strong at altitude', 'Altitude medicine, after checking with your doctor'],
  spiti: ['Thermals and a down jacket', 'Sturdy shoes for village walks', 'Cash: ATMs are rare in Spiti', 'Personal medicines and a basic first-aid kit'],
};

export function PublicWelcomePack() {
  const { tripId, batchId } = useParams();
  const trip = trips.find(t => t.id === tripId);
  const batch = useBatches().find(b => b.id === batchId && b.tripId === tripId);
  if (!trip || !batch) return <div className="min-h-screen flex items-center justify-center bg-white text-gray-600">Invalid link.</div>;
  const cap = captains.find(c => c.id === batch.captainId);
  const variant = trip.variants.find(v => v.id === batch.variantId);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl p-6 space-y-6">
        <header className="border-b pb-4">
          <p className="text-sm text-gray-500">GenRicTravel · Welcome pack</p>
          <h1 className="text-2xl font-semibold mt-1">Welcome to {trip.name}</h1>
          <p className="text-gray-600">{batch.name} · {fmtRange(batch.start, batch.end)}</p>
        </header>
        {cap && <p className="text-gray-700">Your trip captain is <strong>{cap.name}</strong>. They’ll add you to the group chat and post each evening’s plan there.</p>}
        <section>
          <h2 className="font-semibold mb-2">Your itinerary</h2>
          <ol className="space-y-1 text-gray-700">
            {variant?.days.map(d => <li key={d.day}><span className="text-gray-500 mr-2">Day {d.day}</span>{d.title}</li>)}
          </ol>
        </section>
        <section className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="font-semibold mb-2">House rules</h2>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              <li>Respect local culture and quiet hours.</li>
              <li>No littering; carry your plastic back.</li>
              <li>Alcohol only where permitted; no drugs.</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Packing list</h2>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              {(PACKING[trip.id] ?? []).map(p => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </section>
        <p className="text-xs text-gray-400">Demo page with fictional data.</p>
      </div>
    </div>
  );
}
