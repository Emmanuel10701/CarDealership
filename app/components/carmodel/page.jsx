// components/modals/CarModal.js
"use client"

import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import { CircularProgress } from '@mui/material'
import { 
  FaCar, 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaTachometerAlt, 
  FaCog, 
  FaGasPump, 
  FaUser, 
  FaPhone,
  FaEnvelope,
  FaCamera, 
  FaStar,
  FaTimes,
  FaPlus,
  FaTrash,
  FaUpload,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaImage
} from 'react-icons/fa'

export default function CarModal({ 
  isOpen, 
  onClose, 
  onSave, // This function must handle the API call (POST or PUT)
  selectedCar, 
  isEditing 
}) {
  const [features, setFeatures] = useState([])
  const [newFeature, setNewFeature] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([]) // Files added in the current session (new uploads)
  const [existingImages, setExistingImages] = useState([]) // URLs/IDs of images already on the server (to be kept)
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const fileInputRef = useRef(null)

  // Form state for controlled inputs
  const [formData, setFormData] = useState({
    carName: '',
    price: '',
    location: '',
    year: '',
    carType: '',
    mileage: '',
    transmission: '',
    fuelType: '',
    description: '',
    sellerName: '',
    sellerPhone: '',
    sellerEmail: ''
  })

  // Initialize form data when modal opens or selectedCar changes
  useEffect(() => {
    if (selectedCar) {
      setFeatures(Array.isArray(selectedCar.features) ? selectedCar.features : [])
      
      // Handle existing images from API (assuming 'files' is the standard array, falling back to 'file')
      const imagesFromApi = Array.isArray(selectedCar.files) ? selectedCar.files : 
                            selectedCar.file ? [selectedCar.file] : []
      setExistingImages(imagesFromApi)
      
      // Set form data for editing
      setFormData({
        carName: selectedCar.carName || '',
        price: selectedCar.price || '',
        location: selectedCar.location || '',
        year: selectedCar.year || '',
        carType: selectedCar.carType || '',
        mileage: selectedCar.mileage || '',
        transmission: selectedCar.transmission || '',
        fuelType: selectedCar.fuelType || '',
        description: selectedCar.description || '',
        sellerName: selectedCar.sellerName || '',
        sellerPhone: selectedCar.sellerPhone || '',
        sellerEmail: selectedCar.sellerEmail || ''
      })
      
      // Reset image index after data load
      setCurrentImageIndex(0); 
    } else {
      // Reset for new car listing
      setFeatures([])
      setExistingImages([])
      setUploadedFiles([])
      setFormData({
        carName: '',
        price: '',
        location: '',
        year: '',
        carType: '',
        mileage: '',
        transmission: '',
        fuelType: '',
        description: '',
        sellerName: '',
        sellerPhone: '',
        sellerEmail: ''
      })
    }
  }, [selectedCar, isOpen])

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.carName?.trim()) errors.carName = 'Car name is required'
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Valid price is required'
    if (!formData.location?.trim()) errors.location = 'Location is required'
    if (!formData.year || parseInt(formData.year) < 1990) errors.year = 'Valid year is required'
    if (!formData.carType?.trim()) errors.carType = 'Car type is required'
    if (!formData.mileage || parseInt(formData.mileage) < 0) errors.mileage = 'Valid mileage is required'
    if (!formData.transmission?.trim()) errors.transmission = 'Transmission is required'
    if (!formData.fuelType?.trim()) errors.fuelType = 'Fuel type is required'
    if (!formData.sellerName?.trim()) errors.sellerName = 'Seller name is required'
    if (!formData.sellerPhone?.trim()) errors.sellerPhone = 'Seller phone is required'
    if (!formData.sellerEmail?.trim()) {
      errors.sellerEmail = 'Seller email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.sellerEmail)) {
      errors.sellerEmail = 'Valid email is required'
    }
    if (!formData.description?.trim()) errors.description = 'Description is required'

    // Validate at least one image exists (either existing or new uploads)
    if (existingImages.length === 0 && uploadedFiles.length === 0) {
      errors.images = 'At least one image is required'
    }

    return errors
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  
  const errors = validateForm()
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors)
    toast.error('Please fix the form errors before submitting', {
      position: "top-right",
      autoClose: 4000,
    })
    return
  }

  setIsLoading(true)
  setFormErrors({})

  try {
    // --- CORE SUBMISSION LOGIC ---
    const submitFormData = new FormData()
    
    // 1. Add all standard form fields - USE formData STATE, NOT carData
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
        submitFormData.append(key, formData[key]);
      }
    });

    // 2. Add features (Array handled by appending multiple times with the same key)
    features.forEach(feature => {
      if (feature.trim()) {
        submitFormData.append('features', feature.trim())
      }
    })
    
    // 3. Add new files (Array of files handled by appending multiple times with the 'files' key)
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach(file => {
        submitFormData.append('files', file)
      })
    }
    
    // 4. Handle Existing Images for PUT/Update
    if (isEditing && existingImages.length > 0) {
      existingImages.forEach(imageIdentifier => {
        submitFormData.append('existingImagesToKeep', imageIdentifier);
      });
    }

    // DEBUG: Check what's being sent (UNCOMMENT THIS TO SEE THE DATA)
    console.log('=== FORM DATA BEING SENT ===');
    for (let [key, value] of submitFormData.entries()) {
      console.log(key + ': ', value);
    }
    console.log('=== END FORM DATA ===');

    // Show loading toast
    const loadingToast = toast.loading(
      isEditing ? 'Updating car listing...' : 'Creating car listing...',
      { position: "top-right", autoClose: false, hideProgressBar: false }
    )

    // Pass the FormData directly to onSave
    await onSave(submitFormData)

    // Update toast to success
    toast.update(loadingToast, {
      render: isEditing ? 'Car listing updated successfully! 🎉' : 'Car listing created successfully! 🎉',
      type: "success",
      isLoading: false,
      autoClose: 3000,
      closeOnClick: true,
      draggable: true,
    })

    // Reset form and close
    setUploadedFiles([])
    setFeatures([])
    setExistingImages([])
    setFormData({
      carName: '', price: '', location: '', year: '', carType: '', 
      mileage: '', transmission: '', fuelType: '', description: '',
      sellerName: '', sellerPhone: '', sellerEmail: ''
    })
    onClose()
    
  } catch (error) {
    console.error('Error saving car:', error)
    toast.error(
      isEditing ? 'Failed to update car listing. Please try again.' : 'Failed to create car listing. Please try again.',
      { position: "top-right", autoClose: 5000 }
    )
  } finally {
    setIsLoading(false)
  }
}

  const addFeature = () => {
    if (newFeature.trim()) {
      if (features.includes(newFeature.trim())) {
        toast.warning('Feature already exists! ⚠️', { autoClose: 3000 })
        return
      }
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
      toast.success('Feature added! ✅', { autoClose: 2000 })
    }
  }

  const removeFeature = (index) => {
    const featureToRemove = features[index]
    setFeatures(features.filter((_, i) => i !== index))
    toast.info(`Feature "${featureToRemove}" removed`, { autoClose: 2000 })
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const validFiles = files.filter(file => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024)
    
    // Check total images count
    const totalImages = existingImages.length + uploadedFiles.length + validFiles.length
    if (totalImages > 10) {
      toast.error('Maximum 10 images allowed per car', { autoClose: 4000 })
      return
    }

    setUploadedFiles(prev => [...prev, ...validFiles])
    
    if (validFiles.length > 0) {
      toast.success(`Added ${validFiles.length} image${validFiles.length > 1 ? 's' : ''} 📸`, { autoClose: 2000 })
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeUploadedFile = (index) => {
    const fileToRemove = uploadedFiles[index]
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
    
    if (currentImageIndex >= uploadedFiles.length - 1) {
      setCurrentImageIndex(Math.max(0, uploadedFiles.length - 2))
    }
    
    toast.info(`Image "${fileToRemove.name}" removed`, { autoClose: 2000 })
  }

  const removeExistingImage = (index) => {
    const imageIdentifier = existingImages[index]
    setExistingImages(existingImages.filter((_, i) => i !== index))
    
    // Adjust current image index if needed
    const totalNew = uploadedFiles.length;
    const totalExistingAfterRemoval = existingImages.length - 1;

    if (currentImageIndex >= totalNew + totalExistingAfterRemoval) {
        setCurrentImageIndex(Math.max(0, totalNew + totalExistingAfterRemoval - 1));
    }
    
    toast.info(`Existing image removed (will be deleted on save)`, { autoClose: 2000 })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFeature()
    }
  }

  const totalImages = uploadedFiles.length + existingImages.length
  
  const nextImage = () => {
    if (totalImages > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages)
    }
  }

  const prevImage = () => {
    if (totalImages > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
    }
  }

  const getCurrentImageUrl = () => {
    const totalUploaded = uploadedFiles.length
    if (currentImageIndex < totalUploaded) {
      // New file is displayed using URL.createObjectURL
      return URL.createObjectURL(uploadedFiles[currentImageIndex])
    } else {
      // Existing file (URL/ID string) from the server
      return existingImages[currentImageIndex - totalUploaded]
    }
  }

  const getFieldError = (fieldName) => {
    return formErrors[fieldName] ? (
      <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <FaTimes className="text-xs" />
        {formErrors[fieldName]}
      </span>
    ) : null
  }

  // Modern input styling
  const inputClassName = (hasError) => 
    `w-full p-4 bg-gray-50 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition duration-200 ${
      hasError ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
    } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`

  const selectClassName = (hasError) => 
    `w-full p-4 bg-gray-50 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition duration-200 appearance-none cursor-pointer ${
      hasError ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
    } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-2">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Car Listing' : 'Add New Car Listing'}
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-3 hover:bg-gray-100 rounded-2xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaTimes className="text-xl text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaCar className="text-blue-600 text-xl" />
                    Car Name *
                  </label>
                  <input 
                    type="text" 
                    name="carName"
                    value={formData.carName}
                    onChange={handleInputChange}
                    className={inputClassName(formErrors.carName)}
                    placeholder="e.g., Toyota Camry XLE"
                    disabled={isLoading}
                  />
                  {getFieldError('carName')}
                </div>
                
                <div>
                  <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaMoneyBillWave className="text-green-600 text-xl" />
                    Price (KSh) *
                  </label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    className={inputClassName(formErrors.price)}
                    placeholder="e.g., 2850000"
                    disabled={isLoading}
                  />
                  {getFieldError('price')}
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaMapMarkerAlt className="text-red-600 text-xl" />
                    Location *
                  </label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={inputClassName(formErrors.location)}
                    placeholder="e.g., Nairobi, Kenya"
                    disabled={isLoading}
                  />
                  {getFieldError('location')}
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaCalendar className="text-blue-600 text-xl" />
                    Year *
                  </label>
                  <input 
                    type="number" 
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={inputClassName(formErrors.year)}
                    placeholder="e.g., 2023"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    disabled={isLoading}
                  />
                  {getFieldError('year')}
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaCar className="text-blue-600 text-xl" />
                    Car Type *
                  </label>
                  <select 
                    name="carType"
                    value={formData.carType}
                    onChange={handleInputChange}
                    className={selectClassName(formErrors.carType)}
                    disabled={isLoading}
                  >
                    <option value="">Select Car Type</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Minivan">Minivan</option>
                    <option value="Sports Car">Sports Car</option>
                    <option value="Electric">Electric</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                  {getFieldError('carType')}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaTachometerAlt className="text-blue-600 text-xl" />
                    Mileage (km) *
                  </label>
                  <input 
                    type="number" 
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    className={inputClassName(formErrors.mileage)}
                    placeholder="e.g., 12500"
                    disabled={isLoading}
                  />
                  {getFieldError('mileage')}
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaCog className="text-blue-600 text-xl" />
                    Transmission *
                  </label>
                  <select 
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className={selectClassName(formErrors.transmission)}
                    disabled={isLoading}
                  >
                    <option value="">Select Transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                    <option value="Semi-Automatic">Semi-Automatic</option>
                  </select>
                  {getFieldError('transmission')}
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaGasPump className="text-blue-600 text-xl" />
                    Fuel Type *
                  </label>
                  <select 
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className={selectClassName(formErrors.fuelType)}
                    disabled={isLoading}
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                  {getFieldError('fuelType')}
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaUser className="text-blue-600 text-xl" />
                    Seller Name *
                  </label>
                  <input 
                    type="text" 
                    name="sellerName"
                    value={formData.sellerName}
                    onChange={handleInputChange}
                    className={inputClassName(formErrors.sellerName)}
                    placeholder="e.g., John Smith"
                    disabled={isLoading}
                  />
                  {getFieldError('sellerName')}
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaPhone className="text-blue-600 text-xl" />
                    Seller Phone *
                  </label>
                  <input 
                    type="tel" 
                    name="sellerPhone"
                    value={formData.sellerPhone}
                    onChange={handleInputChange}
                    className={inputClassName(formErrors.sellerPhone)}
                    placeholder="e.g., +254712345678"
                    disabled={isLoading}
                  />
                  {getFieldError('sellerPhone')}
                </div>
              </div>

              {/* Full Width Fields */}
              <div className="lg:col-span-2">
                <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                  <FaEnvelope className="text-blue-600 text-xl" />
                  Seller Email *
                </label>
                <input 
                  type="email" 
                  name="sellerEmail"
                  value={formData.sellerEmail}
                  onChange={handleInputChange}
                  className={inputClassName(formErrors.sellerEmail)}
                  placeholder="e.g., seller@example.com"
                  disabled={isLoading}
                />
                {getFieldError('sellerEmail')}
              </div>

              {/* Enhanced Image Upload Section */}
              <div className="lg:col-span-2">
                <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                  <FaCamera className="text-blue-600 text-xl" />
                  Car Images *
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({totalImages}/10 images)
                  </span>
                </label>
                
                {/* Modern File Upload Button */}
                <div className="mb-4">
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={isLoading || totalImages >= 10}
                  />
                  <label 
                    htmlFor="file-upload"
                    className={`flex items-center justify-center gap-3 w-full p-6 border-2 border-dashed rounded-2xl transition duration-200 cursor-pointer ${
                      totalImages >= 10 
                        ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700'
                    }`}
                  >
                    <FaUpload className="text-xl" />
                    <div className="text-center">
                      <p className="text-lg font-semibold">Click to upload images</p>
                      <p className="text-sm">PNG, JPG, JPEG, WEBP up to 5MB each</p>
                    </div>
                  </label>
                </div>
                
                {/* Image Gallery with Navigation */}
                {totalImages > 0 && (
                  <div className="space-y-4">
                    {/* Main Image Display */}
                    <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
                      <img 
                        src={getCurrentImageUrl()} 
                        alt={`Preview ${currentImageIndex + 1}`}
                        className="w-full h-64 object-cover cursor-pointer"
                        onClick={nextImage}
                      />
                      
                      {/* Navigation Arrows */}
                      {totalImages > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              prevImage()
                            }}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition duration-200 cursor-pointer"
                          >
                            <FaChevronLeft className="text-lg" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              nextImage()
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition duration-200 cursor-pointer"
                          >
                            <FaChevronRight className="text-lg" />
                          </button>
                        </>
                      )}
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {totalImages}
                      </div>

                      {/* Image Type Badge */}
                      <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        {currentImageIndex < uploadedFiles.length ? 'New Upload' : 'Existing'}
                      </div>
                    </div>

                    {/* Thumbnail Strip */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {/* New Uploaded Files */}
                      {uploadedFiles.map((file, index) => (
                        <div 
                          key={`uploaded-${index}`} 
                          className={`relative flex-shrink-0 cursor-pointer group ${
                            index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Thumbnail ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeUploadedFile(index)
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs text-center py-0.5">
                            New
                          </div>
                        </div>
                      ))}
                      
                      {/* Existing Images */}
                      {existingImages.map((image, index) => (
                        <div 
                          key={`existing-${index}`} 
                          className={`relative flex-shrink-0 cursor-pointer group ${
                            (index + uploadedFiles.length) === currentImageIndex ? 'ring-2 ring-green-500' : ''
                          }`}
                          onClick={() => setCurrentImageIndex(index + uploadedFiles.length)}
                        >
                          <img 
                            src={image} 
                            alt={`Existing ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeExistingImage(index)
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs text-center py-0.5">
                            Existing
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Images Warning */}
                {totalImages === 0 && (
                  <div className="text-center py-8 bg-yellow-50 rounded-2xl border border-yellow-200">
                    <FaImage className="text-3xl text-yellow-500 mx-auto mb-3" />
                    <p className="text-yellow-700 font-medium">No images uploaded yet</p>
                    <p className="text-yellow-600 text-sm">Please upload at least one car image</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                  <FaStar className="text-blue-600 text-xl" />
                  Features
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition duration-200"
                      placeholder="Add a feature (e.g., Sunroof, GPS)"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      disabled={isLoading || !newFeature.trim()}
                      className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <FaPlus className="text-xl" />
                    </button>
                  </div>
                  
                  {/* Feature Tags Display */}
                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            disabled={isLoading}
                            className="ml-2 -mr-1 p-1 hover:bg-blue-200 rounded-full transition duration-150 disabled:opacity-50"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <label className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                  <FaEye className="text-blue-600 text-xl" />
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  className={inputClassName(formErrors.description)}
                  placeholder="Provide a detailed description of the car's condition, history, and key selling points."
                  disabled={isLoading}
                />
                {getFieldError('description')}
              </div>
            </div>

            {/* Footer and Submit Button */}
            <div className="mt-10 flex justify-end gap-4 border-t pt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-8 py-3 text-lg font-semibold border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 text-lg font-semibold bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <CircularProgress size={24} style={{ color: 'white' }} />
                ) : (
                  isEditing ? 'Save Changes' : 'Create Listing'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}