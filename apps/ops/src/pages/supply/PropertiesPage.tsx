import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { properties, vendors, mediaAssets } from '../../data/seedData';
import { MagnifyingGlassIcon, EllipsisVerticalIcon, PhotoIcon, EyeIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PropertyStepper } from '../../components/PropertyStepper';

export function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [styleTierFilter, setStyleTierFilter] = useState('all');
  const [groupByVendor, setGroupByVendor] = useState(false);
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);
  const [imageGalleryOpen, setImageGalleryOpen] = useState<{ propertyId: string; imageIndex: number } | null>(null);
  const [showPropertyStepper, setShowPropertyStepper] = useState(false);
  const [editingProperty, setEditingProperty] = useState<string | null>(null);

  const filteredProperties = properties.filter(property => {
    const vendor = vendors.find(v => v.id === property.vendorId);
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor?.legalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.docsStatus === statusFilter;
    const matchesCity = cityFilter === 'all' || property.city === cityFilter;
    const matchesCategory = categoryFilter === 'all' || property.category.some(cat => cat.includes(categoryFilter));
    const matchesStyleTier = styleTierFilter === 'all' || property.styleTier === styleTierFilter;
    
    return matchesSearch && matchesStatus && matchesCity && matchesCategory && matchesStyleTier;
  });

  const getStatusChip = (status: string) => {
    const colors: Record<string, string> = {
      'OK': 'bg-emerald-900 text-emerald-300 border-emerald-600',
      'Needs review': 'bg-yellow-900 text-yellow-300 border-yellow-600',
      'Expired': 'bg-red-900 text-red-300 border-red-600'
    };
    return colors[status] || colors['OK'];
  };

  const cities = [...new Set(properties.map(p => p.city))];
  const categories = ['Hotel', 'Hostel', 'Guest House', 'Homestay', 'Villa', 'Resort'];
  const styleTiers = ['3 Star', '4 Star', '5 Star', 'Premium', 'Deluxe', 'Budget'];

  const getPropertyImages = (propertyId: string) => {
    return mediaAssets.filter(asset => asset.propertyId === propertyId);
  };

  const togglePropertyExpansion = (propertyId: string) => {
    setExpandedProperty(expandedProperty === propertyId ? null : propertyId);
  };

  const openImageGallery = (propertyId: string, imageIndex: number = 0) => {
    setImageGalleryOpen({ propertyId, imageIndex });
  };

  const closeImageGallery = () => {
    setImageGalleryOpen(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!imageGalleryOpen) return;
    
    const images = getPropertyImages(imageGalleryOpen.propertyId);
    const currentIndex = imageGalleryOpen.imageIndex;
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    } else {
      newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    }
    
    setImageGalleryOpen({ ...imageGalleryOpen, imageIndex: newIndex });
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      // In a real app, this would call an API
      console.log('Deleting property:', propertyId);
      // Remove from local state or refresh data
    }
  };

  const handleEditProperty = (propertyId: string) => {
    setEditingProperty(propertyId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Properties</h1>
        <button 
          onClick={() => setShowPropertyStepper(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Status</option>
            <option value="OK">OK</option>
            <option value="Needs review">Needs review</option>
            <option value="Expired">Expired</option>
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={styleTierFilter}
            onChange={(e) => setStyleTierFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Style Tiers</option>
            {styleTiers.map(tier => (
              <option key={tier} value={tier}>{tier}</option>
            ))}
          </select>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder-gray-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="groupByVendor"
              checked={groupByVendor}
              onChange={(e) => setGroupByVendor(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700"
            />
            <label htmlFor="groupByVendor" className="text-sm text-white">Group by Vendor</label>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Images</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Vendor</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Style</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Docs</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Updated</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProperties.map((property) => {
                const vendor = vendors.find(v => v.id === property.vendorId);
                const propertyImages = getPropertyImages(property.id);
                const isExpanded = expandedProperty === property.id;
                return (
                  <React.Fragment key={property.id}>
                    <tr className="hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-white font-medium">
                            <Link 
                              to={`/property/${property.id}`}
                              className="hover:text-blue-400 transition-colors"
                            >
                              {property.name}
                            </Link>
                          </div>
                          <div className="text-gray-400 text-sm">{property.city}, {property.country}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {propertyImages.length > 0 ? (
                            <div className="flex -space-x-2">
                              {propertyImages.slice(0, 3).map((image, index) => (
                                <button
                                  key={image.id}
                                  onClick={() => openImageGallery(property.id, index)}
                                  className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover hover:scale-110 transition-transform cursor-pointer"
                                  style={{ zIndex: 3 - index }}
                                >
                                  <img
                                    src={image.url}
                                    alt=""
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                </button>
                              ))}
                              {propertyImages.length > 3 && (
                                <button
                                  onClick={() => openImageGallery(property.id, 3)}
                                  className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-xs text-gray-300 hover:bg-gray-600 transition-colors"
                                >
                                  +{propertyImages.length - 3}
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                              <PhotoIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <span className="text-gray-400 text-sm">
                            {propertyImages.length} images
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        <Link to={`/supply/vendors/${vendor?.id}`} className="hover:text-blue-400">
                          {vendor?.legalName || 'Unknown'}
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {property.category.slice(0, 2).map(cat => (
                            <span key={cat} className="px-2 py-1 text-xs rounded bg-blue-900 text-blue-300">
                              {cat}
                            </span>
                          ))}
                          {property.category.length > 2 && (
                            <span className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300">
                              +{property.category.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 text-xs rounded bg-purple-900 text-purple-300 border border-purple-600">
                          {property.styleTier}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 text-xs rounded border ${getStatusChip(property.docsStatus)}`}>
                          {property.docsStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-sm">
                        {new Date(property.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => togglePropertyExpansion(property.id)}
                            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                          >
                            <EyeIcon className="h-4 w-4" />
                            <span>View Inventory</span>
                          </button>
                          <button
                            onClick={() => handleEditProperty(property.id)}
                            className="text-emerald-400 hover:text-emerald-300 text-sm"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Inventory Row - Image-First Design */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={8} className="px-6 py-6 bg-gray-900/50">
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-semibold text-white">Property Inventory - {property.name}</h4>
                              <button
                                onClick={() => setExpandedProperty(null)}
                                className="text-gray-400 hover:text-white text-sm px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                Close
                              </button>
                            </div>
                            
                            {/* Large Image Gallery - Primary Focus */}
                            {propertyImages.length > 0 ? (
                              <div className="space-y-4">
                                <h5 className="text-lg font-medium text-white">Property Images ({propertyImages.length})</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {propertyImages.map((image, index) => (
                                    <div key={image.id} className="relative group cursor-pointer" onClick={() => openImageGallery(property.id, index)}>
                                      <img
                                        src={image.url}
                                        alt=""
                                        className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                                      />
                                      {image.isHero && (
                                        <div className="absolute top-3 left-3">
                                          <span className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-full font-medium">Hero Image</span>
                                        </div>
                                      )}
                                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex flex-wrap gap-2">
                                          {image.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 text-xs bg-gray-800/80 text-gray-200 rounded">
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-12 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
                                <PhotoIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg mb-2">No images uploaded for this property</p>
                                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                                  Upload Images
                                </button>
                              </div>
                            )}
                            
                            {/* Property Details - Secondary Information */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-700">
                              <div className="bg-gray-800 rounded-lg p-4">
                                <h5 className="text-white font-medium mb-3">Amenities</h5>
                                <div className="flex flex-wrap gap-2">
                                  {property.amenities.map(amenity => (
                                    <span key={amenity} className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-full">
                                      {amenity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="bg-gray-800 rounded-lg p-4">
                                <h5 className="text-white font-medium mb-3">Setting & Location</h5>
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-2">
                                    {property.settingTags.map(tag => (
                                      <span key={tag} className="px-3 py-1 text-sm bg-green-900 text-green-300 rounded-full">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-gray-400 text-sm mt-2">{property.address}</p>
                                </div>
                              </div>
                              
                              <div className="bg-gray-800 rounded-lg p-4">
                                <h5 className="text-white font-medium mb-3">Contact & Rules</h5>
                                <div className="space-y-2 text-sm">
                                  <p className="text-gray-300">Contact: {property.houseRules.contactName}</p>
                                  <p className="text-gray-300">Phone: {property.houseRules.contactPhone}</p>
                                  <p className="text-gray-300">Reception: {property.houseRules.receptionHours}</p>
                                  {property.houseRules.curfew && (
                                    <p className="text-gray-300">Curfew: {property.houseRules.curfew}</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 pt-4 border-t border-gray-700">
                              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                Edit Property
                              </button>
                              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                                Upload More Images
                              </button>
                              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                                Manage Inventory
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No properties found matching your filters.</p>
        </div>
      )}

      {/* Image Gallery Modal */}
      {imageGalleryOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative max-w-6xl max-h-full p-4">
            <button
              onClick={closeImageGallery}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
            
            {(() => {
              const images = getPropertyImages(imageGalleryOpen.propertyId);
              const currentImage = images[imageGalleryOpen.imageIndex];
              const property = properties.find(p => p.id === imageGalleryOpen.propertyId);
              
              return (
                <div className="text-center">
                  <img
                    src={currentImage?.url}
                    alt=""
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                  <div className="mt-4 text-white">
                    <h3 className="text-xl font-semibold">{property?.name}</h3>
                    <p className="text-gray-300">Image {imageGalleryOpen.imageIndex + 1} of {images.length}</p>
                    {currentImage?.tags && (
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {currentImage.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 text-sm bg-gray-800 text-gray-200 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Property Stepper */}
      {showPropertyStepper && (
        <PropertyStepper onClose={() => setShowPropertyStepper(false)} />
      )}
    </div>
  );
}
