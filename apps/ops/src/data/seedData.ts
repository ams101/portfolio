import { Vendor, Property, RoomType, MediaAsset, License, RatePlan, Policy, InventoryDay } from '../types';
import { format, addDays } from 'date-fns';
import { serviceVendors } from './opsData';

const stayVendors: Vendor[] = [
  {
    id: 'v1',
    serviceTypes: ['Stay'],
    legalName: 'Coastal Stays Pvt Ltd',
    brandName: 'Coastal Escapes',
    type: 'chain',
    servicedAreas: ['Goa', 'Karnataka Coast', 'Kerala Beaches', 'Tamil Nadu Coast'],
    languages: ['English', 'Hindi', 'Kannada', 'Malayalam'],
    contacts: {
      primary: {
        name: 'Arjun Menon',
        phone: '+91-9876543210',
        whatsapp: '+91-9876543210',
        email: 'arjun@coastalstays.com'
      },
      backup: {
        name: 'Priya Nair',
        phone: '+91-9876543211',
        email: 'priya@coastalstays.com'
      }
    },
    payout: {
      method: 'Bank',
      beneficiary: 'Coastal Stays Pvt Ltd',
      taxId: 'GSTIN123456789'
    },
    status: 'Active',
    licenses: [],
    notes: 'Premium beachfront properties specialist',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'v2',
    serviceTypes: ['Stay'],
    legalName: 'Northwind Stays Network',
    type: 'aggregator',
    servicedAreas: ['Pan India', 'Nepal', 'Bhutan'],
    languages: ['English', 'Hindi', 'Bengali', 'Nepali'],
    contacts: {
      primary: {
        name: 'Rohit Sharma',
        phone: '+91-9876543212',
        whatsapp: '+91-9876543212',
        email: 'rohit@northwindstays.example'
      }
    },
    payout: {
      method: 'UPI',
      beneficiary: 'Northwind Stays Network',
      taxId: 'GSTIN234567890'
    },
    status: 'Active',
    licenses: [],
    updatedAt: '2025-01-14T15:45:00Z'
  },
  {
    id: 'v3',
    serviceTypes: ['Stay'],
    legalName: 'Alpine Ridge Hospitality',
    brandName: 'Ridge Retreats',
    type: 'owner',
    servicedAreas: ['Himachal Pradesh', 'Uttarakhand', 'Kashmir', 'Ladakh'],
    languages: ['English', 'Hindi', 'Punjabi'],
    contacts: {
      primary: {
        name: 'Vikram Singh',
        phone: '+91-9876543213',
        email: 'vikram@alpineridge.com'
      },
      backup: {
        name: 'Sunita Devi',
        phone: '+91-9876543214',
        email: 'sunita@alpineridge.com'
      }
    },
    status: 'Under approval',
    licenses: [],
    updatedAt: '2025-01-13T09:15:00Z'
  },
  {
    id: 'v4',
    serviceTypes: ['Stay'],
    legalName: 'Desert Bloom Lodges',
    type: 'propertyManager',
    servicedAreas: ['Rajasthan', 'Gujarat', 'Kutch'],
    languages: ['English', 'Hindi', 'Gujarati', 'Marathi'],
    contacts: {
      primary: {
        name: 'Kiran Patel',
        phone: '+91-9876543215',
        whatsapp: '+91-9876543215',
        email: 'kiran@desertbloom.com'
      }
    },
    payout: {
      method: 'Bank',
      beneficiary: 'Desert Bloom Lodges',
      taxId: 'GSTIN345678901'
    },
    status: 'Active',
    licenses: [],
    notes: 'Specializes in desert and heritage properties',
    updatedAt: '2025-01-12T14:20:00Z'
  },
  {
    id: 'v5',
    serviceTypes: ['Stay'],
    legalName: 'Riverbend Retreats',
    type: 'owner',
    servicedAreas: ['Rishikesh', 'Haridwar', 'Jim Corbett', 'Nainital'],
    languages: ['English', 'Hindi'],
    contacts: {
      primary: {
        name: 'Anjali Gupta',
        phone: '+91-9876543216',
        email: 'anjali@riverbend.com'
      }
    },
    status: 'Active',
    licenses: [],
    updatedAt: '2025-01-11T11:30:00Z'
  },
  {
    id: 'v6',
    serviceTypes: ['Stay'],
    legalName: 'Urban Nest Partners',
    brandName: 'Urban Nest',
    type: 'chain',
    servicedAreas: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'],
    languages: ['English', 'Hindi', 'Marathi', 'Tamil', 'Bengali'],
    contacts: {
      primary: {
        name: 'Rajesh Kumar',
        phone: '+91-9876543217',
        whatsapp: '+91-9876543217',
        email: 'rajesh@urbannest.com'
      }
    },
    payout: {
      method: 'SWIFT',
      beneficiary: 'Urban Nest Partners Ltd',
      taxId: 'GSTIN456789012'
    },
    status: 'Active',
    licenses: [],
    updatedAt: '2025-01-10T16:45:00Z'
  },
  {
    id: 'v7',
    serviceTypes: ['Stay'],
    legalName: 'Evergreen Homestays',
    type: 'partner',
    servicedAreas: ['Coorg', 'Ooty', 'Munnar', 'Wayanad'],
    languages: ['English', 'Kannada', 'Tamil', 'Malayalam'],
    contacts: {
      primary: {
        name: 'Meera Iyer',
        phone: '+91-9876543218',
        email: 'meera@evergreenhomestays.com'
      }
    },
    status: 'Suspended',
    licenses: [],
    notes: 'Temporary suspension due to compliance review',
    updatedAt: '2025-01-09T08:10:00Z'
  },
  {
    id: 'v8',
    serviceTypes: ['Stay'],
    legalName: 'Island & Bay Resorts',
    brandName: 'I&B Resorts',
    type: 'chain',
    servicedAreas: ['Andaman', 'Goa', 'Lakshadweep', 'Konkan Coast'],
    languages: ['English', 'Hindi', 'Konkani'],
    contacts: {
      primary: {
        name: 'Captain Ravi',
        phone: '+91-9876543219',
        whatsapp: '+91-9876543219',
        email: 'ravi@islandbay.com'
      }
    },
    payout: {
      method: 'Bank',
      beneficiary: 'Island & Bay Resorts',
      taxId: 'GSTIN567890123'
    },
    status: 'Active',
    licenses: [],
    updatedAt: '2025-01-08T13:25:00Z'
  },
  {
    id: 'v9',
    serviceTypes: ['Stay'],
    legalName: 'Heritage Haveli Group',
    type: 'owner',
    servicedAreas: ['Rajasthan', 'Punjab', 'Haryana'],
    languages: ['English', 'Hindi', 'Punjabi', 'Marathi'],
    contacts: {
      primary: {
        name: 'Maharaj Singh',
        phone: '+91-9876543220',
        email: 'maharaj@heritagehaveli.com'
      }
    },
    status: 'On hold',
    licenses: [],
    notes: 'Heritage property restoration in progress',
    updatedAt: '2025-01-07T12:00:00Z'
  }
];

