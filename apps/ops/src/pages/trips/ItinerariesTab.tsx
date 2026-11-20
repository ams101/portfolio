import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Trip } from '../../data/opsData';
import { useBatches } from '../../data/store';
import { Card, fmtRange } from '../../components/ui';

export function ItinerariesTab() {
  const trip = useOutletContext<Trip>();
  const batches = useBatches();
  const [active, setActive] = useState(trip.variants[0].id);
  const variant = trip.variants.find(v => v.id === active)!;
  const other = trip.variants.find(v => v.id !== active);
  const runs = batches.filter(b => b.tripId === trip.id && b.variantId === variant.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Variants">
        {trip.variants.map(v => (
          <button
            key={v.id}
            onClick={() => setActive(v.id)}
            aria-pressed={v.id === active}
            className={`px-3 py-1.5 rounded-lg text-sm border ${v.id === active ? 'bg-gray-700 border-gray-500 text-white' : 'border-gray-700 text-gray-300 hover:border-gray-500'}`}
          >
            {v.name}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <ol className="divide-y divide-gray-700">
            {variant.days.map(d => {
              const differs = other && other.days.find(o => o.day === d.day)?.title !== d.title;
              return (
                <li key={d.day} className="flex gap-4 px-5 py-3">
                  <span className="text-xs text-gray-500 w-12 pt-0.5">Day {d.day}</span>
                  <span className="text-gray-100 flex-1">{d.title}</span>
                  {differs && <span className="text-xs text-amber-300 whitespace-nowrap">differs from {other!.name}</span>}
                </li>
              );
            })}
          </ol>
        </Card>
        <Card className="p-5 text-sm">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Batches on this itinerary</h2>
          {runs.length === 0 ? (
            <p className="text-gray-400">None scheduled.</p>
          ) : (
            <ul className="space-y-2">
              {runs.map(b => (
                <li key={b.id} className="flex justify-between gap-2">
                  <span className="text-gray-100">{b.name}</span>
                  <span className="text-gray-400">{fmtRange(b.start, b.end)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
