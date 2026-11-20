// What a vendor supplies. Stays come from the supply side; the rest are used by
// trip operations (merged in from the trip-ops prototype).
export type ServiceType = 'Stay' | 'Transfer' | 'Activity' | 'Rental';

export interface Vendor {
  id: string;
  legalName: string;
  serviceTypes: ServiceType[];
  rating?: number;
  preferred?: boolean;
  brandName?: string;
  type: 'owner' | 'propertyManager' | 'chain' | 'aggregator' | 'partner';
  servicedAreas: string[];
  languages: string[];
  contacts: {
    primary: Contact;
    backup?: Contact;
  };
  payout?: {
    method: 'UPI' | 'Bank' | 'IBAN' | 'SWIFT';
    beneficiary: string;
    taxId: string;
  };
  status: 'Draft' | 'Active' | 'Suspended' | 'Blacklisted' | 'On hold' | 'Under approval';
  licenses: License[];
  notes?: string;
  updatedAt: string;
}

export interface Contact {
  name: string;
  phone: string;
  whatsapp?: string;
  email: string;
}

export interface Property {
  id: string;
  vendorId: string;
  name: string;
  city: string;
  country: string;
  category: string[];
  settingTags: string[];
  styleTier: '3 Star' | '4 Star' | '5 Star' | 'Premium' | 'Deluxe' | 'Budget';
  address: string;
  mapPin: {
    lat: number;
    lng: number;
  };
  landmarks: Landmark[];
  houseRules: {
    curfew?: string;
    receptionHours: string;
    contactName: string;
    contactPhone: string;
  };
  amenities: string[];
  docsStatus: 'OK' | 'Needs review' | 'Expired';
  images: MediaAsset[];
  updatedAt: string;
}

export interface Landmark {
  name: string;
  distanceKm: number;
}

export interface RoomType {
  id: string;
  propertyId: string;
  publicName: string;
  internalCode: string;
  unitOfSale: 'room' | 'bed' | 'entire';
  occupancy: {
    adults: number;
    children: number;
  };
  bhk?: string;
  extraBed: {
    allowed: boolean;
    charge?: number;
  };
  bedConfig: string;
  bedCount: number;
  bath: {
    ensuite: boolean;
    count: number;
    amenities: string[];
  };
  sizeSqft: number;
  floor?: number;
  elevatorProximity: 'Yes' | 'No';
  view: string;
  balconyOrTerrace: 'Yes' | 'No';
  climate: {
    ac: boolean;
    heating: boolean;
    fan: boolean;
  };
  work: {
    desk: boolean;
    chair: boolean;
    outletsNearBed: number;
    wifiMbps: number;
  };
  kitchenette: {
    hob: boolean;
    microwave: boolean;
    fridge: boolean;
    cookware: boolean;
    waterFilter: boolean;
    kettle: boolean;
  };
  safety: {
    safe: boolean;
    smokeDetector: boolean;
  };
  entertainment: {
    tvSmart: boolean;
  };
  accessibility: {
    differentlyAbledAccess: 'Yes' | 'No';
  };
  special: {
    privateJacuzzi: boolean;
    sharedJacuzzi: boolean;
    fireplace: boolean;
    mosquitoNet: boolean;
    blackoutCurtains: boolean;
  };
  dormSpecifics?: {
    genderPolicy: 'mixed' | 'female' | 'male';
    locker: boolean;
    linenTowelPolicy: string;
  };
  images: MediaAsset[];
}

export interface InventoryDay {
  roomTypeId: string;
  date: string;
  status: 'Open' | 'Closed/Stop sell' | 'On hold';
  availableCount: number;
  reason?: string;
  releaseDate?: string;
}

export interface RatePlan {
  roomTypeId: string;
  base: {
    rate1Adult: number;
    rate2Adults: number;
    rate3Adults: number;
    extraChild: number;
    extraAdult: number;
    taxes: {
      gstPercent: number;
      serviceChargePercent: number;
    };
  };
  overrides: RateOverride[];
}

export interface RateOverride {
  startDate: string;
  endDate: string;
  rate1Adult: number;
  rate2Adults: number;
  rate3Adults: number;
  extraChild: number;
  extraAdult: number;
}

export interface Policy {
  roomTypeId: string;
  template: 'Flexible' | 'Moderate' | 'Strict';
  freeCancelCutoffHours: number;
  noShowPenalty: number;
  checkInWindow: string;
  checkOutWindow: string;
}

export interface License {
  id: string;
  type: string;
  number: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  files: string[];
  status: 'Uploaded' | 'Needs review' | 'Approved' | 'Expired';
  notes?: string;
}

export interface MediaAsset {
  id: string;
  propertyId: string;
  roomTypeId?: string;
  url: string;
  tags: string[];
  isHero: boolean;
}