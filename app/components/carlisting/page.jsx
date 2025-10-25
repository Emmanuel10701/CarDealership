"use client"

import { useState, useEffect } from 'react'
import { FaCar, FaMapMarkerAlt, FaCog, FaGasPump, FaBuilding, FaPhone, FaTimes, FaCalendar, FaStar, FaMoneyBillWave, FaFilter, FaHeart, FaShare, FaSearch } from 'react-icons/fa'
import { IoMdSpeedometer } from 'react-icons/io'
import { sampleCars } from '../mockdata/page.jsx'

export default function CarListing() {
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCar, setSelectedCar] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showTestDriveModal, setShowTestDriveModal] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const carsPerPage = 9

  // Test drive form state
  const [testDriveForm, setTestDriveForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  })

  // Filter state
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    carType: '',
    year: ''
  })

  useEffect(() => {
    setCars(sampleCars)
    setFilteredCars(sampleCars)
  }, [])

  // Filter options
  const locations = ['Nairobi', 'Nakuru', 'Nyeri', 'Muranga', 'Kiambu', 'Thika', 'All Central Kenya']
  const priceRanges = ['Under 500K', '500K - 1M', '1M - 2M', '2M - 5M', '5M+']
  const carTypes = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Luxury']

  // Search function
  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      applyFilters()
      return
    }

    const searchTerms = query.toLowerCase().split(' ')
    const filtered = cars.filter(car => {
      const searchableText = `
        ${car.name} ${car.location} ${car.year} ${car.type} ${car.mileage} 
        ${car.transmission} ${car.fuel} ${car.description} ${car.dealer}
        ${car.features.join(' ')} ${car.price}
      `.toLowerCase()

      return searchTerms.every(term => searchableText.includes(term))
    })

    const sorted = sortCars(filtered, sortBy)
    setFilteredCars(sorted)
    setCurrentPage(1)
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (filterParams = filters) => {
    let filtered = cars

    if (filterParams.location && filterParams.location !== 'All Locations') {
      filtered = filtered.filter(car => car.location === filterParams.location)
    }

    if (filterParams.carType && filterParams.carType !== 'All Types') {
      filtered = filtered.filter(car => car.type === filterParams.carType)
    }

    if (filterParams.year) {
      filtered = filtered.filter(car => car.year === filterParams.year)
    }

    if (filterParams.priceRange) {
      switch (filterParams.priceRange) {
        case 'Under 500K':
          filtered = filtered.filter(car => parseFloat(car.price.replace(/,/g, '')) < 500000)
          break
        case '500K - 1M':
          filtered = filtered.filter(car => {
            const price = parseFloat(car.price.replace(/,/g, ''))
            return price >= 500000 && price < 1000000
          })
          break
        case '1M - 2M':
          filtered = filtered.filter(car => {
            const price = parseFloat(car.price.replace(/,/g, ''))
            return price >= 1000000 && price < 2000000
          })
          break
        case '2M - 5M':
          filtered = filtered.filter(car => {
            const price = parseFloat(car.price.replace(/,/g, ''))
            return price >= 2000000 && price < 5000000
          })
          break
        case '5M+':
          filtered = filtered.filter(car => parseFloat(car.price.replace(/,/g, '')) >= 5000000)
          break
      }
    }

    // Apply search if there's a query
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().split(' ')
      filtered = filtered.filter(car => {
        const searchableText = `
          ${car.name} ${car.location} ${car.year} ${car.type} ${car.mileage} 
          ${car.transmission} ${car.fuel} ${car.description} ${car.dealer}
          ${car.features.join(' ')} ${car.price}
        `.toLowerCase()

        return searchTerms.every(term => searchableText.includes(term))
      })
    }

    // Apply sorting
    filtered = sortCars(filtered, sortBy)
    
    setFilteredCars(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    const clearedFilters = {
      location: '',
      priceRange: '',
      carType: '',
      year: ''
    }
    setFilters(clearedFilters)
    setSearchQuery('')
    applyFilters(clearedFilters)
  }

  const sortCars = (cars, sortType) => {
    const sorted = [...cars]
    switch (sortType) {
      case 'price-low':
        return sorted.sort((a, b) => parseFloat(a.price.replace(/,/g, '')) - parseFloat(b.price.replace(/,/g, '')))
      case 'price-high':
        return sorted.sort((a, b) => parseFloat(b.price.replace(/,/g, '')) - parseFloat(a.price.replace(/,/g, '')))
      case 'newest':
        return sorted.sort((a, b) => b.year - a.year)
      case 'oldest':
        return sorted.sort((a, b) => a.year - b.year)
      default:
        return sorted
    }
  }

  const handleSortChange = (e) => {
    const newSort = e.target.value
    setSortBy(newSort)
    const sortedCars = sortCars(filteredCars, newSort)
    setFilteredCars(sortedCars)
  }

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

  const handleTestDriveSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Test drive request:', { car: selectedCar, ...testDriveForm })
    alert('Test drive scheduled successfully! We will contact you shortly.')
    setShowTestDriveModal(false)
    setTestDriveForm({
      name: '',
      email: '',
      phone: '',
      preferredDate: '',
      preferredTime: '',
      message: ''
    })
  }

  const handleTestDriveClick = (car) => {
    setSelectedCar(car)
    setShowTestDriveModal(true)
  }

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar)
  const totalPages = Math.ceil(filteredCars.length / carsPerPage)

  const handleViewDetails = (car) => {
    setSelectedCar(car)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCar(null)
  }

  const closeTestDriveModal = () => {
    setShowTestDriveModal(false)
    setSelectedCar(null)
  }

  const hasActiveFilters = filters.location || filters.priceRange || filters.carType || filters.year || searchQuery

  // Generate page numbers with modern pagination logic
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

  return (
    <section id="cars" className="min-h-screen bg-gray-50 py-4">
      <div className="w-full px-4 sm:px-6 lg:px-20 xl:px-32">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Quality Used Cars
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover certified pre-owned vehicles across Central Kenya
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar - REDUCED WIDTH AND CENTERED */}
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-full max-w-2xl">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search cars by name, location, features, year, dealer..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 text-lg placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-300"
            >
              <span className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FaFilter className="text-blue-600" />
                Filters {hasActiveFilters && `(${Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0)})`}
              </span>
              <span className={`transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Sidebar - Hidden on mobile unless toggled */}
            <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:sticky lg:top-4">
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
                      {searchQuery && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <FaSearch className="text-xs" />
                          "{searchQuery}"
                        </span>
                      )}
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
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Sort Controls */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {Math.min(filteredCars.length, carsPerPage)} of {filteredCars.length} cars on page {currentPage}
                    {totalPages > 1 && ` of ${totalPages}`}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={handleSortChange}
                      className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modern Car Grid - 3 columns for 9 cars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                {currentCars.map(car => (
                  <div key={car.id} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group cursor-pointer">
                    <div className="relative overflow-hidden">
                      <img 
                        src={car.image} 
                        alt={car.name}
                        className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                          <FaCalendar className="text-xs" />
                          {car.year}
                        </span>
                        <span className="bg-green-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                          <FaMapMarkerAlt className="text-xs" />
                          {car.location}
                        </span>
                      </div>
                      
                      {/* Top Right Actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button 
                          onClick={(e) => toggleFavorite(car.id, e)}
                          className={`p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
                            favorites.has(car.id) 
                              ? 'bg-red-500 text-white shadow-lg' 
                              : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                          }`}
                        >
                          <FaHeart className={`text-sm ${favorites.has(car.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg">
                          <FaShare className="text-sm" />
                        </button>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                          {car.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {/* Header with Rating */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex-1 pr-2">{car.name}</h3>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                          <FaStar className="text-amber-500 text-sm" />
                          <span className="text-sm font-semibold text-amber-700">{car.rating}</span>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center mb-4">
                        <span className="text-2xl font-bold text-blue-600">KSh {car.price}</span>
                      </div>

                      {/* Specifications Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-5">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                          <IoMdSpeedometer className="text-gray-400 text-base" />
                          <span className="font-medium">{car.mileage}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                          <FaCog className="text-gray-400 text-base" />
                          <span className="font-medium">{car.transmission}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                          <FaGasPump className="text-gray-400 text-base" />
                          <span className="font-medium">{car.fuel}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                          <FaBuilding className="text-gray-400 text-base" />
                          <span className="font-medium truncate">{car.dealer.split(' ')[0]}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewDetails(car)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          <FaCar className="text-sm" />
                          View Details
                        </button>
                        <a 
                          href={`tel:${car.phone}`}
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                        >
                          <FaPhone className="text-sm" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modern Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-xl transition duration-300 text-sm font-medium min-w-[44px] ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md'
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
                    className="px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    Next →
                  </button>
                </div>
              )}

              {filteredCars.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-4">
                    {searchQuery ? `No results found for "${searchQuery}"` : 'Try adjusting your filters to see more results'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-semibold"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Car Details Modal */}
        {showModal && selectedCar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition duration-300"
                >
                  <FaTimes className="text-gray-600" />
                </button>
                
                {/* Car Images */}
                <div className="relative h-64 sm:h-80 lg:h-96">
                  <img
                    src={selectedCar.images[0]}
                    alt={selectedCar.name}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{selectedCar.name}</h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <FaCalendar />
                          {selectedCar.year}
                        </span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <FaMapMarkerAlt />
                          {selectedCar.location}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <FaCar />
                          {selectedCar.type}
                        </span>
                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <FaStar />
                          {selectedCar.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                      KSh {selectedCar.price}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">{selectedCar.description}</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        Specifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600 flex items-center gap-2">
                            <IoMdSpeedometer />
                            Mileage
                          </span>
                          <span className="font-semibold">{selectedCar.mileage}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600 flex items-center gap-2">
                            <FaCog />
                            Transmission
                          </span>
                          <span className="font-semibold">{selectedCar.transmission}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600 flex items-center gap-2">
                            <FaGasPump />
                            Fuel Type
                          </span>
                          <span className="font-semibold">{selectedCar.fuel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaBuilding className="text-green-600" />
                        Dealer Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600">Dealer</span>
                          <span className="font-semibold">{selectedCar.dealer}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600">Location</span>
                          <span className="font-semibold">{selectedCar.location}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Phone</span>
                          <a href={`tel:${selectedCar.phone}`} className="font-semibold text-blue-600 hover:text-blue-700">
                            {selectedCar.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCar.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium border border-blue-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`tel:${selectedCar.phone}`}
                      className="flex-1 bg-green-600 text-white text-center py-4 px-6 rounded-xl hover:bg-green-700 transition duration-300 font-semibold flex items-center justify-center gap-2"
                    >
                      <FaPhone />
                      Call Dealer
                    </a>
                    <button 
                      onClick={() => handleTestDriveClick(selectedCar)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition duration-300 font-semibold flex items-center justify-center gap-2"
                    >
                      <FaCar />
                      Schedule Test Drive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Drive Modal */}
        {showTestDriveModal && selectedCar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
              <div className="relative p-6">
                <button
                  onClick={closeTestDriveModal}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition duration-300"
                >
                  <FaTimes className="text-gray-600" />
                </button>
                
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Schedule Test Drive
                  </h2>
                  <p className="text-gray-600">
                    {selectedCar.name} - KSh {selectedCar.price}
                  </p>
                </div>

                <form onSubmit={handleTestDriveSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={testDriveForm.name}
                        onChange={(e) => setTestDriveForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={testDriveForm.email}
                        onChange={(e) => setTestDriveForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={testDriveForm.phone}
                        onChange={(e) => setTestDriveForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={testDriveForm.preferredDate}
                        onChange={(e) => setTestDriveForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      required
                      value={testDriveForm.preferredTime}
                      onChange={(e) => setTestDriveForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    >
                      <option value="">Select preferred time</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <textarea
                      value={testDriveForm.message}
                      onChange={(e) => setTestDriveForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      placeholder="Any specific requirements or questions..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 cursor-pointer bg-gradient-to-r  from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition duration-300 font-semibold flex items-center justify-center gap-2"
                    >
                      <FaCar />
                      Schedule Test Drive
                    </button>
                    <button
                      type="button"
                      onClick={closeTestDriveModal}
                      className="flex-1 bg-gray-500 text-white py-4 px-6 rounded-xl hover:bg-gray-600 transition duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}