export const vendors: Vendor[] = [...stayVendors, ...serviceVendors];

export const properties: Property[] = [
  {
    id: 'p1',
    vendorId: 'v1',
    name: 'Coastal Paradise Resort',
    city: 'Goa',
    country: 'India',
    category: ['Beach Resort', 'Hotel (3-5 star)'],
    settingTags: ['Beachfront', 'Beach access', 'Coastal cliffs', 'Urban core'],
    styleTier: '4 Star',
    address: 'Calangute Beach Road, North Goa, Goa 403516',
    mapPin: { lat: 15.5449, lng: 73.7535 },
    landmarks: [
      { name: 'Calangute Beach', distanceKm: 0.1 },
      { name: 'Baga Beach', distanceKm: 1.2 },
      { name: 'Fort Aguada', distanceKm: 2.5 },
      { name: 'Anjuna Flea Market', distanceKm: 4.8 },
      { name: 'Saturday Night Market', distanceKm: 6.2 },
      { name: 'Chapora Fort', distanceKm: 7.3 },
      { name: 'Mapusa Market', distanceKm: 8.9 },
      { name: 'Panaji City Center', distanceKm: 15.4 },
      { name: 'Goa Airport', distanceKm: 42.1 }
    ],
    houseRules: {
      curfew: '11:00 PM',
      receptionHours: '24/7',
      contactName: 'Arjun Menon',
      contactPhone: '+91-9876543210'
    },
    amenities: ['pool', 'elevator', 'balcony', 'jacuzzi', 'beach access', 'restaurant', 'bar', 'spa'],
    docsStatus: 'OK',
    images: [],
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'p2',
    vendorId: 'v3',
    name: 'Mountain View Lodge',
    city: 'Manali',
    country: 'India',
    category: ['Mountain Hut/Tea House', 'Guest House'],
    settingTags: ['Mountain', 'High altitude', 'Forest', 'Remote'],
    styleTier: '3 Star',
    address: 'Old Manali Road, Manali, Himachal Pradesh 175131',
    mapPin: { lat: 32.2432, lng: 77.1892 },
    landmarks: [
      { name: 'Mall Road', distanceKm: 0.8 },
      { name: 'Hadimba Temple', distanceKm: 1.5 },
      { name: 'Vashisht Hot Springs', distanceKm: 3.2 },
      { name: 'Solang Valley', distanceKm: 14.7 },
      { name: 'Rohtang Pass', distanceKm: 51.2 },
      { name: 'Kasol', distanceKm: 75.3 },
      { name: 'Tosh Village', distanceKm: 82.1 },
      { name: 'Kullu Airport', distanceKm: 50.8 }
    ],
    houseRules: {
      receptionHours: '7:00 AM - 10:00 PM',
      contactName: 'Vikram Singh',
      contactPhone: '+91-9876543213'
    },
    amenities: ['mountain view', 'fireplace', 'garden', 'parking', 'room service'],
    docsStatus: 'Needs review',
    images: [],
    updatedAt: '2025-01-13T09:15:00Z'
  },
  {
    id: 'p3',
    vendorId: 'v2',
    name: 'Trailhead Hostel Kasol',
    city: 'Kasol',
    country: 'India',
    category: ['Hostel (mixed/female/male dorms, private rooms)', 'Backpacker'],
    settingTags: ['Riverfront', 'Forest', 'Mountain', 'Off grid'],
    styleTier: 'Budget',
    address: 'Village Kasol, Tosh Road, Parvati Valley, HP 175105',
    mapPin: { lat: 32.2995, lng: 77.3142 },
    landmarks: [
      { name: 'Parvati River', distanceKm: 0.2 },
      { name: 'Kasol Market', distanceKm: 0.5 },
      { name: 'Chalal Village', distanceKm: 2.8 },
      { name: 'Tosh Village', distanceKm: 4.5 },
      { name: 'Malana Village', distanceKm: 12.3 },
      { name: 'Kheerganga Trek Start', distanceKm: 15.7 },
      { name: 'Manali', distanceKm: 75.3 },
      { name: 'Bhuntar Airport', distanceKm: 31.2 }
    ],
    houseRules: {
      curfew: '12:00 AM',
      receptionHours: '24/7',
      contactName: 'Rohit Sharma',
      contactPhone: '+91-9876543212'
    },
    amenities: ['common area', 'kitchen', 'lockers', 'wifi', 'river view', 'trek support'],
    docsStatus: 'OK',
    images: [],
    updatedAt: '2025-01-14T15:45:00Z'
  },
  {
    id: 'p4',
    vendorId: 'v4',
    name: 'Desert Palace Heritage',
    city: 'Jaipur',
    country: 'India',
    category: ['Heritage property', 'Boutique Hotel'],
    settingTags: ['Heritage/Temple area', 'Old town', 'Desert', 'Urban core'],
    styleTier: 'Premium',
    address: 'Heritage Quarter, Pink City, Jaipur, Rajasthan 302001',
    mapPin: { lat: 26.9124, lng: 75.7873 },
    landmarks: [
      { name: 'City Palace', distanceKm: 0.3 },
      { name: 'Hawa Mahal', distanceKm: 0.8 },
      { name: 'Jantar Mantar', distanceKm: 1.2 },
      { name: 'Amber Fort', distanceKm: 11.5 },
      { name: 'Nahargarh Fort', distanceKm: 8.7 },
      { name: 'Jal Mahal', distanceKm: 6.3 },
      { name: 'Johari Bazaar', distanceKm: 0.5 },
      { name: 'Jaipur Railway Station', distanceKm: 4.2 },
      { name: 'Jaipur Airport', distanceKm: 13.8 }
    ],
    houseRules: {
      receptionHours: '24/7',
      contactName: 'Kiran Patel',
      contactPhone: '+91-9876543215'
    },
    amenities: ['heritage architecture', 'courtyard', 'traditional decor', 'cultural shows', 'restaurant'],
    docsStatus: 'OK',
    images: [],
    updatedAt: '2025-01-12T14:20:00Z'
  },
  {
    id: 'p5',
    vendorId: 'v5',
    name: 'Riverside Yoga Retreat',
    city: 'Rishikesh',
    country: 'India',
    category: ['Ashram/Monastery/Dharamshala', 'Retreat Center'],
    settingTags: ['Riverfront', 'Heritage/Temple area', 'Mountain', 'Jungle'],
    styleTier: 'Deluxe',
    address: 'Laxman Jhula Road, Rishikesh, Uttarakhand 249302',
    mapPin: { lat: 30.1267, lng: 78.2905 },
    landmarks: [
      { name: 'Ganga River', distanceKm: 0.1 },
      { name: 'Laxman Jhula', distanceKm: 0.5 },
      { name: 'Ram Jhula', distanceKm: 2.3 },
      { name: 'Beatles Ashram', distanceKm: 3.1 },
      { name: 'Triveni Ghat', distanceKm: 4.7 },
      { name: 'Rajaji National Park', distanceKm: 18.5 },
      { name: 'Haridwar', distanceKm: 20.8 },
      { name: 'Dehradun Airport', distanceKm: 35.2 }
    ],
    houseRules: {
      receptionHours: '6:00 AM - 9:00 PM',
      contactName: 'Anjali Gupta',
      contactPhone: '+91-9876543216'
    },
    amenities: ['yoga hall', 'meditation room', 'organic garden', 'river view', 'library'],
    docsStatus: 'OK',
    images: [],
    updatedAt: '2025-01-11T11:30:00Z'
  },
  {
    id: 'p6',
    vendorId: 'v8',
    name: 'Island Paradise Resort',
    city: 'Havelock',
    country: 'India',
    category: ['Beach Resort', 'Island Resort'],
    settingTags: ['Island', 'Beachfront', 'Beach access', 'Remote'],
    styleTier: '5 Star',
    address: 'Radhanagar Beach, Havelock Island, Andaman 744211',
    mapPin: { lat: 12.0064, lng: 93.0092 },
    landmarks: [
      { name: 'Radhanagar Beach', distanceKm: 0.1 },
      { name: 'Elephant Beach', distanceKm: 3.2 },
      { name: 'Kalapatthar Beach', distanceKm: 5.8 },
      { name: 'Havelock Jetty', distanceKm: 12.5 },
      { name: 'Neil Island', distanceKm: 35.7 },
      { name: 'Port Blair', distanceKm: 54.3 },
      { name: 'Cellular Jail', distanceKm: 54.8 },
      { name: 'Port Blair Airport', distanceKm: 62.1 }
    ],
    houseRules: {
      receptionHours: '24/7',
      contactName: 'Captain Ravi',
      contactPhone: '+91-9876543219'
    },
    amenities: ['private beach', 'water sports', 'diving center', 'spa', 'multiple restaurants', 'pool', 'jacuzzi'],
    docsStatus: 'OK',
    images: [],
    updatedAt: '2025-01-08T13:25:00Z'
  },
  {
    id: 'p7',
    vendorId: 'v6',
    name: 'Urban Hub Mumbai',
    city: 'Mumbai',
    country: 'India',
    category: ['Business Hotel', 'Serviced Apartment'],
    settingTags: ['Urban core', 'Downtown', 'Near transit hub'],
    styleTier: '4 Star',
    address: 'Andheri East, Mumbai, Maharashtra 400069',
    mapPin: { lat: 19.1136, lng: 72.8697 },
    landmarks: [
      { name: 'Mumbai Airport', distanceKm: 2.1 },
      { name: 'Powai Lake', distanceKm: 4.3 },
      { name: 'Bandra-Kurla Complex', distanceKm: 8.5 },
      { name: 'Linking Road', distanceKm: 12.7 },
      { name: 'Marine Drive', distanceKm: 18.9 },
      { name: 'Gateway of India', distanceKm: 22.4 },
      { name: 'CST Railway Station', distanceKm: 21.8 },
      { name: 'Juhu Beach', distanceKm: 7.6 }
    ],
    houseRules: {
      receptionHours: '24/7',
      contactName: 'Rajesh Kumar',
      contactPhone: '+91-9876543217'
    },
    amenities: ['business center', 'gym', 'restaurant', 'airport shuttle', 'conference rooms'],
    docsStatus: 'OK',
    images: [],
    updatedAt: '2025-01-10T16:45:00Z'
  },
  {
    id: 'p8',
    vendorId: 'v7',
    name: 'Coorg Coffee Estate',
    city: 'Coorg',
    country: 'India',
    category: ['Farm stay', 'Homestay'],
    settingTags: ['Hill', 'Rural', 'Forest', 'Off grid'],
    styleTier: 'Premium',
    address: 'Madikeri-Virajpet Road, Coorg, Karnataka 571201',
    mapPin: { lat: 12.4244, lng: 75.7382 },
    landmarks: [
      { name: 'Coffee Plantation', distanceKm: 0.0 },
      { name: 'Abbey Falls', distanceKm: 5.8 },
      { name: 'Raja Seat', distanceKm: 8.2 },
      { name: 'Madikeri Fort', distanceKm: 9.5 },
      { name: 'Dubare Elephant Camp', distanceKm: 15.3 },
      { name: 'Talakaveri', distanceKm: 42.7 },
      { name: 'Nisargadhama', distanceKm: 28.4 },
      { name: 'Mangalore Airport', distanceKm: 135.8 }
    ],
    houseRules: {
      receptionHours: '7:00 AM - 9:00 PM',
      contactName: 'Meera Iyer',
      contactPhone: '+91-9876543218'
    },
    amenities: ['coffee plantation tour', 'organic meals', 'nature walks', 'bonfire'],
    docsStatus: 'Expired',
    images: [],
    updatedAt: '2025-01-09T08:10:00Z'
  },
  {
    id: 'p9',
    vendorId: 'v3',
    name: 'Himalayan High Camp',
    city: 'Leh',
    country: 'India',
    category: ['Mountain Hut/Tea House', 'Guest House'],
    settingTags: ['High altitude', 'Mountain', 'Remote', 'Dark sky'],
    styleTier: 'Budget',
    address: 'Leh Main Market, Ladakh, J&K 194101',
    mapPin: { lat: 34.1526, lng: 77.5771 },
    landmarks: [
      { name: 'Leh Palace', distanceKm: 0.8 },
      { name: 'Shanti Stupa', distanceKm: 3.2 },
      { name: 'Magnetic Hill', distanceKm: 30.1 },
      { name: 'Pangong Lake', distanceKm: 160.5 },
      { name: 'Nubra Valley', distanceKm: 120.3 },
      { name: 'Khardung La Pass', distanceKm: 39.7 },
      { name: 'Hemis Monastery', distanceKm: 45.2 },
      { name: 'Leh Airport', distanceKm: 3.5 }
    ],
    houseRules: {
      receptionHours: '6:00 AM - 10:00 PM',
      contactName: 'Vikram Singh',
      contactPhone: '+91-9876543213'
    },
    amenities: ['oxygen supply', 'heated rooms', 'local guide service', 'equipment rental'],
    docsStatus: 'Needs review',
    images: [],
    updatedAt: '2025-01-07T12:00:00Z'
  },
  {
    id: 'p10',
    vendorId: 'v1',
    name: 'Tropical Bay Villa',
    city: 'Gokarna',
    country: 'India',
    category: ['Villa', 'Beach Resort'],
    settingTags: ['Beachfront', 'Beach access', 'Coastal cliffs', 'Heritage/Temple area'],
    styleTier: 'Deluxe',
    address: 'Om Beach Road, Gokarna, Karnataka 581326',
    mapPin: { lat: 14.5426, lng: 74.3188 },
    landmarks: [
      { name: 'Om Beach', distanceKm: 0.2 },
      { name: 'Kudle Beach', distanceKm: 1.5 },
      { name: 'Half Moon Beach', distanceKm: 0.8 },
      { name: 'Paradise Beach', distanceKm: 1.2 },
      { name: 'Mahabaleshwar Temple', distanceKm: 6.8 },
      { name: 'Mirjan Fort', distanceKm: 22.4 },
      { name: 'Karwar Beach', distanceKm: 55.7 },
      { name: 'Goa Airport', distanceKm: 140.2 }
    ],
    houseRules: {
      receptionHours: '24/7',
      contactName: 'Arjun Menon',
      contactPhone: '+91-9876543210'
    },
    amenities: ['private villa', 'beach access', 'pool', 'kitchen', 'balcony', 'sea view'],
    docsStatus: 'OK',
    images: [],
    updatedAt: '2025-01-06T14:15:00Z'
  },
  {
    id: 'p11',
    vendorId: 'v4',
    name: 'Royal Desert Camp',
    city: 'Udaipur',
    country: 'India',
    category: ['Luxury Tent', 'Desert Camp'],
    settingTags: ['Desert', 'Heritage/Temple area', 'Remote', 'Dark sky'],
    styleTier: '5 Star',
    address: 'Khuri Sand Dunes, Udaipur, Rajasthan 313001',
    mapPin: { lat: 24.5854, lng: 73.7125 },
    landmarks: [
      { name: 'City Palace', distanceKm: 0.8 },
      { name: 'Lake Pichola', distanceKm: 1.2 },
      { name: 'Jag Mandir', distanceKm: 2.5 },
      { name: 'Saheliyon ki Bari', distanceKm: 3.8 },
      { name: 'Monsoon Palace', distanceKm: 9.5 },
      { name: 'Kumbhalgarh Fort', distanceKm: 85.7 },
      { name: 'Chittorgarh Fort', distanceKm: 112.3 },
      { name: 'Udaipur Airport', distanceKm: 22.8 }
    ],
    houseRules: {
      receptionHours: '24/7',
      contactName: 'Kiran Patel',
      contactPhone: '+91-9876543215'
    },
    amenities: ['luxury tents', 'camel safari', 'cultural show', 'stargazing', 'desert dining'],
    docsStatus: 'OK',
    images: [],
    updatedAt: '2025-01-05T11:30:00Z'
  },
  {
    id: 'p12',
    vendorId: 'v8',
    name: 'Bay View Houseboat',
    city: 'Port Blair',
    country: 'India',
    category: ['Houseboat/Boathouse'],
    settingTags: ['Waterfront', 'Island', 'Remote', 'Beach access'],
    styleTier: 'Premium',
    address: 'Aberdeen Bazaar, Port Blair, Andaman 744101',
    mapPin: { lat: 11.6234, lng: 92.7265 },
    landmarks: [
      { name: 'Cellular Jail', distanceKm: 2.3 },
      { name: 'Corbyn Cove Beach', distanceKm: 8.5 },
      { name: 'Chatham Saw Mill', distanceKm: 1.8 },
      { name: 'Ross Island', distanceKm: 3.2 },
      { name: 'North Bay Island', distanceKm: 4.7 },
      { name: 'Havelock Island Ferry', distanceKm: 54.3 },
      { name: 'Neil Island Ferry', distanceKm: 37.8 },
      { name: 'Port Blair Airport', distanceKm: 4.2 }
    ],
    houseRules: {
      receptionHours: '7:00 AM - 8:00 PM',
      contactName: 'Captain Ravi',
      contactPhone: '+91-9876543219'
    },
    amenities: ['floating accommodation', 'fishing', 'sunset viewing', 'water taxi'],
    docsStatus: 'OK',
    images: [],
    updatedAt: '2025-01-04T16:20:00Z'
  }
];

