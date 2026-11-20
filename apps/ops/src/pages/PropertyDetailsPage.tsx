import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { properties, vendors, roomTypes, mediaAssets, ratePlans } from '../data/seedData';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  StarIcon, 
  MapPinIcon, 
  WifiIcon, 
  TruckIcon, 
  SunIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XMarkIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (!property) {
        setError('Property not found');
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [id]);

  const property = properties.find(p => p.id === id);
  const vendor = property ? vendors.find(v => v.id === property.vendorId) : null;
  const propertyRoomTypes = property ? roomTypes.filter(rt => rt.propertyId === property.id) : [];
  const propertyImages = property ? mediaAssets.filter(ma => ma.propertyId === property.id) : [];
  const propertyRatePlans = propertyRoomTypes.map(rt => ratePlans.find(rp => rp.roomTypeId === rt.id)).filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Property not found'}</p>
          <button
            onClick={() => navigate('/supply/properties')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  const getStarRating = (tier: string) => {
    const ratings: Record<string, number> = {
      'Budget': 2,
      '3 Star': 3,
      '4 Star': 4,
      '5 Star': 5,
      'Premium': 4,
      'Deluxe': 5
    };
    return ratings[tier] || 3;
  };

  const handleBooking = () => {
    setShowBookingForm(true);
  };

  const submitBooking = () => {
    alert('Booking request submitted! You will receive a confirmation email shortly.');
    setShowBookingForm(false);
  };

  const currentImage = propertyImages[currentImageIndex];
  const starRating = getStarRating(property.styleTier);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center space-x-2 text-sm">
          <Link to="/supply/properties" className="text-blue-400 hover:text-blue-300">
            Properties
          </Link>
          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
          <span className="text-gray-300">{property.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-3xl font-bold text-white">{property.name}</h1>
              <div className="flex items-center space-x-1">
                {[...Array(starRating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-gray-400 ml-2">({starRating} Star)</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{property.city}, {property.country}</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                property.docsStatus === 'OK' ? 'bg-emerald-900 text-emerald-300' :
                property.docsStatus === 'Needs review' ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
              }`}>
                {property.docsStatus}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {isFavorite ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-400" />
              )}
              <span className="text-white">Save</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
              <ShareIcon className="h-5 w-5 text-gray-400" />
              <span className="text-white">Share</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              {propertyImages.length > 0 ? (
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <img
                    src={currentImage.url}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {propertyImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeftIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronRightIcon className="h-6 w-6" />
                      </button>
                    </>
                  )}
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {propertyImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {propertyImages.length}
                  </div>
                </div>
              ) : (
                <div className="h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">No images available</p>
                </div>
              )}
              
              {/* Thumbnail Strip */}
              {propertyImages.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {propertyImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-gray-600'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Description */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">About This Property</h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Experience luxury and comfort at {property.name}, a {property.styleTier.toLowerCase()} property 
                  located in the heart of {property.city}. Our property offers exceptional hospitality with 
                  modern amenities and traditional charm.
                </p>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.category.map(cat => (
                      <span key={cat} className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Setting & Location</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.settingTags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
                    <span className="text-gray-300 capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Types */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Room Types & Pricing</h2>
              <div className="space-y-4">
                {propertyRoomTypes.map(roomType => {
                  const ratePlan = ratePlans.find(rp => rp.roomTypeId === roomType.id);
                  return (
                    <div
                      key={roomType.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedRoomType === roomType.id
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedRoomType(roomType.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-white">{roomType.publicName}</h3>
                          <p className="text-gray-400 text-sm mb-2">{roomType.bedConfig} • {roomType.sizeSqft} sq ft</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-300">
                            <span>Max {roomType.occupancy.adults} adults</span>
                            <span>•</span>
                            <span>{roomType.view} view</span>
                            {roomType.balconyOrTerrace === 'Yes' && (
                              <>
                                <span>•</span>
                                <span>Balcony</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {ratePlan && (
                            <div className="text-white">
                              <span className="text-2xl font-bold">₹{ratePlan.base.rate2Adults}</span>
                              <span className="text-gray-400 text-sm">/night</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location & Landmarks */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Location & Nearby</h2>
              <div className="mb-4">
                <p className="text-gray-300">{property.address}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.landmarks.slice(0, 8).map((landmark, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-300">{landmark.name}</span>
                    <span className="text-gray-400">{landmark.distanceKm} km</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">House Rules</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Reception Hours:</span>
                  <span className="text-white">{property.houseRules.receptionHours}</span>
                </div>
                {property.houseRules.curfew && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Curfew:</span>
                    <span className="text-white">{property.houseRules.curfew}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-300">Contact:</span>
                  <span className="text-white">{property.houseRules.contactName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleBooking}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    Check Availability
                  </button>

                  <div className="text-center text-gray-400 text-sm">
                    You won't be charged yet
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-3">Contact Property</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{property.houseRules.contactPhone}</span>
                    </div>
                    {vendor && (
                      <div className="flex items-center space-x-2">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">{vendor.contacts.primary.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Confirm Booking</h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">{property.name}</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Check-in: {checkIn}</p>
                  <p>Check-out: {checkOut}</p>
                  <p>Guests: {guests}</p>
                  {selectedRoomType && (
                    <p>Room: {propertyRoomTypes.find(rt => rt.id === selectedRoomType)?.publicName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={submitBooking}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Submit Booking Request
                </button>
                <button
                  onClick={() => setShowBookingForm(false)}
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