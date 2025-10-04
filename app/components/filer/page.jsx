"use client"

import { useState } from 'react'
import { FaMapMarkerAlt, FaMoneyBillWave, FaCar, FaCalendar, FaTimes } from 'react-icons/fa'

export default function Filter({ onFilter }) {
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    carType: '',
    year: ''
  })

  const locations = ['Nairobi', 'Nakuru', 'Nyeri', 'Muranga', 'Kiambu', 'Thika', 'All Central Kenya']
  const priceRanges = ['Under 500K', '500K - 1M', '1M - 2M', '2M - 5M', '5M+']
  const carTypes = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Luxury']

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      location: '',
      priceRange: '',
      carType: '',
      year: ''
    }
    setFilters(clearedFilters)
    onFilter(clearedFilters)
  }

  const hasActiveFilters = filters.location || filters.priceRange || filters.carType || filters.year

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FaCar className="text-blue-600" />
          Filter Cars
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <FaTimes />
            Clear All
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400" />
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FaMoneyBillWave className="text-gray-400" />
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="">Any Price</option>
            {priceRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        {/* Car Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FaCar className="text-gray-400" />
            Car Type
          </label>
          <select
            value={filters.carType}
            onChange={(e) => handleFilterChange('carType', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="">All Types</option>
            {carTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FaCalendar className="text-gray-400" />
            Year
          </label>
          <input
            type="number"
            placeholder="e.g., 2020"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            min="1990"
            max="2024"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.location && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <FaMapMarkerAlt className="text-xs" />
                {filters.location}
              </span>
            )}
            {filters.priceRange && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <FaMoneyBillWave className="text-xs" />
                {filters.priceRange}
              </span>
            )}
            {filters.carType && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <FaCar className="text-xs" />
                {filters.carType}
              </span>
            )}
            {filters.year && (
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <FaCalendar className="text-xs" />
                {filters.year}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}