import type { ReactNode } from 'react';
import type { BatchStatus } from '../data/opsData';

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>{children}</div>
);

export const PageHeader = ({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

const BATCH_COLORS: Record<BatchStatus, string> = {
  Draft: 'bg-gray-700 text-gray-300 border-gray-600',
  'On sale': 'bg-blue-900 text-blue-300 border-blue-700',
  Confirmed: 'bg-emerald-900 text-emerald-300 border-emerald-700',
  Live: 'bg-amber-900 text-amber-300 border-amber-700',
  Done: 'bg-gray-800 text-gray-400 border-gray-600',
};

export const BatchChip = ({ status }: { status: BatchStatus }) => (
  <span className={`inline-block px-2 py-0.5 text-xs rounded border ${BATCH_COLORS[status]}`}>{status}</span>
);

export const SERVICE_COLORS: Record<string, string> = {
  Stay: 'bg-emerald-900/60 text-emerald-300',
  Transfer: 'bg-blue-900/60 text-blue-300',
  Activity: 'bg-purple-900/60 text-purple-300',
  Rental: 'bg-amber-900/60 text-amber-300',
};

export const ServiceChip = ({ service }: { service: string }) => (
  <span className={`inline-block px-2 py-0.5 text-xs rounded ${SERVICE_COLORS[service] ?? 'bg-gray-700 text-gray-300'}`}>{service}</span>
);

export const fmtDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const fmtRange = (a: string, b: string) => {
  const s = new Date(a + 'T00:00:00');
  const e = new Date(b + 'T00:00:00');
  const d = (x: Date) => x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${d(s)} – ${d(e)} ${e.getFullYear()}`;
};

export const btn = {
  primary: 'inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors',
  secondary: 'inline-flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg text-sm transition-colors',
  ghost: 'inline-flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg text-sm transition-colors',
};
