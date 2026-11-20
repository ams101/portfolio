import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { vendors } from '../data/seedData';

interface PropertyStepperProps {
  onClose: () => void;
  prefillVendorId?: string;
}

interface PropertyFormData {
  // Step 1: Identity
  name: string;
  vendorId: string;
  categoryTags: string[];
  settingTags: string[];
  styleTier: string;
  internalSummary: string;
  vibeTags: string[];
  
  // Step 2: Location
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  mapPin: { lat: number; lng: number };
  landmarks: Array<{ name: string; distanceKm: number }>;
  directions: string;
  
  // Step 3: Contact and Operating
  frontDeskName: string;
  frontDeskPhone: string;
  receptionHours: string;
  checkInWindow: string;
  checkOutWindow: string;
  curfewRules: string;
  secondaryContact: string;
  secondaryEmail: string;
  
  // Step 4: Amenities
  amenities: {
    wellness: string[];
    foodBeverage: string[];
    sharedSpaces: string[];
    utilities: string[];
    activities: string[];
    events: string[];
    petsAndSmoking: string[];
    safety: string[];
    custom: Array<{ name: string; icon: string }>;
  };
  
  // Step 5: House Rules
  liquorLicense: boolean;
  localPermits: boolean;
  hookahAllowed: boolean;
  powerBackupRating: string;
  waterSource: string;
  ecoRating: string;
  
  // Step 6: Photos
  photos: Array<{
    id: string;
    url: string;
    isHero: boolean;
    tags: string[];
    altText: string;
    type: 'exterior' | 'common' | 'room' | 'bathroom' | 'other';
  }>;
  
  // Step 7: Room Types
  roomTypes: Array<{
    id: string;
    publicName: string;
    internalCode: string;
    unitOfSale: 'room' | 'bed' | 'entire';
    occupancy: { adults: number; children: number };
    bhkLayout: string;
    bedConfig: string;
    bedCount: number;
    bathroom: {
      ensuite: boolean;
      count: number;
      amenities: string[];
    };
    sizeSqft: number;
    floor: number;
    elevatorProximity: boolean;
    view: string;
    balconyTerrace: boolean;
    climate: {
      ac: boolean;
      heating: boolean;
      fan: boolean;
    };
    work: {
      desk: boolean;
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
      tv: boolean;
      smartTv: boolean;
    };
    accessibility: {
      differentlyAbledAccess: boolean;
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
      linenPolicy: string;
    };
    images: string[];
  }>;
  
  // Step 8: Inventory (simplified for now)
  inventoryDays: number;
  
  // Step 9: Rates
  baseRates: {
    [roomTypeId: string]: {
      rate1Adult: number;
      rate2Adults: number;
      rate3Adults: number;
      extraChild: number;
      extraAdult: number;
    };
  };
  taxes: {
    gstPercent: number;
    serviceChargePercent: number;
  };
  
  // Step 10: Policies
  policyTemplate: 'Flexible' | 'Moderate' | 'Strict';
  freeCancelCutoff: number;
  earlyCheckInFee: number;
  lateCheckOutFee: number;
  idRules: string[];
  coupleFriendly: boolean;
  ageLimit: number;
  quietHours: string;
  inclusions: string[];
  addOns: Array<{ name: string; price: number }>;
  
  // Step 11: Licenses
  licenses: Array<{
    type: string;
    number: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    status: string;
    files: string[];
  }>;
}

const STEPS = [
  { id: 1, name: 'Identity', required: true },
  { id: 2, name: 'Location', required: true },
  { id: 3, name: 'Contact & Operating', required: true },
  { id: 4, name: 'Amenities', required: false },
  { id: 5, name: 'House Rules', required: false },
  { id: 6, name: 'Photos', required: true },
  { id: 7, name: 'Room Types', required: true },
  { id: 8, name: 'Inventory', required: true },
  { id: 9, name: 'Rates', required: true },
  { id: 10, name: 'Policies', required: true },
  { id: 11, name: 'Licenses', required: true },
  { id: 12, name: 'Review & Publish', required: true }
];

const CATEGORY_TAGS = ['Hotel', 'Hostel', 'Villa', 'Campsite', 'Houseboat', 'Heritage', 'Resort', 'Guest House', 'Homestay'];
const SETTING_TAGS = ['Beach access', 'Mountain', 'Jungle', 'Urban core', 'Remote', 'Riverfront', 'Forest', 'Desert'];
const VIBE_TAGS = ['Boutique', 'Backpacker', 'Luxury', 'Eco', 'Family', 'Digital nomad', 'Party', 'Wellness'];

