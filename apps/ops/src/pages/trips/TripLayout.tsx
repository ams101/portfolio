import { NavLink, Outlet, useParams, Link } from 'react-router-dom';
import { trips } from '../../data/opsData';

const TABS = [
  { to: 'info', label: 'Trip info' },
  { to: 'itineraries', label: 'Itineraries' },
  { to: 'batches', label: 'Batches' },
  { to: 'vendors', label: 'Vendors per batch' },
];

export function TripLayout() {
  const { tripId } = useParams();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return <p className="text-gray-400">Trip not found.</p>;

  return (
    <div>
      <Link to="/trips" className="text-sm text-gray-400 hover:text-white">← All trips</Link>
      <div className="mt-2 mb-5">
        <h1 className="text-2xl font-semibold text-white">{trip.name}</h1>
        <p className="text-sm text-gray-400 mt-1">{trip.route.join(' → ')} · {trip.nights} nights · up to {trip.groupSize} travellers</p>
      </div>
      <div role="tablist" className="flex gap-1 border-b border-gray-700 mb-6 overflow-x-auto">
        {TABS.map(t => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px ${isActive ? 'border-emerald-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
      <Outlet context={trip} />
    </div>
  );
}
