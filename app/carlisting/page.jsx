"use client"

import { useState, useEffect, useMemo } from 'react'
import { 
  FaMapMarkerAlt, FaCog, FaGasPump, FaBuilding, FaPhone, FaCalendar, 
  FaStar, FaHeart, FaShare, FaSearch, FaFilter, FaTimes, FaChevronDown,
  FaCar, FaMoneyBillWave, FaTachometerAlt, FaPalette, FaUsers, FaCaretRight,
  FaExpand, FaCompress, FaPlay, FaPause, FaWhatsapp, FaEnvelope, FaShieldAlt,
  FaCertificate, FaRoad, FaClock, FaCheck, FaArrowLeft, FaArrowRight,
  FaSort, FaSortUp, FaSortDown, FaEye, FaList, FaTh, FaSync
} from 'react-icons/fa'
import { IoMdSpeedometer } from 'react-icons/io'
import { motion, AnimatePresence } from 'framer-motion'
import { carData } from '../components/mockdata/page'

export default function EnhancedCarListing() {
  // State Management
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCar, setSelectedCar] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('featured')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [compareCars, setCompareCars] = useState(new Set())
  const [showCompareBar, setShowCompareBar] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState([])

  // Filter State
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    carType: '',
    year: '',
    transmission: '',
    fuelType: '',
    mileage: '',
    color: '',
    features: []
  })

  const carsPerPage = 12

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCars(carData)
      setFilteredCars(carData)
      setIsLoading(false)
    }
    loadData()
  }, [])

  // Enhanced Filter Options
  const filterOptions = useMemo(() => ({
    locations: [...new Set(cars.map(car => car.location))],
    carTypes: [...new Set(cars.map(car => car.type))],
    transmissions: ['Automatic', 'Manual', 'CVT'],
    fuelTypes: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
    colors: ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Other'],
    priceRanges: [
      { value: 'under-1m', label: 'Under KSh 1M', min: 0, max: 1000000 },
      { value: '1m-2m', label: 'KSh 1M - 2M', min: 1000000, max: 2000000 },
      { value: '2m-5m', label: 'KSh 2M - 5M', min: 2000000, max: 5000000 },
      { value: '5m-10m', label: 'KSh 5M - 10M', min: 5000000, max: 10000000 },
      { value: '10m-plus', label: 'KSh 10M+', min: 10000000, max: Infinity }
    ],
    mileageRanges: [
      { value: 'under-20k', label: 'Under 20,000 km' },
      { value: '20k-50k', label: '20,000 - 50,000 km' },
      { value: '50k-100k', label: '50,000 - 100,000 km' },
      { value: '100k-plus', label: '100,000+ km' }
    ],
    features: [
      'Sunroof', 'Leather Seats', 'Backup Camera', 'GPS Navigation', 'Heated Seats',
      'Premium Sound', 'Bluetooth', 'Apple CarPlay', 'Android Auto', 'LED Lights',
      'Parking Sensors', 'Blind Spot Monitor', 'Adaptive Cruise', 'Panoramic Roof'
    ]
  }), [cars])

  // Enhanced Filter Handler
  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    
    let filtered = [...cars]

    // Location filter
    if (newFilters.location) {
      filtered = filtered.filter(car => car.location === newFilters.location)
    }

    // Car type filter
    if (newFilters.carType) {
      filtered = filtered.filter(car => car.type === newFilters.carType)
    }

    // Year filter
    if (newFilters.year) {
      filtered = filtered.filter(car => car.year === newFilters.year)
    }

    // Price range filter
    if (newFilters.priceRange) {
      const range = filterOptions.priceRanges.find(r => r.value === newFilters.priceRange)
      if (range) {
        filtered = filtered.filter(car => {
          const price = parseFloat(car.price.replace(/,/g, ''))
          return price >= range.min && price <= range.max
        })
      }
    }

    // Transmission filter
    if (newFilters.transmission) {
      filtered = filtered.filter(car => car.transmission === newFilters.transmission)
    }

    // Fuel type filter
    if (newFilters.fuelType) {
      filtered = filtered.filter(car => car.fuel === newFilters.fuelType)
    }

    // Mileage filter
    if (newFilters.mileage) {
      const mileageValue = parseInt(newFilters.mileage)
      filtered = filtered.filter(car => {
        const carMileage = parseInt(car.mileage.replace(/[^0-9]/g, ''))
        return carMileage <= mileageValue
      })
    }

    // Color filter
    if (newFilters.color) {
      filtered = filtered.filter(car => 
        car.color.toLowerCase().includes(newFilters.color.toLowerCase())
      )
    }

    // Features filter
    if (newFilters.features.length > 0) {
      filtered = filtered.filter(car =>
        newFilters.features.every(feature => car.features.includes(feature))
      )
    }

    // Search filter
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().split(' ')
      filtered = filtered.filter(car => {
        const searchableText = `
          ${car.name} ${car.location} ${car.year} ${car.type} ${car.mileage} 
          ${car.transmission} ${car.fuel} ${car.description} ${car.dealer}
          ${car.features.join(' ')} ${car.engine} ${car.color} ${car.rating}
        `.toLowerCase()

        return searchTerms.every(term => searchableText.includes(term))
      })
    }

    setFilteredCars(filtered)
    setCurrentPage(1)
  }

  // Enhanced Search Handler
  const handleSearch = (query) => {
    setSearchQuery(query)
    handleFilter(filters)
  }

  // Sorting Handler
  const handleSort = (sortType) => {
    if (sortBy === sortType) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(sortType)
      setSortOrder('desc')
    }
  }

  // Apply sorting
  const sortedCars = useMemo(() => {
    const sorted = [...filteredCars]
    
    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/,/g, ''))
          const priceB = parseFloat(b.price.replace(/,/g, ''))
          return sortOrder === 'asc' ? priceA - priceB : priceB - priceA
        })
      case 'year':
        return sorted.sort((a, b) => 
          sortOrder === 'asc' ? a.year - b.year : b.year - a.year
        )
      case 'mileage':
        return sorted.sort((a, b) => {
          const mileageA = parseInt(a.mileage.replace(/[^0-9]/g, ''))
          const mileageB = parseInt(b.mileage.replace(/[^0-9]/g, ''))
          return sortOrder === 'asc' ? mileageA - mileageB : mileageB - mileageA
        })
      case 'rating':
        return sorted.sort((a, b) => 
          sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
        )
      default:
        return sorted
    }
  }, [filteredCars, sortBy, sortOrder])

  // Pagination
  const indexOfLastCar = currentPage * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = sortedCars.slice(indexOfFirstCar, indexOfLastCar)
  const totalPages = Math.ceil(sortedCars.length / carsPerPage)

  // Favorite functionality
  const toggleFavorite = (carId, e) => {
    e?.stopPropagation()
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(carId)) {
        newFavorites.delete(carId)
      } else {
        newFavorites.add(carId)
      }
      return newFavorites
    })
  }