export function PropertyStepper({ onClose, prefillVendorId }: PropertyStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    // Initialize with default values
    name: '',
    vendorId: prefillVendorId || '',
    categoryTags: [],
    settingTags: [],
    styleTier: '3 Star',
    internalSummary: '',
    vibeTags: [],
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    postcode: '',
    mapPin: { lat: 0, lng: 0 },
    landmarks: Array(7).fill(null).map(() => ({ name: '', distanceKm: 0 })),
    directions: '',
    frontDeskName: '',
    frontDeskPhone: '',
    receptionHours: '24/7',
    checkInWindow: '14:00 - 22:00',
    checkOutWindow: '08:00 - 12:00',
    curfewRules: '',
    secondaryContact: '',
    secondaryEmail: '',
    amenities: {
      wellness: [],
      foodBeverage: [],
      sharedSpaces: [],
      utilities: [],
      activities: [],
      events: [],
      petsAndSmoking: [],
      safety: [],
      custom: []
    },
    liquorLicense: false,
    localPermits: false,
    hookahAllowed: false,
    powerBackupRating: '',
    waterSource: '',
    ecoRating: '',
    photos: [],
    roomTypes: [],
    inventoryDays: 30,
    baseRates: {},
    taxes: { gstPercent: 12, serviceChargePercent: 10 },
    policyTemplate: 'Flexible',
    freeCancelCutoff: 24,
    earlyCheckInFee: 0,
    lateCheckOutFee: 0,
    idRules: [],
    coupleFriendly: true,
    ageLimit: 18,
    quietHours: '22:00 - 08:00',
    inclusions: [],
    addOns: [],
    licenses: []
  });

  const [saveStatus, setSaveStatus] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof PropertyFormData] as Record<string, unknown>),
        [field]: value
      }
    }));
  };

  const saveDraft = () => {
    setSaveStatus({ show: true, message: 'Draft saved successfully!' });
    setTimeout(() => setSaveStatus({ show: false, message: '' }), 3000);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepValidation = (stepId: number) => {
    switch (stepId) {
      case 1:
        return formData.name && formData.vendorId && formData.categoryTags.length > 0;
      case 2:
        return formData.addressLine1 && formData.city && formData.state;
      case 3:
        return formData.frontDeskName && formData.frontDeskPhone;
      case 6:
        return formData.photos.length >= 8;
      case 7:
        return formData.roomTypes.length >= 1;
      default:
        return true;
    }
  };

  const getCompletionPercentage = () => {
    const completedSteps = STEPS.filter(step => getStepValidation(step.id)).length;
    return Math.round((completedSteps / STEPS.length) * 100);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Property Identity</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Property Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter property name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vendor *
                </label>
                <select
                  required
                  value={formData.vendorId}
                  onChange={(e) => updateFormData('vendorId', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>{vendor.legalName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category Tags *
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const newTags = formData.categoryTags.includes(tag)
                        ? formData.categoryTags.filter(t => t !== tag)
                        : [...formData.categoryTags, tag];
                      updateFormData('categoryTags', newTags);
                    }}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      formData.categoryTags.includes(tag)
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Setting Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {SETTING_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const newTags = formData.settingTags.includes(tag)
                        ? formData.settingTags.filter(t => t !== tag)
                        : [...formData.settingTags, tag];
                      updateFormData('settingTags', newTags);
                    }}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      formData.settingTags.includes(tag)
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Style Tier
                </label>
                <select
                  value={formData.styleTier}
                  onChange={(e) => updateFormData('styleTier', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Budget">Budget</option>
                  <option value="3 Star">3 Star</option>
                  <option value="4 Star">4 Star</option>
                  <option value="5 Star">5 Star</option>
                  <option value="Premium">Premium</option>
                  <option value="Deluxe">Deluxe</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vibe Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {VIBE_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const newTags = formData.vibeTags.includes(tag)
                        ? formData.vibeTags.filter(t => t !== tag)
                        : [...formData.vibeTags, tag];
                      updateFormData('vibeTags', newTags);
                    }}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      formData.vibeTags.includes(tag)
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Short Internal Summary
              </label>
              <textarea
                value={formData.internalSummary}
                onChange={(e) => updateFormData('internalSummary', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-20"
                placeholder="Brief internal notes about this property"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Location Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.addressLine1}
                  onChange={(e) => updateFormData('addressLine1', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Street address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => updateFormData('addressLine2', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Apartment, suite, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => updateFormData('state', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="India">India</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Bhutan">Bhutan</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  value={formData.postcode}
                  onChange={(e) => updateFormData('postcode', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Landmarks (Name and Distance)
              </label>
              <div className="space-y-2">
                {formData.landmarks.map((landmark, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={landmark.name}
                      onChange={(e) => {
                        const newLandmarks = [...formData.landmarks];
                        newLandmarks[index] = { ...landmark, name: e.target.value };
                        updateFormData('landmarks', newLandmarks);
                      }}
                      className="col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="Landmark name"
                    />
                    <input
                      type="number"
                      value={landmark.distanceKm}
                      onChange={(e) => {
                        const newLandmarks = [...formData.landmarks];
                        newLandmarks[index] = { ...landmark, distanceKm: Number(e.target.value) };
                        updateFormData('landmarks', newLandmarks);
                      }}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="km"
                      step="0.1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Directions and Parking
              </label>
              <textarea
                value={formData.directions}
                onChange={(e) => updateFormData('directions', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-20"
                placeholder="How to reach the property and parking information"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Contact & Operating Hours</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Front Desk Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.frontDeskName}
                  onChange={(e) => updateFormData('frontDeskName', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Front Desk Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.frontDeskPhone}
                  onChange={(e) => updateFormData('frontDeskPhone', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reception Hours *
                </label>
                <input
                  type="text"
                  required
                  value={formData.receptionHours}
                  onChange={(e) => updateFormData('receptionHours', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., 24/7 or 8:00 AM - 10:00 PM"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Check-in Window *
                </label>
                <input
                  type="text"
                  required
                  value={formData.checkInWindow}
                  onChange={(e) => updateFormData('checkInWindow', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., 14:00 - 22:00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Check-out Window *
                </label>
                <input
                  type="text"
                  required
                  value={formData.checkOutWindow}
                  onChange={(e) => updateFormData('checkOutWindow', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., 08:00 - 12:00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Secondary Contact
                </label>
                <input
                  type="text"
                  value={formData.secondaryContact}
                  onChange={(e) => updateFormData('secondaryContact', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Secondary Email
                </label>
                <input
                  type="email"
                  value={formData.secondaryEmail}
                  onChange={(e) => updateFormData('secondaryEmail', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Curfew Rules
              </label>
              <textarea
                value={formData.curfewRules}
                onChange={(e) => updateFormData('curfewRules', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-20"
                placeholder="Any curfew or quiet hour rules"
              />
            </div>
          </div>
        );

      case 12:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Review & Publish</h3>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-white">Completeness</h4>
                <span className="text-2xl font-bold text-emerald-400">{getCompletionPercentage()}%</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionPercentage()}%` }}
                ></div>
              </div>

              <div className="space-y-2">
                {STEPS.slice(0, -1).map(step => {
                  const isValid = getStepValidation(step.id);
                  return (
                    <div key={step.id} className="flex items-center justify-between py-2">
                      <span className="text-gray-300">{step.name}</span>
                      <div className="flex items-center space-x-2">
                        {isValid ? (
                          <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                        )}
                        <span className={`text-sm ${isValid ? 'text-emerald-400' : 'text-yellow-400'}`}>
                          {isValid ? 'Complete' : 'Incomplete'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-medium text-white mb-4">Property Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white ml-2">{formData.name || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Vendor:</span>
                  <span className="text-white ml-2">
                    {vendors.find(v => v.id === formData.vendorId)?.legalName || 'Not selected'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white ml-2">{formData.city || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Style Tier:</span>
                  <span className="text-white ml-2">{formData.styleTier}</span>
                </div>
                <div>
                  <span className="text-gray-400">Categories:</span>
                  <span className="text-white ml-2">{formData.categoryTags.join(', ') || 'None'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Room Types:</span>
                  <span className="text-white ml-2">{formData.roomTypes.length}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setSaveStatus({ show: true, message: 'Property published to directory!' });
                  setTimeout(() => {
                    onClose();
                  }, 2000);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Publish to Directory
              </button>
              <button
                onClick={() => {
                  setSaveStatus({ show: true, message: 'Vendor invitation sent!' });
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Invite Vendor to Portal
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-4">Step {currentStep}</h3>
            <p className="text-gray-400">This step is under development.</p>
            <p className="text-gray-500 text-sm mt-2">
              Step content for {STEPS.find(s => s.id === currentStep)?.name} will be implemented here.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-semibold text-white">Add New Property</h2>
            <p className="text-gray-400 text-sm">Step {currentStep} of {STEPS.length}: {STEPS.find(s => s.id === currentStep)?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step.id === currentStep
                    ? 'bg-blue-600 text-white'
                    : step.id < currentStep
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {step.id < currentStep ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 rounded ${
                    step.id < currentStep ? 'bg-emerald-600' : 'bg-gray-600'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            {STEPS.map(step => (
              <span key={step.id} className={step.id === currentStep ? 'text-blue-400' : ''}>
                {step.name}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {saveStatus.show && (
            <div className="mb-4 p-3 bg-emerald-900/30 border border-emerald-600/30 rounded-lg">
              <p className="text-emerald-300">{saveStatus.message}</p>
            </div>
          )}
          
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="flex space-x-3">
            <button
              onClick={saveDraft}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Back</span>
            </button>
            
            <button
              onClick={nextStep}
              disabled={currentStep === STEPS.length}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}