"use client"

import { useState, useEffect } from 'react'
import { 
  FaMapMarkerAlt, FaCog, FaGasPump, FaBuilding, FaPhone, FaCalendar, 
  FaStar, FaHeart, FaShare, FaArrowLeft, FaArrowRight, FaPlay, FaPause,
  FaWhatsapp, FaUsers, FaPalette, FaShieldAlt, FaCertificate, FaCheck,
  FaEnvelope, FaCar, FaTimes, FaCarSide, FaFilter, FaList, FaTh,
  FaSearch, FaSlidersH, FaChevronDown, FaChevronUp, FaTimesCircle,
  FaArrowLeft as FaLeft, FaArrowRight as FaRight
} from 'react-icons/fa'
import { IoMdSpeedometer } from 'react-icons/io'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CircularProgress, Skeleton, Pagination } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// import Head from 'next/head'
import { carData } from '../components/mockdata/page'

export default function CarListingPage() {
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [displayedCars, setDisplayedCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState({})
  const [layout, setLayout] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [carsPerPage] = useState(8)
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [0, 10000000],
    year: '',
    fuelType: '',
    transmission: '',
    location: '',
    dealer: '',
    features: []
  })

  const router = useRouter()

  // All available features from cars
  const allFeatures = [...new Set(carData.flatMap(car => car.features))]

  // Simulate API call
  useEffect(() => {
    const loadCars = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        setCars(carData)
        setFilteredCars(carData)
        
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        const favoriteMap = {}
        favorites.forEach(id => {
          favoriteMap[id] = true
        })
        setIsFavorite(favoriteMap)
      } catch (error) {
        console.error('Error loading cars:', error)
        toast.error('Failed to load cars')
      } finally {
        setLoading(false)
      }
    }

    loadCars()
  }, [])

  // Filter cars based on search and filters
  useEffect(() => {
    let results = cars

    // Search filter
    if (searchTerm) {
      results = results.filter(car => 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.dealer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.features.some(feature => 
          feature.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Price range filter
    results = results.filter(car => {
      const price = parseFloat(car.price.replace(/,/g, ''))
      return price >= selectedFilters.priceRange[0] && price <= selectedFilters.priceRange[1]
    })

    // Other filters
    if (selectedFilters.year) {
      results = results.filter(car => car.year === selectedFilters.year)
    }
    if (selectedFilters.fuelType) {
      results = results.filter(car => car.fuel === selectedFilters.fuelType)
    }
    if (selectedFilters.transmission) {
      results = results.filter(car => car.transmission === selectedFilters.transmission)
    }
    if (selectedFilters.location) {
      results = results.filter(car => car.location === selectedFilters.location)
    }
    if (selectedFilters.dealer) {
      results = results.filter(car => car.dealer === selectedFilters.dealer)
    }

    // Features filter
    if (selectedFilters.features.length > 0) {
      results = results.filter(car =>
        selectedFilters.features.every(feature =>
          car.features.includes(feature)
        )
      )
    }

    setFilteredCars(results)
    setCurrentPage(1) // Reset to first page when filters change
  }, [cars, searchTerm, selectedFilters])

  // Pagination
  useEffect(() => {
    const indexOfLastCar = currentPage * carsPerPage
    const indexOfFirstCar = indexOfLastCar - carsPerPage
    setDisplayedCars(filteredCars.slice(indexOfFirstCar, indexOfLastCar))
  }, [filteredCars, currentPage, carsPerPage])

  const toggleFavorite = (carId, e) => {
    e.stopPropagation()
    const newFavorites = { ...isFavorite }
    if (newFavorites[carId]) {
      delete newFavorites[carId]
      toast.success('Removed from favorites')
    } else {
      newFavorites[carId] = true
      toast.success('Added to favorites')
    }
    
    setIsFavorite(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(Object.keys(newFavorites)))
  }

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const toggleFeatureFilter = (feature) => {
    setSelectedFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const clearFilters = () => {
    setSelectedFilters({
      priceRange: [0, 10000000],
      year: '',
      fuelType: '',
      transmission: '',
      location: '',
      dealer: '',
      features: []
    })
    setSearchTerm('')
    toast.info('All filters cleared')
  }

  const clearSingleFilter = (filterType) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: filterType === 'priceRange' ? [0, 10000000] : 
                    filterType === 'features' ? [] : ''
    }))
  }

  const handleCarClick = (carId) => {
    router.push(`/carlisting/${carId}`)
  }

  // Get unique values for filter options
  const uniqueYears = [...new Set(cars.map(car => car.year))].sort((a, b) => b - a)
  const uniqueFuelTypes = [...new Set(cars.map(car => car.fuel))]
  const uniqueTransmissions = [...new Set(cars.map(car => car.transmission))]
  const uniqueLocations = [...new Set(cars.map(car => car.location))]
  const uniqueDealers = [...new Set(cars.map(car => car.dealer))]

  const activeFiltersCount = Object.entries(selectedFilters).filter(([key, value]) => {
    if (key === 'priceRange') return value[0] > 0 || value[1] < 10000000
    if (key === 'features') return value.length > 0
    return value !== ''
  }).length + (searchTerm ? 1 : 0)

  const totalPages = Math.ceil(filteredCars.length / carsPerPage)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <HeaderSection />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <CarCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Corporate Header */}
        <HeaderSection />

        {/* Main Content */}
        <main className="container mx-auto  px-4 py-8">
          {/* Controls Bar */}
          <div className="flex flex-col mt-[8%] lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Premium Vehicle Collection
              </h1>
              <p className="text-gray-400">
                Discover {filteredCars.length} exceptional vehicles tailored to your lifestyle
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Box */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cars, dealers, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FaTimesCircle />
                  </button>
                )}
              </div>

              {/* Layout Toggle */}
              <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                <button
                  onClick={() => setLayout('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    layout === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setLayout('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    layout === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaList />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                }`}
              >
                <FaFilter />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {searchTerm && (
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-blue-500/30">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-200">
                    <FaTimesCircle className="text-xs" />
                  </button>
                </span>
              )}
              {selectedFilters.priceRange[0] > 0 || selectedFilters.priceRange[1] < 10000000 ? (
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-green-500/30">
                  Price: KSh {selectedFilters.priceRange[0].toLocaleString()} - {selectedFilters.priceRange[1].toLocaleString()}
                  <button onClick={() => clearSingleFilter('priceRange')} className="hover:text-green-200">
                    <FaTimesCircle className="text-xs" />
                  </button>
                </span>
              ) : null}
              {selectedFilters.year && (
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-purple-500/30">
                  Year: {selectedFilters.year}
                  <button onClick={() => clearSingleFilter('year')} className="hover:text-purple-200">
                    <FaTimesCircle className="text-xs" />
                  </button>
                </span>
              )}
              {selectedFilters.fuelType && (
                <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-orange-500/30">
                  Fuel: {selectedFilters.fuelType}
                  <button onClick={() => clearSingleFilter('fuelType')} className="hover:text-orange-200">
                    <FaTimesCircle className="text-xs" />
                  </button>
                </span>
              )}
              {selectedFilters.transmission && (
                <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-cyan-500/30">
                  Transmission: {selectedFilters.transmission}
                  <button onClick={() => clearSingleFilter('transmission')} className="hover:text-cyan-200">
                    <FaTimesCircle className="text-xs" />
                  </button>
                </span>
              )}
              {selectedFilters.features.map(feature => (
                <span key={feature} className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-pink-500/30">
                  {feature}
                  <button onClick={() => toggleFeatureFilter(feature)} className="hover:text-pink-200">
                    <FaTimesCircle className="text-xs" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1 ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8 backdrop-blur-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FaSlidersH className="text-blue-400" />
                  Refine Your Search
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price Range (KSh)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={selectedFilters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [selectedFilters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0</span>
                      <span>{selectedFilters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year
                  </label>
                  <select
                    value={selectedFilters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Year</option>
                    {uniqueYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fuel Type
                  </label>
                  <select
                    value={selectedFilters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Fuel Type</option>
                    {uniqueFuelTypes.map(fuel => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Transmission
                  </label>
                  <select
                    value={selectedFilters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Transmission</option>
                    {uniqueTransmissions.map(transmission => (
                      <option key={transmission} value={transmission}>{transmission}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <select
                    value={selectedFilters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Location</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Dealer */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dealer
                  </label>
                  <select
                    value={selectedFilters.dealer}
                    onChange={(e) => handleFilterChange('dealer', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Dealer</option>
                    {uniqueDealers.map(dealer => (
                      <option key={dealer} value={dealer}>{dealer}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Features Filter */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Features
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {allFeatures.slice(0, 12).map(feature => (
                    <button
                      key={feature}
                      onClick={() => toggleFeatureFilter(feature)}
                      className={`p-2 rounded-lg border text-xs text-left transition-all duration-200 ${
                        selectedFilters.features.includes(feature)
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                          : 'bg-gray-700/50 text-gray-300 border-gray-600 hover:border-blue-500/30'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400">
              Showing {displayedCars.length} of {filteredCars.length} vehicles
            </p>
            {filteredCars.length === 0 && !loading && (
              <div className="text-center py-12 w-full">
                <FaCar className="text-gray-500 text-4xl mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">No vehicles found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your search criteria</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Cars Grid/List */}
          {filteredCars.length > 0 && (
            <>
              <div className={
                layout === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                  : "space-y-4 mb-8"
              }>
                {displayedCars.map(car => (
                  <CarCard 
                    key={car.id} 
                    car={car} 
                    layout={layout}
                    isFavorite={isFavorite[car.id]}
                    onToggleFavorite={toggleFavorite}
                    onCarClick={handleCarClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    <FaLeft />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg border transition-all duration-200 ${
                              currentPage === page
                                ? 'bg-blue-600 text-white border-blue-500'
                                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="text-gray-400">...</span>
                      }
                      return null
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Next
                    <FaRight />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}

// Corporate Header Component
function HeaderSection() {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-gray-900 to-purple-900 border-b border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Corporate Cars Elite
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
            Your premier destination for luxury, performance, and executive vehicles. 
            Experience automotive excellence with our curated collection of premium automobiles.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-400" />
              <span>Certified Pre-Owned</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCertificate className="text-amber-400" />
              <span>Quality Assured</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-blue-400" />
              <span>Executive Service</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'Premium Vehicles', value: '200+', color: 'blue' },
            { label: 'Satisfied Clients', value: '5,000+', color: 'green' },
            { label: 'Years Experience', value: '15+', color: 'purple' },
            { label: 'Cities Covered', value: '25+', color: 'orange' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
              <div className={`text-2xl font-bold text-${stat.color}-400 mb-1`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}

// Car Card Component
function CarCard({ car, layout, isFavorite, onToggleFavorite, onCarClick }) {
  const router = useRouter()

  if (layout === 'list') {
    return (
      <div 
        onClick={() => onCarClick(car.id)}
        className="bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 p-6 cursor-pointer group"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={car.images[0]}
                alt={car.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={(e) => onToggleFavorite(car.id, e)}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-lg transition-all duration-200 ${
                  isFavorite 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-gray-800/80 text-gray-300 hover:bg-red-500 hover:text-white'
                }`}
              >
                <FaHeart className={`text-sm ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {car.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-semibold">
                    {car.year}
                  </span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
                    {car.location}
                  </span>
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs font-semibold">
                    {car.type}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-400 whitespace-nowrap">
                KSh {car.price}
              </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <IoMdSpeedometer className="text-blue-400" />
                <span>{car.mileage}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FaCog className="text-purple-400" />
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FaGasPump className="text-green-400" />
                <span>{car.fuel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FaUsers className="text-cyan-400" />
                <span>{car.seats} seats</span>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {car.features.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs text-gray-400">
                    <FaCheck className="text-green-400 text-xs" />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dealer & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                <span className="text-white font-semibold">{car.dealer}</span>
                <span className="mx-2">•</span>
                <span>{car.location}</span>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${car.phone.replace('+', '').replace(/\s/g, '')}`}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <FaWhatsapp />
                  Contact Dealer
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid Layout
  return (
    <div 
      onClick={() => onCarClick(car.id)}
      className="bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.images[0]}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => onToggleFavorite(car.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-lg transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-gray-800/80 text-gray-300 hover:bg-red-500 hover:text-white'
          }`}
        >
          <FaHeart className={`text-sm ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-1">
          <span className="bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
            {car.year}
          </span>
          <span className="bg-blue-500/80 text-white px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
            {car.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
          {car.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-blue-400">
            KSh {car.price}
          </div>
          <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded border border-amber-500/30">
            <FaStar className="text-amber-400 text-xs" />
            <span className="text-amber-400 text-xs font-medium">{car.rating}</span>
          </div>
        </div>

        {/* Quick Specs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <IoMdSpeedometer className="text-blue-400" />
            <span className="truncate">{car.mileage}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <FaCog className="text-purple-400" />
            <span className="truncate">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <FaGasPump className="text-green-400" />
            <span className="truncate">{car.fuel}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <FaUsers className="text-cyan-400" />
            <span>{car.seats} seats</span>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {car.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs border border-gray-600">
                {feature}
              </span>
            ))}
            {car.features.length > 3 && (
              <span className="bg-gray-700/50 text-gray-400 px-2 py-1 rounded text-xs border border-gray-600">
                +{car.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Dealer & Location */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
          <div className="flex items-center gap-1 truncate">
            <FaBuilding className="text-green-400" />
            <span className="truncate">{car.dealer}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-red-400" />
            <span>{car.location}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <a
            href={`https://wa.me/${car.phone.replace('+', '').replace(/\s/g, '')}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold flex items-center justify-center gap-1"
          >
            <FaWhatsapp />
            Contact
          </a>
        </div>
      </div>
    </div>
  )
}

// Skeleton Loader
function CarCardSkeleton() {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-700"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-6 bg-gray-700 rounded mb-3"></div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-3 bg-gray-700 rounded"></div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-700 rounded"></div>
          <div className="flex-1 h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}