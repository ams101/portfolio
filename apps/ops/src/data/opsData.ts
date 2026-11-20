// Trip-operations data for GenRicTravel Ops. All names, numbers and contacts are
// fictional. Experience Vietnam comes from the portfolio's shared dataset, so the
// same trip, variants and batches appear in the comparator and the ID check.
import type { ServiceType, Vendor } from '../types';
import { VIETNAM } from '../../../../src/data/genricTravel';

// ---------------------------------------------------------------------------
// Service vendors (transfers, activities, rentals, plus stays used by trips)
// ---------------------------------------------------------------------------

const contact = (name: string, n: number, domain: string) => ({
  name,
  phone: `+91-98000000${String(n).padStart(2, '0')}`,
  whatsapp: `+91-98000000${String(n).padStart(2, '0')}`,
  email: `${name.split(' ')[0].toLowerCase()}@${domain}`,
});

const sv = (
  id: string,
  legalName: string,
  serviceTypes: ServiceType[],
  servicedAreas: string[],
  person: string,
  n: number,
  domain: string,
  extra: Partial<Vendor> = {}
): Vendor => ({
  id,
  legalName,
  serviceTypes,
  type: 'partner',
  servicedAreas,
  languages: ['English', 'Hindi'],
  contacts: { primary: contact(person, n, domain) },
  payout: { method: 'Bank', beneficiary: legalName, taxId: `TAX-${id.toUpperCase()}` },
  status: 'Active',
  licenses: [],
  updatedAt: '2026-10-20T10:00:00Z',
  ...extra,
});

export const serviceVendors: Vendor[] = [
  // Vietnam
  sv('sv1', 'Red River Stays', ['Stay'], ['Hanoi'], 'Linh Tran', 1, 'redriverstays.example', {
    languages: ['English', 'Vietnamese'],
    payout: { method: 'SWIFT', beneficiary: 'Red River Stays Co.', taxId: 'VN-0108123456' },
    rating: 4.5,
  }),
  sv('sv2', 'Lotus Coach Lines', ['Transfer'], ['Hanoi', 'Hoi An', 'Da Nang'], 'Minh Pham', 2, 'lotuscoach.example', {
    languages: ['English', 'Vietnamese'],
    payout: { method: 'SWIFT', beneficiary: 'Lotus Coach Lines JSC', taxId: 'VN-0109876543' },
    rating: 4.3,
    preferred: true,
  }),
  sv('sv3', 'Jade Bay Cruises', ['Activity'], ['Ha Long Bay'], 'Hoa Nguyen', 3, 'jadebay.example', {
    languages: ['English', 'Vietnamese'],
    payout: { method: 'SWIFT', beneficiary: 'Jade Bay Cruises Ltd', taxId: 'VN-0201234567' },
    rating: 4.7,
  }),
  sv('sv4', 'Lantern Town Cycles', ['Rental', 'Activity'], ['Hoi An', 'Tam Coc'], 'Bao Le', 4, 'lanterncycles.example', {
    languages: ['English', 'Vietnamese'],
    payout: { method: 'SWIFT', beneficiary: 'Lantern Town Cycles', taxId: 'VN-0401122334' },
    rating: 4.1,
  }),
  // Ladakh
  sv('sv5', 'Indus Riders', ['Rental'], ['Leh', 'Nubra', 'Pangong'], 'Stanzin Dorje', 5, 'indusriders.example', {
    rating: 4.6,
    preferred: true,
    notes: 'Royal Enfield Himalayan fleet, mechanic rides with every group.',
  }),
  sv('sv6', 'High Pass Cabs', ['Transfer'], ['Leh', 'Nubra', 'Pangong'], 'Tsering Angmo', 6, 'highpasscabs.example', {
    rating: 4.2,
    licenses: [
      { id: 'lic-sv6', type: 'Tourist Vehicle Permit', number: 'LA-TP-2291', issuer: 'Transport Dept', issueDate: '2025-04-01', expiryDate: '2026-03-31', files: [], status: 'Expired' },
    ],
  }),
  sv('sv7', 'Leh Courtyard Guesthouse', ['Stay'], ['Leh'], 'Padma Lhamo', 7, 'lehcourtyard.example', { rating: 4.4 }),
  // Spiti (from the trip-ops prototype)
  sv('sv8', 'Himalayan Stays', ['Stay'], ['Manali', 'Kaza'], 'Tashi Negi', 8, 'himalayanstays.example', { rating: 4.6 }),
  sv('sv9', 'Kaza Jeep Co.', ['Transfer'], ['Kaza', 'Tabo', 'Manali'], 'Dorje Bodh', 9, 'kazajeep.example', {
    rating: 4.2,
    licenses: [
      { id: 'lic-sv9', type: 'Transport Permit', number: 'HP-TP-7781', issuer: 'Transport Dept', issueDate: '2025-06-01', expiryDate: '2027-05-31', files: [], status: 'Approved' },
    ],
  }),
  sv('sv10', 'Spiti Guides Collective', ['Activity'], ['Kaza', 'Key', 'Langza'], 'Nawang Chhering', 10, 'spitiguides.example', {
    rating: 4.8,
    preferred: true,
  }),
];

