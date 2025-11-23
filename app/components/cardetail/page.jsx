// components/modals/CarDetailsModal.js
"use client"

import { useState, useEffect } from 'react' // Added useEffect for cleanup
import { CircularProgress } from '@mui/material'
import { 
  FaTimes, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaCar, 
  FaCog, 
  FaGasPump, 
  FaTachometerAlt, 
  FaCheckCircle, 
  FaPhone, 
  FaUser, 
  FaEdit,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
  FaCamera
} from 'react-icons/fa'

export default function CarDetailsModal({ 
  isOpen, 
  onClose, 
  car, 
  onEdit 
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  // Reset state when modal opens for a new car
  useEffect(() => {
    if (isOpen && car) {
      setCurrentImageIndex(0);
      setImageLoading(true); // Always start loading new image
      setImageError(false);
    }
  }, [isOpen, car]);
  
  if (!isOpen || !car) return null

  // FIXED: Proper image mapping - check both files array and file field
  // This logic is robust for different API responses
  const images = Array.isArray(car.files) && car.files.length > 0 ? car.files : 
                 car.file ? [car.file] : 
                 []

  const features = Array.isArray(car.features) ? car.features : 
                   typeof car.features === 'string' ? [car.features] : 
                   []

  const currentImage = images[currentImageIndex]

  // --- Image Handlers ---
  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  const navigateImage = (direction) => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => {
        let newIndex = prev + direction;
        if (newIndex < 0) {
          newIndex = images.length - 1;
        } else if (newIndex >= images.length) {
          newIndex = 0;
        }
        return newIndex;
      });
      setImageLoading(true)
    }
  }

  const prevImage = () => navigateImage(-1);
  const nextImage = () => navigateImage(1);
  
  // --- Formatting Helpers ---
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-KE').format(mileage) + ' km'
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          
          {/* Compact Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{car.carName}</h2>
              <p className="text-gray-600 text-sm">{car.year} • {car.carType} • {car.location}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <FaTimes className="text-lg text-gray-500" />
            </button>
          </div>

          {/* Compact Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Images & Description (2/3 width) */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Image Gallery */}
              <div className="space-y-3">
                {/* Main Image Container */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  
                  {/* Image Display or No-Image Fallback */}
                  {images.length > 0 ? (
                    <>
                      {/* Loading/Error State */}
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <CircularProgress size={30} className="text-blue-600" />
                        </div>
                      )}
                      {imageError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-600 text-sm font-medium">
                            Failed to load image
                        </div>
                      )}
                      
                      {/* Actual Image */}
                      <img 
                        src={currentImage} 
                        alt={car.carName}
                        className={`w-full h-64 object-cover transition-opacity duration-300 ${
                          (imageLoading || imageError) ? 'opacity-0' : 'opacity-100'
                        }`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                      
                      {/* Navigation Arrows (Visible only if > 1 image) */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition duration-200"
                          >
                            <FaChevronLeft className="text-sm" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition duration-200"
                          >
                            <FaChevronRight className="text-sm" />
                          </button>
                          
                          {/* Image Counter (Visible only if > 1 image) */}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {currentImageIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    // Fallback when NO images are in the array
                    <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-200 text-gray-500">
                      <FaCamera className="text-3xl mb-2" />
                      <p className="text-sm">No images available</p>
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery - Displayed only if images.length > 1 */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index)
                          setImageLoading(true)
                        }}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition duration-200 ${
                          index === currentImageIndex 
                            ? 'border-blue-500 ring-1 ring-blue-300' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${car.carName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description Section */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaCar className="text-blue-600 text-sm" />
                  Description
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {car.description || 'No description available for this vehicle.'}
                </p>
              </div>

              {/* Features Section */}
              {features.length > 0 && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaCheckCircle className="text-amber-600 text-sm" />
                    Features ({features.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <span 
                        key={index}
                        className="bg-white text-amber-700 px-3 py-1 rounded-md text-xs font-medium border border-amber-200"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details (1/3 width) */}
            <div className="space-y-4">
              {/* Price & Basic Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600 mb-3">
                  KSh {formatPrice(car.price)}
                </div>
                
                {/* Compact Specs Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaCar className="text-gray-400 text-xs" />
                    <span>{car.carType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaCog className="text-gray-400 text-xs" />
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaGasPump className="text-gray-400 text-xs" />
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaTachometerAlt className="text-gray-400 text-xs" />
                    <span>{formatMileage(car.mileage)}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-700 mt-3 pt-3 border-t border-gray-100">
                  <FaMapMarkerAlt className="text-red-400 text-xs" />
                  <span className="text-sm">{car.location}</span>
                </div>
              </div>

              {/* Seller Information */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaUser className="text-green-600 text-sm" />
                  Seller Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">{car.sellerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">{car.sellerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900 text-xs break-all">{car.sellerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaCog className="text-purple-600 text-sm" />
                  Technical
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-mono font-medium text-gray-900 text-xs">{car.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium text-gray-900">{car.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Images:</span>
                    <span className="font-medium text-gray-900">{images.length} photos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 font-medium text-sm"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose()
                onEdit?.(car)
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-sm flex items-center gap-2"
            >
              <FaEdit className="text-xs" />
              Edit Car
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}