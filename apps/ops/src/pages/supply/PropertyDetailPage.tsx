import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { properties, vendors, roomTypes, mediaAssets, ratePlans, inventoryDays, licenses } from '../../data/seedData';
import { RoomTypeInspector } from '../../components/RoomTypeInspector';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  StarIcon, 
  MapPinIcon, 
  PencilIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  TagIcon,
  HeartIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { format, addDays, isSameDay } from 'date-fns';

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [mediaDrawerOpen, setMediaDrawerOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomImage, setZoomImage] = useState<{ url: string; index: number; images: any[] } | null>(null);
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Check if this is an admin route
  const isAdminRoute = window.location.pathname.startsWith('/supply');

  const property = properties.find(p => p.id === id);
  const vendor = property ? vendors.find(v => v.id === property.vendorId) : null;
  const propertyRoomTypes = property ? roomTypes.filter(rt => rt.propertyId === property.id) : [];
  const propertyImages = property ? mediaAssets.filter(ma => ma.propertyId === property.id) : [];
  const propertyLicenses = licenses.slice(0, 3); // Mock licenses for this property
  const propertyRatePlans = property ? ratePlans.filter(rp => propertyRoomTypes.some(rt => rt.id === rp.roomTypeId)) : [];

  useEffect(() => {
    if (propertyRoomTypes.length > 0 && !selectedRoomType) {
      setSelectedRoomType(propertyRoomTypes[0].id);
    }
  }, [propertyRoomTypes, selectedRoomType]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if (e.key === 'Escape') {
        if (zoomImage) setZoomImage(null);
        else if (mediaDrawerOpen) setMediaDrawerOpen(false);
      }
      if (zoomImage && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        navigateZoomImage(e.key === 'ArrowLeft' ? 'prev' : 'next');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomImage, mediaDrawerOpen]);

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Property not found.</p>
      </div>
    );
  }

  const allTags = [...new Set(propertyImages.flatMap(img => img.tags))];
  const filteredImages = propertyImages.filter(img => {
    const matchesTag = !selectedTag || img.tags.includes(selectedTag);
    const matchesSearch = !searchTerm || img.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesTag && matchesSearch;
  });

  const heroImages = propertyImages.filter(img => img.isHero).slice(0, 9);
  const requiredPhotoTypes = ['exterior', 'common area', 'room', 'bathroom'];
  const missingPhotoTypes = requiredPhotoTypes.filter(type => 
    !propertyImages.some(img => img.tags.includes(type))
  );

  const getInventoryHeatmap = (roomTypeId: string) => {
    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = format(addDays(new Date(), i), 'yyyy-MM-dd');
      const inventory = inventoryDays.find(inv => 
        inv.roomTypeId === roomTypeId && inv.date === date
      );
      days.push({
        date,
        status: inventory?.status || 'Open',
        available: inventory?.availableCount || 2
      });
    }
    return days;
  };

  const getStatusColor = (status: string, available?: number) => {
    if (status === 'Closed/Stop sell') return 'bg-red-500';
    if (status === 'On hold') return 'bg-yellow-500';
    if (available === 0) return 'bg-red-400';
    if (available && available <= 1) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  const getLicenseStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Approved': 'bg-emerald-900 text-emerald-300 border-emerald-600',
      'Needs review': 'bg-yellow-900 text-yellow-300 border-yellow-600',
      'Expired': 'bg-red-900 text-red-300 border-red-600',
      'Uploaded': 'bg-blue-900 text-blue-300 border-blue-600'
    };
    return colors[status] || colors['Uploaded'];
  };

  const openZoom = (image: any, images: any[]) => {
    const index = images.findIndex(img => img.id === image.id);
    setZoomImage({ url: image.url, index, images });
  };

  const navigateZoomImage = (direction: 'prev' | 'next') => {
    if (!zoomImage) return;
    const { index, images } = zoomImage;
    let newIndex;
    if (direction === 'prev') {
      newIndex = index > 0 ? index - 1 : images.length - 1;
    } else {
      newIndex = index < images.length - 1 ? index + 1 : 0;
    }
    setZoomImage({ ...zoomImage, index: newIndex, url: images[newIndex].url });
  };

  const handleDragStart = (imageId: string) => {
    setDraggedImage(imageId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetImageId: string) => {
    e.preventDefault();
    if (draggedImage && draggedImage !== targetImageId) {
      // In a real app, this would reorder the images
      console.log('Reordering images:', draggedImage, 'to', targetImageId);
    }
    setDraggedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Strip */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold text-white">{property.name}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>{property.city}</span>
                <span>•</span>
                {vendor && (
                  <Link to={`/supply/vendors/${vendor.id}`} className="text-blue-400 hover:text-blue-300">
                    {vendor.legalName}
                  </Link>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs rounded bg-purple-900 text-purple-300 border border-purple-600">
                {property.styleTier}
              </span>
              <span className={`px-2 py-1 text-xs rounded border ${
                property.docsStatus === 'OK' ? 'bg-emerald-900 text-emerald-300 border-emerald-600' :
                property.docsStatus === 'Needs review' ? 'bg-yellow-900 text-yellow-300 border-yellow-600' :
                'bg-red-900 text-red-300 border-red-600'
              }`}>
                {property.docsStatus}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
              <PencilIcon className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors">
              <PlusIcon className="h-4 w-4" />
              <span>Add Room Type</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Open Calendar</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition-colors">
              <CurrencyDollarIcon className="h-4 w-4" />
              <span>Edit Rates</span>
            </button>
            <button 
              onClick={() => setMediaDrawerOpen(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
              <PhotoIcon className="h-4 w-4" />
              <span>Open Gallery</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Hero Gallery Band */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Property Gallery</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {heroImages.map((image, index) => (
              <div
                key={image.id}
                className="relative group cursor-pointer aspect-square"
                draggable
                onDragStart={() => handleDragStart(image.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, image.id)}
                onClick={() => openZoom(image, heroImages)}
              >
                <img
                  src={image.url}
                  alt=""
                  className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay chips */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {image.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-black/70 text-white rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  <button className="p-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors">
                    <HeartSolidIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <TagIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {/* Missing photo placeholders */}
            {missingPhotoTypes.map(type => (
              <div key={type} className="aspect-square bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-center p-4">
                <PhotoIcon className="h-8 w-8 text-gray-500 mb-2" />
                <p className="text-gray-400 text-sm">Add photo for</p>
                <p className="text-white text-sm font-medium">{type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Room Type Mini Carousels */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Room Types</h2>
          {propertyRoomTypes.map(roomType => {
            const roomImages = mediaAssets.filter(ma => ma.roomTypeId === roomType.id).slice(0, 5);
            return (
              <div key={roomType.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">{roomType.publicName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className={`px-2 py-1 rounded text-xs ${
                        roomType.unitOfSale === 'room' ? 'bg-blue-900 text-blue-300' :
                        roomType.unitOfSale === 'bed' ? 'bg-purple-900 text-purple-300' :
                        'bg-green-900 text-green-300'
                      }`}>
                        {roomType.unitOfSale}
                      </span>
                      <span>{roomType.occupancy.adults} adults</span>
                      <span>{roomType.view} view</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors">
                      Calendar
                    </button>
                    <button className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors">
                      Rates
                    </button>
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-4 mb-4">
                  {roomImages.map(image => (
                    <div
                      key={image.id}
                      className="flex-shrink-0 w-32 h-24 cursor-pointer"
                      onClick={() => openZoom(image, roomImages)}
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                  {roomImages.length === 0 && (
                    <div className="flex-shrink-0 w-32 h-24 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                      <PhotoIcon className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                
                {/* Icons row */}
                <div className="flex items-center space-x-4 text-gray-400">
                  {roomType.bath.ensuite && <span className="text-blue-400">🚿 Ensuite</span>}
                  {roomType.balconyOrTerrace === 'Yes' && <span className="text-green-400">🏡 Balcony</span>}
                  {roomType.climate.ac && <span className="text-cyan-400">❄️ AC</span>}
                  {roomType.climate.heating && <span className="text-red-400">🔥 Heating</span>}
                  {roomType.work.desk && <span className="text-purple-400">💻 Desk</span>}
                  {roomType.work.wifiMbps > 0 && <span className="text-yellow-400">📶 WiFi {roomType.work.wifiMbps}Mbps</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Amenity Proof Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {property.amenities.map(amenity => {
              const amenityImage = propertyImages.find(img => img.tags.includes(amenity));
              return (
                <div
                  key={amenity}
                  className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  onClick={() => setSelectedTag(amenity)}
                >
                  {amenityImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={amenityImage.url}
                        alt={amenity}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-white text-sm font-medium capitalize">{amenity}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-600">
                      <PhotoIcon className="h-8 w-8 text-gray-500 mb-2" />
                      <p className="text-gray-400 text-xs">Add photo for</p>
                      <p className="text-white text-xs font-medium capitalize">{amenity}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory and Rates Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Heatmap */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Inventory Snapshot</h3>
              <select
                value={selectedRoomType || ''}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
              >
                {propertyRoomTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>{rt.publicName}</option>
                ))}
              </select>
            </div>
            
            {selectedRoomType && (
              <div className="space-y-2">
                <div className="grid grid-cols-6 gap-1">
                  {getInventoryHeatmap(selectedRoomType).map((day, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded ${getStatusColor(day.status, day.available)} flex items-center justify-center text-xs text-white font-medium`}
                      title={`${day.date}: ${day.status} (${day.available} available)`}
                    >
                      {day.available}
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Closed</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  Open Calendar
                </button>
              </div>
            )}
          </div>

          {/* Rates Band */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Rates Snapshot</h3>
            {selectedRoomType && (() => {
              const ratePlan = ratePlans.find(rp => rp.roomTypeId === selectedRoomType);
              return ratePlan ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Base Rate Range</p>
                    <p className="text-white text-xl font-bold">
                      ₹{ratePlan.base.rate1Adult} - ₹{ratePlan.base.rate3Adults}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Rate Overrides</p>
                    <p className="text-white">{ratePlan.overrides.length} active</p>
                  </div>
                  <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                    Edit Rates
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">No rate plan found</p>
              );
            })()}
          </div>
        </div>

        {/* Landmarks Strip */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Landmarks</h3>
            <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm transition-colors">
              Add Landmark
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-lg h-32 flex items-center justify-center">
              <MapPinIcon className="h-8 w-8 text-gray-400" />
              <span className="text-gray-400 ml-2">Map View</span>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-2 text-sm">
              {property.landmarks.slice(0, 8).map((landmark, index) => (
                <div key={index} className="flex justify-between py-1">
                  <span className="text-gray-300">{landmark.name}</span>
                  <span className="text-gray-400">{landmark.distanceKm}km</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Licenses and Compliance */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Licenses & Compliance</h3>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
              Open Licenses
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {propertyLicenses.map(license => (
                <span key={license.id} className={`px-3 py-1 text-sm rounded border ${getLicenseStatusColor(license.status)}`}>
                  {license.type} {license.status}
                </span>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              Next expiry: {format(new Date(propertyLicenses[0]?.expiryDate || new Date()), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Right Column - Room Type Inspector (Admin) or Booking Form (Public) */}
        {isAdminRoute ? (
          <div className="lg:col-span-1">
            <RoomTypeInspector
              roomTypes={propertyRoomTypes}
              inventoryDays={inventoryDays}
              ratePlans={ratePlans}
              mediaAssets={mediaAssets}
              onOpenCalendar={(roomTypeId) => {
                navigate(`/supply/properties/${property.id}/calendar?roomType=${roomTypeId}`);
              }}
              onEditRates={(roomTypeId) => {
                navigate(`/supply/properties/${property.id}/rates?roomType=${roomTypeId}`);
              }}
              onEditDetails={(roomTypeId) => {
                navigate(`/supply/properties/${property.id}/room-types/${roomTypeId}`);
              }}
              onOpenGallery={(roomTypeId) => {
                setMediaDrawerOpen(true);
                setSelectedTag(null);
                setSearchTerm('');
              }}
            />
          </div>
        ) : (
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-white">
                      ₹{propertyRatePlans[0]?.base.rate2Adults || 2500}
                    </span>
                    <span className="text-gray-400">/night</span>
                  </div>
                  <p className="text-gray-400 text-sm">Prices may vary by dates</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Check-in</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Check-out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Library Drawer */}
      {mediaDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-gray-800 rounded-t-lg max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Media Library</h3>
                <button
                  onClick={() => setMediaDrawerOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              {/* Search and filters */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search by tags... (⌘K)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
                <select
                  value={selectedTag || ''}
                  onChange={(e) => setSelectedTag(e.target.value || null)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">All tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {filteredImages.map(image => (
                  <div
                    key={image.id}
                    className="aspect-square cursor-pointer group relative"
                    onClick={() => openZoom(image, filteredImages)}
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <EyeIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={zoomImage.url}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Navigation */}
            <button
              onClick={() => navigateZoomImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => navigateZoomImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
            
            {/* Close button */}
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/50 text-white rounded-full text-sm">
              {zoomImage.index + 1} / {zoomImage.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}