// Generate comprehensive room types
export const roomTypes: RoomType[] = [
  // Property 1 - Coastal Paradise Resort
  {
    id: 'rt1',
    propertyId: 'p1',
    publicName: 'Deluxe Sea View Room',
    internalCode: 'DSV001',
    unitOfSale: 'room',
    occupancy: { adults: 2, children: 1 },
    extraBed: { allowed: true, charge: 1200 },
    bedConfig: 'King',
    bedCount: 1,
    bath: { ensuite: true, count: 1, amenities: ['bathtub', 'rain shower', 'premium toiletries'] },
    sizeSqft: 450,
    floor: 3,
    elevatorProximity: 'Yes',
    view: 'sea',
    balconyOrTerrace: 'Yes',
    climate: { ac: true, heating: false, fan: true },
    work: { desk: true, chair: true, outletsNearBed: 4, wifiMbps: 50 },
    kitchenette: { hob: false, microwave: false, fridge: true, cookware: false, waterFilter: true, kettle: true },
    safety: { safe: true, smokeDetector: true },
    entertainment: { tvSmart: true },
    accessibility: { differentlyAbledAccess: 'Yes' },
    special: { privateJacuzzi: false, sharedJacuzzi: true, fireplace: false, mosquitoNet: true, blackoutCurtains: true },
    images: []
  },
  {
    id: 'rt2',
    propertyId: 'p1',
    publicName: 'Superior Suite with Jacuzzi',
    internalCode: 'SSJ002',
    unitOfSale: 'room',
    occupancy: { adults: 2, children: 2 },
    extraBed: { allowed: false },
    bedConfig: 'King + Sofa bed',
    bedCount: 1,
    bath: { ensuite: true, count: 1, amenities: ['jacuzzi tub', 'separate shower', 'luxury toiletries'] },
    sizeSqft: 650,
    floor: 4,
    elevatorProximity: 'Yes',
    view: 'sea',
    balconyOrTerrace: 'Yes',
    climate: { ac: true, heating: false, fan: true },
    work: { desk: true, chair: true, outletsNearBed: 6, wifiMbps: 100 },
    kitchenette: { hob: false, microwave: true, fridge: true, cookware: false, waterFilter: true, kettle: true },
    safety: { safe: true, smokeDetector: true },
    entertainment: { tvSmart: true },
    accessibility: { differentlyAbledAccess: 'No' },
    special: { privateJacuzzi: true, sharedJacuzzi: false, fireplace: false, mosquitoNet: true, blackoutCurtains: true },
    images: []
  },
  {
    id: 'rt6',
    propertyId: 'p1',
    publicName: 'Ocean View Penthouse',
    internalCode: 'OVP006',
    unitOfSale: 'entire',
    occupancy: { adults: 4, children: 2 },
    extraBed: { allowed: true, charge: 2000 },
    bedConfig: 'King + Queen',
    bedCount: 2,
    bath: { ensuite: true, count: 2, amenities: ['jacuzzi tub', 'rain shower', 'luxury toiletries', 'heated floors'] },
    sizeSqft: 1200,
    floor: 8,
    elevatorProximity: 'Yes',
    view: 'sea',
    balconyOrTerrace: 'Yes',
    climate: { ac: true, heating: false, fan: true },
    work: { desk: true, chair: true, outletsNearBed: 8, wifiMbps: 200 },
    kitchenette: { hob: true, microwave: true, fridge: true, cookware: true, waterFilter: true, kettle: true },
    safety: { safe: true, smokeDetector: true },
    entertainment: { tvSmart: true },
    accessibility: { differentlyAbledAccess: 'Yes' },
    special: { privateJacuzzi: true, sharedJacuzzi: false, fireplace: true, mosquitoNet: true, blackoutCurtains: true },
    images: []
  },
  {
    id: 'rt7',
    propertyId: 'p1',
    publicName: 'Garden View Standard',
    internalCode: 'GVS007',
    unitOfSale: 'room',
    occupancy: { adults: 2, children: 1 },
    extraBed: { allowed: true, charge: 800 },
    bedConfig: 'Queen',
    bedCount: 1,
    bath: { ensuite: true, count: 1, amenities: ['shower', 'basic toiletries'] },
    sizeSqft: 320,
    floor: 2,
    elevatorProximity: 'Yes',
    view: 'garden',
    balconyOrTerrace: 'No',
    climate: { ac: true, heating: false, fan: true },
    work: { desk: false, chair: false, outletsNearBed: 2, wifiMbps: 25 },
    kitchenette: { hob: false, microwave: false, fridge: false, cookware: false, waterFilter: true, kettle: true },
    safety: { safe: false, smokeDetector: true },
    entertainment: { tvSmart: false },
    accessibility: { differentlyAbledAccess: 'No' },
    special: { privateJacuzzi: false, sharedJacuzzi: false, fireplace: false, mosquitoNet: true, blackoutCurtains: false },
    images: []
  },
  {
    id: 'rt8',
    propertyId: 'p1',
    publicName: 'Premium Twin with Balcony',
    internalCode: 'PTB008',
    unitOfSale: 'room',
    occupancy: { adults: 2, children: 0 },
    extraBed: { allowed: false },
    bedConfig: 'Twin',
    bedCount: 2,
    bath: { ensuite: true, count: 1, amenities: ['shower', 'premium toiletries'] },
    sizeSqft: 380,
    floor: 5,
    elevatorProximity: 'Yes',
    view: 'mountain',
    balconyOrTerrace: 'Yes',
    climate: { ac: true, heating: true, fan: true },
    work: { desk: true, chair: true, outletsNearBed: 4, wifiMbps: 75 },
    kitchenette: { hob: false, microwave: false, fridge: true, cookware: false, waterFilter: true, kettle: true },
    safety: { safe: true, smokeDetector: true },
    entertainment: { tvSmart: true },
    accessibility: { differentlyAbledAccess: 'Yes' },
    special: { privateJacuzzi: false, sharedJacuzzi: true, fireplace: false, mosquitoNet: false, blackoutCurtains: true },
    images: []
  },
  {
    id: 'rt9',
    propertyId: 'p1',
    publicName: 'Accessible Sea View',
    internalCode: 'ASV009',
    unitOfSale: 'room',
    occupancy: { adults: 2, children: 1 },
    extraBed: { allowed: true, charge: 1000 },
    bedConfig: 'King',
    bedCount: 1,
    bath: { ensuite: true, count: 1, amenities: ['roll-in shower', 'grab bars', 'premium toiletries'] },
    sizeSqft: 500,
    floor: 1,
    elevatorProximity: 'Yes',
    view: 'sea',
    balconyOrTerrace: 'Yes',
    climate: { ac: true, heating: false, fan: true },
    work: { desk: true, chair: true, outletsNearBed: 6, wifiMbps: 50 },
    kitchenette: { hob: false, microwave: true, fridge: true, cookware: false, waterFilter: true, kettle: true },
    safety: { safe: true, smokeDetector: true },
    entertainment: { tvSmart: true },
    accessibility: { differentlyAbledAccess: 'Yes' },
    special: { privateJacuzzi: false, sharedJacuzzi: false, fireplace: false, mosquitoNet: true, blackoutCurtains: true },
    images: []
  },
  // Property 2 - Mountain View Lodge
  {
    id: 'rt3',
    propertyId: 'p2',
    publicName: 'Mountain View Twin',
    internalCode: 'MVT003',
    unitOfSale: 'room',
    occupancy: { adults: 2, children: 1 },
    extraBed: { allowed: true, charge: 800 },
    bedConfig: 'Twin',
    bedCount: 2,
    bath: { ensuite: true, count: 1, amenities: ['hot water', 'basic toiletries'] },
    sizeSqft: 320,
    floor: 2,
    elevatorProximity: 'No',
    view: 'mountain',
    balconyOrTerrace: 'Yes',
    climate: { ac: false, heating: true, fan: false },
    work: { desk: true, chair: true, outletsNearBed: 2, wifiMbps: 25 },
    kitchenette: { hob: false, microwave: false, fridge: false, cookware: false, waterFilter: true, kettle: true },
    safety: { safe: false, smokeDetector: true },
    entertainment: { tvSmart: false },
    accessibility: { differentlyAbledAccess: 'No' },
    special: { privateJacuzzi: false, sharedJacuzzi: false, fireplace: true, mosquitoNet: false, blackoutCurtains: false },
    images: []
  },
  // Property 3 - Trailhead Hostel Kasol
  {
    id: 'rt4',
    propertyId: 'p3',
    publicName: '6 Bed Mixed Dorm',
    internalCode: 'DMX004',
    unitOfSale: 'bed',
    occupancy: { adults: 1, children: 0 },
    extraBed: { allowed: false },
    bedConfig: 'Bunk',
    bedCount: 6,
    bath: { ensuite: false, count: 2, amenities: ['shared bathroom', 'hot water'] },
    sizeSqft: 280,
    floor: 1,
    elevatorProximity: 'No',
    view: 'river',
    balconyOrTerrace: 'No',
    climate: { ac: false, heating: true, fan: false },
    work: { desk: false, chair: false, outletsNearBed: 2, wifiMbps: 20 },
    kitchenette: { hob: false, microwave: false, fridge: false, cookware: false, waterFilter: true, kettle: false },
    safety: { safe: false, smokeDetector: true },
    entertainment: { tvSmart: false },
    accessibility: { differentlyAbledAccess: 'No' },
    special: { privateJacuzzi: false, sharedJacuzzi: false, fireplace: false, mosquitoNet: false, blackoutCurtains: true },
    dormSpecifics: {
      genderPolicy: 'mixed',
      locker: true,
      linenTowelPolicy: 'Included with deposit'
    },
    images: []
  },
  {
    id: 'rt5',
    propertyId: 'p3',
    publicName: '4 Bed Female Dorm',
    internalCode: 'DFM005',
    unitOfSale: 'bed',
    occupancy: { adults: 1, children: 0 },
    extraBed: { allowed: false },
    bedConfig: 'Bunk',
    bedCount: 4,
    bath: { ensuite: false, count: 1, amenities: ['shared bathroom', 'hot water'] },
    sizeSqft: 200,
    floor: 2,
    elevatorProximity: 'No',
    view: 'forest',
    balconyOrTerrace: 'No',
    climate: { ac: false, heating: true, fan: false },
    work: { desk: false, chair: false, outletsNearBed: 1, wifiMbps: 20 },
    kitchenette: { hob: false, microwave: false, fridge: false, cookware: false, waterFilter: true, kettle: false },
    safety: { safe: false, smokeDetector: true },
    entertainment: { tvSmart: false },
    accessibility: { differentlyAbledAccess: 'No' },
    special: { privateJacuzzi: false, sharedJacuzzi: false, fireplace: false, mosquitoNet: false, blackoutCurtains: true },
    dormSpecifics: {
      genderPolicy: 'female',
      locker: true,
      linenTowelPolicy: 'Included with deposit'
    },
    images: []
  }
  // Continue with more room types...
];

