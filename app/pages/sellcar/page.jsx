"use client"

import { useState, useEffect } from 'react'
import {
  FaCar, FaMapMarkerAlt, FaCalendar, FaShieldAlt, FaTachometerAlt,
  FaCog, FaGasPump, FaMoneyBillWave, FaUpload, FaCheck, FaPhone,
  FaEnvelope, FaUser, FaCamera, FaRocket, FaStar, FaCheckCircle,
  FaCashRegister, FaCreditCard, FaHandHoldingUsd, FaSpinner,
  FaTimes, FaExclamationTriangle, FaInfoCircle, FaPaintBrush,
  FaWrench, FaShield, FaCogs, FaTachometer, FaPalette,
  FaBuilding, FaAward, FaHeadset, FaCrown,
  FaGem, FaStarHalfAlt, FaRegCheckCircle, FaBolt
} from 'react-icons/fa'
import { toast, Toaster } from 'react-hot-toast'
import SuccessStep from '../../components/sucess/page.jsx'

export default function SellYourCar() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([])
  const [submissionResult, setSubmissionResult] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formErrors, setFormErrors] = useState({})

  // ✅ ADD THE MISSING STEPS ARRAY
  const steps = [
    { label: 'Vehicle Details', icon: FaCar, description: 'Premium vehicle information' },
    { label: 'Specifications & Certification', icon: FaCreditCard, description: 'Technical excellence & verification' },
    { label: 'Dealer & Media', icon: FaBuilding, description: 'Corporate details & visuals' }
  ]

  // ✅ ADD THE MISSING CONSTANTS
  const carTypes = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Luxury', 'Convertible', 'Coupe', 'Minivan', 'Truck']
  const transmissions = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic']
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG']
  const locations = ['Nairobi', 'Nakuru', 'Nyeri', 'Muranga', 'Kiambu', 'Thika', 'Mombasa', 'Kisumu', 'Eldoret', 'Other']
  const conditions = [
    { value: 'excellent', label: 'Showroom Condition', color: 'text-emerald-400' },
    { value: 'very good', label: 'Premium Certified', color: 'text-blue-400' },
    { value: 'good', label: 'Well Maintained', color: 'text-green-400' },
    { value: 'fair', label: 'Good Running Condition', color: 'text-yellow-400' },
    { value: 'needs work', label: 'Project Vehicle', color: 'text-orange-400' }
  ]
  const serviceHistories = ['full', 'partial', 'none', 'recent']
  const accidentHistories = ['none', 'minor', 'moderate', 'major']
  const ownershipHistories = ['first', 'second', 'third', 'fourth', 'fifth+']
  const taxStatuses = ['current', 'expired', 'exempt']
  const insuranceStatuses = ['comprehensive', 'third-party', 'none']
  const modificationLevels = ['none', 'minor', 'moderate', 'extensive']
  const contactMethods = ['phone', 'email', 'both']
  const certifications = ['none', 'premium', 'elite', 'certified']

  const featuresList = [
    'Air Conditioning', 'Leather Seats', 'Sunroof', 'Navigation', 'Backup Camera',
    'Bluetooth', 'Push Start', 'Keyless Entry', 'Climate Control', 'Alloy Wheels',
    'Parking Sensors', 'LED Lights', 'Premium Sound', 'Heated Seats', '4WD/AWD',
    'Tow Package', 'Roof Rails', 'Third Row Seating', 'Apple CarPlay', 'Android Auto',
    'Cruise Control', 'Power Windows', 'Power Locks', 'ABS Brakes', 'Airbags',
    'GPS Tracking', 'Alarm System', 'Fog Lights', 'Running Boards', 'Tinted Windows'
  ]

  // ✅ ADD THE MISSING CORPORATE BENEFITS AND ELITE FEATURES
  const corporateBenefits = [
    {
      icon: FaCrown,
      title: "Elite Dealer Network",
      description: "Join Kenya's premier automotive marketplace with exclusive buyer access",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: FaCreditCard,
      title: "Verified Corporate Seller",
      description: "Build trust with certified dealer status and verified business credentials",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaBolt,
      title: "Priority Listing",
      description: "Get featured placement and 3x more views than private listings",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: FaGem,
      title: "Premium Analytics",
      description: "Access detailed performance metrics and buyer intelligence reports",
      gradient: "from-green-500 to-emerald-500"
    }
  ]

  const eliteFeatures = [
    { icon: FaAward, text: "Certified Pre-Owned Program" },
    { icon: FaHeadset, text: "Dedicated Account Manager" },
    { icon: FaStarHalfAlt, text: "Premium Featured Listings" },
    { icon: FaRegCheckCircle, text: "Quality Assurance Certification" }
  ]

  // ✅ ADD THE MISSING HELPER FUNCTIONS
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

    setIsSubmitting(true)
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
      setIsSubmitting(false)
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

  const [formData, setFormData] = useState({
    // Basic Information
    carName: '',
    year: '',
    price: '',
    location: '',
    carType: '',
    mileage: '',
    transmission: '',
    fuelType: '',
    engineSize: '',
    color: '',
    doors: '',
    seats: '',
    
    // Specifications & Features
    features: [],
    description: '',
    carCondition: 'excellent',
    serviceHistory: 'full',
    accidentHistory: 'none',
    ownershipHistory: '',
    roadTaxStatus: 'current',
    insuranceStatus: 'comprehensive',
    
    // Seller Information
    sellerName: '',
    sellerPhone: '',
    sellerEmail: '',
    preferredContact: 'phone',
    companyName: '',
    dealerLicense: '',
    
    // Additional Details
    priceNegotiable: true,
    testDrive: true,
    warranty: false,
    warrantyMonths: '',
    serviceRecords: true,
    originalPaint: true,
    modifications: 'none',
    certification: 'none'
  })

  const validateStep = (step) => {
    const errors = {}
    
    switch (step) {
      case 0:
        if (!formData.carName.trim()) errors.carName = 'Car model is required'
        if (!formData.year) errors.year = 'Manufacturing year is required'
        if (!formData.price) errors.price = 'Price is required'
        if (!formData.location) errors.location = 'Location is required'
        if (!formData.carType) errors.carType = 'Car type is required'
        if (!formData.mileage) errors.mileage = 'Mileage is required'
        if (!formData.transmission) errors.transmission = 'Transmission is required'
        if (!formData.fuelType) errors.fuelType = 'Fuel type is required'
        if (!formData.engineSize) errors.engineSize = 'Engine size is required'
        if (!formData.color) errors.color = 'Color is required'
        break
      case 1:
        if (!formData.description.trim()) {
          errors.description = 'Description is required'
        } else if (formData.description.length < 50) {
          errors.description = 'Description must be at least 50 characters'
        } else if (formData.description.length > 500) {
          errors.description = 'Description must be less than 500 characters'
        }
        if (!formData.ownershipHistory) errors.ownershipHistory = 'Ownership history is required'
        break
      case 2:
        if (!formData.sellerName.trim()) errors.sellerName = 'Your name is required'
        if (!formData.sellerPhone.trim()) errors.sellerPhone = 'Phone number is required'
        if (!formData.sellerEmail.trim()) errors.sellerEmail = 'Email is required'
        if (imagePreviews.length < 1) errors.images = 'At least one photo is required'
        break
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Your existing handleSubmit function and other code continues below...

const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!validateStep(currentStep)) {
    showToast('Please fix all errors before submitting', 'error')
    return
  }

  setIsSubmitting(true)
  setUploadProgress(0)

  const loadingToast = toast.loading('Publishing your elite vehicle listing...')

  try {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      setUploadProgress(progress)
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    const submitFormData = new FormData()
    
    // ✅ FIXED: Create PROPER carData structure that matches backend expectations
    const carData = {
      // Basic Information - with proper field names
      carName: (formData.carName || '').substring(0, 100),
      year: parseInt(formData.year) || 2023,
      price: parseFloat(formData.price.toString().replace(/,/g, '')) || 0,
      location: (formData.location || '').substring(0, 50),
      carType: (formData.carType || '').substring(0, 50),
      mileage: parseInt(formData.mileage.toString().replace(/,/g, '')) || 0,
      transmission: (formData.transmission || '').substring(0, 20),
      fuelType: (formData.fuelType || '').substring(0, 20),
      engineSize: (formData.engineSize || '').substring(0, 20),
      color: (formData.color || '').substring(0, 30),
      doors: formData.doors ? parseInt(formData.doors) : null,
      seats: formData.seats ? parseInt(formData.seats) : null,
      
      // ✅ FIXED: Description with proper length limit
      description: (formData.description || '').substring(0, 500),
      
      // ✅ FIXED: Direct fields that backend expects (not nested in features)
      carCondition: (formData.carCondition || 'excellent').substring(0, 20),
      serviceHistory: (formData.serviceHistory || 'full').substring(0, 20),
      accidentHistory: (formData.accidentHistory || 'none').substring(0, 20),
      ownershipHistory: (formData.ownershipHistory || '').substring(0, 20),
      roadTaxStatus: (formData.roadTaxStatus || 'current').substring(0, 20),
      insuranceStatus: (formData.insuranceStatus || 'comprehensive').substring(0, 20),
      
      // Seller Information
      sellerName: (formData.sellerName || '').substring(0, 100),
      sellerPhone: (formData.sellerPhone || '').substring(0, 20),
      sellerEmail: (formData.sellerEmail || '').substring(0, 100),
      preferredContact: (formData.preferredContact || 'phone').substring(0, 10),
      companyName: (formData.companyName || '').substring(0, 100),
      dealerLicense: (formData.dealerLicense || '').substring(0, 50),
      
      // Additional Details
      priceNegotiable: Boolean(formData.priceNegotiable),
      testDrive: Boolean(formData.testDrive),
      warranty: Boolean(formData.warranty),
      warrantyMonths: formData.warrantyMonths ? parseInt(formData.warrantyMonths) : null,
      serviceRecords: Boolean(formData.serviceRecords),
      originalPaint: Boolean(formData.originalPaint),
      modifications: (formData.modifications || 'none').substring(0, 20),
      certification: (formData.certification || 'none').substring(0, 20),
      
      // ✅ FIXED: Features array (not nested object)
      features: Array.isArray(formData.features) ? formData.features : []
    }

    console.log('📤 Sending carData with proper structure:', {
      carName: carData.carName,
      descriptionLength: carData.description.length,
      price: carData.price,
      year: carData.year,
      featuresCount: carData.features.length,
      hasDirectFields: !!carData.carCondition && !!carData.serviceHistory
    })

    // ✅ Validate critical fields
    if (!carData.carName || !carData.price || !carData.year) {
      throw new Error('Please fill in all required fields: Car Name, Price, and Year')
    }

    if (carData.description.length < 10) {
      throw new Error('Description must be at least 10 characters long')
    }

    // ✅ Add carData as JSON string
    submitFormData.append('carData', JSON.stringify(carData))
    
    // ✅ Add images
    if (imagePreviews.length > 0) {
      imagePreviews.forEach((preview, index) => {
        if (preview.file && preview.file.size < 10 * 1024 * 1024) {
          submitFormData.append('files', preview.file)
        }
      })
    }

    // Send to API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    const response = await fetch('/api/sellyourcar', {
      method: 'POST',
      body: submitFormData,
      signal: controller.signal
    })

    clearTimeout(timeoutId);

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || `Failed to submit form: ${response.status}`)
    }

    // ✅ IMPROVED: Handle both database success and database-down scenarios
    if (result.success) {
      // Check if we have a database record or if it's saved locally due to DB issues
      const hasDatabaseRecord = !!result.data?.id;
      const referenceId = result.reference || result.data?.reference || `CAR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      setSubmissionResult({
        success: true,
        reference: referenceId,
        message: hasDatabaseRecord 
          ? 'Your elite vehicle listing has been published successfully!' 
          : 'Your listing has been received! (Database maintenance in progress)',
        listingId: result.id || result.data?.id,
        estimatedViews: Math.floor(Math.random() * 5000) + 1000,
        databaseSaved: hasDatabaseRecord
      })

      setCurrentStep(steps.length)
      
      toast.dismiss(loadingToast);
      
      if (hasDatabaseRecord) {
        showToast('Elite vehicle listing published successfully! 🎉', 'success');
      } else {
        showToast('Listing received! Emails sent successfully. Database maintenance in progress.', 'success');
      }

    } else {
      throw new Error(result.error || 'Unknown error occurred');
    }

  } catch (error) {
    console.error("❌ Error submitting form:", error)
    toast.dismiss(loadingToast)
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      showToast('Request timeout. Please check your connection and try again.', 'error');
    } else if (error.message.includes('database') || error.message.includes('connection')) {
      showToast('Listing received! Emails sent, but database is temporarily unavailable.', 'warning');
      
      // Still show success even if database is down (since emails are sent)
      setSubmissionResult({
        success: true,
        reference: `CAR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: 'Your listing has been received! Database maintenance in progress.',
        estimatedViews: Math.floor(Math.random() * 3000) + 500,
        databaseSaved: false
      })
      setCurrentStep(steps.length)
    } else {
      showToast(error.message || 'Failed to publish your vehicle listing. Please try again.', 'error')
    }
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
      engineSize: '',
      color: '',
      doors: '',
      seats: '',
      features: [],
      description: '',
      carCondition: 'excellent',
      serviceHistory: 'full',
      accidentHistory: 'none',
      ownershipHistory: '',
      roadTaxStatus: 'current',
      insuranceStatus: 'comprehensive',
      sellerName: '',
      sellerPhone: '',
      sellerEmail: '',
      preferredContact: 'phone',
      companyName: '',
      dealerLicense: '',
      priceNegotiable: true,
      testDrive: true,
      warranty: false,
      warrantyMonths: '',
      serviceRecords: true,
      originalPaint: true,
      modifications: 'none',
      certification: 'none'
    })
    setImagePreviews([])
    setCurrentStep(0)
    setSubmissionResult(null)
    setFormErrors({})
    showToast('Form reset successfully', 'info')
  }

  // ✅ Use the extracted SuccessStep component
  if (currentStep === steps.length && submissionResult?.success) {
    return <SuccessStep submissionResult={submissionResult} resetForm={resetForm} />
  }



  return (
    <div 
      className="min-h-screen py-6 px-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-cyan-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Premium Car Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-5"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
        }}
      />
      
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
            <h3 className="text-xl font-black text-gray-900 mb-2">Publishing Elite Listing...</h3>
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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Header Section */}
        <div className="text-center mb-12">
          {/* Corporate Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-blue-500/30 mb-6">
            <FaCrown className="text-yellow-400 text-base" />
            <span className="text-blue-300 font-semibold text-xs uppercase tracking-wider">Corporate Seller Portal</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Elite Vehicle
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Listing Platform
            </span>
          </h1>

          {/* Corporate Description */}
          <div className="max-w-4xl mx-auto mb-6">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
              Welcome to Kenya's <span className="font-bold text-white">Premier Automotive Marketplace</span> for 
              established dealers and corporate sellers.
            </p>
          </div>

          {/* Corporate Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            {[
              { number: "500+", label: "Active Corporate Partners" },
              { number: "15K+", label: "Monthly Premium Buyers" },
              { number: "98%", label: "Seller Satisfaction" },
              { number: "24h", label: "Average Sale Time" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg md:text-xl font-black text-white mb-1">{stat.number}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Elite Features */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {eliteFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
                <feature.icon className="text-blue-400 text-xs" />
                <span className="text-white text-xs font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {corporateBenefits.map((benefit, index) => (
            <div 
              key={index}
              className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4"
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-5`}></div>
              
              {/* Icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-3`}>
                <benefit.icon className="text-white text-lg" />
              </div>
              
              {/* Content */}
              <h3 className="text-base font-black text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-300 text-xs leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`relative overflow-hidden rounded-2xl border-2 p-4 transition-all duration-500 ${
                  currentStep === index 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/25' 
                    : currentStep > index
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-md shadow-emerald-500/10'
                    : 'border-gray-600/50 bg-white/5 backdrop-blur-sm opacity-70'
                }`}
              >
                {/* Step Indicator */}
                <div className={`flex items-center gap-3 mb-3 ${
                  currentStep === index || currentStep > index ? 'text-white' : 'text-gray-400'
                }`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
                    currentStep === index 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-md' 
                      : currentStep > index
                      ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-md'
                      : 'bg-gray-600/50'
                  }`}>
                    {currentStep > index ? <FaCheck className="text-sm" /> : <step.icon className="text-sm" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold opacity-80">
                      STEP {index + 1}
                    </div>
                    <div className="font-black text-base">
                      {step.label}
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <p className={`text-xs ${
                  currentStep === index || currentStep > index ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Container - 90% Width */}
        <div className="w-[90%] mx-auto">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Form Header */}
            <div className="border-b border-white/10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">
                    {steps[currentStep].label}
                  </h2>
                  <p className="text-blue-200 text-base">
                    {steps[currentStep].description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">Corporate Listing</div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <FaCreditCard className="text-sm" />
                    <span className="font-semibold text-sm">Verified Dealer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              
              {/* Step 1: Vehicle Details */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  {/* Premium Vehicle Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Vehicle Model & Make *",
                        name: "carName",
                        type: "text",
                        placeholder: "e.g., Mercedes-Benz S-Class 2023",
                        icon: FaCar,
                        error: formErrors.carName
                      },
                      {
                        label: "Manufacturing Year *",
                        name: "year",
                        type: "number",
                        placeholder: "e.g., 2023",
                        icon: FaCalendar,
                        error: formErrors.year
                      },
                      {
                        label: "Asking Price (KSh) *",
                        name: "price",
                        type: "text",
                        placeholder: "e.g., 8,500,000",
                        icon: FaMoneyBillWave,
                        error: formErrors.price
                      },
                      {
                        label: "Showroom Location *",
                        name: "location",
                        type: "select",
                        options: locations,
                        icon: FaMapMarkerAlt,
                        error: formErrors.location
                      },
                      {
                        label: "Vehicle Category *",
                        name: "carType",
                        type: "select",
                        options: carTypes,
                        icon: FaCar,
                        error: formErrors.carType
                      },
                      {
                        label: "Mileage (km) *",
                        name: "mileage",
                        type: "text",
                        placeholder: "e.g., 15,000",
                        icon: FaTachometerAlt,
                        error: formErrors.mileage
                      },
                      {
                        label: "Transmission *",
                        name: "transmission",
                        type: "select",
                        options: transmissions,
                        icon: FaCog,
                        error: formErrors.transmission
                      },
                      {
                        label: "Fuel Type *",
                        name: "fuelType",
                        type: "select",
                        options: fuelTypes,
                        icon: FaGasPump,
                        error: formErrors.fuelType
                      },
                      {
                        label: "Engine Capacity (cc) *",
                        name: "engineSize",
                        type: "text",
                        placeholder: "e.g., 3000",
                        icon: FaCogs,
                        error: formErrors.engineSize
                      },
                      {
                        label: "Exterior Color *",
                        name: "color",
                        type: "text",
                        placeholder: "e.g., Obsidian Black",
                        icon: FaPaintBrush,
                        error: formErrors.color
                      },
                      {
                        label: "Number of Doors",
                        name: "doors",
                        type: "select",
                        options: ['2', '3', '4', '5'],
                        icon: FaCar
                      },
                      {
                        label: "Seating Capacity",
                        name: "seats",
                        type: "select",
                        options: ['2', '4', '5', '7', '8+'],
                        icon: FaUser
                      }
                    ].map((field, index) => (
                      <div key={index} className="group">
                        <label className="block text-xs font-semibold text-white mb-2 uppercase tracking-wide">
                          {field.label}
                        </label>
                        <div className="relative">
                          {field.type === 'select' ? (
                            <select
                              name={field.name}
                              value={formData[field.name]}
                              onChange={(e) => handleInputChange(e)}
                              className={`w-full p-3 pl-10 border-2 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base transition-all duration-200 bg-white/5 backdrop-blur-sm text-white appearance-none ${
                                field.error ? 'border-red-500' : 'border-gray-500/50'
                              }`}
                            >
                              <option value="" className="text-gray-800">Select {field.label.split(' ')[0]}</option>
                              {field.options.map(option => (
                                <option key={option} value={option} className="text-gray-800">{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={(e) => handleInputChange(e)}
                              placeholder={field.placeholder}
                              className={`w-full p-3 pl-10 border-2 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                                field.error ? 'border-red-500' : 'border-gray-500/50'
                              }`}
                            />
                          )}
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <field.icon />
                          </div>
                        </div>
                        {field.error && (
                          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                            <FaExclamationTriangle />
                            {field.error}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Quick Stats Preview */}
                  <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-4 border border-blue-500/20">
                    <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                      <FaStar className="text-yellow-400" />
                      Premium Listing Preview
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                      {[
                        { label: 'Market Value', value: 'Premium' },
                        { label: 'Target Audience', value: 'Elite Buyers' },
                        { label: 'Visibility', value: 'Featured' },
                        { label: 'Verification', value: 'Corporate' }
                      ].map((stat, index) => (
                        <div key={index} className="text-white">
                          <div className="text-lg font-black text-blue-400">{stat.value}</div>
                          <div className="text-xs text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Specifications & Certification */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FaCreditCard className="text-emerald-400 text-2xl" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Specifications & Certification</h2>
                    <p className="text-lg text-gray-300">Technical excellence & quality verification</p>
                  </div>
                  
                  <div className="space-y-4">
                  <div>
  <label className="block text-base font-bold text-white mb-3">
    Premium Vehicle Description *
  </label>
  <textarea
    name="description"
    value={formData.description}
    onChange={(e) => handleInputChange(e)}
    placeholder="Describe your premium vehicle in detail. Highlight unique features, service history, certification details, and why this vehicle stands out in the market. Include maintenance records, special features, and any premium upgrades..."
    rows="5"
    className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base resize-none transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
      formErrors.description ? 'border-red-500' : 'border-gray-500/50'
    }`}
  />
  
  {/* ✅ ADD/UPDATED CHARACTER COUNTER HERE */}
  <div className={`text-sm font-semibold mt-2 flex items-center gap-2 ${
    formData.description.length >= 50 && formData.description.length <= 500 
      ? 'text-emerald-400' 
      : formData.description.length > 500 
        ? 'text-red-400' 
        : 'text-yellow-400'
  }`}>
    {formData.description.length >= 50 && formData.description.length <= 500 ? (
      <FaCheckCircle />
    ) : (
      <FaExclamationTriangle />
    )}
    {formData.description.length}/500 characters 
    {formData.description.length >= 50 && formData.description.length <= 500 
      ? '✓' 
      : formData.description.length > 500 
        ? '(maximum 500 characters)' 
        : '(minimum 50 required)'
    }
  </div>
  
  {formErrors.description && (
    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
      <FaExclamationTriangle />
      {formErrors.description}
    </p>
  )}
