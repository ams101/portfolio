import { useOutletContext } from 'react-router-dom';
import type { Trip } from '../../data/opsData';
import { useBatches } from '../../data/store';
import { Card } from '../../components/ui';

export function TripInfoTab() {
  const trip = useOutletContext<Trip>();
  const batches = useBatches().filter(b => b.tripId === trip.id);
  const sold = batches.reduce((n, b) => n + b.seatsSold, 0);
  const seats = batches.reduce((n, b) => n + b.seatsTotal, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="p-5 lg:col-span-2 space-y-5">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Overview</h2>
          <p className="text-gray-200">{trip.summary}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Included</h3>
            <ul className="space-y-1.5 text-sm text-gray-200 list-disc pl-5 marker:text-emerald-500">
              {trip.inclusions.map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Not included</h3>
            <ul className="space-y-1.5 text-sm text-gray-300 list-disc pl-5 marker:text-gray-500">
              {trip.exclusions.map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>
        </div>
      </Card>
      <Card className="p-5 space-y-3 text-sm">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">At a glance</h2>
        {[
          ['Region', trip.region],
          ['Duration', `${trip.nights} nights / ${trip.nights + 1} days`],
          ['Group size', `Up to ${trip.groupSize}`],
          ['Variants', trip.variants.map(v => v.name).join(', ')],
          ['Batches', String(batches.length)],
          ['Seats sold', `${sold} of ${seats}`],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-gray-700 pb-2 last:border-0">
            <span className="text-gray-400">{k}</span>
            <span className="text-gray-100 text-right">{v}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
