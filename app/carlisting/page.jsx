"use client"

import { useState, useEffect } from 'react'
import { 
  FaMapMarkerAlt, FaCog, FaGasPump, FaBuilding, FaPhone, FaCalendar, 
  FaStar, FaHeart, FaShare, FaArrowLeft, FaArrowRight, FaPlay, FaPause,
  FaUsers, FaPalette, FaShieldAlt, FaCertificate, FaCheck,
  FaEnvelope, FaCar, FaTimes, FaCarSide, FaFilter, FaList, FaTh,
  FaSearch, FaSlidersH, FaChevronDown, FaChevronUp, FaTimesCircle,
  FaArrowLeft as FaLeft, FaArrowRight as FaRight,
  FaChevronLeft, FaChevronRight, FaEye, FaTachometerAlt, FaInfoCircle
} from 'react-icons/fa'
import { IoMdSpeedometer } from 'react-icons/io'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CircularProgress, Skeleton, Pagination } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Head from 'next/head'

// Enhanced Car Card Component with Proper Image Handling
function CarCard({ car, layout, isFavorite, onToggleFavorite, onCarClick }) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const [currentImages, setCurrentImages] = useState([])

  // Generate SEO-friendly URL slug
  const generateCarSlug = (car) => {
    const baseSlug = `${car.year}-${car.name.toLowerCase().replace(/\s+/g, '-')}-${car.location.toLowerCase().replace(/\s+/g, '-')}`
    return baseSlug.replace(/[^a-z0-9-]/g, '')
  }

  // ✅ CORRECT IMAGE MAPPING - Use direct paths and handle missing images
  const mapImages = (carData) => {
    const images = []
    const pushIfValid = (p) => {
      if (!p) return
      const s = typeof p === 'string' ? p.trim() : String(p)
      if (!s) return
      // accept any extension (jpg,jpeg,png,webp,avif,gif,svg), keep path as-is
      if (!images.includes(s)) images.push(s)
    }

    if (Array.isArray(carData.files) && carData.files.length > 0) {
      carData.files.forEach(f => pushIfValid(f))
    }
    if (carData.file) pushIfValid(carData.file)
    return images
  }

  // ✅ FALLBACK IMAGES - Used when original images fail to load
  const getFallbackImages = (carData) => {
    const carType = carData.carType?.toLowerCase() || 'sedan'
    const fallbacks = {
      'suv': '/car-placeholders/suv.jpg',
      'sedan': '/car-placeholders/sedan.jpg',
      'luxury sedan': '/car-placeholders/luxury.jpg',
      'convertible': '/car-placeholders/convertible.jpg',
      'luxury': '/car-placeholders/luxury.jpg',
      'default': '/car-placeholders/default.jpg'
    }
    
    // Find the best matching fallback
    for (const [key, value] of Object.entries(fallbacks)) {
      if (carType.includes(key)) {
        return [value]
      }
    }
    
    return [fallbacks.default]
  }

  // Features mapping
  const mapFeatures = (carData) => {
    if (Array.isArray(carData.features)) {
      return carData.features.flatMap(feature => {
        if (typeof feature === 'string') {
          return feature.split(',').map(f => f.trim()).filter(f => f !== '')
        }
        return feature
      }).filter(f => f && f.trim() !== '')
    }
    if (typeof carData.features === 'string') {
      return carData.features.split(',').map(f => f.trim()).filter(f => f !== '')
    }
    return []
  }

  // Initialize images on component mount
  useEffect(() => {
    const originalImages = mapImages(car)
    setCurrentImages(originalImages.length > 0 ? originalImages : getFallbackImages(car))
    setCurrentImageIndex(0)
    setImageLoading(true)
    setImageError(false)
  }, [car])

  const features = mapFeatures(car)
  const carSlug = generateCarSlug(car)
  const currentImage = currentImages[currentImageIndex] || getFallbackImages(car)[0]

  const handleImageError = (e) => {
    console.warn(`Image failed to load: ${currentImage}`, e)
    // Try next image in list if available
    if (currentImages.length > 1) {
      setCurrentImageIndex(prev => (prev + 1) % currentImages.length)
      setImageLoading(true)
      return
    }
    // Fallback to placeholder images
    const fallback = getFallbackImages(car)
    setCurrentImages(fallback)
    setCurrentImageIndex(0)
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const nextImage = (e) => {
    e.stopPropagation()
    if (currentImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % currentImages.length)
      setImageLoading(true)
      setImageError(false)
    }
  }

  const prevImage = (e) => {
    e.stopPropagation()
    if (currentImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length)
      setImageLoading(true)
      setImageError(false)
    }
  }

  const handleCardClick = () => {
    router.push(`/carlisting/${car.id}/${carSlug}`)
  }

  // Format price with commas
  const formattedPrice = car.price?.toLocaleString() || '0'

  // Check if image is remote (for Next.js Image optimization)
  const isRemoteImage = currentImage?.startsWith('http')
  const imageProps = {
    src: currentImage,
    alt: `${car.year} ${car.name} for sale in ${car.location}`,
    fill: true,
    className: "object-cover group-hover:scale-105 transition-transform duration-300",
    onError: handleImageError,
    onLoad: handleImageLoad,
    priority: currentImageIndex === 0,
  }

  // Add unoptimized prop for remote images to avoid Next.js optimization issues
  if (isRemoteImage) {
    imageProps.unoptimized = true
  }

  if (layout === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 p-6 cursor-pointer group"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Enhanced Image Section */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="relative h-48 rounded-lg overflow-hidden bg-gray-700">
              <div className="relative w-full h-full">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-700 z-10">
                    <CircularProgress size={24} />
                  </div>
                )}
                <Image
                  {...imageProps}
                  sizes="(max-width: 768px) 256px, 256px"
                />
              </div>
              
              {/* Image Navigation */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm z-20"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm z-20"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {currentImages.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm z-20">
                  {currentImageIndex + 1}/{currentImages.length}
                </div>
              )}
              
              {/* Favorite Button */}
              <button
                onClick={(e) => onToggleFavorite(car.id, e)}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-lg transition-all duration-200 z-20 ${
                  isFavorite 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-gray-800/80 text-gray-300 hover:bg-red-500 hover:text-white'
                }`}
              >
                <FaHeart className={`text-sm ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              {/* Fallback indicator — no generated sample filename used */}
              {imageError && (
                <div className="absolute bottom-3 left-3 bg-amber-500/80 text-white px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm z-20">
                  Image unavailable
                </div>
              )}
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
                    {car.carType}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-400 whitespace-nowrap">
                KSh {formattedPrice}
              </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FaTachometerAlt className="text-blue-400" />
                <span>{car.mileage?.toLocaleString()} km</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FaCog className="text-purple-400" />
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FaGasPump className="text-green-400" />
                <span>{car.fuelType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FaUsers className="text-cyan-400" />
                <span>{car.seats || '5'} seats</span>
              </div>
            </div>

            {/* Features Grid */}
            {features.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                  {features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs text-gray-400">
                      <FaCheck className="text-green-400 text-xs" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {car.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 line-clamp-2">
                  {car.description}
                </p>
              </div>
            )}

            {/* Dealer & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                <span className="text-white font-semibold">{car.sellerName}</span>
                <span className="mx-2">•</span>
                <span>{car.location}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCardClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <FaInfoCircle />
                  View Details
                </button>
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
      onClick={handleCardClick}
      className="bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden group cursor-pointer"
    >
      {/* Enhanced Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-700">
        <div className="relative w-full h-full">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700 z-10">
              <CircularProgress size={20} />
            </div>
          )}
          <Image
            {...imageProps}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        
        {/* Image Navigation */}
        {currentImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm z-20"
            >
              <FaChevronLeft className="text-sm" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm z-20"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {currentImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm z-20">
            {currentImageIndex + 1}/{currentImages.length}
          </div>
        )}
        
        <button
          onClick={(e) => onToggleFavorite(car.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-lg transition-all duration-200 z-20 ${
            isFavorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-gray-800/80 text-gray-300 hover:bg-red-500 hover:text-white'
          }`}
        >
          <FaHeart className={`text-sm ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        
        <div className="absolute bottom-3 left-3 flex gap-1 z-20">
          <span className="bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
            {car.year}
          </span>
          <span className="bg-blue-500/80 text-white px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
            {car.carType}
          </span>
        </div>

        {/* Fallback indicator — no generated sample filename used */}
        {imageError && (
          <div className="absolute top-3 left-3 bg-amber-500/80 text-white px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm z-20">
            Image unavailable
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
          {car.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-blue-400">
            KSh {formattedPrice}
          </div>
          <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded border border-amber-500/30">
            <FaStar className="text-amber-400 text-xs" />
            <span className="text-amber-400 text-xs font-medium">4.5</span>
          </div>
        </div>

        {/* Quick Specs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <FaTachometerAlt className="text-blue-400" />
            <span className="truncate">{car.mileage?.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <FaCog className="text-purple-400" />
            <span className="truncate">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <FaGasPump className="text-green-400" />
            <span className="truncate">{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <FaUsers className="text-cyan-400" />
            <span>{car.seats || '5'} seats</span>
          </div>
        </div>

        {/* Features Preview */}
        {features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 3).map((feature, index) => (
                <span key={index} className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs border border-gray-600">
                  {feature}
                </span>
              ))}
              {features.length > 3 && (
                <span className="bg-gray-700/50 text-gray-400 px-2 py-1 rounded text-xs border border-gray-600">
                  +{features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Dealer & Location */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
          <div className="flex items-center gap-1 truncate">
            <FaBuilding className="text-green-400" />
            <span className="truncate">{car.sellerName}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-red-400" />
            <span>{car.location}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <button
            onClick={handleCardClick}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center justify-center gap-1"
          >
            <FaInfoCircle />
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------- MODERN FILTER COMPONENT ----------
function FilterSection({ 
  filters, 
  onFilterChange, 
  cars,
  isFilterOpen,
  onToggleFilter 
}) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [activeFilters, setActiveFilters] = useState(0)

  // Calculate active filters count
  useEffect(() => {
    let count = 0
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 10000000) count++
    if (localFilters.year) count++
    if (localFilters.fuelType) count++
    if (localFilters.transmission) count++
    if (localFilters.location) count++
    if (localFilters.carType) count++
    if (localFilters.dealer) count++
    setActiveFilters(count)
  }, [localFilters])

  // Get unique values for filter options
  const uniqueYears = [...new Set(cars.map(car => car.year))].sort((a, b) => b - a)
  const uniqueFuelTypes = [...new Set(cars.map(car => car.fuelType))].filter(Boolean)
  const uniqueTransmissions = [...new Set(cars.map(car => car.transmission))].filter(Boolean)
  const uniqueLocations = [...new Set(cars.map(car => car.location))].filter(Boolean)
  const uniqueCarTypes = [...new Set(cars.map(car => car.carType))].filter(Boolean)
  const uniqueDealers = [...new Set(cars.map(car => car.sellerName))].filter(Boolean)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceRangeChange = (min, max) => {
    const newFilters = { ...localFilters, priceRange: [min, max] }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      priceRange: [0, 10000000],
      year: '',
      fuelType: '',
      transmission: '',
      location: '',
      carType: '',
      dealer: ''
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onToggleFilter}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300 ${
            isFilterOpen || activeFilters > 0
              ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
          }`}
        >
          <FaFilter className="text-lg" />
          <span className="font-semibold">Filters</span>
          {activeFilters > 0 && (
            <span className="bg-red-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">
              {activeFilters}
            </span>
          )}
          <FaChevronDown className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>

        {activeFilters > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimesCircle />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Filter Options */}
      {isFilterOpen && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Price Range */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">Price Range</label>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>KSh {localFilters.priceRange[0].toLocaleString()}</span>
                  <span>KSh {localFilters.priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={localFilters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(localFilters.priceRange[0], parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Year */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">Year</label>
              <select
                value={localFilters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">Fuel Type</label>
              <select
                value={localFilters.fuelType}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Fuel Types</option>
                {uniqueFuelTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">Transmission</label>
              <select
                value={localFilters.transmission}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Transmissions</option>
                {uniqueTransmissions.map(trans => (
                  <option key={trans} value={trans}>{trans}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">Location</label>
              <select
                value={localFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Car Type */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">Car Type</label>
              <select
                value={localFilters.carType}
                onChange={(e) => handleFilterChange('carType', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {uniqueCarTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Dealer */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">Dealer</label>
              <select
                value={localFilters.dealer}
                onChange={(e) => handleFilterChange('dealer', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Dealers</option>
                {uniqueDealers.map(dealer => (
                  <option key={dealer} value={dealer}>{dealer}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Active Filter Tags */}
          {activeFilters > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex flex-wrap gap-2">
                {localFilters.priceRange[0] > 0 && (
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                    Min: KSh {localFilters.priceRange[0].toLocaleString()}
                  </span>
                )}
                {localFilters.priceRange[1] < 10000000 && (
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                    Max: KSh {localFilters.priceRange[1].toLocaleString()}
                  </span>
                )}
                {localFilters.year && (
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
                    Year: {localFilters.year}
                  </span>
                )}
                {localFilters.fuelType && (
                  <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm border border-purple-500/30">
                    Fuel: {localFilters.fuelType}
                  </span>
                )}
                {localFilters.transmission && (
                  <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm border border-amber-500/30">
                    {localFilters.transmission}
                  </span>
                )}
                {localFilters.location && (
                  <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm border border-red-500/30">
                    {localFilters.location}
                  </span>
                )}
                {localFilters.carType && (
                  <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm border border-cyan-500/30">
                    {localFilters.carType}
                  </span>
                )}
                {localFilters.dealer && (
                  <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm border border-pink-500/30">
                    {localFilters.dealer}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------- SEO ENGINE (client-side, dynamic based on search & results) ----------
function generateSEOMeta(searchTerm, filters, cars) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Corporate Cars Elite'
  const siteUrl = (typeof window !== 'undefined' && window.location?.origin) || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const total = (cars && cars.length) || 0

  // Build filter descriptions for SEO
  const filterDescriptions = []
  if (filters.priceRange[0] > 0) filterDescriptions.push(`from KSh ${filters.priceRange[0].toLocaleString()}`)
  if (filters.priceRange[1] < 10000000) filterDescriptions.push(`up to KSh ${filters.priceRange[1].toLocaleString()}`)
  if (filters.year) filterDescriptions.push(`${filters.year} year`)
  if (filters.fuelType) filterDescriptions.push(`${filters.fuelType} fuel`)
  if (filters.transmission) filterDescriptions.push(`${filters.transmission} transmission`)
  if (filters.location) filterDescriptions.push(`in ${filters.location}`)
  if (filters.carType) filterDescriptions.push(`${filters.carType} type`)

  const filterText = filterDescriptions.length > 0 ? ` ${filterDescriptions.join(', ')}` : ''

  // Title + description
  const title = searchTerm
    ? `${total} results for "${searchTerm}"${filterText} — ${siteName}`
    : `${total} Premium Used Cars for Sale${filterText} — ${siteName}`

  const description = searchTerm
    ? `Browse ${total} vehicles matching "${searchTerm}"${filterText}. Find prices, specifications & contact sellers directly. Search Toyota, Mercedes, BMW and more at ${siteName}.`
    : `Explore ${total} premium used cars for sale${filterText}. Toyota, Mercedes, Tesla, BMW and more. Verified dealers, competitive prices — find your next vehicle at ${siteName}.`

  // keywords: top makes/types up to 8
  const keywords = Array.from(
    new Set(
      (cars || [])
        .slice(0, 50)
        .flatMap(c => [c.name, c.carType, c.location, c.fuelType, c.transmission])
        .filter(Boolean)
        .map(s => String(s).split(' ')[0])
    )
  )
    .slice(0, 12)
    .join(', ')

  // Open Graph image: first available car image or fallback
  const ogImage =
    (cars && cars[0] && (Array.isArray(cars[0].files) ? cars[0].files[0] : cars[0].file)) ||
    '/car-placeholders/default.jpg'

  // JSON-LD ItemList for rich results
  const itemListElements = (cars || []).slice(0, 20).map((c, i) => {
    const image = Array.isArray(c.files) && c.files.length ? c.files[0] : c.file || `${siteUrl}/car-placeholders/default.jpg`
    return {
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/carlisting/${c.id}/${encodeURIComponent((c.year || '') + '-' + (c.name || '').toLowerCase().replace(/\s+/g, '-'))}`,
      name: c.name,
      image,
      description: c.description || undefined,
      offers: c.price ? { 
        "@type": "Offer", 
        price: String(c.price), 
        priceCurrency: "KES",
        availability: "https://schema.org/InStock"
      } : undefined
    }
  })

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": siteName + " - Car Listings",
    "description": description,
    "url": siteUrl + '/carlisting',
    "numberOfItems": total,
    "itemListElement": itemListElements
  }

  return { 
    title, 
    description, 
    keywords, 
    canonical: siteUrl + '/carlisting', 
    ogImage, 
    jsonLd 
  }
}

// Main Car Listing Page Component
export default function CarListingPage() {
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [displayedCars, setDisplayedCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState({})
  const [layout, setLayout] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [carsPerPage] = useState(8)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 10000000],
    year: '',
    fuelType: '',
    transmission: '',
    location: '',
    carType: '',
    dealer: ''
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearchTerm(urlSearch)
    }
  }, [searchParams])

  // Fetch cars from API - CORRECT DATA MAPPING
  useEffect(() => {
    const loadCars = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/cardeal')
        const result = await response.json()
        
        if (result.success) {
          // ✅ CORRECT TRANSFORMATION - Use API data directly
          const transformedCars = result.carListings.map(car => ({
            id: car.id,
            name: car.carName,
            price: car.price,
            location: car.location,
            year: car.year,
            carType: car.carType,
            mileage: car.mileage,
            transmission: car.transmission,
            fuelType: car.fuelType,
            features: car.features,
            description: car.description,
            sellerName: car.sellerName,
            sellerPhone: car.sellerPhone,
            sellerEmail: car.sellerEmail,
            file: car.file,
            files: car.files,
            rating: 4.5,
            seats: 5
          }))
          
          setCars(transformedCars)
          console.log('✅ Loaded cars:', transformedCars.length)
        } else {
          throw new Error(result.error || 'Failed to load cars')
        }
        
        // Load favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        const favoriteMap = {}
        favorites.forEach(id => {
          favoriteMap[id] = true
        })
        setIsFavorite(favoriteMap)
      } catch (error) {
        console.error('❌ Error loading cars:', error)
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

    // Text search
    if (searchTerm) {
      results = results.filter(car => 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.carType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(car.features) && car.features.some(feature => 
          feature.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    }

    // Advanced filters
    results = results.filter(car => {
      // Price range
      const price = parseFloat(car.price) || 0
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false

      // Year
      if (filters.year && car.year.toString() !== filters.year) return false

      // Fuel type
      if (filters.fuelType && car.fuelType !== filters.fuelType) return false

      // Transmission
      if (filters.transmission && car.transmission !== filters.transmission) return false

      // Location
      if (filters.location && car.location !== filters.location) return false

      // Car type
      if (filters.carType && car.carType !== filters.carType) return false

      // Dealer
      if (filters.dealer && car.sellerName !== filters.dealer) return false

      return true
    })

    setFilteredCars(results)
    setCurrentPage(1)
  }, [cars, searchTerm, filters])

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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const totalPages = Math.ceil(filteredCars.length / carsPerPage)

  // compute SEO meta for current view
  const seoMeta = generateSEOMeta(searchTerm, filters, filteredCars)

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
      <Head>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <link rel="canonical" href={seoMeta.canonical} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoMeta.title} />
        <meta property="og:description" content={seoMeta.description} />
        <meta property="og:image" content={seoMeta.ogImage} />
        <meta property="og:url" content={seoMeta.canonical} />
        <meta property="og:site_name" content={process.env.NEXT_PUBLIC_SITE_NAME || 'Corporate Cars Elite'} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoMeta.title} />
        <meta name="twitter:description" content={seoMeta.description} />
        <meta name="twitter:image" content={seoMeta.ogImage} />

        {/* Additional SEO Meta */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="Corporate Cars Elite" />
        
        {/* Car-specific meta tags */}
        <meta name="vehicle:type" content="used cars" />
        <meta name="vehicle:location" content="Kenya" />
        <meta name="vehicle:currency" content="KES" />

        {/* JSON-LD structured data for listings */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoMeta.jsonLd) }}
        />
      </Head>

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
        <HeaderSection />

        <main className="container mx-auto px-4 py-8">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-white">Cars for Sale</span>
              </li>
              {searchTerm && (
                <>
                  <li className="flex items-center">
                    <span className="mx-2">/</span>
                    <span className="text-blue-400">Search: "{searchTerm}"</span>
                  </li>
                </>
              )}
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Premium Vehicle Collection
              </h1>
              <p className="text-gray-400">
                Discover {filteredCars.length} exceptional vehicles tailored to your lifestyle
              </p>
              
              {/* SEO-friendly search result info */}
              {searchTerm && (
                <div className="mt-2 text-sm text-blue-400">
                  Showing results for: <strong>"{searchTerm}"</strong>
                </div>
              )}
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
            </div>
          </div>

          {/* Modern Filter Section */}
          <FilterSection
            filters={filters}
            onFilterChange={handleFilterChange}
            cars={cars}
            isFilterOpen={isFilterOpen}
            onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
          />

          {/* Cars Grid/List */}
          {filteredCars.length > 0 ? (
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
          ) : (
            <div className="text-center py-12">
              <FaCar className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No cars found</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm 
                  ? `No vehicles match your search for "${searchTerm}"`
                  : "No vehicles match your current filters"
                }
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilters({
                    priceRange: [0, 10000000],
                    year: '',
                    fuelType: '',
                    transmission: '',
                    location: '',
                    carType: '',
                    dealer: ''
                  })
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
      `}</style>
    </>
  )
}

// Header Component
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
      </div>
    </header>
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
        </div>
      </div>
    </div>
  )
}