// Add this function after your other handlers
const closeModal = () => {
  setShowModal(false)
  setSelectedCar(null)
  setSelectedImageIndex(0)
  setIsAutoPlaying(true)
}

  // Compare functionality
  const toggleCompare = (carId) => {
    setCompareCars(prev => {
      const newCompare = new Set(prev)
      if (newCompare.has(carId)) {
        newCompare.delete(carId)
      } else {
        if (newCompare.size < 3) {
          newCompare.add(carId)
        }
      }
      return newCompare
    })
  }

  // View details handler
  const handleViewDetails = (car) => {
    setSelectedCar(car)
    setSelectedImageIndex(0)
    setShowModal(true)
    
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== car.id)
      return [car, ...filtered.slice(0, 4)]
    })
  }

  // Image gallery navigation
  const nextImage = () => {
    setSelectedImageIndex(prev => (prev + 1) % selectedCar.images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex(prev => (prev - 1 + selectedCar.images.length) % selectedCar.images.length)
  }

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = {
      location: '',
      priceRange: '',
      carType: '',
      year: '',
      transmission: '',
      fuelType: '',
      mileage: '',
      color: '',
      features: []
    }
    setFilters(clearedFilters)
    setSearchQuery('')
    handleFilter(clearedFilters)
  }

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  ) || searchQuery

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      
      if (startPage > 1) {
        pages.push(1)
        if (startPage > 2) pages.push('...')
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  // Auto-play for image gallery
  useEffect(() => {
    if (!isAutoPlaying || !showModal || !selectedCar) return
    
    const interval = setInterval(() => {
      setSelectedImageIndex(prev => (prev + 1) % selectedCar.images.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying, showModal, selectedCar])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Premium Car Collection
              </h1>
              <p className="text-gray-400 text-lg">
                Discover {cars.length} quality vehicles across Kenya
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaTh className="text-sm" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaList className="text-sm" />
                </button>
              </div>

              {/* Results Count */}
              <div className="hidden md:block text-sm text-gray-400">
                {sortedCars.length} cars found
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Search and Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 sticky top-20 z-30"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cars by name, features, location, year..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500'
                }`}
              >
                <FaFilter className="text-sm" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : v !== '').length + (searchQuery ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-')
                    setSortBy(newSortBy)
                    setSortOrder(newSortOrder)
                  }}
                  className="appearance-none bg-gray-700 border border-gray-600 text-white py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="featured-desc">Featured</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="year-desc">Year: Newest First</option>
                  <option value="year-asc">Year: Oldest First</option>
                  <option value="mileage-asc">Mileage: Low to High</option>
                  <option value="mileage-desc">Mileage: High to Low</option>
                  <option value="rating-desc">Rating: Highest First</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-6 bg-gray-700/50 rounded-lg border border-gray-600"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FaMapMarkerAlt className="inline mr-2 text-blue-400" />
                      Location
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) => handleFilter({ ...filters, location: e.target.value })}
                      className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">All Locations</option>
                      {filterOptions.locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FaMoneyBillWave className="inline mr-2 text-green-400" />
                      Price Range
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => handleFilter({ ...filters, priceRange: e.target.value })}
                      className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Any Price</option>
                      {filterOptions.priceRanges.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Car Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FaCar className="inline mr-2 text-purple-400" />
                      Car Type
                    </label>
                    <select
                      value={filters.carType}
                      onChange={(e) => handleFilter({ ...filters, carType: e.target.value })}
                      className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">All Types</option>
                      {filterOptions.carTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FaCalendar className="inline mr-2 text-amber-400" />
                      Year
                    </label>
                    <input
                      type="number"
                      placeholder="Enter year"
                      value={filters.year}
                      onChange={(e) => handleFilter({ ...filters, year: e.target.value })}
                      className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      min="2010"
                      max="2024"
                    />
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  {/* Transmission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FaCog className="inline mr-2 text-purple-400" />
                      Transmission
                    </label>
                    <select
                      value={filters.transmission}
                      onChange={(e) => handleFilter({ ...filters, transmission: e.target.value })}
                      className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Any Transmission</option>
                      {filterOptions.transmissions.map(trans => (
                        <option key={trans} value={trans}>{trans}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FaGasPump className="inline mr-2 text-green-400" />
                      Fuel Type
                    </label>
                    <select
                      value={filters.fuelType}
                      onChange={(e) => handleFilter({ ...filters, fuelType: e.target.value })}
                      className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Any Fuel Type</option>
                      {filterOptions.fuelTypes.map(fuel => (
                        <option key={fuel} value={fuel}>{fuel}</option>
                      ))}
                    </select>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FaPalette className="inline mr-2 text-amber-400" />
                      Color
                    </label>
                    <select
                      value={filters.color}
                      onChange={(e) => handleFilter({ ...filters, color: e.target.value })}
                      className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Any Color</option>
                      {filterOptions.colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Features Filter */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaCertificate className="inline mr-2 text-blue-400" />
                    Features
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {filterOptions.features.map(feature => (
                      <label key={feature} className="flex items-center space-x-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature)}
                          onChange={(e) => {
                            const newFeatures = e.target.checked
                              ? [...filters.features, feature]
                              : filters.features.filter(f => f !== feature)
                            handleFilter({ ...filters, features: newFeatures })
                          }}
                          className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        <span>{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-600">
                  <div className="text-sm text-gray-400">
                    {sortedCars.length} cars match your criteria
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-blue-500/30">
                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')}>
                        <FaTimes className="text-xs hover:text-blue-300" />
                      </button>
                    </span>
                  )}
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0)) return null
                    
                    if (Array.isArray(value)) {
                      return value.map(item => (
                        <span key={item} className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-purple-500/30">
                          {item}
                          <button onClick={() => handleFilter({
                            ...filters,
                            features: filters.features.filter(f => f !== item)
                          })}>
                            <FaTimes className="text-xs hover:text-purple-300" />
                          </button>
                        </span>
                      ))
                    }
                    
                    let displayValue = value
                    if (key === 'priceRange') {
                      displayValue = filterOptions.priceRanges.find(r => r.value === value)?.label
                    }
                    
                    return (
                      <span key={key} className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-green-500/30">
                        {displayValue}
                        <button onClick={() => handleFilter({ ...filters, [key]: '' })}>
                          <FaTimes className="text-xs hover:text-green-300" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Car Grid/List View */}
            {viewMode === 'grid' ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8"
              >
                {currentCars.map((car, index) => (
                  <CarCard 
                    key={car.id}
                    car={car}
                    index={index}
                    isFavorite={favorites.has(car.id)}
                    onToggleFavorite={toggleFavorite}
                    onViewDetails={handleViewDetails}
                    viewMode={viewMode}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="space-y-4 mb-8"
              >
                {currentCars.map((car, index) => (
                  <CarCard 
                    key={car.id}
                    car={car}
                    index={index}
                    isFavorite={favorites.has(car.id)}
                    onToggleFavorite={toggleFavorite}
                    onViewDetails={handleViewDetails}
                    viewMode={viewMode}
                  />
                ))}
              </motion.div>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-center gap-4"
              >
                <div className="text-sm text-gray-400">
                  Showing {indexOfFirstCar + 1}-{Math.min(indexOfLastCar, sortedCars.length)} of {sortedCars.length} cars
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaArrowLeft className="text-sm" />
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg transition-colors min-w-[40px] ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* No Results State */}
            {filteredCars.length === 0 && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <FaSearch className="text-6xl text-gray-500 mx-auto mb-4" />
                <h3 className="text-2xl font-medium text-white mb-2">No cars found</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  {searchQuery ? `No results found for "${searchQuery}"` : 'Try adjusting your filters to see more results'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Car Details Modal */}
      <AnimatePresence>
        {showModal && selectedCar && (
          <CarDetailsModal
            car={selectedCar}
            selectedImageIndex={selectedImageIndex}
            onImageIndexChange={setSelectedImageIndex}
            onNextImage={nextImage}
            onPrevImage={prevImage}
            isAutoPlaying={isAutoPlaying}
            onAutoPlayToggle={setIsAutoPlaying}
            onClose={() => setShowModal(false)}
            isFavorite={favorites.has(selectedCar.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>

      {/* Compare Bar */}
      {compareCars.size > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50"
        >
          <div className="flex items-center gap-4 p-4">
            <span className="text-white font-medium">
              {compareCars.size} car(s) selected for comparison
            </span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Compare Now
            </button>
            <button 
              onClick={() => setCompareCars(new Set())}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Enhanced Car Card Component
const CarCard = ({ car, index, isFavorite, onToggleFavorite, onViewDetails, viewMode }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    className={`bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 group cursor-pointer ${
      viewMode === 'list' ? 'flex' : ''
    }`}
    whileHover={{ y: -4 }}
  >
   <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
  <img 
    src={car.image} 
    alt={car.name}
    className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
      viewMode === 'list' ? 'h-48' : 'h-48'
    }`}
  />
  
  {/* Top Badges */}
  <div className="absolute top-3 left-3 flex flex-col gap-2">
    <span className="bg-blue-500/90 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
      {car.year}
    </span>
    <span className="bg-green-500/90 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
      {car.location}
    </span>
    {car.rating >= 4.5 && (
      <span className="bg-amber-500/90 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm flex items-center gap-1">
        <FaStar className="text-xs" />
        Premium
      </span>
    )}
  </div>
  
  {/* Action Buttons */}
  <div className="absolute top-3 right-3 flex flex-col gap-2">
    <button 
      onClick={(e) => onToggleFavorite(car.id, e)}
      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
        isFavorite 
          ? 'bg-red-500 text-white shadow-lg' 
          : 'bg-gray-800/80 text-gray-300 hover:bg-red-500 hover:text-white'
      }`}
    >
      <FaHeart className={`text-sm ${isFavorite ? 'fill-current' : ''}`} />
    </button>
    <button className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-300 hover:bg-blue-500 hover:text-white transition-all duration-300">
      <FaShare className="text-sm" />
    </button>
    <button className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-300 hover:bg-green-500 hover:text-white transition-all duration-300">
      <FaEye className="text-sm" />
    </button>
  </div>

  {/* Quick View Overlay */}
  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
    <button
      onClick={() => onViewDetails(car)}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 font-medium"
    >
      <FaExpand className="text-sm" />
      Quick View
    </button>
  </div>
</div>

<div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
  {/* Header */}
  <div className="flex justify-between items-start mb-3">
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-white line-clamp-1 mb-1">
        {car.name}
      </h3>
      <p className="text-gray-400 text-sm line-clamp-2 mb-2">
        {car.description.substring(0, 80)}...
      </p>
    </div>
    <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded border border-amber-500/30">
      <FaStar className="text-amber-400 text-xs" />
      <span className="text-amber-400 text-xs font-medium">{car.rating}</span>
    </div>
  </div>
  
  {/* Price */}
  <div className="mb-4">
    <span className="text-2xl font-bold text-blue-400">KSh {car.price}</span>
    <div className="flex items-center gap-2 mt-1">
      <span className="text-green-400 text-sm font-medium">
        {parseFloat(car.price.replace(/,/g, '')) > 5000000 ? 'Premium' : 'Great Value'}
      </span>
      <span className="text-gray-500 text-sm">•</span>
      <span className="text-gray-400 text-sm">{car.mileage}</span>
    </div>
  </div>

  {/* Specifications Grid */}
  <div className={`grid gap-2 text-sm text-gray-300 mb-4 ${
    viewMode === 'list' ? 'grid-cols-3' : 'grid-cols-2'
  }`}>
    <div className="flex items-center gap-2">
      <IoMdSpeedometer className="text-blue-400 flex-shrink-0" />
      <span className="truncate">{car.mileage}</span>
    </div>
    <div className="flex items-center gap-2">
      <FaCog className="text-purple-400 flex-shrink-0" />
      <span className="truncate">{car.transmission}</span>
    </div>
    <div className="flex items-center gap-2">
      <FaGasPump className="text-green-400 flex-shrink-0" />
      <span className="truncate">{car.fuel}</span>
    </div>
    <div className="flex items-center gap-2">
      <FaBuilding className="text-amber-400 flex-shrink-0" />
      <span className="truncate">{car.dealer.split(' ')[0]}</span>
    </div>
    {viewMode === 'list' && (
      <>
        <div className="flex items-center gap-2">
          <FaPalette className="text-pink-400 flex-shrink-0" />
          <span className="truncate">{car.color}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaUsers className="text-cyan-400 flex-shrink-0" />
          <span>{car.seats} seats</span>
        </div>
      </>
    )}
  </div>

  {/* Features Preview */}
  <div className="mb-4">
    <div className="flex flex-wrap gap-1">
      {car.features.slice(0, 3).map((feature, index) => (
        <span
          key={index}
          className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/30"
        >
          {feature}
        </span>
      ))}
      {car.features.length > 3 && (
        <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
          +{car.features.length - 3} more
        </span>
      )}
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex gap-2">
    <button 
      onClick={() => onViewDetails(car)}
      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
    >
      <FaEye className="text-sm" />
      View Details
    </button>
    <a 
      href={`tel:${car.phone}`}
      className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
      title="Call Dealer"
    >
      <FaPhone className="text-sm" />
    </a>
    <a 
      href={`https://wa.me/${car.phone.replace('+', '').replace(/\s/g, '')}`}
      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
      title="WhatsApp"
    >
      <FaWhatsapp className="text-sm" />
    </a>
  </div>

  {/* Additional Info */}
  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <FaShieldAlt className="text-green-400" />
      <span>Certified</span>
    </div>
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <FaClock className="text-blue-400" />
      <span>Just arrived</span>
    </div>
  </div>
</div>
</motion.div>
)

