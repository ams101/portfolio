import React from 'react';
import { RoomType, InventoryDay, RatePlan, MediaAsset } from '../types';
import { 
  CalendarDaysIcon, 
  CurrencyDollarIcon, 
  PencilIcon, 
  PhotoIcon,
  UserGroupIcon,
  HomeIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface RoomTypeInspectorProps {
  roomTypes: RoomType[];
  inventoryDays: InventoryDay[];
  ratePlans: RatePlan[];
  mediaAssets: MediaAsset[];
  onOpenCalendar: (roomTypeId: string) => void;
  onEditRates: (roomTypeId: string) => void;
  onEditDetails: (roomTypeId: string) => void;
  onOpenGallery: (roomTypeId: string) => void;
}

interface RoomTypeInspectorCardProps {
  roomType: RoomType;
  priceBand: { min: number; max: number };
  coverage: number;
  photoCount: number;
  onOpenCalendar: () => void;
  onEditRates: () => void;
  onEditDetails: () => void;
  onOpenGallery: () => void;
}

// Utility functions
export const getPriceBand = (
  roomTypeId: string, 
  inventoryDays: InventoryDay[], 
  ratePlans: RatePlan[], 
  fromDate = new Date(), 
  days = 30
): { min: number; max: number } => {
  const ratePlan = ratePlans.find(rp => rp.roomTypeId === roomTypeId);
  if (!ratePlan) return { min: 0, max: 0 };

  const prices: number[] = [];
  const endDate = new Date(fromDate);
  endDate.setDate(endDate.getDate() + days);

  // Get base rates
  prices.push(ratePlan.base.rate1Adult, ratePlan.base.rate2Adults, ratePlan.base.rate3Adults);

  // Get override rates
  ratePlan.overrides.forEach(override => {
    const overrideStart = new Date(override.startDate);
    const overrideEnd = new Date(override.endDate);
    
    if (overrideStart <= endDate && overrideEnd >= fromDate) {
      prices.push(override.rate1Adult, override.rate2Adults, override.rate3Adults);
    }
  });

  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

export const getCoverage = (
  roomTypeId: string, 
  inventoryDays: InventoryDay[], 
  days = 90
): number => {
  const roomInventory = inventoryDays.filter(inv => inv.roomTypeId === roomTypeId);
  const openDays = roomInventory.filter(inv => inv.status === 'Open').length;
  return Math.round((openDays / Math.min(days, roomInventory.length)) * 100);
};

export const getPhotoCount = (
  roomTypeId: string, 
  mediaAssets: MediaAsset[]
): number => {
  return mediaAssets.filter(asset => asset.roomTypeId === roomTypeId).length;
};

function RoomTypeInspectorCard({
  roomType,
  priceBand,
  coverage,
  photoCount,
  onOpenCalendar,
  onEditRates,
  onEditDetails,
  onOpenGallery
}: RoomTypeInspectorCardProps) {
  const getUnitChip = (unit: string) => {
    const colors: Record<string, string> = {
      'room': 'bg-blue-900 text-blue-300',
      'bed': 'bg-purple-900 text-purple-300',
      'entire': 'bg-green-900 text-green-300'
    };
    return colors[unit] || colors['room'];
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return 'text-emerald-400';
    if (coverage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{roomType.publicName}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>{roomType.internalCode}</span>
            <span>•</span>
            <span>Floor {roomType.floor}</span>
            <span>•</span>
            <span>{roomType.sizeSqft} sq ft</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-bold">₹{priceBand.min}–₹{priceBand.max}</div>
          <div className="text-xs text-gray-400">per night</div>
          <div className="text-xs text-gray-500">prices vary by dates</div>
        </div>
      </div>

      {/* Key Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 text-xs rounded ${getUnitChip(roomType.unitOfSale)}`}>
          {roomType.unitOfSale}
        </span>
        
        {roomType.bath.ensuite && (
          <span className="px-2 py-1 text-xs rounded bg-cyan-900 text-cyan-300">Ensuite</span>
        )}
        
        {roomType.balconyOrTerrace === 'Yes' && (
          <span className="px-2 py-1 text-xs rounded bg-green-900 text-green-300">Balcony</span>
        )}
        
        <span className="px-2 py-1 text-xs rounded bg-indigo-900 text-indigo-300">
          {roomType.view} view
        </span>
        
        {roomType.climate.ac && (
          <span className="px-2 py-1 text-xs rounded bg-blue-900 text-blue-300">AC</span>
        )}
        
        {roomType.climate.heating && (
          <span className="px-2 py-1 text-xs rounded bg-red-900 text-red-300">Heating</span>
        )}
        
        {roomType.work.desk && (
          <span className="px-2 py-1 text-xs rounded bg-purple-900 text-purple-300">Desk</span>
        )}
        
        {roomType.work.wifiMbps > 0 && (
          <span className="px-2 py-1 text-xs rounded bg-yellow-900 text-yellow-300">
            WiFi {roomType.work.wifiMbps}Mbps
          </span>
        )}
        
        {roomType.dormSpecifics && (
          <span className="px-2 py-1 text-xs rounded bg-pink-900 text-pink-300">
            {roomType.dormSpecifics.genderPolicy} dorm
          </span>
        )}
        
        {roomType.accessibility.differentlyAbledAccess === 'Yes' && (
          <span className="px-2 py-1 text-xs rounded bg-emerald-900 text-emerald-300">Accessible</span>
        )}
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-400">Occupancy:</span>
          <span className="text-white ml-2">
            {roomType.occupancy.adults}A
            {roomType.occupancy.children > 0 && `+${roomType.occupancy.children}C`}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Bed:</span>
          <span className="text-white ml-2">{roomType.bedConfig}</span>
        </div>
        <div>
          <span className="text-gray-400">Elevator:</span>
          <span className="text-white ml-2">{roomType.elevatorProximity}</span>
        </div>
        <div>
          <span className="text-gray-400">Bathroom:</span>
          <span className="text-white ml-2">{roomType.bath.count} {roomType.bath.ensuite ? 'ensuite' : 'shared'}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center space-x-4 mb-4 text-sm">
        <div className="flex items-center space-x-1">
          <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
          <span className={`font-medium ${getCoverageColor(coverage)}`}>
            {coverage}% open
          </span>
          <span className="text-gray-400">(90d)</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
          <span className="text-emerald-400 font-medium">Rate set</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <PhotoIcon className="h-4 w-4 text-gray-400" />
          <span className="text-white font-medium">{photoCount}</span>
          <span className="text-gray-400">photos</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={onOpenCalendar}
          className="flex items-center space-x-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
        >
          <CalendarDaysIcon className="h-4 w-4" />
          <span>Calendar</span>
        </button>
        
        <button
          onClick={onEditRates}
          className="flex items-center space-x-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition-colors"
        >
          <CurrencyDollarIcon className="h-4 w-4" />
          <span>Rates</span>
        </button>
        
        <button
          onClick={onEditDetails}
          className="flex items-center space-x-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors"
        >
          <PencilIcon className="h-4 w-4" />
          <span>Edit</span>
        </button>
        
        <button
          onClick={onOpenGallery}
          className="flex items-center space-x-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
        >
          <PhotoIcon className="h-4 w-4" />
          <span>Gallery</span>
        </button>
      </div>
    </div>
  );
}

export function RoomTypeInspector({
  roomTypes,
  inventoryDays,
  ratePlans,
  mediaAssets,
  onOpenCalendar,
  onEditRates,
  onEditDetails,
  onOpenGallery
}: RoomTypeInspectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Room Types & Pricing</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <UserGroupIcon className="h-4 w-4" />
          <span>{roomTypes.length} room types</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roomTypes.map(roomType => {
          const priceBand = getPriceBand(roomType.id, inventoryDays, ratePlans);
          const coverage = getCoverage(roomType.id, inventoryDays);
          const photoCount = getPhotoCount(roomType.id, mediaAssets);
          
          return (
            <RoomTypeInspectorCard
              key={roomType.id}
              roomType={roomType}
              priceBand={priceBand}
              coverage={coverage}
              photoCount={photoCount}
              onOpenCalendar={() => onOpenCalendar(roomType.id)}
              onEditRates={() => onEditRates(roomType.id)}
              onEditDetails={() => onEditDetails(roomType.id)}
              onOpenGallery={() => onOpenGallery(roomType.id)}
            />
          );
        })}
      </div>
    </div>
  );
}