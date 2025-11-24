"use client"

import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { 
  FaCar, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch, 
  FaSync,
  FaEye,
  FaFilter,
  FaSort,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaGasPump,
  FaTachometerAlt,
  FaCog,
  FaMapMarkerAlt,
  FaCalendar,
  FaDollarSign,
  FaTh,
  FaThList,
  FaUpload,
  FaImages,
  FaShield,
  FaCertificate,
  FaHeart,
  FaShare,
  FaChartLine,
  FaTags,
  FaHistory
} from 'react-icons/fa'
import { CircularProgress } from '@mui/material'

// Car Card Component
function CarCard({ car, viewMode, onViewCar, onEditCar, onDeleteCar, onToggleFeatured }) {
  const [imageError, setImageError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const images = Array.isArray(car.images) ? car.images : 
                car.image ? [car.image] : 
                []

  const features = Array.isArray(car.features) ? car.features : 
                  typeof car.features === 'string' ? [car.features] : 
                  []

  const handleImageError = () => {
    setImageError(true)
  }

  const nextImage = (e) => {
    e.stopPropagation()
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = (e) => {
    e.stopPropagation()
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const currentImage = images[currentImageIndex]

  if (viewMode === 'grid') {
    return (
      <div 
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        onClick={() => onViewCar?.(car)}
      >
        {/* Enhanced Image Section */}
        <div className="relative h-48 overflow-hidden">
          {images.length > 0 && !imageError ? (
            <>
              <img 
                src={currentImage} 
                alt={car.carName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={handleImageError}
              />
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                  {currentImageIndex + 1}/{images.length}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400">
              <FaCar className="text-4xl mb-2" />
              <span className="text-sm">No Image Available</span>
            </div>
          )}
          
          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
              car.status === 'available' 
                ? 'bg-green-500 text-white' 
                : car.status === 'sold'
                ? 'bg-red-500 text-white'
                : 'bg-yellow-500 text-white'
            }`}>
              {car.status?.charAt(0).toUpperCase() + car.status?.slice(1)}
            </span>
            {car.featured && (
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1">
                <FaStar className="text-xs" />
                Featured
              </span>
            )}
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setIsLiked(!isLiked)
              }}
              className={`p-2 rounded-full backdrop-blur-sm ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white'
              } transition duration-200 shadow-lg`}
            >
              <FaHeart className={`text-sm ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onToggleFeatured?.(car)
              }}
              className={`p-2 rounded-full backdrop-blur-sm ${
                car.featured ? 'bg-yellow-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white'
              } transition duration-200 shadow-lg`}
            >
              <FaStar className={`text-sm ${car.featured ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-lg line-clamp-2 flex-1">{car.carName}</h3>
              <span className="text-2xl font-bold text-blue-600 ml-2">KSh {car.price?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FaCalendar className="text-gray-400" />
                {car.year}
              </span>
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-gray-400" />
                {car.location}
              </span>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FaCar className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{car.carType}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FaTachometerAlt className="text-gray-400 flex-shrink-0" />
              <span>{car.mileage?.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FaCog className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FaGasPump className="text-gray-400 flex-shrink-0" />
              <span>{car.fuelType}</span>
            </div>
          </div>

          {/* Features Preview */}
          {features.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {features.slice(0, 3).map((feature, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                    {feature}
                  </span>
                ))}
                {features.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
                    +{features.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Footer with Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {car.sellerName?.charAt(0) || 'A'}
              </div>
              <span className="text-sm text-gray-700 font-medium truncate max-w-20">
                {car.sellerName}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onViewCar?.(car)
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition duration-200 border border-transparent hover:border-blue-200"
                title="View Details"
              >
                <FaEye className="text-base" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onEditCar?.(car)
                }}
                className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition duration-200 border border-transparent hover:border-green-200"
                title="Edit Car"
              >
                <FaEdit className="text-base" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteCar?.(car)
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition duration-200 border border-transparent hover:border-red-200"
                title="Delete Car"
              >
                <FaTrash className="text-base" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <FaEye className="text-gray-400" />
              {car.views || 0} views
            </span>
            <span className="flex items-center gap-1">
              <FaHeart className="text-gray-400" />
              {car.likes || 0} likes
            </span>
            <span className="flex items-center gap-1">
              <FaChartLine className="text-gray-400" />
              {car.inquiries || 0} inquiries
            </span>
          </div>
        </div>
      </div>
    )
  }

  // List View
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onViewCar?.(car)}
    >
      <div className="flex items-start gap-6">
        {/* Image Section */}
        <div className="relative flex-shrink-0">
          {images.length > 0 && !imageError ? (
            <>
              <img 
                src={currentImage} 
                alt={car.carName}
                className="w-32 h-24 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                onError={handleImageError}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute -right-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-32 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400">
              <FaCar className="text-xl mb-1" />
              <span className="text-xs">No Image</span>
            </div>
          )}
          
          <div className="absolute -top-2 -left-2 flex flex-col gap-1">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              car.status === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {car.status}
            </span>
            {car.featured && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <FaStar className="text-xs" />
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-xl mb-2">{car.carName}</h3>
              <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
                <span className="flex items-center gap-1">
                  <FaCalendar className="text-gray-400" />
                  {car.year}
                </span>
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-gray-400" />
                  {car.location}
                </span>
                <span className="flex items-center gap-1">
                  <FaTachometerAlt className="text-gray-400" />
                  {car.mileage?.toLocaleString()} km
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600 block">KSh {car.price?.toLocaleString()}</span>
              <span className="text-sm text-gray-500">{car.status}</span>
            </div>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-gray-500 text-sm">Type</div>
              <div className="font-semibold text-gray-900">{car.carType}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-sm">Transmission</div>
              <div className="font-semibold text-gray-900">{car.transmission}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-sm">Fuel</div>
              <div className="font-semibold text-gray-900">{car.fuelType}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-sm">Seller</div>
              <div className="font-semibold text-gray-900 truncate">{car.sellerName}</div>
            </div>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {features.slice(0, 6).map((feature, index) => (
                <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                  {feature}
                </span>
              ))}
              {features.length > 6 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium">
                  +{features.length - 6}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onViewCar?.(car)
            }}
            className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition duration-200 border border-transparent hover:border-blue-200"
            title="View Details"
          >
            <FaEye className="text-lg" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onEditCar?.(car)
            }}
            className="p-3 text-green-600 hover:bg-green-50 rounded-2xl transition duration-200 border border-transparent hover:border-green-200"
            title="Edit Car"
          >
            <FaEdit className="text-lg" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onDeleteCar?.(car)
            }}
            className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition duration-200 border border-transparent hover:border-red-200"
            title="Delete Car"
          >
            <FaTrash className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Delete Confirmation Modal
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, item, loading }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FaExclamationTriangle className="text-red-500" />
            Confirm Deletion
          </h2>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete the car "<strong>{item?.carName}</strong>"? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-2xl hover:bg-red-700 transition duration-200 font-semibold shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <CircularProgress size={20} className="text-white" />
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash />
                  Delete Car
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, trend, trendColor = 'green' }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  }

  const trendColorClasses = {
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="text-2xl" />
        </div>
      </div>
      {trend && (
        <div className="mt-4">
          <div className={`flex items-center text-sm ${trendColorClasses[trendColor]}`}>
            <FaChartLine className="mr-2" />
            <span>{trend}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Main Cars Management Component
export default function CarsManagement({ onAddCar, onEditCar, onViewCar, onDeleteCar }) {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    priceRange: 'all',
    carType: 'all',
    transmission: 'all',
    fuelType: 'all'
  })
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  // API Service
  const carsApiService = {
    async getCarListings() {
      const response = await fetch('/api/cars')
      if (!response.ok) throw new Error('Failed to fetch cars')
      const data = await response.json()
      return data.cars || []
    },

    async deleteCarListing(id) {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete car')
      return await response.json()
    },

    async toggleFeatured(id, featured) {
      const response = await fetch(`/api/cars/${id}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured })
      })
      if (!response.ok) throw new Error('Failed to update featured status')
      return await response.json()
    }
  }

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    loadCars()
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const loadCars = async () => {
    try {
      setLoading(true)
      setError('')
      const carListings = await carsApiService.getCarListings()
      setCars(carListings)
      toast.success('Cars loaded successfully!')
    } catch (err) {
      setError('Failed to load cars. Please try again.')
      toast.error('Failed to load cars!')
      console.error('Error loading cars:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCar = async (car) => {
    setDeleteConfirm(car)
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirm) {
      try {
        setActionLoading(true)
        await carsApiService.deleteCarListing(deleteConfirm.id)
        setCars(cars.filter(c => c.id !== deleteConfirm.id))
        setDeleteConfirm(null)
        toast.success('Car deleted successfully!')
        onDeleteCar?.(deleteConfirm)
      } catch (err) {
        toast.error('Failed to delete car. Please try again.')
        console.error('Error deleting car:', err)
      } finally {
        setActionLoading(false)
      }
    }
  }

  const handleToggleFeatured = async (car) => {
    try {
      setActionLoading(true)
      await carsApiService.toggleFeatured(car.id, !car.featured)
      setCars(cars.map(c => c.id === car.id ? { ...c, featured: !c.featured } : c))
      toast.success(`Car ${!car.featured ? 'added to' : 'removed from'} featured!`)
    } catch (err) {
      toast.error('Failed to update featured status!')
      console.error('Error updating featured status:', err)
    } finally {
      setActionLoading(false)
    }
  }

  // Filter and sort cars
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.carName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.carType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.sellerName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filters.status === 'all' || car.status === filters.status
    const matchesCarType = filters.carType === 'all' || car.carType === filters.carType
    const matchesTransmission = filters.transmission === 'all' || car.transmission === filters.transmission
    const matchesFuelType = filters.fuelType === 'all' || car.fuelType === filters.fuelType

    return matchesSearch && matchesStatus && matchesCarType && matchesTransmission && matchesFuelType
  })

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'price-high':
        return b.price - a.price
      case 'price-low':
        return a.price - b.price
      case 'name':
        return a.carName.localeCompare(b.carName)
      default:
        return 0
    }
  })

  // Pagination
  const carsPerPage = isMobile ? 6 : viewMode === 'grid' ? 12 : 10
  const indexOfLastCar = currentPage * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = sortedCars.slice(indexOfFirstCar, indexOfLastCar)
  const totalPages = Math.ceil(sortedCars.length / carsPerPage)

  // Stats
  const stats = {
    totalCars: cars.length,
    availableCars: cars.filter(car => car.status === 'available').length,
    featuredCars: cars.filter(car => car.featured).length,
    soldCars: cars.filter(car => car.status === 'sold').length,
    totalValue: cars.reduce((sum, car) => sum + (car.price || 0), 0)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <CircularProgress size={40} className="text-blue-600 mx-auto mb-4" />
          <span className="text-lg text-gray-600">Loading car listings...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
        <h3 className="text-red-800 font-bold text-xl mb-3">{error}</h3>
        <button
          onClick={loadCars}
          className="bg-red-600 text-white px-6 py-3 rounded-2xl hover:bg-red-700 transition duration-200 font-semibold shadow-lg"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Car Management</h1>
            <p className="text-gray-600">Manage your vehicle inventory and listings</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadCars}
              className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-2xl hover:bg-gray-700 transition duration-200 font-semibold shadow-lg"
            >
              <FaSync className="text-sm" />
              Refresh
            </button>
            <button
              onClick={onAddCar}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg"
            >
              <FaPlus className="text-sm" />
              Add New Car
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Cars"
          value={stats.totalCars}
          icon={FaCar}
          color="blue"
          trend="+5 this month"
        />
        <StatCard
          title="Available"
          value={stats.availableCars}
          icon={FaCheckCircle}
          color="green"
          trend="Ready for sale"
        />
        <StatCard
          title="Featured"
          value={stats.featuredCars}
          icon={FaStar}
          color="yellow"
          trend="Highlighted"
        />
        <StatCard
          title="Sold"
          value={stats.soldCars}
          icon={FaDollarSign}
          color="purple"
          trend="This month"
        />
        <StatCard
          title="Total Value"
          value={`KSh ${stats.totalValue.toLocaleString()}`}
          icon={FaChartLine}
          color="red"
          trend="Inventory value"
        />
      </div>

      {/* Enhanced Search and Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search cars by name, location, type, or seller..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-gray-50"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaTh className="text-lg" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaThList className="text-lg" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition duration-200 font-semibold ${
                showFilters 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <FaFilter className="text-sm" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Car Type</label>
                <select
                  value={filters.carType}
                  onChange={(e) => setFilters(prev => ({ ...prev, carType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                <select
                  value={filters.transmission}
                  onChange={(e) => setFilters(prev => ({ ...prev, transmission: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => setFilters(prev => ({ ...prev, fuelType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    status: 'all',
                    priceRange: 'all',
                    carType: 'all',
                    transmission: 'all',
                    fuelType: 'all'
                  })}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 font-medium">
          {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} found
          {searchTerm && ` for "${searchTerm}"`}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaHistory className="text-gray-400" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Cars Display - Grid or List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
      }>
        {currentCars.map((car) => (
          <CarCard 
            key={car.id} 
            car={car} 
            viewMode={viewMode}
            onViewCar={onViewCar}
            onEditCar={onEditCar}
            onDeleteCar={handleDeleteCar}
            onToggleFeatured={handleToggleFeatured}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentCars.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
          <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {searchTerm || Object.values(filters).some(f => f !== 'all') ? 'No cars found' : 'No cars available'}
          </h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            {searchTerm || Object.values(filters).some(f => f !== 'all') 
              ? 'Try adjusting your search criteria or filters' 
              : 'Start by adding your first car listing to showcase your inventory'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onAddCar}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg flex items-center gap-2 text-lg"
            >
              <FaPlus />
              Add Your First Car
            </button>
            {(searchTerm || Object.values(filters).some(f => f !== 'all')) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilters({
                    status: 'all',
                    priceRange: 'all',
                    carType: 'all',
                    transmission: 'all',
                    fuelType: 'all'
                  })
                }}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-semibold"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modern Pagination */}
      {filteredCars.length > carsPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 bg-white rounded-2xl shadow-lg gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaChevronLeft /> Previous
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <span className="text-sm text-gray-500">
              ({filteredCars.length} total cars)
            </span>
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        item={deleteConfirm}
        loading={actionLoading}
      />
    </div>
  )
}