// Generate inventory for 90 days
export const generateInventoryDays = (): InventoryDay[] => {
  const inventory: InventoryDay[] = [];
  const startDate = new Date();
  
  roomTypes.forEach(roomType => {
    for (let i = 0; i < 90; i++) {
      const date = format(addDays(startDate, i), 'yyyy-MM-dd');
      const dayOfWeek = addDays(startDate, i).getDay();
      
      // Weekend availability is lower
      let availableCount = roomType.unitOfSale === 'bed' ? 
        Math.floor(roomType.bedCount * (dayOfWeek === 5 || dayOfWeek === 6 ? 0.3 : 0.7)) :
        dayOfWeek === 5 || dayOfWeek === 6 ? 1 : 2;
      
      let status: 'Open' | 'Closed/Stop sell' | 'On hold' = 'Open';
      let reason: string | undefined;
      
      // Some maintenance blocks
      if (i >= 20 && i <= 22) {
        status = 'Closed/Stop sell';
        reason = 'Maintenance';
        availableCount = 0;
      }
      
      // Festival blackout (simulate Diwali)
      if (i >= 45 && i <= 47) {
        status = 'On hold';
        reason = 'Festival booking hold';
        availableCount = 0;
      }
      
      inventory.push({
        roomTypeId: roomType.id,
        date,
        status,
        availableCount,
        reason,
        releaseDate: status === 'On hold' ? format(addDays(new Date(date), 7), 'yyyy-MM-dd') : undefined
      });
    }
  });
  
  return inventory;
};

