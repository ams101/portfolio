import React, { useState } from 'react';
import { mediaAssets, properties } from '../../data/seedData';
import { PhotoIcon, MagnifyingGlassIcon, TagIcon, StarIcon } from '@heroicons/react/24/outline';

export function MediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAssets = mediaAssets.filter(asset => {
    const property = properties.find(p => p.id === asset.propertyId);
    const matchesSearch = property?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = selectedTag === 'all' || asset.tags.includes(selectedTag);
    const matchesProperty = selectedProperty === 'all' || asset.propertyId === selectedProperty;
    
    return matchesSearch && matchesTag && matchesProperty;
  });

  const allTags = [...new Set(mediaAssets.flatMap(asset => asset.tags))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Gallery</h1>
          <p className="text-gray-400">Manage property and room images</p>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
          <PhotoIcon className="h-4 w-4" />
          <span>Upload Images</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Properties</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>{property.name}</option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder-gray-400"
            />
          </div>

          <div className="flex bg-gray-700 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm rounded-l-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm rounded-r-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Tag Palette */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <TagIcon className="h-5 w-5 text-gray-400" />
          <h3 className="font-medium text-white">Popular Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['pool', 'beach access', 'mountain view', 'jacuzzi', 'balcony', 'sea view', 'exterior', 'room', 'common area', 'heritage'].map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                selectedTag === tag
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              {tag} ({mediaAssets.filter(asset => asset.tags.includes(tag)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAssets.map(asset => {
            const property = properties.find(p => p.id === asset.propertyId);
            return (
              <div key={asset.id} className="group relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="aspect-square">
                  <img
                    src={asset.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="mb-2">
                      {asset.isHero && (
                        <div className="inline-flex items-center space-x-1 px-2 py-1 bg-yellow-600 text-white rounded text-xs mb-1">
                          <StarIcon className="h-3 w-3" />
                          <span>Hero</span>
                        </div>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium truncate">
                      {property?.name}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {asset.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 text-xs bg-gray-800/80 text-gray-200 rounded">
                          {tag}
                        </span>
                      ))}
                      {asset.tags.length > 2 && (
                        <span className="px-1.5 py-0.5 text-xs bg-gray-700/80 text-gray-300 rounded">
                          +{asset.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Hero Badge */}
                {asset.isHero && (
                  <div className="absolute top-2 left-2">
                    <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-600 text-white rounded text-xs">
                      <StarIcon className="h-3 w-3" />
                      <span>Hero</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Property</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Tags</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAssets.map(asset => {
                  const property = properties.find(p => p.id === asset.propertyId);
                  return (
                    <tr key={asset.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 px-6">
                        <img
                          src={asset.url}
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-white font-medium">{property?.name}</div>
                        <div className="text-gray-400 text-sm">{property?.city}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 text-xs rounded bg-blue-900 text-blue-300">
                              {tag}
                            </span>
                          ))}
                          {asset.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300">
                              +{asset.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {asset.isHero ? (
                          <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-900 text-yellow-300 rounded border border-yellow-600 w-fit">
                            <StarIcon className="h-3 w-3" />
                            <span className="text-xs">Hero Image</span>
                          </div>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300">Regular</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 text-sm">Edit Tags</button>
                          <button className="text-emerald-400 hover:text-emerald-300 text-sm">
                            {asset.isHero ? 'Remove Hero' : 'Set Hero'}
                          </button>
                          <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No images found matching your filters.</p>
          <button className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            Upload Images
          </button>
        </div>
      )}

      {/* Bulk Actions */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Bulk Actions</h3>
            <p className="text-gray-400 text-sm">Select multiple images to perform batch operations</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
              Bulk Tag
            </button>
            <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
              Move to Property
            </button>
            <button className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
              Delete Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}