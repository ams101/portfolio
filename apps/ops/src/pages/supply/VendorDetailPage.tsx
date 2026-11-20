import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { properties } from '../../data/seedData';
import { useVendors } from '../../data/store';
import { PlusIcon, UserPlusIcon, LinkIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { PropertyStepper } from '../../components/PropertyStepper';

export function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [saveStatus, setSaveStatus] = useState<{ show: boolean; time?: Date }>({ show: false });
  const [showPropertyStepper, setShowPropertyStepper] = useState(false);
  
  const vendors = useVendors();
  const vendor = vendors.find(v => v.id === id);
  const vendorProperties = properties.filter(p => p.vendorId === id);

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Vendor not found.</p>
      </div>
    );
  }

  const handleFieldChange = () => {
    setSaveStatus({ show: true, time: new Date() });
    setTimeout(() => setSaveStatus({ show: false }), 3000);
  };

  const handleInviteToPortal = () => {
    alert(`Invitation sent to ${vendor.contacts.primary.email}!`);
  };

  const handleAddProperty = () => {
    setShowPropertyStepper(true);
  };

  const handleMergeVendor = () => {
    if (confirm('Are you sure you want to merge this vendor?')) {
      alert('Merge vendor functionality would be implemented here');
    }
  };

  const handleSuspendVendor = () => {
    if (confirm('Are you sure you want to suspend this vendor?')) {
      alert('Vendor suspended successfully');
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      console.log('Deleting property:', propertyId);
    }
  };

  const getStatusChip = (status: string) => {
    const colors: Record<string, string> = {
      'Active': 'bg-emerald-900 text-emerald-300 border-emerald-600',
      'Draft': 'bg-gray-600 text-gray-300 border-gray-500',
      'Suspended': 'bg-orange-900 text-orange-300 border-orange-600',
      'Blacklisted': 'bg-red-900 text-red-300 border-red-600',
      'On hold': 'bg-yellow-900 text-yellow-300 border-yellow-600',
      'Under approval': 'bg-blue-900 text-blue-300 border-blue-600'
    };
    return colors[status] || colors['Draft'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{vendor.legalName}</h1>
          {vendor.brandName && (
            <p className="text-gray-400">Brand: {vendor.brandName}</p>
          )}
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
          
          <button 
            onClick={handleInviteToPortal}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <UserPlusIcon className="h-4 w-4" />
            <span>Invite to Portal</span>
          </button>
          
          <button 
            onClick={handleAddProperty}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Property</span>
          </button>
          
          <button 
            onClick={handleMergeVendor}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <LinkIcon className="h-4 w-4" />
            <span>Merge</span>
          </button>
          
          <button 
            onClick={handleSuspendVendor}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <span>Suspend</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Vendor Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <span className={`px-3 py-1 text-sm rounded border ${getStatusChip(vendor.status)}`}>
                  {vendor.status}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  defaultValue={vendor.type}
                  onChange={handleFieldChange}
                >
                  <option value="owner">Owner</option>
                  <option value="propertyManager">Property Manager</option>
                  <option value="chain">Chain</option>
                  <option value="aggregator">Aggregator</option>
                  <option value="partner">Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Serviced Areas</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {vendor.servicedAreas.map(area => (
                    <span key={area} className="px-2 py-1 text-sm bg-blue-900 text-blue-300 rounded">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {vendor.languages.map(lang => (
                    <span key={lang} className="px-2 py-1 text-sm bg-purple-900 text-purple-300 rounded">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Primary Contact</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    defaultValue={vendor.contacts.primary.name}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="Name"
                    onChange={handleFieldChange}
                  />
                  <input
                    type="email"
                    defaultValue={vendor.contacts.primary.email}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="Email"
                    onChange={handleFieldChange}
                  />
                  <input
                    type="tel"
                    defaultValue={vendor.contacts.primary.phone}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="Phone"
                    onChange={handleFieldChange}
                  />
                </div>
              </div>

              {vendor.contacts.backup && (
                <div>
                  <h4 className="font-medium text-gray-300 mb-2">Backup Contact</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      defaultValue={vendor.contacts.backup.name}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Name"
                      onChange={handleFieldChange}
                    />
                    <input
                      type="email"
                      defaultValue={vendor.contacts.backup.email}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Email"
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payout Information */}
          {vendor.payout && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Payout Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Method</label>
                  <p className="text-white">{vendor.payout.method}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Beneficiary</label>
                  <p className="text-white">{vendor.payout.beneficiary}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tax ID</label>
                  <p className="text-white">{vendor.payout.taxId}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Properties and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Properties Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Properties ({vendorProperties.length})</h3>
                <button 
                  onClick={handleAddProperty}
                  className="flex items-center space-x-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Property</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase">Name</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase">City</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase">Docs</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {vendorProperties.map(property => (
                    <tr key={property.id} className="hover:bg-gray-700/50">
                      <td className="py-3 px-6 text-white">{property.name}</td>
                      <td className="py-3 px-6 text-gray-300">{property.city}</td>
                      <td className="py-3 px-6">
                        <span className={`px-2 py-1 text-xs rounded ${
                          property.docsStatus === 'OK' ? 'bg-emerald-900 text-emerald-300' :
                          property.docsStatus === 'Needs review' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {property.docsStatus}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center space-x-3">
                          <Link to={`/supply/properties/${property.id}`} className="text-blue-400 hover:text-blue-300" aria-label={`View ${property.name}`}>
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-400 hover:text-red-300"
                            aria-label={`Remove ${property.name}`}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
            <textarea
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-24"
              placeholder="Add notes about this vendor..."
              defaultValue={vendor.notes}
              onChange={handleFieldChange}
            />
            <div className="mt-3 flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                Save Notes
              </button>
              <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors">
                Clear
              </button>
            </div>
          </div>

          {/* Recent Changes */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Changes</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Contact information updated</p>
                  <p className="text-gray-400 text-xs">2 days ago by Admin</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">New property added: {vendorProperties[0]?.name}</p>
                  <p className="text-gray-400 text-xs">1 week ago by System</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Status changed to {vendor.status}</p>
                  <p className="text-gray-400 text-xs">2 weeks ago by Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Stepper */}
      {showPropertyStepper && (
        <PropertyStepper 
          onClose={() => setShowPropertyStepper(false)} 
          prefillVendorId={vendor.id}
        />
      )}
    </div>
  );
}