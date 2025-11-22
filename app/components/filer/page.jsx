"use client"

import { useState } from 'react'
import { FaMapMarkerAlt, FaMoneyBillWave, FaCar, FaCalendar, FaTimes, FaFilter, FaChevronDown } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function CarFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    carType: '',
    year: ''
  })

  const [isExpanded, setIsExpanded] = useState(true)

  const locations = ['Nairobi', 'Nakuru', 'Nyeri', 'Muranga', 'Kiambu', 'Thika']
  const priceRanges = [
    { value: 'under-500k', label: 'Under KSh 500K' },
    { value: '500k-1m', label: 'KSh 500K - 1M' },
    { value: '1m-2m', label: 'KSh 1M - 2M' },
    { value: '2m-5m', label: 'KSh 2M - 5M' },
    { value: '5m-plus', label: 'KSh 5M+' }
  ]
  const carTypes = ['SUV', 'Sedan', 'Luxury SUV', 'Pickup', 'Hatchback']

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
    <motion.div 
      className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <FaFilter className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Filter Cars</h3>
            <p className="text-sm text-gray-400 mt-1">Find your perfect match</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <motion.button
              onClick={clearFilters}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm hover:bg-red-500/30 transition-colors flex items-center gap-2 border border-red-500/30"
            >
              <FaTimes className="text-xs" />
              Clear
            </motion.button>
          )}
          
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronDown className="text-gray-300 text-xs" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Location Filter */}
            <div>
              <label className=" text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-400" />
                Location
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleFilterChange('location', filters.location === location ? '' : location)}
                    className={`p-3 rounded-lg border transition-colors text-sm ${
                      filters.location === location
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                        : 'bg-gray-700/50 text-gray-300 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className=" text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <FaMoneyBillWave className="text-green-400" />
                Price Range
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handleFilterChange('priceRange', filters.priceRange === range.value ? '' : range.value)}
                    className={`p-3 rounded-lg border transition-colors text-sm text-left ${
                      filters.priceRange === range.value
                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                        : 'bg-gray-700/50 text-gray-300 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Car Type Filter */}
            <div>
              <label className=" text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <FaCar className="text-purple-400" />
                Car Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {carTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange('carType', filters.carType === type ? '' : type)}
                    className={`p-3 rounded-lg border transition-colors text-sm text-center ${
                      filters.carType === type
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                        : 'bg-gray-700/50 text-gray-300 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <label className=" text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <FaCalendar className="text-amber-400" />
                Year
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  placeholder="Enter year (e.g., 2020)"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="flex-1 p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-700 text-white text-sm placeholder-gray-400 transition-colors"
                  min="2010"
                  max="2024"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div 
          className="mt-6 pt-6 border-t border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-sm font-medium text-gray-300 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {filters.location && (
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs flex items-center gap-2 border border-blue-500/30">
                <FaMapMarkerAlt className="text-xs" />
                {filters.location}
                <button 
                  onClick={() => handleFilterChange('location', '')}
                  className="hover:text-blue-300"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
            {filters.priceRange && (
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs flex items-center gap-2 border border-green-500/30">
                <FaMoneyBillWave className="text-xs" />
                {priceRanges.find(r => r.value === filters.priceRange)?.label}
                <button 
                  onClick={() => handleFilterChange('priceRange', '')}
                  className="hover:text-green-300"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
            {filters.carType && (
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs flex items-center gap-2 border border-purple-500/30">
                <FaCar className="text-xs" />
                {filters.carType}
                <button 
                  onClick={() => handleFilterChange('carType', '')}
                  className="hover:text-purple-300"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
            {filters.year && (
              <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs flex items-center gap-2 border border-amber-500/30">
                <FaCalendar className="text-xs" />
                {filters.year}
                <button 
                  onClick={() => handleFilterChange('year', '')}
                  className="hover:text-amber-300"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}