export const inventoryDays = generateInventoryDays();

// Rate plans with overrides
export const ratePlans: RatePlan[] = roomTypes.map(roomType => ({
  roomTypeId: roomType.id,
  base: {
    rate1Adult: roomType.unitOfSale === 'bed' ? 800 : 2500,
    rate2Adults: roomType.unitOfSale === 'bed' ? 800 : 3500,
    rate3Adults: roomType.unitOfSale === 'bed' ? 800 : 4200,
    extraChild: 500,
    extraAdult: 800,
    taxes: {
      gstPercent: 12,
      serviceChargePercent: 10
    }
  },
  overrides: [
    {
      startDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 35), 'yyyy-MM-dd'),
      rate1Adult: roomType.unitOfSale === 'bed' ? 1000 : 3000,
      rate2Adults: roomType.unitOfSale === 'bed' ? 1000 : 4200,
      rate3Adults: roomType.unitOfSale === 'bed' ? 1000 : 5040,
      extraChild: 600,
      extraAdult: 960
    },
    {
      startDate: format(addDays(new Date(), 60), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 65), 'yyyy-MM-dd'),
      rate1Adult: roomType.unitOfSale === 'bed' ? 1200 : 3500,
      rate2Adults: roomType.unitOfSale === 'bed' ? 1200 : 4900,
      rate3Adults: roomType.unitOfSale === 'bed' ? 1200 : 5880,
      extraChild: 700,
      extraAdult: 1120
    }
  ]
}));

