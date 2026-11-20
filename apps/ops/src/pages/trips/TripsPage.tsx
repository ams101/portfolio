import { Link } from 'react-router-dom';
import { trips } from '../../data/opsData';
import { useBatches } from '../../data/store';
import { Card, PageHeader, fmtRange } from '../../components/ui';

export function TripsPage() {
  const batches = useBatches();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader title="Trips" subtitle="Each trip has variants (itineraries) and dated batches. Vendors are assigned per batch." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {trips.map(t => {
          const tb = batches.filter(b => b.tripId === t.id);
          const next = tb.filter(b => b.end >= today).sort((a, b) => a.start.localeCompare(b.start))[0];
          const sold = tb.reduce((n, b) => n + b.seatsSold, 0);
          const seats = tb.reduce((n, b) => n + b.seatsTotal, 0);
          const unstaffed = tb.filter(b => b.status !== 'Draft' && !b.captainId).length;
          return (
            <Link key={t.id} to={`/trips/${t.id}/batches`} className="block group">
              <Card className="p-5 h-full group-hover:border-gray-500 transition-colors">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{t.region}</p>
                <h2 className="text-lg font-semibold text-white mt-1">{t.name}</h2>
                <p className="text-sm text-gray-400 mt-1">{t.route.join(' → ')}</p>
                <dl className="grid grid-cols-3 gap-2 mt-4 text-sm">
                  <div><dt className="text-gray-500 text-xs">Variants</dt><dd className="text-gray-100">{t.variants.length}</dd></div>
                  <div><dt className="text-gray-500 text-xs">Batches</dt><dd className="text-gray-100">{tb.length}</dd></div>
                  <div><dt className="text-gray-500 text-xs">Seats sold</dt><dd className="text-gray-100">{sold}/{seats}</dd></div>
                </dl>
                <div className="mt-4 pt-3 border-t border-gray-700 text-sm flex justify-between gap-2">
                  <span className="text-gray-400">{next ? `Next: ${fmtRange(next.start, next.end)}` : 'No upcoming batch'}</span>
                  {unstaffed > 0 && <span className="text-amber-300 text-xs">{unstaffed} without a captain</span>}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