// Enhanced Car Details Modal Component
// Enhanced Car Details Modal Component
const CarDetailsModal = ({ 
  car, 
  selectedImageIndex, 
  onImageIndexChange, 
  onNextImage, 
  onPrevImage, 
  isAutoPlaying, 
  onAutoPlayToggle, 
  onClose, 
  isFavorite, 
  onToggleFavorite 
}) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 z-50"
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-gray-800 rounded-2xl w-[90%] max-w-5xl max-h-[95vh] overflow-hidden border border-gray-700 shadow-2xl"
    >
      <div className="relative">
        {/* Header Actions */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => onToggleFavorite(car.id)}
            className={`p-3 rounded-full backdrop-blur-lg transition-all duration-300 ${
              isFavorite 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-gray-800/80 text-gray-300 hover:bg-red-500 hover:text-white'
            }`}
          >
            <FaHeart className={`text-lg ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button className="p-3 bg-gray-800/80 backdrop-blur-lg rounded-full text-gray-300 hover:bg-blue-500 hover:text-white transition-all duration-300">
            <FaShare className="text-lg" />
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-gray-800/80 backdrop-blur-lg rounded-full text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Enhanced Image Gallery */}
        <div className="relative h-80 md:h-96 lg:h-[500px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedImageIndex}
              src={car.images[selectedImageIndex]}
              alt={`${car.name} - View ${selectedImageIndex + 1}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          
          {/* Navigation Arrows */}
          <button
            onClick={onPrevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-lg w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 border border-white/20 text-white"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={onNextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-lg w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 border border-white/20 text-white"
          >
            <FaArrowRight />
          </button>

          {/* Auto-play Control */}
          <button
            onClick={() => onAutoPlayToggle(!isAutoPlaying)}
            className="absolute top-4 left-4 bg-black/50 backdrop-blur-lg w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 border border-white/20 text-white"
          >
            {isAutoPlaying ? <FaPause className="text-sm" /> : <FaPlay className="text-sm" />}
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {car.images.map((_, index) => (
              <button
                key={index}
                onClick={() => onImageIndexChange(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  selectedImageIndex === index 
                    ? 'bg-white shadow-lg scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2 z-10">
            {car.images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => onImageIndexChange(index)}
                whileHover={{ scale: 1.05 }}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  selectedImageIndex === index 
                    ? 'border-blue-400 shadow-lg' 
                    : 'border-white/30 hover:border-white/50'
                }`}
              >
                <img 
                  src={image} 
                  alt={`${car.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(95vh-500px)]">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {car.name}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border border-blue-500/30">
                  <FaCalendar />
                  {car.year}
                </span>
                <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border border-green-500/30">
                  <FaMapMarkerAlt />
                  {car.location}
                </span>
                <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border border-purple-500/30">
                  <FaCar />
                  {car.type}
                </span>
                <span className="bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border border-amber-500/30">
                  <FaStar />
                  {car.rating} Rating
                </span>
              </div>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-blue-400">
              KSh {car.price}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
            <p className="text-gray-300 text-lg leading-relaxed">{car.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-700/50 rounded-xl p-4 text-center border border-gray-600">
              <IoMdSpeedometer className="text-blue-400 text-2xl mx-auto mb-2" />
              <div className="text-white font-semibold">{car.mileage}</div>
              <div className="text-gray-400 text-sm">Mileage</div>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center border border-gray-600">
              <FaCog className="text-purple-400 text-2xl mx-auto mb-2" />
              <div className="text-white font-semibold">{car.transmission}</div>
              <div className="text-gray-400 text-sm">Transmission</div>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center border border-gray-600">
              <FaGasPump className="text-green-400 text-2xl mx-auto mb-2" />
              <div className="text-white font-semibold">{car.fuel}</div>
              <div className="text-gray-400 text-sm">Fuel Type</div>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center border border-gray-600">
              <FaUsers className="text-cyan-400 text-2xl mx-auto mb-2" />
              <div className="text-white font-semibold">{car.seats}</div>
              <div className="text-gray-400 text-sm">Seats</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Specifications */}
            <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <FaCog className="text-blue-400" />
                Technical Specifications
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-gray-300">Engine</span>
                  <span className="text-white font-semibold">{car.engine}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-gray-300">Transmission</span>
                  <span className="text-white font-semibold">{car.transmission}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-gray-300">Fuel Type</span>
                  <span className="text-white font-semibold">{car.fuel}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-gray-300">Mileage</span>
                  <span className="text-white font-semibold">{car.mileage}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-gray-300">Color</span>
                  <span className="text-white font-semibold">{car.color}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-300">Seating Capacity</span>
                  <span className="text-white font-semibold">{car.seats} seats</span>
                </div>
              </div>
            </div>

            {/* Dealer Information */}
            <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <FaBuilding className="text-green-400" />
                Dealer Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-gray-300">Dealer Name</span>
                  <span className="text-white font-semibold">{car.dealer}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-gray-300">Location</span>
                  <span className="text-white font-semibold">{car.location}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-gray-300">Contact</span>
                  <a href={`tel:${car.phone}`} className="text-blue-400 hover:text-blue-300 font-semibold">
                    {car.phone}
                  </a>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-300">Rating</span>
                  <div className="flex items-center gap-2">
                    <FaStar className="text-amber-400" />
                    <span className="text-white font-semibold">{car.rating}/5</span>
                  </div>
                </div>
              </div>
              
              {/* Dealer Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-600">
                <a
                  href={`tel:${car.phone}`}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold flex items-center justify-center gap-2"
                >
                  <FaPhone />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${car.phone.replace('+', '').replace(/\s/g, '')}`}
                  className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-center font-semibold flex items-center justify-center gap-2"
                >
                  <FaWhatsapp />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Modern Features Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <FaCertificate className="text-amber-400" />
              Vehicle Features & Amenities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {car.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 border border-gray-600 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                      <FaCheck className="text-blue-400 text-sm" />
                    </div>
                    <span className="text-gray-200 font-medium text-sm leading-tight">
                      {feature}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Interested in this vehicle?
            </h3>
            <p className="text-blue-100 mb-6">
              Contact the dealer now to schedule a test drive or get more information
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${car.phone}`}
                className="bg-white text-blue-600 py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg flex items-center justify-center gap-3"
              >
                <FaPhone />
                Call Dealer Now
              </a>
              <a
                href={`https://wa.me/${car.phone.replace('+', '').replace(/\s/g, '')}`}
                className="bg-green-500 text-white py-4 px-8 rounded-lg hover:bg-green-600 transition-colors font-bold text-lg flex items-center justify-center gap-3"
              >
                <FaWhatsapp />
                WhatsApp Dealer
              </a>
              <button 
                onClick={onClose}
                className="bg-gray-700 text-white py-4 px-8 rounded-lg hover:bg-gray-600 transition-colors font-bold text-lg"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
)