// ---------------------------------------------------------------------------
// Trips, variants (itineraries) and batches
// ---------------------------------------------------------------------------

export type BatchStatus = 'Draft' | 'On sale' | 'Confirmed' | 'Live' | 'Done';

export interface TripVariant {
  id: string;
  name: string;
  days: { day: number; title: string }[];
}

export interface Trip {
  id: string;
  name: string;
  region: string;
  nights: number;
  groupSize: number;
  route: string[];
  summary: string;
  inclusions: string[];
  exclusions: string[];
  variants: TripVariant[];
}

export interface Assignment {
  service: ServiceType;
  vendorId: string;
  note?: string;
}

export interface Batch {
  id: string;
  tripId: string;
  variantId: string;
  name: string;
  start: string;
  end: string;
  seatsSold: number;
  seatsTotal: number;
  status: BatchStatus;
  captainId?: string;
  backupCaptainId?: string;
  transferPlan?: string;
  guestIds: string[];
  assignments: Assignment[];
}

export interface Captain {
  id: string;
  name: string;
  phone: string;
}

export interface Guest {
  id: string;
  name: string;
  phone: string; // masked: ops sees the full number in the real tool
  gender: 'F' | 'M' | 'O';
  arrival?: string;
  room?: string;
  diet?: string;
  medical?: string;
}

