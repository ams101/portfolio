import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { roomTypes, properties } from '../../data/seedData';

export function RoomTypeEditorPage() {
  const { propertyId, roomTypeId } = useParams<{ propertyId: string; roomTypeId: string }>();
  const [saveStatus, setSaveStatus] = useState<{ show: boolean; time?: Date }>({ show: false });
  
  const property = properties.find(p => p.id === propertyId);
  const roomType = roomTypes.find(rt => rt.id === roomTypeId);

  if (!property || !roomType) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Room type not found.</p>
      </div>
    );
  }

  const handleFieldChange = () => {
    setSaveStatus({ show: true, time: new Date() });
    setTimeout(() => setSaveStatus({ show: false }), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{roomType.publicName}</h1>
          <p className="text-gray-400">{property.name} • Code: {roomType.internalCode}</p>
        </div>
        
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
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
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
                  <option value="entire">Entire Property</option>
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
          </div>

          {/* Occupancy and Bed Configuration */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Occupancy & Beds</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Adults</label>
                <input
                  type="number"
                  defaultValue={roomType.occupancy.adults}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  onChange={handleFieldChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Children</label>
                <input
                  type="number"
                  defaultValue={roomType.occupancy.children}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  onChange={handleFieldChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bed Count</label>
                <input
                  type="number"
                  defaultValue={roomType.bedCount}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  onChange={handleFieldChange}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Bed Configuration</label>
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
                  <option value="King + Sofa bed">King + Sofa bed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Extra Bed Allowed</label>
                <select
                  defaultValue={roomType.extraBed.allowed ? 'yes' : 'no'}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  onChange={handleFieldChange}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Climate and Technology */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Climate & Technology</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">Climate Control</h4>
                <div className="space-y-2">
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
                      defaultChecked={roomType.climate.heating}
                      className="rounded border-gray-600 bg-gray-700"
                      onChange={handleFieldChange}
                    />
                    <span className="text-gray-300">Heating</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked={roomType.climate.fan}
                      className="rounded border-gray-600 bg-gray-700"
                      onChange={handleFieldChange}
                    />
                    <span className="text-gray-300">Fan</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Work Setup</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked={roomType.work.desk}
                      className="rounded border-gray-600 bg-gray-700"
                      onChange={handleFieldChange}
                    />
                    <span className="text-gray-300">Desk</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked={roomType.work.chair}
                      className="rounded border-gray-600 bg-gray-700"
                      onChange={handleFieldChange}
                    />
                    <span className="text-gray-300">Chair</span>
                  </label>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">WiFi Speed (Mbps)</label>
                    <input
                      type="number"
                      defaultValue={roomType.work.wifiMbps}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white text-sm"
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Entertainment</h4>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={roomType.entertainment.tvSmart}
                    className="rounded border-gray-600 bg-gray-700"
                    onChange={handleFieldChange}
                  />
                  <span className="text-gray-300">Smart TV</span>
                </label>
              </div>
            </div>
          </div>

          {/* Special Features */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Special Features</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={roomType.special.privateJacuzzi}
                    className="rounded border-gray-600 bg-gray-700"
                    onChange={handleFieldChange}
                  />
                  <span className="text-gray-300">Private Jacuzzi</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={roomType.special.sharedJacuzzi}
                    className="rounded border-gray-600 bg-gray-700"
                    onChange={handleFieldChange}
                  />
                  <span className="text-gray-300">Shared Jacuzzi</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={roomType.special.fireplace}
                    className="rounded border-gray-600 bg-gray-700"
                    onChange={handleFieldChange}
                  />
                  <span className="text-gray-300">Fireplace</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={roomType.special.mosquitoNet}
                    className="rounded border-gray-600 bg-gray-700"
                    onChange={handleFieldChange}
                  />
                  <span className="text-gray-300">Mosquito Net</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={roomType.special.blackoutCurtains}
                    className="rounded border-gray-600 bg-gray-700"
                    onChange={handleFieldChange}
                  />
                  <span className="text-gray-300">Blackout Curtains</span>
                </label>
              </div>
            </div>
          </div>

          {/* Dorm Specifics (conditional) */}
          {roomType.unitOfSale === 'bed' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Dorm Specifics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender Policy</label>
                  <select
                    defaultValue={roomType.dormSpecifics?.genderPolicy}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    onChange={handleFieldChange}
                  >
                    <option value="mixed">Mixed</option>
                    <option value="female">Female Only</option>
                    <option value="male">Male Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Linen & Towel Policy</label>
                  <input
                    type="text"
                    defaultValue={roomType.dormSpecifics?.linenTowelPolicy}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    onChange={handleFieldChange}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={roomType.dormSpecifics?.locker}
                    className="rounded border-gray-600 bg-gray-700"
                    onChange={handleFieldChange}
                  />
                  <span className="text-gray-300">Individual Lockers Provided</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Location & View */}
        <div className="space-y-6">
          {/* Location & View */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Location & View</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Floor</label>
                <input
                  type="number"
                  defaultValue={roomType.floor}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  onChange={handleFieldChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Elevator Proximity</label>
                <select
                  defaultValue={roomType.elevatorProximity}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  onChange={handleFieldChange}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              
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
                  <option value="river">River</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Balcony/Terrace</label>
                <select
                  defaultValue={roomType.balconyOrTerrace}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  onChange={handleFieldChange}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bathroom */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Bathroom</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={roomType.bath.ensuite}
                    className="rounded border-gray-600 bg-gray-700"
                    onChange={handleFieldChange}
                  />
                  <span className="text-gray-300">Ensuite Bathroom</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bathroom Count</label>
                <input
                  type="number"
                  defaultValue={roomType.bath.count}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  onChange={handleFieldChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bath Amenities</label>
                <div className="space-y-1">
                  {roomType.bath.amenities.map((amenity, index) => (
                    <span key={index} className="inline-block px-2 py-1 text-sm bg-gray-700 text-gray-300 rounded mr-2 mb-1">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Safety & Security */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Safety & Security</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked={roomType.safety.safe}
                  className="rounded border-gray-600 bg-gray-700"
                  onChange={handleFieldChange}
                />
                <span className="text-gray-300">In-room Safe</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked={roomType.safety.smokeDetector}
                  className="rounded border-gray-600 bg-gray-700"
                  onChange={handleFieldChange}
                />
                <span className="text-gray-300">Smoke Detector</span>
              </label>
            </div>
          </div>

          {/* Accessibility */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Accessibility</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Differently Abled Access</label>
              <select
                defaultValue={roomType.accessibility.differentlyAbledAccess}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                onChange={handleFieldChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 rounded-b-lg">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">Changes are auto-saved as you type</p>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}