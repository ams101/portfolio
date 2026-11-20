// GenRicTravel: the fictional travel company used across the portfolio demos.
// Every name, price and date here is invented for illustration.
// The comparator, the ID check and the Ops app all read from this file so the
// demos describe one consistent company.

export const BRAND = {
  name: 'GenRicTravel',
  tagline: 'Small-group trips, done properly',
};

export const FX_INR_PER_USD = 94;

// ---------------------------------------------------------------------------
// Trips and batches
// ---------------------------------------------------------------------------

export interface DayPlan {
  day: number;
  title: string;
}

export interface Batch {
  id: string;
  start: string; // ISO date
  end: string;
  priceInr: number;
  wasPriceInr?: number;
  seatsLeft: number;
  seatsTotal: number;
}

export interface TripVariant {
  id: string;
  name: string;
  /** Structured output, in the shape the comparator's prompt asks the model for. */
  parsed: {
    tierName: string;
    tripHighlights: string[];
    whatYouDo: string;
    dayPlan: DayPlan[];
    inclusions: string[];
    exclusions: string[];
    pickup: string;
    drop: string;
    price: string;
    duration: string;
    nextGroupDates: string[];
  };
  batches: Batch[];
}

export interface Trip {
  id: string;
  name: string;
  region: string;
  nights: number;
  route: string[];
  groupSize: number;
  variants: TripVariant[];
}

const VIETNAM_DAYS: DayPlan[] = [
  { day: 1, title: 'Arrive in Hanoi, street-food walk' },
  { day: 2, title: 'Hanoi to Tam Coc, cycling through rice fields' },
  { day: 3, title: 'Ha Long Bay day cruise and kayaking, back to Hanoi' },
  { day: 4, title: 'Hanoi to Hoi An' },
  { day: 5, title: 'Coconut village and basket-boat ride' },
  { day: 6, title: 'Hoi An to Da Nang, Marble Mountains' },
  { day: 7, title: 'Ba Na Hills cable car and Dragon Bridge' },
  { day: 8, title: 'Departure from Da Nang' },
];

const VIETNAM_HIGHLIGHTS = [
  'Street food and old-quarter walks in Hanoi',
  'Day cruise with kayaking in Ha Long Bay',
  'Cycling through the karst valleys of Tam Coc',
  'Lantern-lit evenings and free time in Hoi An',
];

const VIETNAM_INCLUSIONS = [
  '7 nights in partner hostels, hotels and a bungalow',
  '10 meals: 7 breakfasts and 3 lunches; evenings left free',
  'Private bus between cities, plus the Ha Long Bay cruise',
  'Ba Na Hills, coconut village, Tam Coc cycling, Marble Mountains',
  'Local trip leader for the whole trip',
];

const VIETNAM_EXCLUSIONS = [
  'Travel to Hanoi and from Da Nang',
  'Airport transfers on arrival and departure',
  'Vietnam visa',
  'Meals and drinks not listed, including dinners',
  'Personal expenses',
];

export const VIETNAM: Trip = {
  id: 'vietnam',
  name: 'Experience Vietnam',
  region: 'Vietnam',
  nights: 7,
  route: ['Hanoi', 'Tam Coc', 'Ha Long Bay', 'Hoi An', 'Da Nang'],
  groupSize: 15,
  variants: [
    {
      id: 'regular',
      name: 'Regular batches',
      parsed: {
        tierName: 'Regular batches',
        tripHighlights: VIETNAM_HIGHLIGHTS,
        whatYouDo:
          'Eight days from Hanoi to Da Nang with a group of up to 15: city food walks, a Ha Long Bay cruise, cycling in Tam Coc and slow days in Hoi An.',
        dayPlan: VIETNAM_DAYS,
        inclusions: VIETNAM_INCLUSIONS,
        exclusions: VIETNAM_EXCLUSIONS,
        pickup: 'Hanoi',
        drop: 'Da Nang',
        price: '₹44,817 per person',
        duration: '7N/8D',
        nextGroupDates: ['12–19 Dec 2026', '23–30 Jan 2027', '28 Feb – 7 Mar 2027', '21–28 Mar 2027'],
      },
      batches: [
        { id: 'vn-1212', start: '2026-12-12', end: '2026-12-19', priceInr: 44817, seatsLeft: 2, seatsTotal: 15 },
        { id: 'vn-0123', start: '2027-01-23', end: '2027-01-30', priceInr: 44817, seatsLeft: 12, seatsTotal: 15 },
        { id: 'vn-0228', start: '2027-02-28', end: '2027-03-07', priceInr: 44817, seatsLeft: 11, seatsTotal: 15 },
        { id: 'vn-0321', start: '2027-03-21', end: '2027-03-28', priceInr: 44817, seatsLeft: 11, seatsTotal: 15 },
      ],
    },
    {
      id: 'festive',
      name: 'Xmas & NYE special',
      parsed: {
        tierName: 'Xmas & NYE special',
        tripHighlights: VIETNAM_HIGHLIGHTS,
        whatYouDo:
          'The same eight-day Hanoi to Da Nang route, timed so the group spends Christmas in Hanoi and New Year’s Eve in Da Nang.',
        dayPlan: VIETNAM_DAYS,
        inclusions: VIETNAM_INCLUSIONS,
        exclusions: VIETNAM_EXCLUSIONS,
        pickup: 'Hanoi',
        drop: 'Da Nang',
        price: '₹50,781 per person (was ₹53,781)',
        duration: '7N/8D',
        nextGroupDates: ['25 Dec 2026 – 1 Jan 2027'],
      },
      batches: [
        { id: 'vn-1225', start: '2026-12-25', end: '2027-01-01', priceInr: 50781, wasPriceInr: 53781, seatsLeft: 3, seatsTotal: 15 },
      ],
    },
  ],
};