export const trips: Trip[] = [
  {
    id: VIETNAM.id,
    name: VIETNAM.name,
    region: VIETNAM.region,
    nights: VIETNAM.nights,
    groupSize: VIETNAM.groupSize,
    route: VIETNAM.route,
    summary: VIETNAM.variants[0].parsed.whatYouDo,
    inclusions: VIETNAM.variants[0].parsed.inclusions,
    exclusions: VIETNAM.variants[0].parsed.exclusions,
    variants: VIETNAM.variants.map(v => ({ id: v.id, name: v.name, days: v.parsed.dayPlan })),
  },
  {
    id: 'ladakh',
    name: 'Experience Ladakh',
    region: 'Ladakh',
    nights: 7,
    groupSize: 14,
    route: ['Leh', 'Nubra Valley', 'Pangong Lake', 'Leh'],
    summary: 'Eight days over the high passes, by Royal Enfield or by car, with two days in Leh to acclimatise first.',
    inclusions: ['7 nights in guesthouses and camps', 'Breakfast and dinner daily', 'Bike or car as per variant', 'Inner-line permits', 'Trip captain and mechanic (bike variant)'],
    exclusions: ['Flights to and from Leh', 'Fuel beyond the planned route', 'Lunches', 'Personal expenses'],
    variants: [
      {
        id: 'bike',
        name: 'Bike trip',
        days: [
          { day: 1, title: 'Arrive in Leh, rest day' },
          { day: 2, title: 'Leh local ride, bike check' },
          { day: 3, title: 'Leh to Nubra over Khardung La' },
          { day: 4, title: 'Nubra: Hunder dunes and Turtuk' },
          { day: 5, title: 'Nubra to Pangong via Shyok' },
          { day: 6, title: 'Pangong to Leh over Chang La' },
          { day: 7, title: 'Buffer day in Leh' },
          { day: 8, title: 'Departure' },
        ],
      },
      {
        id: 'car',
        name: 'Car trip',
        days: [
          { day: 1, title: 'Arrive in Leh, rest day' },
          { day: 2, title: 'Leh monasteries and market' },
          { day: 3, title: 'Leh to Nubra over Khardung La' },
          { day: 4, title: 'Nubra: Hunder dunes' },
          { day: 5, title: 'Nubra to Pangong' },
          { day: 6, title: 'Pangong to Leh' },
          { day: 7, title: 'Sham valley day trip' },
          { day: 8, title: 'Departure' },
        ],
      },
    ],
  },
  {
    id: 'spiti',
    name: 'Experience Spiti',
    region: 'Spiti Valley',
    nights: 6,
    groupSize: 12,
    route: ['Manali', 'Chandratal', 'Kaza', 'Key', 'Manali'],
    summary: 'A week in the cold desert: villages above 4,000 m, monasteries and a night by Chandratal lake.',
    inclusions: ['6 nights in homestays and a camp', 'All meals in Spiti', 'Jeep transfers from Manali', 'Local guide in Kaza'],
    exclusions: ['Travel to and from Manali', 'Personal expenses'],
    variants: [
      {
        id: 'summer',
        name: 'Summer',
        days: [
          { day: 1, title: 'Manali to Chandratal' },
          { day: 2, title: 'Chandratal to Kaza' },
          { day: 3, title: 'Key monastery and Kibber' },
          { day: 4, title: 'Langza, Hikkim, Komic' },
          { day: 5, title: 'Dhankar and Tabo' },
          { day: 6, title: 'Kaza rest day' },
          { day: 7, title: 'Kaza to Manali' },
        ],
      },
      {
        id: 'winter',
        name: 'Winter',
        days: [
          { day: 1, title: 'Shimla to Narkanda' },
          { day: 2, title: 'Narkanda to Kalpa' },
          { day: 3, title: 'Kalpa to Tabo' },
          { day: 4, title: 'Tabo to Kaza' },
          { day: 5, title: 'Snow walk to Langza' },
          { day: 6, title: 'Kaza to Kalpa' },
          { day: 7, title: 'Kalpa to Shimla' },
        ],
      },
    ],
  },
];

export const captains: Captain[] = [
  { id: 'c1', name: 'Aman Rawat', phone: '+91 98xxxxxx01' },
  { id: 'c2', name: 'Riya Sen', phone: '+91 98xxxxxx02' },
  { id: 'c3', name: 'Karan Bhatia', phone: '+91 98xxxxxx03' },
  { id: 'c4', name: 'Thu Ha', phone: '+84 9xxxxxx04' },
];

export const guests: Guest[] = [
  { id: 'g1', name: 'Mohd Arif Khan', phone: '+91 9xxxxxxx11', gender: 'M', arrival: '10:30', room: 'Twin 101', diet: 'Halal' },
  { id: 'g2', name: 'Rahul Verma', phone: '+91 9xxxxxxx12', gender: 'M', arrival: '10:30', room: 'Twin 101', medical: 'Asthma: carries an inhaler' },
  { id: 'g3', name: 'Ana Ferreira', phone: '+351 9xxxxxx13', gender: 'F', arrival: '13:15', room: 'Twin 102', diet: 'Vegetarian' },
  { id: 'g4', name: 'Neha Iyer', phone: '+91 9xxxxxxx14', gender: 'F', arrival: '13:15', room: 'Twin 102' },
  { id: 'g5', name: 'Kabir Malhotra', phone: '+91 9xxxxxxx15', gender: 'M', arrival: '16:40', room: 'Twin 103', diet: 'No seafood' },
  { id: 'g6', name: 'Sara Thomas', phone: '+91 9xxxxxxx16', gender: 'F', arrival: '16:40', room: 'Twin 104', medical: 'Peanut allergy' },
  { id: 'g7', name: 'Dev Patel', phone: '+91 9xxxxxxx17', gender: 'M', arrival: '09:10', room: 'Twin 103' },
  { id: 'g8', name: 'Meera Joshi', phone: '+91 9xxxxxxx18', gender: 'F', arrival: '09:10', room: 'Twin 104', diet: 'Vegan' },
];

