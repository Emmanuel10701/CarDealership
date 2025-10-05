"use client"

import { useState, useEffect } from 'react'
import { FaCar, FaMapMarkerAlt, FaCog, FaGasPump, FaBuilding, FaPhone, FaTimes, FaCalendar, FaTachometerAlt, FaShieldAlt, FaStar, FaMoneyBillWave, FaFilter } from 'react-icons/fa'
import { IoMdSpeedometer } from 'react-icons/io'

export default function CarListing() {
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCar, setSelectedCar] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const carsPerPage = 8

  // Filter state
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    carType: '',
    year: ''
  })

  // Sample car data
  useEffect(() => {
    const sampleCars = [
      {
        id: 1,
        name: "Toyota RAV4 2021",
        price: "2,300,000",
        location: "Nairobi",
        year: "2021",
        type: "SUV",
        mileage: "45,000 km",
        transmission: "Automatic",
        fuel: "Petrol",
        features: ["Leather Seats", "Sunroof", "Backup Camera", "Bluetooth"],
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=350&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=350&fit=crop",
          "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&h=350&fit=crop"
        ],
        description: "Well maintained Toyota RAV4 with full service history. Perfect family SUV with low mileage.",
        dealer: "Trust Auto Kenya",
        phone: "+254 712 345 678",
        rating: 4.8
      },
      {
        id: 2,
        name: "Honda Civic 2020",
        price: "1,800,000",
        location: "Nakuru",
        year: "2020",
        type: "Sedan",
        mileage: "60,000 km",
        transmission: "Automatic",
        fuel: "Petrol",
        features: ["Push Start", "Touchscreen", "Climate Control", "Keyless Entry"],
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=350&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=350&fit=crop"
        ],
        description: "Sleek Honda Civic with excellent fuel economy. One owner, accident-free.",
        dealer: "Nakuru Motors",
        phone: "+254 723 456 789",
        rating: 4.6
      },
      {
        id: 3,
        name: "Mazda CX-5 2019",
        price: "2,100,000",
        location: "Nyeri",
        year: "2019",
        type: "SUV",
        mileage: "75,000 km",
        transmission: "Automatic",
        fuel: "Diesel",
        features: ["4WD", "Roof Rails", "Parking Sensors", "LED Lights"],
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&h=350&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&h=350&fit=crop"
        ],
        description: "Powerful Mazda CX-5 with diesel engine. Great for both city and off-road driving.",
        dealer: "Central Car Dealers",
        phone: "+254 734 567 890"
      },
      {
        id: 4,
        name: "Toyota Hilux 2022",
        price: "3,500,000",
        location: "Thika",
        year: "2022",
        type: "Pickup",
        mileage: "25,000 km",
        transmission: "Manual",
        fuel: "Diesel",
        features: ["4x4", "Tow Package", "Alloy Wheels", "Double Cab"],
        image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=500&h=350&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=500&h=350&fit=crop"
        ],
        description: "Brand new Toyota Hilux with warranty. Perfect for business and personal use.",
        dealer: "Thika Auto Hub",
        phone: "+254 745 678 901"
      },
      {
        id: 5,
        name: "Subaru Outback 2020",
        price: "2,800,000",
        location: "Nairobi",
        year: "2020",
        type: "SUV",
        mileage: "50,000 km",
        transmission: "Automatic",
        fuel: "Petrol",
        features: ["AWD", "EyeSight", "Apple CarPlay", "Heated Seats"],
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=350&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=350&fit=crop"
        ],
        description: "Reliable Subaru Outback with all-wheel drive. Excellent condition.",
        dealer: "Premium Auto Kenya",
        phone: "+254 756 789 012"
      },
      {
        id: 6,
        name: "Mercedes C-Class 2021",
        price: "4,200,000",
        location: "Nairobi",
        year: "2021",
        type: "Luxury",
        mileage: "30,000 km",
        transmission: "Automatic",
        fuel: "Petrol",
        features: ["Leather", "Panoramic Roof", "Premium Sound", "Navigation"],
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&h=350&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&h=350&fit=crop"
        ],
        description: "Luxury Mercedes C-Class with all premium features. Imported from UK.",
        dealer: "Elite Motors",
        phone: "+254 767 890 123"
      },
      {
        id: 7,
        name: "Nissan X-Trail 2018",
        price: "1,900,000",
        location: "Kiambu",
        year: "2018",
        type: "SUV",
        mileage: "80,000 km",
        transmission: "CVT",
        fuel: "Petrol",
        features: ["7 Seater", "360 Camera", "Bose Sound", "Climate Control"],
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=350&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=350&fit=crop"
        ],
        description: "Spacious Nissan X-Trail perfect for large families. Well maintained.",
        dealer: "Kiambu Auto Center",
        phone: "+254 778 901 234"
      },
      {
        id: 8,
        name: "Toyota Premio 2019",
        price: "1,600,000",
        location: "Muranga",
        year: "2019",
        type: "Sedan",
        mileage: "65,000 km",
        transmission: "Automatic",
        fuel: "Petrol",
        features: ["Fuel Efficient", "Comfortable", "Reliable", "Low Maintenance"],
        image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&h=350&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&h=350&fit=crop"
        ],
        description: "Popular Toyota Premio known for reliability and comfort.",
        dealer: "Muranga Motors",
        phone: "+254 789 012 345"
      },
      {
        id: 9,
        name: "Mitsubishi Pajero 2017",
        price: "2,400,000",
        location: "Nakuru",
        year: "2017",
        type: "SUV",
        mileage: "95,000 km",
        transmission: "Automatic",
        fuel: "Diesel",
        features: ["4WD", "Off-road", "7 Seater", "Roof Rails"],
        image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&h=350&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&h=350&fit=crop"
        ],
        description: "Rugged Mitsubishi Pajero ready for any adventure. Well maintained.",
        dealer: "Rift Valley Autos",
        phone: "+254 790 123 456"
      },
      {
        id: 10,
        name: "BMW X5 2020",
        price: "5,800,000",
        location: "Nairobi",
        year: "2020",
        type: "Luxury",
        mileage: "35,000 km",
        transmission: "Automatic",
        fuel: "Petrol",
        features: ["M Sport", "Heads-up Display", "Premium Package", "Park Assist"],
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=350&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=350&fit=crop"
        ],
        description: "Luxury BMW X5 with all premium features. German engineering at its best.",
        dealer: "Bavarian Motors",
        phone: "+254 701 234 567"
      }
    ]
    setCars(sampleCars)
    setFilteredCars(sampleCars)
  }, [])

  // Filter options
  const locations = ['Nairobi', 'Nakuru', 'Nyeri', 'Muranga', 'Kiambu', 'Thika', 'All Central Kenya']
  const priceRanges = ['Under 500K', '500K - 1M', '1M - 2M', '2M - 5M', '5M+']
  const carTypes = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Luxury']

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

  const hasActiveFilters = filters.location || filters.priceRange || filters.carType || filters.year

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
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-300"
            >
              <span className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FaFilter className="text-blue-600" />
                Filters {hasActiveFilters && `(${Object.values(filters).filter(Boolean).length})`}
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
                    Showing {filteredCars.length} of {cars.length} cars
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

              {/* Car Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                {currentCars.map(car => (
                  <div key={car.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                    <div className="relative">
                      <img 
                        src={car.image} 
                        alt={car.name}
                        className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <FaCalendar className="text-sm" />
                          {car.year}
                        </span>
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <FaMapMarkerAlt className="text-sm" />
                          {car.location}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                          {car.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 line-clamp-1">{car.name}</h3>
                        <div className="flex items-center gap-1 text-amber-500">
                          <FaStar className="text-lg" />
                          <span className="text-lg font-semibold">{car.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <span className="text-3xl font-bold text-blue-600">KSh {car.price}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-lg text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <IoMdSpeedometer className="text-gray-400" />
                          <span>{car.mileage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCog className="text-gray-400" />
                          <span>{car.transmission}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaGasPump className="text-gray-400" />
                          <span>{car.fuel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaBuilding className="text-gray-400" />
                          <span className="truncate">{car.dealer.split(' ')[0]}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewDetails(car)}
                          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition duration-300 font-semibold text-lg flex items-center justify-center gap-2"
                        >
                          <FaCar />
                          View Details
                        </button>
                        <a 
                          href={`tel:${car.phone}`}
                          className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition duration-300 flex items-center justify-center"
                        >
                          <FaPhone />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 text-sm"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-lg transition duration-300 text-sm ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 text-sm"
                  >
                    Next
                  </button>
                </div>
              )}

              {filteredCars.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Try adjusting your filters to see more results
                  </p>
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
                        <FaShieldAlt className="text-blue-600" />
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
                    <button className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition duration-300 font-semibold flex items-center justify-center gap-2">
                      <FaCar />
                      Schedule Test Drive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}