// Lighter trips, used by the Ops app.
export const OTHER_TRIPS = [
  { id: 'ladakh', name: 'Experience Ladakh', region: 'Ladakh', nights: 7, variants: ['Bike trip', 'Car trip'] },
  { id: 'spiti', name: 'Experience Spiti', region: 'Spiti Valley', nights: 6, variants: ['Summer', 'Winter'] },
];

// ---------------------------------------------------------------------------
// Comparator: what a pasted page looks like before the model cleans it up
// ---------------------------------------------------------------------------

export const RAW_PAGE_EXCERPTS: Record<string, string> = {
  regular: `GenRicTravel  Stays  Trips  Destinations  Login
Search your next trip|
Experience Vietnam
See all photos
Summary  Pickup Hanoi  Dropoff Da Nang  Duration 7N/8D
Trip Highlights
😋 Explore Hanoi's streets and street food
🚋 Discover Hanoi's landmarks
...
What's included
🏠 Accommodation for 7 nights with partnered hostels, hotels and bungalow.
🚌 Transportation is by private bus ... and by cruise.
😋 A total of 10 meals- 7 breakfasts and 3 lunches.
...
From ₹44,817 /person
12 - 19 Dec '26 ₹44,817/person • 2 seats left
23 - 30 Jan '27 ₹44,817/person • 12 seats left
...
There's Wanderlust in Our Newsletters!  Email *  Subscribe
Download the app  Get event updates  Earn rewards
© 2026 All Rights Reserved  Privacy  Cookies  Terms`,
  festive: `GenRicTravel  Stays  Trips  Destinations  Login
Experience Vietnam (Xmas & NYE Special)
Summary  Pickup Hanoi  Dropoff Da Nang  Duration 7N/8D
...
What's included
😋 A total of 10 meals- 7 breakfasts and 3 lunches.
✈️ You can opt for domestic flights at extra cost.
🚠 Ba Na Hills and Dragon Bridge tour, Coconut Village ...
🚌 Transportation is by private bus ...
🏠 Accommodation for 7 nights ...
...
From ₹50,781 /person
Phase 1  25 Dec '26 - 1 Jan '27  ₹50,781/₹53,781/person • 3 seats left
FAQs  Is December a good time to visit Vietnam?
...`,
};

// The prompt from the original prototype (lightly trimmed for display).
export const COMPARATOR_PROMPT = `You are a travel content parser. Convert this raw trip content into structured JSON.

✦ Use the schema below.
✦ Each bullet point (highlights, inclusions, exclusions) must be under 100 characters.
✦ Use clean, crisp language. Avoid fluff or repetition.
✦ Return only valid JSON — no markdown, no comments.

Schema:
{
  "tierName": "\${name}",
  "tripHighlights": [ "string (≤100 chars)", ... ],
  "whatYouDo": "1-paragraph summary",
  "dayPlan": [ { "day": number, "date": "string", "title": "string", "description": "string" } ],
  "inclusions": [ "string (≤100 chars)", ... ],
  "exclusions": [ "string (≤100 chars)", ... ],
  "pickup": "string",
  "drop": "string",
  "price": "string",
  "duration": "string",
  "nextGroupDates": [ "string", ... ],
  "images": [ "imageURL1", ... ]
}

Trip content:
""" \${visibleText.slice(0, 6000)} """`;

