import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { properties, roomTypes, ratePlans } from '../../data/seedData';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

export function RatesPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAddOverride, setShowAddOverride] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ show: boolean; time?: Date }>({ show: false });
  
  const property = properties.find(p => p.id === id);
  const roomTypeId = searchParams.get('roomType');
  const propertyRoomTypes = roomTypes.filter(rt => rt.propertyId === id);
  const selectedRoomType = roomTypeId ? roomTypes.find(rt => rt.id === roomTypeId) : propertyRoomTypes[0];
  const ratePlan = selectedRoomType ? ratePlans.find(rp => rp.roomTypeId === selectedRoomType.id) : null;

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Property not found.</p>
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
          <h1 className="text-2xl font-bold text-white">Rates & Pricing</h1>
          <p className="text-gray-400">{property.name}</p>
        </div>
        
        <div className="flex items-center space-x-4">
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
          
          <select
            value={selectedRoomType?.id || ''}
            onChange={(e) => setSearchParams({ roomType: e.target.value })}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            {propertyRoomTypes.map(rt => (
              <option key={rt.id} value={rt.id}>{rt.publicName}</option>
            ))}
          </select>
        </div>
      </div>

      {ratePlan && selectedRoomType && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Rates Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Base Rates */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Base Rates</h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">1 Adult</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      defaultValue={ratePlan.base.rate1Adult}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 pr-3 py-2 text-white"
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">2 Adults</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      defaultValue={ratePlan.base.rate2Adults}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 pr-3 py-2 text-white"
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">3 Adults</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      defaultValue={ratePlan.base.rate3Adults}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 pr-3 py-2 text-white"
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Extra Child</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      defaultValue={ratePlan.base.extraChild}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 pr-3 py-2 text-white"
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Extra Adult</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      defaultValue={ratePlan.base.extraAdult}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 pr-3 py-2 text-white"
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Taxes */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Taxes & Charges</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">GST (%)</label>
                  <input
                    type="number"
                    defaultValue={ratePlan.base.taxes.gstPercent}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    step="0.1"
                    onChange={handleFieldChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Service Charge (%)</label>
                  <input
                    type="number"
                    defaultValue={ratePlan.base.taxes.serviceChargePercent}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    step="0.1"
                    onChange={handleFieldChange}
                  />
                </div>
              </div>
            </div>

            {/* Rate Overrides */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Rate Overrides</h3>
                  <button
                    onClick={() => setShowAddOverride(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Override</span>
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-2">Special pricing for specific date ranges</p>
              </div>
              
              <div className="divide-y divide-gray-700">
                {ratePlan.overrides.map((override, index) => (
                  <div key={index} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-white font-medium">
                          {format(parseISO(override.startDate), 'MMM d')} - {format(parseISO(override.endDate), 'MMM d, yyyy')}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Override #{index + 1}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-700 transition-colors">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">1 Adult</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₹</span>
                          <input
                            type="number"
                            defaultValue={override.rate1Adult}
                            className="w-full bg-gray-700 border border-gray-600 rounded pl-6 pr-2 py-1 text-white text-sm"
                            onChange={handleFieldChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">2 Adults</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₹</span>
                          <input
                            type="number"
                            defaultValue={override.rate2Adults}
                            className="w-full bg-gray-700 border border-gray-600 rounded pl-6 pr-2 py-1 text-white text-sm"
                            onChange={handleFieldChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">3 Adults</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₹</span>
                          <input
                            type="number"
                            defaultValue={override.rate3Adults}
                            className="w-full bg-gray-700 border border-gray-600 rounded pl-6 pr-2 py-1 text-white text-sm"
                            onChange={handleFieldChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Extra Child</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₹</span>
                          <input
                            type="number"
                            defaultValue={override.extraChild}
                            className="w-full bg-gray-700 border border-gray-600 rounded pl-6 pr-2 py-1 text-white text-sm"
                            onChange={handleFieldChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Extra Adult</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₹</span>
                          <input
                            type="number"
                            defaultValue={override.extraAdult}
                            className="w-full bg-gray-700 border border-gray-600 rounded pl-6 pr-2 py-1 text-white text-sm"
                            onChange={handleFieldChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Rate Calculator & Info */}
          <div className="space-y-6">
            {/* Rate Calculator */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Rate Calculator</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Occupancy</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
                    <option>1 Adult</option>
                    <option>2 Adults</option>
                    <option>3 Adults</option>
                    <option>2 Adults + 1 Child</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Check Date</label>
                  <input
                    type="date"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Base Rate:</span>
                      <span className="text-white">₹{ratePlan.base.rate2Adults}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">GST ({ratePlan.base.taxes.gstPercent}%):</span>
                      <span className="text-white">₹{Math.round(ratePlan.base.rate2Adults * ratePlan.base.taxes.gstPercent / 100)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Service Charge ({ratePlan.base.taxes.serviceChargePercent}%):</span>
                      <span className="text-white">₹{Math.round(ratePlan.base.rate2Adults * ratePlan.base.taxes.serviceChargePercent / 100)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-gray-600 pt-2">
                      <span className="text-white">Total:</span>
                      <span className="text-emerald-400">
                        ₹{Math.round(ratePlan.base.rate2Adults * (1 + (ratePlan.base.taxes.gstPercent + ratePlan.base.taxes.serviceChargePercent) / 100))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Strategy */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pricing Strategy</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Competitive Rate:</span>
                  <span className="text-yellow-400">₹{ratePlan.base.rate2Adults - 200}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Your Rate:</span>
                  <span className="text-white">₹{ratePlan.base.rate2Adults}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Premium Rate:</span>
                  <span className="text-emerald-400">₹{ratePlan.base.rate2Adults + 300}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-600/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  💡 Consider dynamic pricing based on demand and local events for better revenue optimization.
                </p>
              </div>
            </div>

            {/* Recent Changes */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Changes</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Base rates updated</p>
                    <p className="text-gray-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Override added for weekend</p>
                    <p className="text-gray-400 text-xs">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">GST rate changed</p>
                    <p className="text-gray-400 text-xs">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Override Modal */}
      {showAddOverride && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add Rate Override</h3>
              <button
                onClick={() => setShowAddOverride(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Override Reason</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Peak Season</option>
                  <option>Festival Period</option>
                  <option>Event in City</option>
                  <option>Last Minute Deal</option>
                  <option>Custom</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddOverride(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Override
                </button>
                <button
                  onClick={() => setShowAddOverride(false)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}