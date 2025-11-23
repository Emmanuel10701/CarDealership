"use client"

import { useState, useEffect } from 'react'
import { CircularProgress } from '@mui/material'
import { 
  FaCar, 
  FaUsers, 
  FaList, 
  FaUserShield, 
  FaChartBar,
  FaMoneyBillWave,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaTachometerAlt,
  FaEdit,
  FaTrash,
  FaStar,
  FaSearch,
  FaChevronLeft,
  FaMapMarkerAlt,
  FaChevronRight,
  FaCheck,
  FaGasPump,
  FaCalendar,
  FaCog,
  FaPlus,
  FaBars,
  FaHome,
  FaUserCircle,
  FaTimes,
  FaSync,
  FaExclamationTriangle,
  FaTh,
  FaThList,
  FaBlog,
  FaFilter,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa'

// Import other components
import SubscribersManagement from '../../components/subscriber/page'
import CarInquiries from '../../components/CarInquiry/page'
import CarModal from '../../components/carmodel/page'
import CarDetailsModal from '../../components/cardetail/page'
import DeleteConfirmationModal from '../../components/deletemodel/page'

// Dashboard Layout Component
function DashboardLayout({ children, activePage, onTabChange }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'cars', label: 'Car Listings', icon: FaCar },
    { id: 'blog', label: 'Blog Posts', icon: FaBlog },
    { id: 'subscribers', label: 'Subscribers', icon: FaUsers },
    { id: 'inquiries', label: 'Car Inquiries', icon: FaList },
    { id: 'admins', label: 'Team Management', icon: FaUserShield },
  ]

  const handleTabChange = (tabId) => {
    onTabChange(tabId)
    if (isMobile) {
      setShowMobileSidebar(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile Overlay */}
      {isMobile && showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : 'relative'}
        ${isMobile && !showMobileSidebar ? '-translate-x-full' : 'translate-x-0'}
        ${isSidebarOpen ? 'w-72' : isMobile ? 'w-72' : 'w-20'} 
        bg-white shadow-2xl transition-all duration-300 flex flex-col
        lg:translate-x-0 border-r border-gray-100
      `}>
        {/* Logo and Close Button */}
        <div className="p-6 lg:p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          {isSidebarOpen || isMobile ? (
            <h1 className="text-2xl lg:text-3xl font-bold text-white">AutoDealer Pro</h1>
          ) : (
            <div className="flex justify-center w-full">
              <FaCar className="text-2xl lg:text-3xl text-white" />
            </div>
          )}
          {isMobile && (
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="p-2 rounded-lg hover:bg-blue-500 transition duration-200"
            >
              <FaTimes className="text-lg text-white" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <ul className="space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                      activePage === item.id
                        ? 'bg-blue-50 text-blue-700 shadow-md border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <Icon className={`text-xl flex-shrink-0 ${activePage === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    {(isSidebarOpen || isMobile) && (
                      <span className="font-semibold text-base tracking-wide">{item.label}</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FaUserCircle className="text-xl text-white" />
            </div>
            {(isSidebarOpen || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate text-base">Admin User</p>
                <p className="text-sm text-gray-600 truncate">admin@autodealer.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 lg:px-8 py-5">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => isMobile ? setShowMobileSidebar(true) : setIsSidebarOpen(!isSidebarOpen)}
                className="p-3 rounded-2xl hover:bg-gray-100 transition duration-200 border border-gray-200"
              >
                <FaBars className="text-lg text-gray-600" />
              </button>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 capitalize">
                  {activePage === 'dashboard' ? 'Admin Dashboard' : activePage.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {activePage === 'dashboard' 
                    ? 'Overview of your dealership management system' 
                    : `Manage ${activePage} efficiently`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-3 rounded-2xl hover:bg-gray-100 transition duration-200 border border-gray-200">
                <FaUserCircle className="text-xl text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  )
}


// 🔥 API SERVICE - PLACE THIS RIGHT AFTER IMPORTS AND BEFORE ANY COMPONENTS 🔥
const apiService = {
  async getCarListings() {
    const response = await fetch('/api/cardeal')
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch car listings' }))
      throw new Error(errorData.message || 'Failed to fetch car listings')
    }
    const data = await response.json()
    return data.carListings || []
  },

  async createCarListing(formData) {
    const response = await fetch('/api/cardeal', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to create car listing' 
      }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  },

  async updateCarListing(id, formData) {
    const response = await fetch(`/api/cardeal/${id}`, {
      method: 'PUT',
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to update car listing' 
      }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  },

  async deleteCarListing(id) {
    const response = await fetch(`/api/cardeal/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to delete car listing' 
      }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  },

  async getDashboardStats() {
    const cars = await this.getCarListings()
    return {
      totalCars: cars.length,
      totalSubscribers: 128,
      pendingInquiries: 8,
      totalAdmins: 4,
      revenue: '2,340,000',
      featuredCars: cars.filter(car => car.featured).length
    }
  }
}

// Modern Cars Management Component
function CarsManagement({ onAddCar, onEditCar, onDeleteCar, onViewCar }) {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

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
      const carListings = await apiService.getCarListings()
      setCars(carListings)
    } catch (err) {
      setError('Failed to load cars. Please try again.')
      console.error('Error loading cars:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCar = async (car) => {
    if (confirm(`Are you sure you want to delete ${car.carName}?`)) {
      try {
        await apiService.deleteCarListing(car.id)
        setCars(cars.filter(c => c.id !== car.id))
        onDeleteCar?.(car)
      } catch (err) {
        setError('Failed to delete car. Please try again.')
        console.error('Error deleting car:', err)
      }
    }
  }

  const carsPerPage = isMobile ? 6 : viewMode === 'grid' ? 12 : 10
  const filteredCars = cars.filter(car => 
    car.carName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.carType?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastCar = currentPage * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar)
  const totalPages = Math.ceil(filteredCars.length / carsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
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
      {/* Enhanced Search and Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search cars..."
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

            <button
              onClick={loadCars}
              className="flex items-center gap-2 bg-gray-600 text-white px-6 py-4 rounded-2xl hover:bg-gray-700 transition duration-200 font-semibold shadow-lg"
            >
              <FaSync className="text-sm" />
              <span>Refresh</span>
            </button>
            <button
              onClick={onAddCar}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg"
            >
              <FaPlus className="text-sm" />
              <span>Add New Car</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 font-medium">
          {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} found
        </p>
      </div>

      {/* Cars Display - Grid or List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
      }>
        {currentCars.map((car) => (
          <ModernCarCard 
            key={car.id} 
            car={car} 
            viewMode={viewMode}
            onViewCar={onViewCar}
            onEditCar={onEditCar}
            onDeleteCar={handleDeleteCar}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentCars.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
          <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? 'No cars found' : 'No cars available'}
          </h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first car listing to showcase your inventory'}
          </p>
          <button
            onClick={onAddCar}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg flex items-center gap-2 mx-auto text-lg"
          >
            <FaPlus />
            Add Your First Car
          </button>
        </div>
      )}

      {/* Modern Pagination */}
      {filteredCars.length > carsPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 bg-white rounded-2xl shadow-lg gap-4">
          <button
            onClick={handlePreviousPage}
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
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  )
}

// Modern Car Card Component with Image Handling
function ModernCarCard({ car, viewMode, onViewCar, onEditCar, onDeleteCar }) {
  const [imageError, setImageError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const features = Array.isArray(car.features) ? car.features : 
                  typeof car.features === 'string' ? [car.features] : 
                  []

  // Handle all image formats and multiple images - NO DEFAULT FALLBACK
  const images = Array.isArray(car.files) ? car.files : 
                car.file ? [car.file] : 
                [] // Empty array if no images

  // Function to handle image loading errors
  const handleImageError = () => {
    setImageError(true)
  }

  // Function to get the next image
  const nextImage = (e) => {
    e.stopPropagation()
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  // Function to get the previous image
  const prevImage = (e) => {
    e.stopPropagation()
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  // Current image or empty if no images
  const currentImage = images[currentImageIndex]

  if (viewMode === 'grid') {
    return (
      <div 
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
        onClick={() => onViewCar?.(car)}
      >
        {/* Enhanced Image Section with Navigation */}
        <div className="relative h-48 overflow-hidden">
          {images.length > 0 && !imageError ? (
            <>
              <img 
                src={currentImage} 
                alt={car.carName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={handleImageError}
              />
              {/* Image Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>
                </>
              )}
              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                  {currentImageIndex + 1}/{images.length}
                </div>
              )}
            </>
          ) : (
            // No image available state
            <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-400">
              <FaCar className="text-4xl mb-2" />
              <span className="text-sm">No Image Available</span>
            </div>
          )}
          
          <div className="absolute top-3 right-3">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Active
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{car.carName}</h3>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">KSh {car.price?.toLocaleString()}</span>
              <span className="text-gray-500 text-sm">{car.year}</span>
            </div>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FaCar className="text-gray-400" />
              <span className="truncate">{car.carType}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FaTachometerAlt className="text-gray-400" />
              <span>{car.mileage?.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FaCog className="text-gray-400" />
              <span className="truncate">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FaMapMarkerAlt className="text-gray-400" />
              <span className="truncate">{car.location}</span>
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

          {/* Seller Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-700 font-medium truncate">
              {car.sellerName}
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onEditCar?.(car)
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition duration-200 border border-transparent hover:border-blue-200"
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
        {/* Enhanced Image with Navigation */}
        <div className="relative flex-shrink-0">
          {images.length > 0 && !imageError ? (
            <>
              <img 
                src={currentImage} 
                alt={car.carName}
                className="w-24 h-24 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                onError={handleImageError}
              />
              {/* Image Navigation for List View */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute -right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400">
              <FaCar className="text-xl mb-1" />
              <span className="text-xs">No Image</span>
            </div>
          )}
          <span className="absolute -top-1 -right-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Active
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-1">{car.carName}</h3>
              <div className="flex items-center gap-4 text-gray-600 text-sm">
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
            <span className="text-2xl font-bold text-blue-600">KSh {car.price?.toLocaleString()}</span>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-4 gap-4 mb-3">
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
              {features.slice(0, 4).map((feature, index) => (
                <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                  {feature}
                </span>
              ))}
              {features.length > 4 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium">
                  +{features.length - 4}
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
              onEditCar?.(car)
            }}
            className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition duration-200 border border-transparent hover:border-blue-200"
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

// Enhanced Dashboard Content Component with Real Data
const DashboardContent = ({ onAddCar, setActiveTab }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    loadDashboardStats()
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      const dashboardStats = await apiService.getDashboardStats()
      setStats(dashboardStats)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <CircularProgress size={40} className="text-blue-600 mx-auto mb-4" />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl lg:text-4xl font-bold mb-3">Welcome back, Admin!</h1>
        <p className="text-blue-100 text-lg">Here's what's happening with your dealership today.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cars"
          value={stats?.totalCars || 0}
          icon={FaCar}
          color="blue"
          trend="+12% from last month"
        />
        <StatCard
          title="Subscribers"
          value={stats?.totalSubscribers || 0}
          icon={FaUsers}
          color="green"
          trend="+8% from last month"
        />
        <StatCard
          title="Pending Inquiries"
          value={stats?.pendingInquiries || 0}
          icon={FaClock}
          color="yellow"
          trend="Needs attention"
          trendColor="red"
        />
        <StatCard
          title="Monthly Revenue"
          value={`KSh ${stats?.revenue || '0'}`}
          icon={FaMoneyBillWave}
          color="purple"
          trend="+15% from last month"
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions onAddCar={onAddCar} setActiveTab={setActiveTab} pendingInquiries={stats?.pendingInquiries} />
        <RecentActivity />
      </div>

      {/* System Overview */}
      <SystemOverview stats={stats} />
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, trend, trendColor = 'green' }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  const trendColorClasses = {
    green: 'text-green-600',
    red: 'text-red-600'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${colorClasses[color]}`}>
          <Icon className="text-2xl" />
        </div>
      </div>
      <div className="mt-4">
        <div className={`flex items-center text-sm ${trendColorClasses[trendColor]}`}>
          <FaChartBar className="mr-2" />
          <span>{trend}</span>
        </div>
      </div>
    </div>
  )
}

// Quick Actions Component
function QuickActions({ onAddCar, setActiveTab, pendingInquiries }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <FaCheckCircle className="text-blue-600 text-lg" />
        Quick Actions
      </h3>
      <div className="space-y-4">
        <QuickActionButton
          icon={FaCar}
          label="Add New Car"
          color="blue"
          onClick={onAddCar}
          actionIcon="+"
        />
        <QuickActionButton
          icon={FaList}
          label="Review Inquiries"
          color="yellow"
          onClick={() => setActiveTab('inquiries')}
          badge={pendingInquiries}
        />
        <QuickActionButton
          icon={FaUserShield}
          label="Manage Team"
          color="purple"
          onClick={() => setActiveTab('admins')}
          actionIcon="→"
        />
        <QuickActionButton
          icon={FaBlog}
          label="Create Blog Post"
          color="green"
          onClick={() => setActiveTab('blog')}
          actionIcon="✎"
        />
      </div>
    </div>
  )
}

// Quick Action Button Component
function QuickActionButton({ icon: Icon, label, color, onClick, actionIcon, badge }) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100 text-blue-700',
    yellow: 'border-yellow-200 bg-yellow-50 hover:border-yellow-300 hover:bg-yellow-100 text-yellow-700',
    purple: 'border-purple-200 bg-purple-50 hover:border-purple-300 hover:bg-purple-100 text-purple-700',
    green: 'border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100 text-green-700'
  }

  const iconColorClasses = {
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    green: 'text-green-600'
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 border-2 rounded-2xl transition duration-300 ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`text-xl ${iconColorClasses[color]}`} />
        <span className="font-semibold text-gray-900 text-base">{label}</span>
      </div>
      {badge ? (
        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {badge}
        </span>
      ) : (
        <span className={`text-xl ${iconColorClasses[color]}`}>{actionIcon}</span>
      )}
    </button>
  )
}

// Recent Activity Component
function RecentActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setActivities([
        { id: 1, action: 'New car added', target: 'Toyota Camry XLE', time: '2 hours ago', type: 'car' },
        { id: 2, action: 'Car listing updated', target: 'Honda CR-V EX', time: '5 hours ago', type: 'car' },
        { id: 3, action: 'New subscriber', target: 'john.doe@example.com', time: '1 day ago', type: 'subscriber' },
        { id: 4, action: 'Inquiry received', target: 'BMW X5 inquiry', time: '1 day ago', type: 'inquiry' },
        { id: 5, action: 'Blog post published', target: 'Summer Car Maintenance Tips', time: '2 days ago', type: 'blog' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <FaClock className="text-gray-600 text-lg" />
          Recent Activity
        </h3>
        <div className="flex justify-center py-8">
          <CircularProgress size={30} className="text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <FaClock className="text-gray-600 text-lg" />
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition duration-300">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                activity.type === 'car' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'inquiry' ? 'bg-green-100 text-green-600' :
                activity.type === 'subscriber' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {activity.type === 'car' && <FaCar className="text-sm" />}
                {activity.type === 'inquiry' && <FaList className="text-sm" />}
                {activity.type === 'subscriber' && <FaUsers className="text-sm" />}
                {activity.type === 'blog' && <FaBlog className="text-sm" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 text-base truncate">{activity.action}</p>
                <p className="text-sm text-gray-600 truncate">{activity.target}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// System Overview Component
function SystemOverview({ stats }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">System Overview</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <OverviewItem
          icon={FaCar}
          value={stats?.featuredCars || 0}
          label="Featured Cars"
          color="blue"
        />
        <OverviewItem
          icon={FaUsers}
          value={stats?.totalAdmins || 0}
          label="Team Members"
          color="green"
        />
        <OverviewItem
          icon={FaList}
          value={stats?.pendingInquiries || 0}
          label="Pending Actions"
          color="yellow"
        />
        <OverviewItem
          icon={FaUserShield}
          value="24/7"
          label="System Status"
          color="purple"
        />
      </div>
    </div>
  )
}

// Overview Item Component
function OverviewItem({ icon: Icon, value, label, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  return (
    <div className="text-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${colorClasses[color]}`}>
        <Icon className="text-2xl" />
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  )
}

// Blog Management Component
function BlogManagement() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
      <FaBlog className="text-6xl text-gray-300 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Blog Management</h3>
      <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
        Create and manage engaging blog posts to attract more customers and improve your SEO ranking.
      </p>
      <div className="flex gap-4 justify-center">
        <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg">
          Create New Post
        </button>
        <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-semibold">
          View All Posts
        </button>
      </div>
    </div>
  )
}

// Admins Management Component
function AdminsManagement() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-8">
        <FaUserShield className="text-6xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Team Management</h3>
        <p className="text-gray-600 text-lg">Manage your team members and their permissions.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Team Members */}
        {[
          { name: 'John Smith', role: 'Super Admin', email: 'john@autodealer.com', status: 'active' },
          { name: 'Sarah Johnson', role: 'Content Manager', email: 'sarah@autodealer.com', status: 'active' },
          { name: 'Mike Wilson', role: 'Sales Manager', email: 'mike@autodealer.com', status: 'active' }
        ].map((member, index) => (
          <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaUserCircle className="text-2xl text-white" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h4>
              <p className="text-blue-600 font-medium mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm mb-4">{member.email}</p>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {member.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg">
          Add Team Member
        </button>
      </div>
    </div>
  )
}

// Main Admin Dashboard Component
// In your MainDashboard/page.jsx - Complete AdminDashboard component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showCarModal, setShowCarModal] = useState(false)
  const [showCarDetails, setShowCarDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [carToDelete, setCarToDelete] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // Add this function to handle car saving
  const handleSaveCar = async (formData) => {
    try {
      if (isEditing && selectedCar) {
        await apiService.updateCarListing(selectedCar.id, formData)
      } else {
        await apiService.createCarListing(formData)
      }
      
      setShowCarModal(false)
      // Refresh the cars list after successful save
      // You might want to add a state refresh here or reload the cars
    } catch (error) {
      console.error('Error saving car:', error)
      throw error // Re-throw to be caught in the modal
    }
  }

  const handleAddCar = () => {
    setSelectedCar(null)
    setIsEditing(false)
    setShowCarModal(true)
  }

  const handleEditCar = (car) => {
    setSelectedCar(car)
    setIsEditing(true)
    setShowCarModal(true)
  }

  const handleViewCar = (car) => {
    setSelectedCar(car)
    setShowCarDetails(true)
  }

  const handleDeleteCar = (car) => {
    setCarToDelete({ ...car, type: 'Car' })
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (carToDelete) {
      try {
        await apiService.deleteCarListing(carToDelete.id)
        setShowDeleteConfirm(false)
        setCarToDelete(null)
        // Refresh cars list after deletion
      } catch (error) {
        console.error('Error deleting car:', error)
        alert('Failed to delete car. Please try again.')
      }
    }
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'cars':
        return (
          <CarsManagement
            onAddCar={handleAddCar}
            onEditCar={handleEditCar}
            onViewCar={handleViewCar}
            onDeleteCar={handleDeleteCar}
          />
        )
      case 'blog':
        return <BlogManagement />
      case 'subscribers':
        return <SubscribersManagement />
      case 'inquiries':
        return <CarInquiries />
      case 'admins':
        return <AdminsManagement />
      case 'dashboard':
      default:
        return <DashboardContent onAddCar={handleAddCar} setActiveTab={setActiveTab} />
    }
  }

  return (
    <DashboardLayout activePage={activeTab} onTabChange={setActiveTab}>
      {renderContent()}

      {/* Modals */}
      <CarModal
        isOpen={showCarModal}
        onClose={() => setShowCarModal(false)}
        onSave={handleSaveCar}
        selectedCar={selectedCar}
        isEditing={isEditing}
      />

      <CarDetailsModal
        isOpen={showCarDetails}
        onClose={() => setShowCarDetails(false)}
        car={selectedCar}
        onEdit={handleEditCar}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        item={carToDelete}
      />
    </DashboardLayout>
  )
}