// Policies
export const policies: Policy[] = roomTypes.map(roomType => ({
  roomTypeId: roomType.id,
  template: 'Flexible',
  freeCancelCutoffHours: 24,
  noShowPenalty: 50,
  checkInWindow: '14:00 - 22:00',
  checkOutWindow: '08:00 - 12:00'
}));

// Licenses and compliance
export const licenses: License[] = [
  {
    id: 'l1',
    type: 'Tourism Board Registration',
    number: 'TBR/2024/001',
    issuer: 'Goa Tourism Board',
    issueDate: '2024-01-15',
    expiryDate: '2025-01-15',
    files: ['tbr_certificate.pdf'],
    status: 'Approved',
    notes: 'Annual renewal required'
  },
  {
    id: 'l2',
    type: 'Fire NOC',
    number: 'FIRE/NOC/2024/002',
    issuer: 'Fire Department, Goa',
    issueDate: '2024-02-20',
    expiryDate: '2025-02-20',
    files: ['fire_noc.pdf'],
    status: 'Approved'
  },
  {
    id: 'l3',
    type: 'GST Registration',
    number: 'GSTIN123456789',
    issuer: 'GST Department',
    issueDate: '2024-01-01',
    expiryDate: '2025-12-31',
    files: ['gst_certificate.pdf'],
    status: 'Approved'
  },
  {
    id: 'l4',
    type: 'Trade License',
    number: 'TL/2024/HP/001',
    issuer: 'Manali Municipal Corporation',
    issueDate: '2024-03-01',
    expiryDate: '2025-03-01',
    files: ['trade_license.pdf'],
    status: 'Needs review',
    notes: 'Renewal application submitted'
  },
  {
    id: 'l5',
    type: 'Insurance Certificate',
    number: 'INS/2024/005',
    issuer: 'HDFC ERGO',
    issueDate: '2024-01-10',
    expiryDate: '2024-12-31',
    files: ['insurance_cert.pdf'],
    status: 'Expired',
    notes: 'Renewal required immediately'
  }
];

