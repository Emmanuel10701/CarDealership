"use client"

import { useState, useEffect } from 'react'
import {
  FaCar, FaMapMarkerAlt, FaCalendar, FaShieldAlt, FaTachometerAlt,
  FaCog, FaGasPump, FaMoneyBillWave, FaUpload, FaCheck, FaPhone,
  FaEnvelope, FaUser, FaCamera, FaRocket, FaStar, FaCheckCircle,
  FaCashRegister, FaCreditCard, FaHandHoldingUsd, FaSpinner,
  FaTimes, FaExclamationTriangle, FaInfoCircle
} from 'react-icons/fa'
import { toast, Toaster } from 'react-hot-toast'

export default function SellYourCar() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([])
  const [submissionResult, setSubmissionResult] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash')
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const [formData, setFormData] = useState({
    carName: '',
    year: '',
    price: '',
    location: '',
    carType: '',
    mileage: '',
    transmission: '',
    fuelType: '',
    features: [],
    description: '',
    sellerName: '',
    sellerPhone: '',
    sellerEmail: '',
    paymentMethod: 'cash',
    financingOption: false,
    priceNegotiable: true,
    carCondition: 'excellent',
    serviceHistory: 'full',
    accidentHistory: 'none'
  })

  const carTypes = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Luxury', 'Convertible', 'Coupe', 'Minivan', 'Truck']
  const transmissions = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic']
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG']
  const locations = ['Nairobi', 'Nakuru', 'Nyeri', 'Muranga', 'Kiambu', 'Thika', 'Mombasa', 'Kisumu', 'Eldoret', 'Other']
  const conditions = [
    { value: 'excellent', label: 'Excellent', color: 'text-green-600' },
    { value: 'very good', label: 'Very Good', color: 'text-blue-600' },
    { value: 'good', label: 'Good', color: 'text-yellow-600' },
    { value: 'fair', label: 'Fair', color: 'text-orange-600' },
    { value: 'needs work', label: 'Needs Work', color: 'text-red-600' }
  ]
  const serviceHistories = ['full', 'partial', 'none', 'recent']
  const accidentHistories = ['none', 'minor', 'moderate', 'major']
  const paymentMethods = [
    { value: 'cash', label: 'Cash Payment', icon: FaCashRegister, description: 'Immediate cash payment', color: 'bg-green-500' },
    { value: 'installment', label: 'Installment Plan', icon: FaCreditCard, description: 'Pay in flexible installments', color: 'bg-blue-500' },
    { value: 'financing', label: 'Bank Financing', icon: FaHandHoldingUsd, description: 'Arrange bank financing', color: 'bg-purple-500' }
  ]

  const featuresList = [
    'Air Conditioning', 'Leather Seats', 'Sunroof', 'Navigation', 'Backup Camera',
    'Bluetooth', 'Push Start', 'Keyless Entry', 'Climate Control', 'Alloy Wheels',
    'Parking Sensors', 'LED Lights', 'Premium Sound', 'Heated Seats', '4WD/AWD',
    'Tow Package', 'Roof Rails', 'Third Row Seating', 'Apple CarPlay', 'Android Auto',
    'Cruise Control', 'Power Windows', 'Power Locks', 'ABS Brakes', 'Airbags',
    'GPS Tracking', 'Alarm System', 'Fog Lights', 'Running Boards', 'Tinted Windows'
  ]

  const steps = [
    { label: 'Basic Information', icon: FaCar, description: 'Car basic details' },
    { label: 'Specifications', icon: FaCog, description: 'Technical specifications' },
    { label: 'Description & Condition', icon: FaStar, description: 'Car condition details' },
    { label: 'Contact & Photos', icon: FaUser, description: 'Your info and photos' },
    { label: 'Payment Options', icon: FaCashRegister, description: 'Payment preferences' }
  ]

  // Toast notifications
  const showToast = (message, type = 'success') => {
    switch (type) {
      case 'success':
        toast.success(message)
        break
      case 'error':
        toast.error(message)
        break
      case 'loading':
        toast.loading(message)
        break
      default:
        toast(message)
    }
  }

  // Validate form step
  const validateStep = (step) => {
    const errors = {}
    
    switch (step) {
      case 0:
        if (!formData.carName.trim()) errors.carName = 'Car model is required'
        if (!formData.year) errors.year = 'Manufacturing year is required'
        if (!formData.price) errors.price = 'Price is required'
        if (!formData.location) errors.location = 'Location is required'
        break
      case 1:
        if (!formData.carType) errors.carType = 'Car type is required'
        if (!formData.mileage) errors.mileage = 'Mileage is required'
        if (!formData.transmission) errors.transmission = 'Transmission is required'
        if (!formData.fuelType) errors.fuelType = 'Fuel type is required'
        break
      case 2:
        if (!formData.description.trim() || formData.description.length < 50) 
          errors.description = 'Description must be at least 50 characters'
        break
      case 3:
        if (!formData.sellerName.trim()) errors.sellerName = 'Your name is required'
        if (!formData.sellerPhone.trim()) errors.sellerPhone = 'Phone number is required'
        if (!formData.sellerEmail.trim()) errors.sellerEmail = 'Email is required'
        if (imagePreviews.length < 1) errors.images = 'At least one photo is required'
        break
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 10 - imagePreviews.length)
    
    if (files.length === 0) return

    setIsLoading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 20
      })
    }, 100)

    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      name: file.name,
      type: file.type,
      size: file.size,
      id: Math.random().toString(36).substr(2, 9)
    }))

    setTimeout(() => {
      setImagePreviews(prev => [...prev, ...newPreviews])
      setUploadProgress(100)
      setIsLoading(false)
      showToast(`${files.length} image(s) uploaded successfully!`, 'success')
      
      setTimeout(() => setUploadProgress(0), 1000)
    }, 1000)
  }

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    showToast('Image removed', 'info')
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        showToast(`Moving to ${steps[currentStep + 1].label}`, 'success')
      }
    } else {
      showToast('Please fix the errors before continuing', 'error')
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      showToast('Please fix all errors before submitting', 'error')
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)

    const loadingToast = toast.loading('Publishing your car listing...')

    try {
      // Simulate form submission with progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const submitFormData = new FormData()
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          submitFormData.append(key, JSON.stringify(formData[key]))
        } else {
          submitFormData.append(key, formData[key])
        }
      })
      
      // Add images
      imagePreviews.forEach((preview, index) => {
        submitFormData.append('images', preview.file)
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const mockResult = {
        success: true,
        reference: `CAR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: 'Your car has been listed successfully!',
        listingId: Math.random().toString(36).substr(2, 9),
        estimatedViews: Math.floor(Math.random() * 5000) + 1000
      }

      setSubmissionResult(mockResult)
      setCurrentStep(steps.length)
      
      toast.dismiss(loadingToast)
      showToast('Car listed successfully! 🎉', 'success')

    } catch (error) {
      console.error("Error submitting form:", error)
      toast.dismiss(loadingToast)
      showToast('Failed to list your car. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  const resetForm = () => {
    setFormData({
      carName: '',
      year: '',
      price: '',
      location: '',
      carType: '',
      mileage: '',
      transmission: '',
      fuelType: '',
      features: [],
      description: '',
      sellerName: '',
      sellerPhone: '',
      sellerEmail: '',
      paymentMethod: 'cash',
      financingOption: false,
      priceNegotiable: true,
      carCondition: 'excellent',
      serviceHistory: 'full',
      accidentHistory: 'none'
    })
    setImagePreviews([])
    setCurrentStep(0)
    setSubmissionResult(null)
    setFormErrors({})
    showToast('Form reset successfully', 'info')
  }

  // Success Step
  if (currentStep === steps.length && submissionResult?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
        <Toaster position="top-right" />
        
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <FaCheckCircle className="text-white text-5xl" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Congratulations!
            </h1>
            
            <p className="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your car has been listed successfully
            </p>

            {/* Reference Number */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 inline-block border border-green-200 shadow-lg mb-8">
              <div className="text-sm text-gray-500 mb-2 font-semibold">Reference Number</div>
              <div className="text-3xl font-black text-green-600 font-mono">{submissionResult.reference}</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-blue-200">
                <div className="text-3xl font-black text-blue-600 mb-2">1,000+</div>
                <div className="text-gray-600 font-semibold">Potential Buyers</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-purple-200">
                <div className="text-3xl font-black text-purple-600 mb-2">24h</div>
                <div className="text-gray-600 font-semibold">Listing Live</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-green-200">
                <div className="text-3xl font-black text-green-600 mb-2">95%</div>
                <div className="text-gray-600 font-semibold">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/60 mb-12">
            <h2 className="text-4xl font-black text-gray-900 text-center mb-12">
              What Happens Next?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: FaEnvelope,
                  title: "Confirmation Email",
                  description: "We've sent a confirmation email with your listing details"
                },
                {
                  icon: FaShieldAlt,
                  title: "Under Review",
                  description: "Our team is reviewing your listing for quality assurance"
                },
                {
                  icon: FaCar,
                  title: "Goes Live",
                  description: "Your car will be visible to thousands of buyers within 24 hours"
                },
                {
                  icon: FaPhone,
                  title: "Receive Offers",
                  description: "Get calls and messages from interested buyers"
                }
              ].map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                    <step.icon className="text-white text-3xl" />
                  </div>
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4 md:space-y-0 md:space-x-6">
            <button 
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3"
            >
              <FaCar />
              List Another Car
            </button>
            <button 
              onClick={() => window.location.href = '/cars'}
              className="bg-gray-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3"
            >
              Browse Other Cars
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 600
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
          loading: {
            style: {
              background: '#2563eb',
            },
          },
        }}
      />
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Publishing Your Listing...</h3>
            <p className="text-gray-600 mb-4">{uploadProgress}% Complete</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-sm border border-gray-100 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-semibold">Sell Your Car in 5 Easy Steps</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sell Your Car
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            List your car on <span className="font-bold text-blue-600">Maina Cars</span> and connect with thousands of verified buyers across Kenya
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  currentStep === index 
                    ? 'border-blue-500 bg-white shadow-lg shadow-blue-200 transform scale-105' 
                    : currentStep > index
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white opacity-70'
                }`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  currentStep === index 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg' 
                    : currentStep > index
                    ? 'bg-green-500 shadow-lg'
                    : 'bg-gray-400'
                }`}>
                  {currentStep > index ? <FaCheck className="text-lg" /> : <step.icon className="text-lg" />}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-semibold ${
                    currentStep === index || currentStep > index ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    Step {index + 1}
                  </div>
                  <div className={`font-bold ${
                    currentStep === index || currentStep > index ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              
              {/* Step 1: Basic Information */}
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaCar className="text-blue-600 text-3xl" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-3">Basic Information</h2>
                    <p className="text-xl text-gray-600">Let's start with the basic details</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
                          <FaCar className="text-blue-600 text-xl" />
                          Car Model & Make
                        </label>
                        <input
                          type="text"
                          name="carName"
                          value={formData.carName}
                          onChange={handleInputChange}
                          placeholder="e.g., Toyota RAV4 2021"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            formErrors.carName ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {formErrors.carName && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.carName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
                          <FaCalendar className="text-blue-600 text-xl" />
                          Manufacturing Year
                        </label>
                        <input
                          type="number"
                          name="year"
                          value={formData.year}
                          onChange={handleInputChange}
                          placeholder="e.g., 2021"
                          min="1990"
                          max="2024"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            formErrors.year ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {formErrors.year && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.year}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
                          <FaMoneyBillWave className="text-green-600 text-xl" />
                          Asking Price (KSh)
                        </label>
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="e.g., 2,300,000"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            formErrors.price ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {formErrors.price && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.price}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
                          <FaMapMarkerAlt className="text-red-600 text-xl" />
                          Car Location
                        </label>
                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none ${
                            formErrors.location ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          <option value="">Select Location</option>
                          {locations.map(location => (
                            <option key={location} value={location}>{location}</option>
                          ))}
                        </select>
                        {formErrors.location && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Specifications */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaCog className="text-green-600 text-3xl" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-3">Car Specifications</h2>
                    <p className="text-xl text-gray-600">Tell us more about your car's features</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3">
                          Car Type
                        </label>
                        <select
                          name="carType"
                          value={formData.carType}
                          onChange={handleInputChange}
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            formErrors.carType ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          <option value="">Select Type</option>
                          {carTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {formErrors.carType && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.carType}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
                          <FaTachometerAlt className="text-blue-600 text-xl" />
                          Mileage (km)
                        </label>
                        <input
                          type="text"
                          name="mileage"
                          value={formData.mileage}
                          onChange={handleInputChange}
                          placeholder="e.g., 45,000"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            formErrors.mileage ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {formErrors.mileage && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.mileage}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
                          <FaCog className="text-blue-600 text-xl" />
                          Transmission
                        </label>
                        <select
                          name="transmission"
                          value={formData.transmission}
                          onChange={handleInputChange}
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            formErrors.transmission ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          <option value="">Select Transmission</option>
                          {transmissions.map(trans => (
                            <option key={trans} value={trans}>{trans}</option>
                          ))}
                        </select>
                        {formErrors.transmission && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.transmission}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
                          <FaGasPump className="text-blue-600 text-xl" />
                          Fuel Type
                        </label>
                        <select
                          name="fuelType"
                          value={formData.fuelType}
                          onChange={handleInputChange}
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            formErrors.fuelType ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          <option value="">Select Fuel Type</option>
                          {fuelTypes.map(fuel => (
                            <option key={fuel} value={fuel}>{fuel}</option>
                          ))}
                        </select>
                        {formErrors.fuelType && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.fuelType}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-lg font-bold text-gray-900 mb-6 text-center">
                      Select Available Features
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-4 border-2 border-gray-200 rounded-2xl">
                      {featuresList.map(feature => (
                        <button
                          key={feature}
                          type="button"
                          onClick={() => handleFeatureToggle(feature)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-105 ${
                            formData.features.includes(feature)
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-200'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                              formData.features.includes(feature)
                                ? 'bg-blue-500 border-blue-500'
                                : 'bg-white border-gray-300'
                            }`}>
                              {formData.features.includes(feature) && (
                                <FaCheck className="text-white text-xs" />
                              )}
                            </div>
                            <span className="font-medium">{feature}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Description & Condition */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaStar className="text-purple-600 text-3xl" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-3">Description & Condition</h2>
                    <p className="text-xl text-gray-600">Help buyers fall in love with your car</p>
                  </div>
                  
                  <div>
                    <label className="block text-lg font-bold text-gray-900 mb-4">
                      Detailed Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your car in detail. Include information about condition, service history, any accidents, special features, maintenance records, and why you're selling. Be honest and detailed to attract serious buyers..."
                      rows="6"
                      className={`w-full p-6 border-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg resize-none transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                        formErrors.description ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <div className={`text-lg font-semibold mt-3 flex items-center gap-2 ${
                      formData.description.length >= 50 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formData.description.length >= 50 ? (
                        <FaCheckCircle />
                      ) : (
                        <FaExclamationTriangle />
                      )}
                      {formData.description.length}/500 characters {formData.description.length >= 50 ? '✓' : '(minimum 50 required)'}
                    </div>
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                        <FaExclamationTriangle />
                        {formErrors.description}
                      </p>
                    )}
                  </div>

                  {/* Condition Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-3">
                        Car Condition
                      </label>
                      <select
                        name="carCondition"
                        value={formData.carCondition}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      >
                        {conditions.map(condition => (
                          <option key={condition.value} value={condition.value}>
                            {condition.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-3">
                        Service History
                      </label>
                      <select
                        name="serviceHistory"
                        value={formData.serviceHistory}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      >
                        {serviceHistories.map(history => (
                          <option key={history} value={history}>
                            {history.charAt(0).toUpperCase() + history.slice(1)} Service History
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-3">
                        Accident History
                      </label>
                      <select
                        name="accidentHistory"
                        value={formData.accidentHistory}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      >
                        {accidentHistories.map(history => (
                          <option key={history} value={history}>
                            {history.charAt(0).toUpperCase() + history.slice(1)} Accidents
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="priceNegotiable"
                      checked={formData.priceNegotiable}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      id="priceNegotiable"
                    />
                    <label htmlFor="priceNegotiable" className="text-lg font-semibold text-gray-900">
                      Price is negotiable
                    </label>
                  </div>

                  {/* Preview Card */}
                  {formData.carName && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
                      <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">Listing Preview</h3>
                      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                          <h4 className="text-2xl font-black text-gray-900">{formData.carName}</h4>
                          <div className="text-3xl font-black text-blue-600">KSh {formData.price}</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 mb-4">
                          <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-gray-400 text-lg" />
                            <span className="font-semibold">{formData.location}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FaCalendar className="text-gray-400 text-lg" />
                            <span className="font-semibold">{formData.year}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FaTachometerAlt className="text-gray-400 text-lg" />
                            <span className="font-semibold">{formData.mileage} km</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FaCar className="text-gray-400 text-lg" />
                            <span className="font-semibold">{formData.carType}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
                          {formData.description || 'Your detailed description will appear here...'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Contact & Photos */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaUser className="text-orange-600 text-3xl" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-3">Contact & Photos</h2>
                    <p className="text-xl text-gray-600">Final step! Add your details and car photos</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
                          <FaUser className="text-blue-600 text-xl" />
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="sellerName"
                          value={formData.sellerName}
                          onChange={handleInputChange}
                          placeholder="e.g., John Doe"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            formErrors.sellerName ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {formErrors.sellerName && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.sellerName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
                          <FaPhone className="text-green-600 text-xl" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="sellerPhone"
                          value={formData.sellerPhone}
                          onChange={handleInputChange}
                          placeholder="e.g., +254 712 345 678"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            formErrors.sellerPhone ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {formErrors.sellerPhone && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.sellerPhone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
                          <FaEnvelope className="text-blue-600 text-xl" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="sellerEmail"
                          value={formData.sellerEmail}
                          onChange={handleInputChange}
                          placeholder="e.g., your.email@example.com"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            formErrors.sellerEmail ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {formErrors.sellerEmail && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.sellerEmail}
                          </p>
                        )}
                      </div>

                      <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <FaShieldAlt className="text-blue-600" />
                          Privacy Protected
                        </h4>
                        <p className="text-blue-700 text-sm">
                          Your contact information is secure and will only be shared with verified buyers.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-lg font-bold text-gray-900 mb-6 text-center">
                      Upload Car Photos ({imagePreviews.length}/10)
                    </label>
                    
                    <div className={`border-3 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all duration-200 ${
                      formErrors.images ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="car-images"
                        disabled={imagePreviews.length >= 10}
                      />
                      <label
                        htmlFor="car-images"
                        className="cursor-pointer block"
                      >
                        {isLoading ? (
                          <div className="space-y-4">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                            <p className="text-lg font-semibold text-gray-700">Uploading...</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <FaUpload className="text-5xl md:text-6xl text-gray-400 mx-auto mb-6 transition-all duration-200" />
                            <p className="text-2xl font-bold text-gray-700 mb-3">
                              {imagePreviews.length > 0 ? 'Add More Photos' : 'Click to Upload Photos'}
                            </p>
                            <p className="text-lg text-gray-500 mb-4">
                              Upload high-quality photos from different angles
                            </p>
                            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105">
                              <FaCamera />
                              Choose Files
                            </div>
                          </>
                        )}
                      </label>
                    </div>
                    {formErrors.images && (
                      <p className="text-red-500 text-sm mt-3 flex items-center gap-2 justify-center">
                        <FaExclamationTriangle />
                        {formErrors.images}
                      </p>
                    )}

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-lg font-bold text-gray-900 mb-6 text-center">
                          Your Car Photos
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={preview.id} className="relative group">
                              <div className="aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 group-hover:border-red-400 transition-all duration-200">
                                <img
                                  src={preview.url}
                                  alt={`Car preview ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-110"
                              >
                                <FaTimes />
                              </button>
                              {index === 0 && (
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                                  Main Photo
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Payment Options */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaCashRegister className="text-green-600 text-3xl" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-3">Payment Options</h2>
                    <p className="text-xl text-gray-600">Choose how you'd like to receive payment</p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon
                        return (
                          <div 
                            key={method.value}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                              formData.paymentMethod === method.value
                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg shadow-blue-200 transform scale-105'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value }))}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center`}>
                                <Icon className="text-white text-xl" />
                              </div>
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.value}
                                checked={formData.paymentMethod === method.value}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                              />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">{method.label}</h3>
                            <p className="text-gray-600 text-sm">{method.description}</p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Payment Method Details */}
                    {formData.paymentMethod === 'installment' && (
                      <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
                        <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2 text-lg">
                          <FaInfoCircle className="text-yellow-600" />
                          Installment Plan Details
                        </h4>
                        <p className="text-yellow-800">
                          Buyers can pay in 3-12 monthly installments. A 30% down payment is required upon agreement.
                          You receive full payment upfront from our financing partner.
                        </p>
                      </div>
                    )}

                    {formData.paymentMethod === 'financing' && (
                      <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-lg">
                          <FaInfoCircle className="text-blue-600" />
                          Bank Financing
                        </h4>
                        <p className="text-blue-800">
                          We partner with major banks to help buyers secure financing. You receive full payment upon loan approval.
                          Typical processing time: 3-5 business days.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                      <input
                        type="checkbox"
                        name="financingOption"
                        checked={formData.financingOption}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        id="financingOption"
                      />
                      <label htmlFor="financingOption" className="text-lg font-semibold text-gray-900">
                        I'm open to buyer financing options
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="w-full md:w-auto px-8 md:px-12 py-4 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-lg text-gray-700 hover:shadow-lg transform hover:scale-105"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  Step {currentStep + 1} of {steps.length}
                </div>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full md:w-auto px-8 md:px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 md:px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <FaRocket />
                        Publish Listing
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Benefits Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: FaUser,
                title: 'Reach Real Buyers',
                description: 'Connect with thousands of verified buyers across Kenya',
                color: 'blue'
              },
              {
                icon: FaMoneyBillWave,
                title: 'Get Best Price',
                description: 'Receive competitive offers and sell at the right price',
                color: 'green'
              },
              {
                icon: FaRocket,
                title: 'Quick & Easy',
                description: 'Sell your car faster with our streamlined process',
                color: 'purple'
              },
              {
                icon: FaShieldAlt,
                title: 'Secure Transaction',
                description: 'Safe and secure payment processing with buyer verification',
                color: 'orange'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`w-16 h-16 bg-${benefit.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className={`text-${benefit.color}-600 text-2xl`} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Method Dialog */}
      {showPaymentDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Method</h3>
            <p className="text-gray-600 mb-6">Choose how you'd like to receive payment for your car</p>
            
            <div className="space-y-4 mb-6">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <div 
                    key={method.value}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedPaymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.value)}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="text-blue-600 text-xl" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{method.label}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                      <input
                        type="radio"
                        name="dialogPayment"
                        value={method.value}
                        checked={selectedPaymentMethod === method.value}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentDialog(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, paymentMethod: selectedPaymentMethod }))
                  setShowPaymentDialog(false)
                  showToast('Payment method updated successfully!', 'success')
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-200 font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}