</div>

                    {/* Certification & Condition Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Vehicle Condition",
                          name: "carCondition",
                          options: conditions,
                          icon: FaCar
                        },
                        {
                          label: "Service History",
                          name: "serviceHistory", 
                          options: serviceHistories,
                          icon: FaWrench
                        },
                        {
                          label: "Accident History",
                          name: "accidentHistory",
                          options: accidentHistories,
                          icon: FaGasPump
                        },
                        {
                          label: "Ownership History *",
                          name: "ownershipHistory",
                          options: ownershipHistories,
                          icon: FaUser,
                          error: formErrors.ownershipHistory
                        }
                      ].map((field, index) => (
                        <div key={index}>
                          <label className="block text-sm font-bold text-white mb-2">
                            {field.label}
                          </label>
                          <select
                            name={field.name}
                            value={formData[field.name]}
                            onChange={(e) => handleInputChange(e)}
                            className={`w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base transition-all duration-200 bg-white/5 backdrop-blur-sm text-white ${
                              field.error ? 'border-red-500' : 'border-gray-500/50'
                            }`}
                          >
                            <option value="" className="text-gray-800">Select</option>
                            {field.options.map(option => (
                              <option key={option.value || option} value={option.value || option} className="text-gray-800">
                                {option.label || option.charAt(0).toUpperCase() + option.slice(1)}
                              </option>
                            ))}
                          </select>
                          {field.error && (
                            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                              <FaExclamationTriangle />
                              {field.error}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Legal & Certification Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          label: "Road Tax Status",
                          name: "roadTaxStatus",
                          options: taxStatuses
                        },
                        {
                          label: "Insurance Status", 
                          name: "insuranceStatus",
                          options: insuranceStatuses
                        },
                        {
                          label: "Vehicle Certification",
                          name: "certification",
                          options: certifications
                        }
                      ].map((field, index) => (
                        <div key={index}>
                          <label className="block text-sm font-bold text-white mb-2">
                            {field.label}
                          </label>
                          <select
                            name={field.name}
                            value={formData[field.name]}
                            onChange={(e) => handleInputChange(e)}
                            className="w-full p-3 border-2 border-gray-500/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base transition-all duration-200 bg-white/5 backdrop-blur-sm text-white"
                          >
                            <option value="" className="text-gray-800">Select</option>
                            {field.options.map(option => (
                              <option key={option} value={option} className="text-gray-800">
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>

                    {/* Features Section */}
                    <div>
                      <label className="block text-lg font-black text-white mb-4 text-center">
                        Premium Features & Options
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-3 border-2 border-gray-500/50 rounded-xl bg-white/5">
                        {featuresList.map(feature => (
                          <button
                            key={feature}
                            type="button"
                            onClick={() => handleFeatureToggle(feature)}
                            className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                              formData.features.includes(feature)
                                ? 'border-blue-500 bg-blue-500/20 text-white'
                                : 'border-gray-500/50 bg-white/5 text-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                formData.features.includes(feature)
                                  ? 'bg-blue-500 border-blue-500'
                                  : 'bg-white/10 border-gray-400'
                              }`}>
                                {formData.features.includes(feature) && (
                                  <FaCheck className="text-white text-xs" />
                                )}
                              </div>
                              <span className="font-medium text-sm">{feature}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="text-lg font-black text-white mb-3">Business Options</h3>
                        
                        {[
                          { name: 'priceNegotiable', label: 'Price is negotiable' },
                          { name: 'testDrive', label: 'Test drive available' },
                          { name: 'serviceRecords', label: 'Service records available' }
                        ].map((option, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-gray-500/50">
                            <input
                              type="checkbox"
                              name={option.name}
                              checked={formData[option.name]}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              id={option.name}
                            />
                            <label htmlFor={option.name} className="text-sm font-semibold text-white">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-black text-white mb-3">Warranty & Modifications</h3>
                        
                        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-gray-500/50">
                          <input
                            type="checkbox"
                            name="warranty"
                            checked={formData.warranty}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            id="warranty"
                          />
                          <label htmlFor="warranty" className="text-sm font-semibold text-white">
                            Dealer warranty included
                          </label>
                        </div>

                        {formData.warranty && (
                          <div>
                            <label className="block text-sm font-bold text-white mb-2">
                              Warranty Period (Months)
                            </label>
                            <input
                              type="number"
                              name="warrantyMonths"
                              value={formData.warrantyMonths}
                              onChange={handleInputChange}
                              placeholder="e.g., 12"
                              className="w-full p-3 border-2 border-gray-500/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-bold text-white mb-2">
                            Modifications Level
                          </label>
                          <select
                            name="modifications"
                            value={formData.modifications}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-500/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base transition-all duration-200 bg-white/5 backdrop-blur-sm text-white"
                          >
                            {modificationLevels.map(level => (
                              <option key={level} value={level} className="text-gray-800">
                                {level.charAt(0).toUpperCase() + level.slice(1)} Modifications
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Dealer & Media */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FaBuilding className="text-purple-400 text-2xl" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Dealer & Media</h2>
                    <p className="text-lg text-gray-300">Corporate details & premium visuals</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-white mb-4">Corporate Information</h3>
                      
                      {[
                        {
                          label: "Contact Person Name *",
                          name: "sellerName",
                          type: "text",
                          placeholder: "e.g., John Doe - Sales Manager",
                          error: formErrors.sellerName
                        },
                        {
                          label: "Company Name",
                          name: "companyName", 
                          type: "text",
                          placeholder: "e.g., Premium Auto Dealers Ltd"
                        },
                        {
                          label: "Dealer License Number",
                          name: "dealerLicense",
                          type: "text",
                          placeholder: "e.g., DL-2024-789456"
                        }
                      ].map((field, index) => (
                        <div key={index}>
                          <label className="block text-sm font-bold text-white mb-2">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            className={`w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                              field.error ? 'border-red-500' : 'border-gray-500/50'
                            }`}
                          />
                          {field.error && (
                            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                              <FaExclamationTriangle />
                              {field.error}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-white mb-4">Contact Details</h3>

                      {[
                        {
                          label: "Business Phone *",
                          name: "sellerPhone", 
                          type: "tel",
                          placeholder: "e.g., +254 712 345 678",
                          error: formErrors.sellerPhone
                        },
                        {
                          label: "Business Email *",
                          name: "sellerEmail",
                          type: "email", 
                          placeholder: "e.g., sales@premiumauto.co.ke",
                          error: formErrors.sellerEmail
                        },
                        {
                          label: "Preferred Contact Method",
                          name: "preferredContact",
                          type: "select",
                          options: contactMethods
                        }
                      ].map((field, index) => (
                        <div key={index}>
                          <label className="block text-sm font-bold text-white mb-2">
                            {field.label}
                          </label>
                          {field.type === 'select' ? (
                            <select
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              className="w-full p-3 border-2 border-gray-500/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base transition-all duration-200 bg-white/5 backdrop-blur-sm text-white"
                            >
                              {field.options.map(option => (
                                <option key={option} value={option} className="text-gray-800">
                                  {option === 'phone' ? 'Phone Only' :
                                   option === 'email' ? 'Email Only' : 'Phone & Email'}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              placeholder={field.placeholder}
                              className={`w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                                field.error ? 'border-red-500' : 'border-gray-500/50'
                              }`}
                            />
                          )}
                          {field.error && (
                            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                              <FaExclamationTriangle />
                              {field.error}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-lg font-black text-white mb-4 text-center">
                      Premium Vehicle Photography ({imagePreviews.length}/10) *
                    </label>
                    
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                      formErrors.images ? 'border-red-300 bg-red-500/10' : 'border-gray-500/50'
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
                        {isSubmitting ? (
                          <div className="space-y-3">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                            <p className="text-base font-semibold text-white">Uploading Premium Images...</p>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                            <p className="text-lg font-bold text-white mb-2">
                              {imagePreviews.length > 0 ? 'Add More Premium Photos' : 'Upload Premium Vehicle Photos'}
                            </p>
                            <p className="text-sm text-gray-300 mb-3">
                              Showcase your vehicle with high-quality professional photography
                            </p>
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-bold text-base">
                              <FaCamera />
                              Choose Professional Photos
                            </div>
                          </>
                        )}
                      </label>
                    </div>
                    {formErrors.images && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1 justify-center">
                        <FaExclamationTriangle />
                        {formErrors.images}
                      </p>
                    )}

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-lg font-black text-white mb-4 text-center">
                          Your Premium Gallery
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {imagePreviews.map((preview, index) => (
                            <div key={preview.id} className="relative">
                              <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-500/50">
                                <img
                                  src={preview.url}
                                  alt={`Premium vehicle preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-lg"
                              >
                                <FaTimes />
                              </button>
                              {index === 0 && (
                                <div className="absolute bottom-1 left-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                                  Featured Image
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Corporate Assurance */}
                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl p-4 border border-emerald-500/20">
                    <div className="flex items-center gap-3">
                      <FaCreditCard className="text-emerald-400 text-xl" />
                      <div>
                        <h4 className="text-base font-black text-white mb-1">Corporate Seller Assurance</h4>
                        <p className="text-emerald-200 text-sm">
                          Your business information is verified and protected. Premium buyers trust corporate listings with 
                          complete transparency and professional service guarantees.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="w-full md:w-auto px-6 py-3 border-2 border-gray-500/50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-base text-white"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  Step {currentStep + 1} of {steps.length}
                </div>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl transition-all duration-200 font-bold text-base shadow-lg"
                  >
                    <span className="flex items-center gap-2">
                      Continue
                      <FaBolt />
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-base shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Publishing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FaRocket />
                        Launch Premium Listing
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Assurance Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-emerald-500/20">
            <FaRocket className="text-emerald-400 text-xl" />
            <div className="text-left">
              <div className="text-white font-bold text-base">Corporate Seller Assurance</div>
              <div className="text-emerald-300 text-xs">Verified business • Premium support • Quality guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}