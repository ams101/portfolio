import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, Bars3Icon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { PropertyStepper } from './PropertyStepper';
import { resetDemo } from '../data/store';

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const [showPropertyStepper, setShowPropertyStepper] = useState(false);

  return (
    <>
      <div className="bg-gray-800 border-b border-gray-700 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onMenu} className="md:hidden p-2 -ml-2 text-gray-300" aria-label="Open menu">
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-white whitespace-nowrap">GenRicTravel Ops</h1>
            <span className="hidden sm:inline text-sm text-gray-400 truncate">Supply and trip operations · demo data</span>
          </div>

          <div className="flex items-center gap-2">
            <a href="/" className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-300 hover:text-white">
              <ArrowUturnLeftIcon className="h-4 w-4" /> Portfolio
            </a>
            <button onClick={resetDemo} className="hidden lg:inline-flex px-3 py-2 text-sm text-gray-400 hover:text-white" title="Clear changes made in this browser">
              Reset demo
            </button>
            <Link
              to="/supply/onboarding"
              className="hidden sm:inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add vendor</span>
            </Link>
            <button
              onClick={() => setShowPropertyStepper(true)}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add property</span>
            </button>
          </div>
        </div>
      </div>

      {showPropertyStepper && <PropertyStepper onClose={() => setShowPropertyStepper(false)} />}
    </>
  );
}