// Media assets
export const mediaAssets: MediaAsset[] = [
  {
    id: 'm1',
    propertyId: 'p1',
    url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
    tags: ['pool', 'exterior', 'sea view', 'resort'],
    isHero: true
  },
  {
    id: 'm2',
    propertyId: 'p1',
    roomTypeId: 'rt1',
    url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    tags: ['room', 'balcony', 'sea view', 'bed'],
    isHero: false
  },
  {
    id: 'm3',
    propertyId: 'p1',
    roomTypeId: 'rt2',
    url: 'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg',
    tags: ['jacuzzi', 'bathroom', 'luxury', 'spa'],
    isHero: false
  },
  // Additional room type images for rt1
  {
    id: 'm16',
    propertyId: 'p1',
    roomTypeId: 'rt1',
    url: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
    tags: ['bathroom', 'ensuite', 'modern', 'clean'],
    isHero: false
  },
  {
    id: 'm17',
    propertyId: 'p1',
    roomTypeId: 'rt1',
    url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    tags: ['room', 'bed', 'comfort', 'luxury'],
    isHero: false
  },
  {
    id: 'm18',
    propertyId: 'p1',
    roomTypeId: 'rt1',
    url: 'https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg',
    tags: ['balcony', 'sea view', 'outdoor', 'relaxation'],
    isHero: false
  },
  {
    id: 'm19',
    propertyId: 'p1',
    roomTypeId: 'rt1',
    url: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg',
    tags: ['room', 'interior', 'modern', 'comfort'],
    isHero: false
  },
  {
    id: 'm20',
    propertyId: 'p1',
    roomTypeId: 'rt1',
    url: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
    tags: ['room', 'desk', 'work', 'business'],
    isHero: false
  },
  // Additional room type images for rt2
  {
    id: 'm21',
    propertyId: 'p1',
    roomTypeId: 'rt2',
    url: 'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg',
    tags: ['suite', 'luxury', 'spacious', 'premium'],
    isHero: false
  },
  {
    id: 'm22',
    propertyId: 'p1',
    roomTypeId: 'rt2',
    url: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg',
    tags: ['jacuzzi', 'private', 'luxury', 'spa'],
    isHero: false
  },
  {
    id: 'm23',
    propertyId: 'p1',
    roomTypeId: 'rt2',
    url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    tags: ['suite', 'living area', 'sofa', 'comfort'],
    isHero: false
  },
  {
    id: 'm24',
    propertyId: 'p1',
    roomTypeId: 'rt2',
    url: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg',
    tags: ['suite', 'bedroom', 'king bed', 'luxury'],
    isHero: false
  },
  {
    id: 'm25',
    propertyId: 'p1',
    roomTypeId: 'rt2',
    url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
    tags: ['balcony', 'sea view', 'outdoor', 'premium'],
    isHero: false
  },
  // Images for new room types rt6-rt9
  {
    id: 'm26',
    propertyId: 'p1',
    roomTypeId: 'rt6',
    url: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
    tags: ['penthouse', 'luxury', 'spacious', 'premium'],
    isHero: false
  },
  {
    id: 'm27',
    propertyId: 'p1',
    roomTypeId: 'rt6',
    url: 'https://images.pexels.com/photos/1838640/pexels-photo-1838640.jpeg',
    tags: ['penthouse', 'living room', 'fireplace', 'luxury'],
    isHero: false
  },
  {
    id: 'm28',
    propertyId: 'p1',
    roomTypeId: 'rt6',
    url: 'https://images.pexels.com/photos/2882234/pexels-photo-2882234.jpeg',
    tags: ['penthouse', 'kitchen', 'modern', 'cooking'],
    isHero: false
  },
  {
    id: 'm29',
    propertyId: 'p1',
    roomTypeId: 'rt7',
    url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    tags: ['standard room', 'garden view', 'comfortable', 'budget'],
    isHero: false
  },
  {
    id: 'm30',
    propertyId: 'p1',
    roomTypeId: 'rt8',
    url: 'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg',
    tags: ['twin room', 'balcony', 'mountain view', 'premium'],
    isHero: false
  },
  {
    id: 'm31',
    propertyId: 'p1',
    roomTypeId: 'rt9',
    url: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
    tags: ['accessible', 'sea view', 'barrier-free', 'inclusive'],
    isHero: false
  },
  {
    id: 'm4',
    propertyId: 'p2',
    url: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
    tags: ['mountain view', 'exterior', 'garden', 'lodge'],
    isHero: true
  },
  {
    id: 'm5',
    propertyId: 'p3',
    url: 'https://images.pexels.com/photos/1838640/pexels-photo-1838640.jpeg',
    tags: ['common area', 'interior', 'coworking', 'hostel'],
    isHero: true
  },
  {
    id: 'm6',
    propertyId: 'p4',
    url: 'https://images.pexels.com/photos/2882234/pexels-photo-2882234.jpeg',
    tags: ['heritage', 'exterior', 'courtyard', 'palace'],
    isHero: true
  },
  {
    id: 'm7',
    propertyId: 'p6',
    url: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg',
    tags: ['beach access', 'pool', 'resort', 'tropical'],
    isHero: true
  },
  {
    id: 'm8',
    propertyId: 'p6',
    url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    tags: ['beach access', 'exterior', 'island', 'paradise'],
    isHero: false
  },
  // Additional images for better gallery experience
  {
    id: 'm9',
    propertyId: 'p1',
    url: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
    tags: ['restaurant', 'dining', 'interior', 'food'],
    isHero: true
  },
  {
    id: 'm10',
    propertyId: 'p1',
    url: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg',
    tags: ['spa', 'wellness', 'relaxation', 'luxury'],
    isHero: true
  },
  {
    id: 'm11',
    propertyId: 'p1',
    url: 'https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg',
    tags: ['bar', 'drinks', 'evening', 'social'],
    isHero: true
  },
  {
    id: 'm12',
    propertyId: 'p1',
    url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    tags: ['gym', 'fitness', 'exercise', 'health'],
    isHero: true
  },
  {
    id: 'm13',
    propertyId: 'p1',
    roomTypeId: 'rt1',
    url: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
    tags: ['bathroom', 'ensuite', 'modern', 'clean'],
    isHero: false
  },
  {
    id: 'm14',
    propertyId: 'p1',
    url: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg',
    tags: ['common area', 'lobby', 'reception', 'welcome'],
    isHero: true
  },
  {
    id: 'm15',
    propertyId: 'p1',
    roomTypeId: 'rt2',
    url: 'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg',
    tags: ['room', 'suite', 'luxury', 'comfort'],
    isHero: false
  }
];