// ---------------------------------------------------------------------------
// Comparator: product-team benchmarking against anonymised competitors
// ---------------------------------------------------------------------------

export type Flag = { level: 'warn' | 'info'; text: string };

export interface BenchmarkRow {
  id: string;
  name: string;
  format: string;
  nights: number;
  route: string;
  priceShown: string;
  priceInr: number; // normalised total per person, before items listed as excluded
  flights: 'Included' | 'Not included' | 'Unclear';
  flightsNote?: string;
  meals: string;
  mealsCount: number | null;
  ours?: boolean;
  flags: Flag[];
  rawExcerpt: string;
}

export const BENCHMARK: BenchmarkRow[] = [
  {
    id: 'ours',
    name: 'GenRicTravel · Regular batches',
    format: 'Fixed-date group, up to 15',
    nights: 7,
    route: 'Hanoi → Tam Coc → Ha Long → Hoi An → Da Nang',
    priceShown: '₹44,817 per person',
    priceInr: 44817,
    flights: 'Not included',
    flightsNote: 'No internal flights needed: cities linked by private bus',
    meals: '7 breakfasts, 3 lunches',
    mealsCount: 10,
    ours: true,
    flags: [],
    rawExcerpt: 'From ₹44,817 /person … A total of 10 meals- 7 breakfasts and 3 lunches …',
  },
  {
    id: 'a',
    name: 'Competitor A',
    format: 'Private or small group, any date',
    nights: 7,
    route: 'Hanoi → Ha Long → Da Nang → Hoi An → Phu Quoc',
    priceShown: '$394 per adult (group of 2)',
    priceInr: 394 * FX_INR_PER_USD,
    flights: 'Not included',
    flightsNote: 'Excludes both internal flights (Hanoi–Da Nang, Da Nang–Phu Quoc)',
    meals: 'Counted from day codes (B, L, D)',
    mealsCount: 13,
    flags: [
      { level: 'info', text: 'Priced in USD; converted at ₹94 = $1' },
      { level: 'info', text: 'Price falls with group size ($394 for 2, $380 for 6)' },
      { level: 'warn', text: 'Two internal flights and the e-visa ($33) are extra' },
    ],
    rawExcerpt:
      'GROUP SIZE  PRICE/ADULT  2 $ 394  3 $ 391  4 $ 388 … Day 2: Hanoi - Halong Bay - Overnight Cruise (B, L, D) … Exclusions: … Internal airfares from Hanoi to Danang, from Danang to Phu Quoc …',
  },
  {
    id: 'b',
    name: 'Competitor B',
    format: 'Escorted group with a tour manager',
    nights: 7,
    route: 'Ho Chi Minh City → Da Nang → Hoi An → Hanoi → Ha Long',
    priceShown: '₹1,50,000 per person + 5% GST',
    priceInr: 150000 * 1.05,
    flights: 'Included',
    flightsNote: 'Return flights from Mumbai plus two internal flights',
    meals: 'All meals',
    mealsCount: 21,
    flags: [
      { level: 'info', text: '5% GST added; TCS as applicable on top' },
      { level: 'info', text: 'Price varies by date (₹1.5–1.8 lakh) and departure city' },
      { level: 'warn', text: 'Inclusions and exclusions tabs merged in the page text: “Airfare, Airport taxes and Visa Fees” is ambiguous' },
    ],
    rawExcerpt:
      'Tour Inclusions Tour Exclusions Advance Preparation To and fro economy class air travel … Airfare, Airport taxes and Visa Fees … All Meals – Breakfast, Lunch, Dinner …',
  },
  {
    id: 'c',
    name: 'Competitor C',
    format: 'Customised package',
    nights: 4,
    route: 'Hanoi → Ha Long Bay → Hanoi',
    priceShown: 'From ₹68,798 per adult · “Buy 1 Get 1 Free”',
    priceInr: 68798,
    flights: 'Unclear',
    flightsNote: 'A “Flights” icon is shown, but no flight details on the page',
    meals: 'Unclear',
    mealsCount: null,
    flags: [
      { level: 'warn', text: '“Buy 1 Get 1 Free” headline: the page doesn’t say how it applies to the price shown' },
      { level: 'warn', text: 'Shorter trip (4 nights), Hanoi and Ha Long only' },
      { level: 'info', text: 'Meals only stated for day 1 (“Meals: None”)' },
    ],
    rawExcerpt: 'Vietnam - Buy 1 Get 1 Free … 4 Nights 5 Days … Hotel Meals Flights Sightseeing Transfer … 68 798 Starting price per adult …',
  },
];
