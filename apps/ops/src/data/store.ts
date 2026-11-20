// A tiny store for what visitors change in the demo: vendors added through
// onboarding and vendor assignments on batches. It lives in this browser only.
import { useSyncExternalStore } from 'react';
import type { Vendor } from '../types';
import { vendors as seedVendors } from './seedData';
import { batches as seedBatches, type Assignment, type Batch } from './opsData';

const KEY = 'genric.ops.v1';

interface State {
  addedVendors: Vendor[];
  assignments: Record<string, Assignment[]>; // batchId -> assignments
}

function load(): State {
  const fallback: State = {
    addedVendors: [],
    assignments: Object.fromEntries(seedBatches.map(b => [b.id, b.assignments])),
  };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as State;
    return { ...fallback, ...parsed, assignments: { ...fallback.assignments, ...parsed.assignments } };
  } catch {
    return fallback;
  }
}

let state = load();
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode); the demo still works for this visit.
  }
  listeners.forEach(l => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const useStore = () => useSyncExternalStore(subscribe, () => state);

export function useVendors(): Vendor[] {
  const s = useStore();
  return [...s.addedVendors, ...seedVendors];
}

export function useBatches(): Batch[] {
  const s = useStore();
  return seedBatches.map(b => ({ ...b, assignments: s.assignments[b.id] ?? [] }));
}

export function addVendor(v: Omit<Vendor, 'id' | 'updatedAt'>): Vendor {
  const vendor: Vendor = { ...v, id: 'nv_' + Math.random().toString(36).slice(2, 8), updatedAt: new Date().toISOString() };
  set({ ...state, addedVendors: [vendor, ...state.addedVendors] });
  return vendor;
}

export function assignVendor(batchId: string, a: Assignment) {
  const current = state.assignments[batchId] ?? [];
  const next = [...current.filter(x => !(x.service === a.service && x.vendorId === a.vendorId)), a];
  set({ ...state, assignments: { ...state.assignments, [batchId]: next } });
}

export function unassignVendor(batchId: string, service: Assignment['service'], vendorId: string) {
  const current = state.assignments[batchId] ?? [];
  set({ ...state, assignments: { ...state.assignments, [batchId]: current.filter(x => !(x.service === service && x.vendorId === vendorId)) } });
}

export function resetDemo() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  set(load());
}

/** Duplicate check from the trip-ops prototype: same name in an overlapping area, or the same phone. */
export function findDuplicates(all: Vendor[], name: string, areasCsv: string, phone: string): Vendor[] {
  const norm = (s?: string) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const n = norm(name);
  const areas = areasCsv.split(',').map(norm).filter(Boolean);
  const p = phone.replace(/[\s-]/g, '');
  return all.filter(v => {
    const nameMatch = n.length > 2 && norm(v.legalName).includes(n);
    const areaOverlap = areas.length ? v.servicedAreas.map(norm).some(a => areas.includes(a)) : false;
    const phoneMatch = p.length > 6 && v.contacts.primary.phone.replace(/[\s-]/g, '') === p;
    return (nameMatch && areaOverlap) || phoneMatch;
  });
}
