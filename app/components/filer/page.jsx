"use client"

import { useState } from 'react'
import { FaMapMarkerAlt, FaMoneyBillWave, FaCar, FaCalendar, FaTimes, FaFilter, FaChevronDown, FaCheck } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function Filter({ onFilter }) {
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    carType: '',
    year: ''
  })

  const [isExpanded, setIsExpanded] = useState(true)

  const locations = ['Nairobi', 'Nakuru', 'Nyeri', 'Muranga', 'Kiambu', 'Thika', 'All Central Kenya']
  const priceRanges = [
    { value: 'under-500k', label: 'Under KSh 500K', min: 0, max: 500000 },
    { value: '500k-1m', label: 'KSh 500K - 1M', min: 500000, max: 1000000 },
    { value: '1m-2m', label: 'KSh 1M - 2M', min: 1000000, max: 2000000 },
    { value: '2m-5m', label: 'KSh 2M - 5M', min: 2000000, max: 5000000 },
    { value: '5m-plus', label: 'KSh 5M+', min: 5000000, max: null }
  ]
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
    <motion.div 
      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 p-7 hover:shadow-3xl transition-all duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-7">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
            <FaFilter className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">FILTER CARS</h3>
            <p className="text-base font-medium text-gray-600 mt-1">Find Your Perfect Match</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <motion.button
              onClick={clearFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-600 to-pink-700 text-white px-5 py-3 rounded-xl font-bold text-base hover:shadow-xl transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <FaTimes className="text-base" />
              CLEAR ALL
            </motion.button>
          )}
          
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronDown className="text-gray-700 text-base font-bold" />
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
            transition={{ duration: 0.4 }}
            className="space-y-7"
          >
            {/* Location Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shadow-md">
                  <FaMapMarkerAlt className="text-blue-700 text-lg font-bold" />
                </div>
                LOCATION
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {locations.map((location, index) => (
                  <motion.button
                    key={location}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFilterChange('location', filters.location === location ? '' : location)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 font-bold text-base ${
                      filters.location === location
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/30'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-blue-500 hover:shadow-lg font-semibold'
                    }`}
                  >
                    {location}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Price Range Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shadow-md">
                  <FaMoneyBillWave className="text-green-700 text-lg font-bold" />
                </div>
                PRICE RANGE
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {priceRanges.map((range) => (
                  <motion.button
                    key={range.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleFilterChange('priceRange', filters.priceRange === range.value ? '' : range.value)}
                    className={`p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                      filters.priceRange === range.value
                        ? 'bg-green-600 text-white border-green-600 shadow-xl shadow-green-600/30 font-bold'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-green-500 hover:shadow-lg font-semibold'
                    }`}
                  >
                    <div className="font-bold text-base">{range.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Car Type Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shadow-md">
                  <FaCar className="text-purple-700 text-lg font-bold" />
                </div>
                CAR TYPE
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {carTypes.map((type) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleFilterChange('carType', filters.carType === type ? '' : type)}
                    className={`p-5 rounded-xl border-2 transition-all duration-300 text-center ${
                      filters.carType === type
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xl shadow-purple-600/30 font-bold'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-purple-500 hover:shadow-lg font-semibold'
                    }`}
                  >
                    <div className="font-bold text-base">{type}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Year Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shadow-md">
                  <FaCalendar className="text-amber-700 text-lg font-bold" />
                </div>
                YEAR
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  placeholder="Enter Year (e.g., 2020)"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="flex-1 p-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-amber-600 focus:border-amber-600 bg-white text-base font-bold placeholder-gray-500 transition-all duration-300 hover:border-amber-500 text-gray-900"
                  min="1990"
                  max="2024"
                />
                {filters.year && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => handleFilterChange('year', '')}
                    className="w-14 h-14 bg-amber-600 text-white rounded-xl flex items-center justify-center hover:bg-amber-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    <FaCheck className="text-base font-bold" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div 
          className="mt-7 pt-7 border-t border-gray-300/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-3">
            <FaFilter className="text-gray-700 font-bold" />
            ACTIVE FILTERS
          </h4>
          <div className="flex flex-wrap gap-3">
            {filters.location && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-blue-600 text-white px-4 py-3 rounded-xl text-base font-extrabold flex items-center gap-3 shadow-xl shadow-blue-600/30"
              >
                <FaMapMarkerAlt className="text-sm font-bold" />
                {filters.location}
                <button 
                  onClick={() => handleFilterChange('location', '')}
                  className="hover:scale-110 transition-transform duration-200 ml-1"
                >
                  <FaTimes className="text-sm font-bold" />
                </button>
              </motion.span>
            )}
            {filters.priceRange && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-600 text-white px-4 py-3 rounded-xl text-base font-extrabold flex items-center gap-3 shadow-xl shadow-green-600/30"
              >
                <FaMoneyBillWave className="text-sm font-bold" />
                {priceRanges.find(r => r.value === filters.priceRange)?.label}
                <button 
                  onClick={() => handleFilterChange('priceRange', '')}
                  className="hover:scale-110 transition-transform duration-200 ml-1"
                >
                  <FaTimes className="text-sm font-bold" />
                </button>
              </motion.span>
            )}
            {filters.carType && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-purple-600 text-white px-4 py-3 rounded-xl text-base font-extrabold flex items-center gap-3 shadow-xl shadow-purple-600/30"
              >
                <FaCar className="text-sm font-bold" />
                {filters.carType}
                <button 
                  onClick={() => handleFilterChange('carType', '')}
                  className="hover:scale-110 transition-transform duration-200 ml-1"
                >
                  <FaTimes className="text-sm font-bold" />
                </button>
              </motion.span>
            )}
            {filters.year && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-amber-600 text-white px-4 py-3 rounded-xl text-base font-extrabold flex items-center gap-3 shadow-xl shadow-amber-600/30"
              >
                <FaCalendar className="text-sm font-bold" />
                {filters.year}
                <button 
                  onClick={() => handleFilterChange('year', '')}
                  className="hover:scale-110 transition-transform duration-200 ml-1"
                >
                  <FaTimes className="text-sm font-bold" />
                </button>
              </motion.span>
            )}
          </div>
        </motion.div>
      )}

      {/* Results Count */}
      <motion.div 
        className="mt-7 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-5 border-2 border-blue-200">
          <p className="text-base font-extrabold text-gray-900">
            {hasActiveFilters ? 'FILTERS APPLIED' : 'READY TO FIND YOUR DREAM CAR?'}
          </p>
          <p className="text-sm font-semibold text-gray-700 mt-2">
            {hasActiveFilters ? 'Browse matching results below' : 'Select filters to get started'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}