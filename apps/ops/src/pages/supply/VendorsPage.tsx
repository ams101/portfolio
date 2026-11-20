import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVendors } from '../../data/store';
import { SERVICE_TYPES } from '../../data/opsData';
import { ServiceChip } from '../../components/ui';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';

export function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const vendors = useVendors();
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [editingVendor, setEditingVendor] = useState<string | null>(null);

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.servicedAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesType = typeFilter === 'all' || vendor.type === typeFilter;
    const matchesService = serviceFilter === 'all' || vendor.serviceTypes.includes(serviceFilter as typeof vendor.serviceTypes[number]);

    return matchesSearch && matchesStatus && matchesType && matchesService;
  });

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

  const getTypeChip = (type: string) => {
    const colors: Record<string, string> = {
      'owner': 'bg-green-900 text-green-300',
      'propertyManager': 'bg-blue-900 text-blue-300',
      'chain': 'bg-purple-900 text-purple-300',
      'aggregator': 'bg-orange-900 text-orange-300',
      'partner': 'bg-cyan-900 text-cyan-300'
    };
    return colors[type] || colors['owner'];
  };

  const statuses = ['Draft', 'Active', 'Suspended', 'Blacklisted', 'On hold', 'Under approval'];
  const types = ['owner', 'propertyManager', 'chain', 'aggregator', 'partner'];

  const handleDeleteVendor = (vendorId: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      console.log('Deleting vendor:', vendorId);
      // In a real app, this would call an API
    }
  };

  const handleEditVendor = (vendorId: string) => {
    setEditingVendor(vendorId);
  };

  const handleInviteVendor = (vendorId: string) => {
    console.log('Inviting vendor to portal:', vendorId);
    alert('Invitation sent to vendor portal!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Vendors</h1>
        <Link
          to="/supply/onboarding"
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add vendor</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All services</option>
            {SERVICE_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <div className="relative md:col-span-2">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  <Link to={`/supply/vendors/${vendor.id}`} className="hover:text-blue-400">
                    {vendor.legalName}
                  </Link>
                </h3>
                {vendor.brandName && (
                  <p className="text-gray-400 text-sm">Brand: {vendor.brandName}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {vendor.serviceTypes.map(t => <ServiceChip key={t} service={t} />)}
                  {vendor.preferred && <span className="text-xs text-emerald-300 ml-1">Preferred</span>}
                  {vendor.rating && <span className="text-xs text-gray-400 ml-1">★ {vendor.rating}</span>}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <span className={`px-2 py-1 text-xs rounded border ${getStatusChip(vendor.status)}`}>
                  {vendor.status}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${getTypeChip(vendor.type)}`}>
                  {vendor.type}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Contact</h4>
                <p className="text-sm text-gray-400">{vendor.contacts.primary.name}</p>
                <p className="text-sm text-gray-400">{vendor.contacts.primary.email}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Serviced Areas</h4>
                <div className="flex flex-wrap gap-1">
                  {vendor.servicedAreas.slice(0, 3).map(area => (
                    <span key={area} className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300">
                      {area}
                    </span>
                  ))}
                  {vendor.servicedAreas.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded bg-gray-600 text-gray-300">
                      +{vendor.servicedAreas.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Languages</h4>
                <p className="text-sm text-gray-400">
                  {vendor.languages.slice(0, 3).join(', ')}
                  {vendor.languages.length > 3 && ` +${vendor.languages.length - 3}`}
                </p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-700 flex space-x-2">
              <button
                onClick={() => handleInviteVendor(vendor.id)}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                <UserPlusIcon className="h-3 w-3" />
                <span>Invite</span>
              </button>
              <button
                onClick={() => handleEditVendor(vendor.id)}
                className="flex items-center space-x-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm transition-colors"
              >
                <PencilIcon className="h-3 w-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteVendor(vendor.id)}
                className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
              >
                <TrashIcon className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Updated {new Date(vendor.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No vendors found matching your filters.</p>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddVendor && (
        <AddVendorModal onClose={() => setShowAddVendor(false)} />
      )}
    </div>
  );
}

// Add Vendor Modal Component
function AddVendorModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    legalName: '',
    brandName: '',
    type: 'owner' as 'owner' | 'propertyManager' | 'chain' | 'aggregator' | 'partner',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    servicedAreas: '',
    languages: ''
  });

  const [saveStatus, setSaveStatus] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setSaveStatus({ show: true, message: 'Saving vendor...' });
    
    setTimeout(() => {
      setSaveStatus({ show: true, message: 'Vendor saved successfully!' });
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1000);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Add New Vendor</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {saveStatus.show && (
          <div className="mb-4 p-3 bg-emerald-900/30 border border-emerald-600/30 rounded-lg">
            <p className="text-emerald-300">{saveStatus.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Legal Name *</label>
              <input
                type="text"
                required
                value={formData.legalName}
                onChange={(e) => handleInputChange('legalName', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="Enter legal business name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="Enter brand name (optional)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Vendor Type *</label>
            <select
              required
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="owner">Owner</option>
              <option value="propertyManager">Property Manager</option>
              <option value="chain">Chain</option>
              <option value="aggregator">Aggregator</option>
              <option value="partner">Partner</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Primary Contact Name *</label>
              <input
                type="text"
                required
                value={formData.primaryContactName}
                onChange={(e) => handleInputChange('primaryContactName', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="Contact person name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Primary Contact Email *</label>
              <input
                type="email"
                required
                value={formData.primaryContactEmail}
                onChange={(e) => handleInputChange('primaryContactEmail', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Primary Contact Phone *</label>
            <input
              type="tel"
              required
              value={formData.primaryContactPhone}
              onChange={(e) => handleInputChange('primaryContactPhone', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="+91-XXXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Serviced Areas</label>
            <input
              type="text"
              value={formData.servicedAreas}
              onChange={(e) => handleInputChange('servicedAreas', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="e.g., Goa, Mumbai, Delhi (comma separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Languages</label>
            <input
              type="text"
              value={formData.languages}
              onChange={(e) => handleInputChange('languages', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="e.g., English, Hindi, Marathi (comma separated)"
            />
          </div>

          <div className="flex space-x-3 pt-6">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Save Vendor
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}