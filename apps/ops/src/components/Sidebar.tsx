import { NavLink } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  UsersIcon,
  PhotoIcon,
  DocumentCheckIcon,
  MapIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

const SECTIONS = [
  {
    title: 'Supply',
    items: [
      { name: 'Vendors', href: '/supply/vendors', icon: UsersIcon },
      { name: 'Properties', href: '/supply/properties', icon: BuildingOfficeIcon },
      { name: 'Media', href: '/supply/media', icon: PhotoIcon },
      { name: 'Licences & compliance', href: '/supply/licenses', icon: DocumentCheckIcon },
      { name: 'Onboard a vendor', href: '/supply/onboarding', icon: UserPlusIcon },
    ],
  },
  {
    title: 'Trip operations',
    items: [{ name: 'Trips', href: '/trips', icon: MapIcon }],
  },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main" className="py-4 px-2 space-y-6">
      {SECTIONS.map(section => (
        <div key={section.title}>
          <p className="px-2 pb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">{section.title}</p>
          <div className="space-y-1">
            {section.items.map(item => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
