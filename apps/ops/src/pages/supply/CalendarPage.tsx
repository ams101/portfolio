import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { properties, roomTypes, inventoryDays } from '../../data/seedData';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';

export function CalendarPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [sidePanel, setSidePanel] = useState<{ open: boolean; data?: any }>({ open: false });
  
  const property = properties.find(p => p.id === id);
  const roomTypeId = searchParams.get('roomType');
  const propertyRoomTypes = roomTypes.filter(rt => rt.propertyId === id);
  const selectedRoomType = roomTypeId ? roomTypes.find(rt => rt.id === roomTypeId) : propertyRoomTypes[0];

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Property not found.</p>
      </div>
    );
  }

  const getInventoryForDate = (date: Date, roomTypeId: string) => {
    return inventoryDays.find(inv => 
      inv.roomTypeId === roomTypeId && 
      isSameDay(new Date(inv.date), date)
    );
  };

  const getStatusColor = (status: string, availability?: number) => {
    if (status === 'Closed/Stop sell') return 'bg-red-600 text-white';
    if (status === 'On hold') return 'bg-yellow-600 text-white';
    if (availability === 0) return 'bg-red-500 text-white';
    if (availability && availability <= 2) return 'bg-yellow-500 text-black';
    return 'bg-green-600 text-white';
  };

  const generateCalendarDays = () => {
    if (viewMode === 'month') {
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfWeek(endOfMonth(currentDate));
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return eachDayOfInterval({ start, end });
    }
  };

  const handleDateClick = (date: Date) => {
    if (!selectedRange.start) {
      setSelectedRange({ start: date, end: null });
    } else if (!selectedRange.end) {
      if (date >= selectedRange.start) {
        setSelectedRange(prev => ({ ...prev, end: date }));
        setSidePanel({ open: true, data: { start: selectedRange.start, end: date } });
      } else {
        setSelectedRange({ start: date, end: null });
      }
    } else {
      setSelectedRange({ start: date, end: null });
    }
  };

  const isDateInRange = (date: Date) => {
    if (!selectedRange.start) return false;
    if (!selectedRange.end) return isSameDay(date, selectedRange.start);
    return date >= selectedRange.start && date <= selectedRange.end;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendar & Inventory</h1>
          <p className="text-gray-400">{property.name}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedRoomType?.id || ''}
            onChange={(e) => setSearchParams({ roomType: e.target.value })}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            {propertyRoomTypes.map(rt => (
              <option key={rt.id} value={rt.id}>{rt.publicName}</option>
            ))}
          </select>
          
          <div className="flex bg-gray-700 rounded-lg">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-2 text-sm rounded-l-lg ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-2 text-sm rounded-r-lg ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      <div className={`grid ${sidePanel.open ? 'grid-cols-4' : 'grid-cols-1'} gap-6`}>
        {/* Calendar */}
        <div className={sidePanel.open ? 'col-span-3' : 'col-span-1'}>
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            {/* Calendar Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-400" />
                </button>
                
                <h2 className="text-lg font-semibold text-white">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                
                <button
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              
              <div className="text-sm text-gray-400">
                {selectedRoomType?.publicName}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const inventory = selectedRoomType ? getInventoryForDate(date, selectedRoomType.id) : null;
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const isToday = isSameDay(date, new Date());
                  const isInRange = isDateInRange(date);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={`relative p-3 text-left rounded-lg border transition-all ${
                        isInRange
                          ? 'border-blue-500 bg-blue-900/30'
                          : isToday
                          ? 'border-emerald-500 bg-emerald-900/30'
                          : 'border-gray-600 hover:border-gray-500'
                      } ${
                        !isCurrentMonth ? 'opacity-40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className={`text-sm font-medium ${
                          isCurrentMonth ? 'text-white' : 'text-gray-500'
                        }`}>
                          {format(date, 'd')}
                        </span>
                        {isToday && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        )}
                      </div>
                      
                      {inventory && isCurrentMonth && (
                        <div className="space-y-1">
                          <div className={`text-xs px-2 py-1 rounded ${getStatusColor(inventory.status, inventory.availableCount)}`}>
                            {inventory.status === 'Open' ? `${inventory.availableCount} left` : inventory.status}
                          </div>
                          {inventory.reason && (
                            <div className="text-xs text-gray-400 truncate">
                              {inventory.reason}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        {sidePanel.open && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Edit Range</h3>
              <button
                onClick={() => setSidePanel({ open: false })}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {sidePanel.data && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                  <p className="text-white">
                    {format(sidePanel.data.start, 'MMM d')} - {format(sidePanel.data.end, 'MMM d, yyyy')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    <option value="Open">Open</option>
                    <option value="Closed/Stop sell">Closed/Stop sell</option>
                    <option value="On hold">On hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Available Count</label>
                  <input
                    type="number"
                    defaultValue={2}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Reason (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Maintenance, Festival"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Release Date (if on hold)</label>
                  <input
                    type="date"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Apply Changes
                  </button>
                  <button
                    onClick={() => setSidePanel({ open: false })}
                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <h3 className="text-white font-medium mb-3">Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-gray-300 text-sm">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-300 text-sm">Low Availability</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-300 text-sm">Sold Out</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-gray-300 text-sm">Closed/Stop Sell</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-600 rounded"></div>
            <span className="text-gray-300 text-sm">On Hold</span>
          </div>
        </div>
      </div>
    </div>
  );
}