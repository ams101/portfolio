import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Batch, Trip } from '../data/opsData';
import { guests } from '../data/opsData';

// From the trip-ops prototype: WhatsApp can't create groups through a link, so ops
// gets the group name, the numbers and the intro message ready to paste.
const groupName = (dest: string, startISO: string, group: string) => {
  const d = new Date(startISO + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).replace(' ', '-');
  return `GenRicTravel | ${dest} ${d} | ${group}`;
};

const introText = (dest: string, group: string) =>
  `Welcome to GenRicTravel ${dest}, ${group}! Please pin this chat. Your trip captain will post the plan here each evening.`;

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function HandoverDrawer({ trip, batch, onClose }: { trip: Trip; batch: Batch; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  const numbers = batch.guestIds.map(id => guests.find(g => g.id === id)?.phone).filter(Boolean).join(', ');
  const fields = [
    { key: 'name', label: 'Group name', value: groupName(trip.region, batch.start, batch.name) },
    { key: 'numbers', label: 'Numbers (comma separated)', value: numbers || 'No guests added yet' },
    { key: 'intro', label: 'Intro message', value: introText(trip.region, batch.name) },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center md:justify-center md:p-10" role="dialog" aria-modal="true" aria-label="Handover to WhatsApp">
      <div className="w-full md:max-w-xl bg-gray-900 border border-gray-700 rounded-t-2xl md:rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-300">Handover to WhatsApp · {batch.name}</span>
          <button className="px-3 py-1.5 rounded-lg text-gray-300 hover:bg-gray-800" onClick={onClose}>Close</button>
        </div>
        <div className="p-4 space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <div className="text-xs text-gray-400 mb-1">{f.label}</div>
              <div className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-100 break-words">{f.value}</div>
              <button
                className="mt-2 px-3 py-1.5 rounded-lg border border-gray-600 text-sm text-gray-200 hover:bg-gray-800"
                onClick={async () => setCopied((await copy(f.value)) ? f.key : null)}
              >
                {copied === f.key ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700">
            <Link to={`/public/welcome/${trip.id}/${batch.id}`} target="_blank" className="px-3 py-2 rounded-lg border border-gray-600 text-sm text-gray-200 hover:bg-gray-800">
              Open welcome pack ↗
            </Link>
          </div>
          <p className="text-xs text-gray-500">WhatsApp doesn’t allow groups to be created automatically; paste the name and numbers when creating the group.</p>
        </div>
      </div>
    </div>
  );
}