const vietnamBatches: Batch[] = VIETNAM.variants.flatMap(v =>
  v.batches.map((b, i) => {
    const sold = b.seatsTotal - b.seatsLeft;
    const first = v.id === 'regular' && i === 1; // the batch used in the ID check demo
    return {
      id: b.id,
      tripId: VIETNAM.id,
      variantId: v.id,
      name: v.id === 'festive' ? 'Festive group' : `Group ${String.fromCharCode(65 + i)}`,
      start: b.start,
      end: b.end,
      seatsSold: sold,
      seatsTotal: b.seatsTotal,
      status: (sold >= b.seatsTotal - 3 ? 'Confirmed' : 'On sale') as BatchStatus,
      captainId: first || v.id === 'festive' ? 'c4' : undefined,
      backupCaptainId: first ? 'c2' : undefined,
      transferPlan: first ? 'Coach from Hanoi old quarter 07:30 on day 2; overnight sleeper bus Hanoi → Hoi An on day 4.' : undefined,
      // The same three travellers as booking GRT-7Q4K2M in the portfolio's ID check demo.
      guestIds: first ? ['g1', 'g2', 'g3'] : [],
      assignments: first
        ? [
            { service: 'Stay', vendorId: 'sv1', note: 'Hanoi, nights 1–3: 2 twin rooms' },
            { service: 'Transfer', vendorId: 'sv2', note: 'Coach throughout; sleeper bus day 4' },
            { service: 'Activity', vendorId: 'sv3', note: 'Day cruise + kayaks, day 3' },
          ]
        : [],
    };
  })
);

export const batches: Batch[] = [
  ...vietnamBatches,
  {
    id: 'la-0608', tripId: 'ladakh', variantId: 'bike', name: 'Riders A', start: '2027-06-08', end: '2027-06-15',
    seatsSold: 11, seatsTotal: 14, status: 'Confirmed', captainId: 'c1', backupCaptainId: 'c3',
    transferPlan: 'Bikes handed over at the Leh guesthouse on day 2 after a test ride.',
    guestIds: ['g5', 'g7', 'g8'],
    assignments: [
      { service: 'Stay', vendorId: 'sv7', note: 'Leh, nights 1, 2, 6, 7' },
      { service: 'Rental', vendorId: 'sv5', note: '11 Himalayans + 1 spare, mechanic included' },
    ],
  },
  { id: 'la-0622', tripId: 'ladakh', variantId: 'car', name: 'Car group B', start: '2027-06-22', end: '2027-06-29', seatsSold: 4, seatsTotal: 14, status: 'On sale', guestIds: [], assignments: [] },
  {
    id: 'sp-0601', tripId: 'spiti', variantId: 'summer', name: 'Group C', start: '2027-06-01', end: '2027-06-07',
    seatsSold: 12, seatsTotal: 12, status: 'Confirmed', captainId: 'c3',
    transferPlan: '2 jeeps from Manali, 06:00 pickup on day 1.',
    guestIds: ['g3', 'g4'],
    assignments: [
      { service: 'Stay', vendorId: 'sv8', note: '6 standard + 2 deluxe rooms' },
      { service: 'Transfer', vendorId: 'sv9', note: '2 jeeps, AM window' },
      { service: 'Activity', vendorId: 'sv10', note: 'Guide for Key, Kibber, Langza' },
    ],
  },
  { id: 'sp-1210', tripId: 'spiti', variantId: 'winter', name: 'Winter group', start: '2026-12-10', end: '2026-12-16', seatsSold: 0, seatsTotal: 12, status: 'Draft', guestIds: [], assignments: [] },
];

export const SERVICE_TYPES: ServiceType[] = ['Stay', 'Transfer', 'Activity', 'Rental'];
