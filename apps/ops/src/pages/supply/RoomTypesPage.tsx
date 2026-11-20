import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { roomTypes, properties } from '../../data/seedData';
import { PlusIcon } from '@heroicons/react/24/outline';

export function RoomTypesPage() {
  const { id: propertyId } = useParams<{ id: string }>();
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  
  const property = properties.find(p => p.id === propertyId);
  const propertyRoomTypes = roomTypes.filter(rt => rt.propertyId === propertyId);

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Property not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Room Types</h1>
          <p className="text-gray-400">{property.name}</p>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
          <PlusIcon className="h-4 w-4" />
          <span>Add Room Type</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Room Types List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white">Room Types ({propertyRoomTypes.length})</h3>
            </div>
            <div className="divide-y divide-gray-700">
              {propertyRoomTypes.map(roomType => (
                <button
                  key={roomType.id}
                  onClick={() => setSelectedRoomType(roomType.id)}
                  className={`w-full text-left p-4 hover:bg-gray-700/50 transition-colors ${
                    selectedRoomType === roomType.id ? 'bg-gray-700 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="text-white font-medium">{roomType.publicName}</div>
                  <div className="text-gray-400 text-sm">{roomType.internalCode}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      roomType.unitOfSale === 'room' ? 'bg-blue-900 text-blue-300' :
                      roomType.unitOfSale === 'bed' ? 'bg-purple-900 text-purple-300' :
                      'bg-green-900 text-green-300'
                    }`}>
                      {roomType.unitOfSale}
                    </span>
                    <span className="text-gray-400 text-xs">{roomType.sizeSqft} sq ft</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Room Type Details */}
        <div className="lg:col-span-3">
          {selectedRoomType ? (
            <RoomTypeEditor roomTypeId={selectedRoomType} />
          ) : (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
              <p className="text-gray-400">Select a room type to view and edit its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RoomTypeEditor({ roomTypeId }: { roomTypeId: string }) {
  const [saveStatus, setSaveStatus] = useState<{ show: boolean; time?: Date }>({ show: false });
  const roomType = roomTypes.find(rt => rt.id === roomTypeId);

  if (!roomType) return null;

  const handleFieldChange = () => {
    setSaveStatus({ show: true, time: new Date() });
    setTimeout(() => setSaveStatus({ show: false }), 3000);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 rounded-t-lg z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{roomType.publicName}</h3>
            <p className="text-gray-400 text-sm">Code: {roomType.internalCode}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {saveStatus.show && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-900 text-emerald-300 rounded-lg">
                <span className="text-sm">✓ Saved</span>
                {saveStatus.time && (
                  <span className="text-xs text-emerald-400">
                    {saveStatus.time.toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
            
            <Link
              to={`/supply/properties/${roomType.propertyId}/room-types/${roomType.id}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Full Editor
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Public Name</label>
            <input
              type="text"
              defaultValue={roomType.publicName}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              onChange={handleFieldChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Internal Code</label>
            <input
              type="text"
              defaultValue={roomType.internalCode}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              onChange={handleFieldChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Unit of Sale</label>
            <select
              defaultValue={roomType.unitOfSale}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              onChange={handleFieldChange}
            >
              <option value="room">Room</option>
              <option value="bed">Bed</option>
              <option value="entire">Entire</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Size (sq ft)</label>
            <input
              type="number"
              defaultValue={roomType.sizeSqft}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              onChange={handleFieldChange}
            />
          </div>
        </div>

        {/* Occupancy */}
        <div>
          <h4 className="text-white font-medium mb-3">Occupancy</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Adults</label>
              <input
                type="number"
                defaultValue={roomType.occupancy.adults}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                onChange={handleFieldChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Children</label>
              <input
                type="number"
                defaultValue={roomType.occupancy.children}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                onChange={handleFieldChange}
              />
            </div>
          </div>
        </div>

        {/* Bed Configuration */}
        <div>
          <h4 className="text-white font-medium mb-3">Bed Configuration</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bed Type</label>
              <select
                defaultValue={roomType.bedConfig}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                onChange={handleFieldChange}
              >
                <option value="King">King</option>
                <option value="Queen">Queen</option>
                <option value="Twin">Twin</option>
                <option value="Bunk">Bunk</option>
                <option value="Tatami">Tatami</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bed Count</label>
              <input
                type="number"
                defaultValue={roomType.bedCount}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                onChange={handleFieldChange}
              />
            </div>
          </div>
        </div>

        {/* Amenities Checkboxes */}
        <div>
          <h4 className="text-white font-medium mb-3">Amenities</h4>
          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked={roomType.climate.ac}
                className="rounded border-gray-600 bg-gray-700"
                onChange={handleFieldChange}
              />
              <span className="text-gray-300">Air Conditioning</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked={roomType.balconyOrTerrace === 'Yes'}
                className="rounded border-gray-600 bg-gray-700"
                onChange={handleFieldChange}
              />
              <span className="text-gray-300">Balcony/Terrace</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked={roomType.work.desk}
                className="rounded border-gray-600 bg-gray-700"
                onChange={handleFieldChange}
              />
              <span className="text-gray-300">Work Desk</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked={roomType.safety.safe}
                className="rounded border-gray-600 bg-gray-700"
                onChange={handleFieldChange}
              />
              <span className="text-gray-300">Safe</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked={roomType.entertainment.tvSmart}
                className="rounded border-gray-600 bg-gray-700"
                onChange={handleFieldChange}
              />
              <span className="text-gray-300">Smart TV</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked={roomType.kitchenette.fridge}
                className="rounded border-gray-600 bg-gray-700"
                onChange={handleFieldChange}
              />
              <span className="text-gray-300">Mini Fridge</span>
            </label>
          </div>
        </div>

        {/* View and Location */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">View</label>
            <select
              defaultValue={roomType.view}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              onChange={handleFieldChange}
            >
              <option value="sea">Sea</option>
              <option value="mountain">Mountain</option>
              <option value="city">City</option>
              <option value="forest">Forest</option>
              <option value="garden">Garden</option>
              <option value="pool">Pool</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Floor</label>
            <input
              type="number"
              defaultValue={roomType.floor}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              onChange={handleFieldChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}