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

export default function SellYourCar() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([])
  const [submissionResult, setSubmissionResult] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formErrors, setFormErrors] = useState({})

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

  const steps = [
    { label: 'Vehicle Details', icon: FaCar, description: 'Premium vehicle information' },
    { label: 'Specifications & Certification', icon: FaCreditCard, description: 'Technical excellence & verification' },
    { label: 'Dealer & Media', icon: FaBuilding, description: 'Corporate details & visuals' }
  ]

  // Corporate benefits data
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
        if (!formData.carType) errors.carType = 'Car type is required'
        if (!formData.mileage) errors.mileage = 'Mileage is required'
        if (!formData.transmission) errors.transmission = 'Transmission is required'
        if (!formData.fuelType) errors.fuelType = 'Fuel type is required'
        if (!formData.engineSize) errors.engineSize = 'Engine size is required'
        if (!formData.color) errors.color = 'Color is required'
        break
      case 1:
        if (!formData.description.trim() || formData.description.length < 50) 
          errors.description = 'Description must be at least 50 characters'
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
      // Simulate form submission with progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const submitFormData = new FormData()
      
      // Add all form fields to match your API structure
      const carData = {
        carName: formData.carName,
        year: parseInt(formData.year),
        price: parseFloat(formData.price.replace(/,/g, '')),
        location: formData.location,
        carType: formData.carType,
        mileage: parseInt(formData.mileage.replace(/,/g, '')),
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        engineSize: formData.engineSize,
        color: formData.color,
        doors: parseInt(formData.doors),
        seats: parseInt(formData.seats),
        features: formData.features,
        description: formData.description,
        carCondition: formData.carCondition,
        serviceHistory: formData.serviceHistory,
        accidentHistory: formData.accidentHistory,
        ownershipHistory: formData.ownershipHistory,
        roadTaxStatus: formData.roadTaxStatus,
        insuranceStatus: formData.insuranceStatus,
        sellerName: formData.sellerName,
        sellerPhone: formData.sellerPhone,
        sellerEmail: formData.sellerEmail,
        preferredContact: formData.preferredContact,
        companyName: formData.companyName,
        dealerLicense: formData.dealerLicense,
        priceNegotiable: formData.priceNegotiable,
        testDrive: formData.testDrive,
        warranty: formData.warranty,
        warrantyMonths: formData.warrantyMonths ? parseInt(formData.warrantyMonths) : null,
        serviceRecords: formData.serviceRecords,
        originalPaint: formData.originalPaint,
        modifications: formData.modifications,
        certification: formData.certification
      }

      // Add JSON data
      submitFormData.append('carData', JSON.stringify(carData))
      
      // Add images - using 'files' to match your API
      imagePreviews.forEach((preview, index) => {
        submitFormData.append('files', preview.file)
      })

      // Send to your API endpoint
      const response = await fetch('/api/sellyourcar', {
        method: 'POST',
        body: submitFormData
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      const result = await response.json()

      setSubmissionResult({
        success: true,
        reference: result.id || `CAR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: 'Your elite vehicle listing has been published successfully!',
        listingId: result.id,
        estimatedViews: Math.floor(Math.random() * 5000) + 1000
      })

      setCurrentStep(steps.length)
      
      toast.dismiss(loadingToast)
      showToast('Elite vehicle listing published successfully! 🎉', 'success')

    } catch (error) {
      console.error("Error submitting form:", error)
      toast.dismiss(loadingToast)
      showToast('Failed to publish your vehicle listing. Please try again.', 'error')
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

  // Success Step
  if (currentStep === steps.length && submissionResult?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-8 px-4">
        <Toaster position="top-right" />
        
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <FaCheckCircle className="text-white text-5xl" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Congratulations!
            </h1>
            
            <p className="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your elite vehicle listing has been published successfully
            </p>

            {/* Reference Number */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 inline-block border border-emerald-200 shadow-lg mb-8">
              <div className="text-sm text-gray-500 mb-2 font-semibold">Premium Listing ID</div>
              <div className="text-3xl font-black text-emerald-600 font-mono">{submissionResult.reference}</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-blue-200">
                <div className="text-3xl font-black text-blue-600 mb-2">1,000+</div>
                <div className="text-gray-600 font-semibold">Premium Buyers</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-purple-200">
                <div className="text-3xl font-black text-purple-600 mb-2">24h</div>
                <div className="text-gray-600 font-semibold">Featured Listing</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-emerald-200">
                <div className="text-3xl font-black text-emerald-600 mb-2">95%</div>
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
                  icon: FaCreditCard,
                  title: "Premium Verification",
                  description: "Our team is verifying your elite listing for quality assurance"
                },
                {
                  icon: FaCar,
                  title: "Goes Live",
                  description: "Your vehicle will be featured to thousands of premium buyers"
                },
                {
                  icon: FaHeadset,
                  title: "Dedicated Support",
                  description: "Your account manager will contact you for premium support"
                }
              ].map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 inline-flex items-center gap-3"
            >
              <FaCar />
              List Another Vehicle
            </button>
            <button 
              onClick={() => window.location.href = '/cars'}
              className="bg-gray-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 inline-flex items-center gap-3"
            >
              Browse Inventory
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen py-8 px-4 relative overflow-hidden"
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
            <h3 className="text-2xl font-black text-gray-900 mb-2">Publishing Elite Listing...</h3>
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
        <div className="text-center mb-16">
          {/* Corporate Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-blue-500/30 mb-8">
            <FaCrown className="text-yellow-400 text-lg" />
            <span className="text-blue-300 font-semibold text-sm uppercase tracking-wider">Corporate Seller Portal</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Elite Vehicle
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Listing Platform
            </span>
          </h1>

          {/* Corporate Description */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed font-light">
              Welcome to Kenya's <span className="font-bold text-white">Premier Automotive Marketplace</span> for 
              established dealers and corporate sellers.
            </p>
          </div>

          {/* Corporate Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
            {[
              { number: "500+", label: "Active Corporate Partners" },
              { number: "15K+", label: "Monthly Premium Buyers" },
              { number: "98%", label: "Seller Satisfaction" },
              { number: "24h", label: "Average Sale Time" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Elite Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {eliteFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                <feature.icon className="text-blue-400 text-sm" />
                <span className="text-white text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {corporateBenefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 transition-all duration-500"
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="text-white text-2xl" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-black text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>
          ))}
        </div>

        {/* Progress Steps - Enhanced */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden rounded-3xl border-2 p-6 transition-all duration-500 ${
                  currentStep === index 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-2xl shadow-blue-500/25 transform scale-105' 
                    : currentStep > index
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                    : 'border-gray-600/50 bg-white/5 backdrop-blur-sm opacity-80 hover:opacity-100'
                }`}
              >
                {/* Step Indicator */}
                <div className={`flex items-center gap-4 mb-4 ${
                  currentStep === index || currentStep > index ? 'text-white' : 'text-gray-400'
                }`}>
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                    currentStep === index 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50' 
                      : currentStep > index
                      ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/50'
                      : 'bg-gray-600/50'
                  }`}>
                    {currentStep > index ? <FaCheck className="text-lg" /> : <step.icon className="text-lg" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold opacity-80">
                      STEP {index + 1}
                    </div>
                    <div className="font-black text-lg">
                      {step.label}
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <p className={`text-sm ${
                  currentStep === index || currentStep > index ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>

                {/* Progress Line */}
                {index < steps.length - 1 && (
                  <div className={`absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-8 h-0.5 ${
                    currentStep > index ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Container - 90% Width */}
        <div className="w-[90%] mx-auto">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Form Header */}
            <div className="border-b border-white/10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    {steps[currentStep].label}
                  </h2>
                  <p className="text-blue-200 text-lg">
                    {steps[currentStep].description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Corporate Listing</div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <FaCreditCard />
                    <span className="font-semibold">Verified Dealer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-8">
              
              {/* Step 1: Vehicle Details */}
              {currentStep === 0 && (
                <div className="space-y-8">
                  {/* Premium Vehicle Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                          {field.label}
                        </label>
                        <div className="relative">
                          {field.type === 'select' ? (
                            <select
                              name={field.name}
                              value={formData[field.name]}
                              onChange={(e) => handleInputChange(e)}
                              className={`w-full p-4 pl-12 border-2 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white appearance-none ${
                                field.error ? 'border-red-500' : 'border-gray-500/50 group-hover:border-blue-500/50'
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
                              className={`w-full p-4 pl-12 border-2 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                                field.error ? 'border-red-500' : 'border-gray-500/50 group-hover:border-blue-500/50'
                              }`}
                            />
                          )}
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-200">
                            <field.icon />
                          </div>
                        </div>
                        {field.error && (
                          <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {field.error}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Quick Stats Preview */}
                  <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-6 border border-blue-500/20">
                    <h3 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                      <FaStar className="text-yellow-400" />
                      Premium Listing Preview
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      {[
                        { label: 'Market Value', value: 'Premium' },
                        { label: 'Target Audience', value: 'Elite Buyers' },
                        { label: 'Visibility', value: 'Featured' },
                        { label: 'Verification', value: 'Corporate' }
                      ].map((stat, index) => (
                        <div key={index} className="text-white">
                          <div className="text-2xl font-black text-blue-400">{stat.value}</div>
                          <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Specifications & Certification */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaCreditCard className="text-emerald-400 text-3xl" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-3">Specifications & Certification</h2>
                    <p className="text-xl text-gray-300">Technical excellence & quality verification</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-bold text-white mb-4">
                        Premium Vehicle Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your premium vehicle in detail. Highlight unique features, service history, certification details, and why this vehicle stands out in the market. Include maintenance records, special features, and any premium upgrades..."
                        rows="6"
                        className={`w-full p-6 border-2 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg resize-none transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                          formErrors.description ? 'border-red-500' : 'border-gray-500/50'
                        }`}
                      />
                      <div className={`text-lg font-semibold mt-3 flex items-center gap-2 ${
                        formData.description.length >= 50 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {formData.description.length >= 50 ? (
                          <FaCheckCircle />
                        ) : (
                          <FaExclamationTriangle />
                        )}
                        {formData.description.length}/500 characters {formData.description.length >= 50 ? '✓' : '(minimum 50 required)'}
                      </div>
                      {formErrors.description && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                          <FaExclamationTriangle />
                          {formErrors.description}
                        </p>
                      )}
                    </div>

                    {/* Certification & Condition Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Vehicle Condition
                        </label>
                        <select
                          name="carCondition"
                          value={formData.carCondition}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-500/50 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white"
                        >
                          {conditions.map(condition => (
                            <option key={condition.value} value={condition.value} className="text-gray-800">
                              {condition.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Service History
                        </label>
                        <select
                          name="serviceHistory"
                          value={formData.serviceHistory}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-500/50 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white"
                        >
                          {serviceHistories.map(history => (
                            <option key={history} value={history} className="text-gray-800">
                              {history.charAt(0).toUpperCase() + history.slice(1)} Service History
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Accident History
                        </label>
                        <select
                          name="accidentHistory"
                          value={formData.accidentHistory}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-500/50 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white"
                        >
                          {accidentHistories.map(history => (
                            <option key={history} value={history} className="text-gray-800">
                              {history.charAt(0).toUpperCase() + history.slice(1)} Accidents
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Ownership History *
                        </label>
                        <select
                          name="ownershipHistory"
                          value={formData.ownershipHistory}
                          onChange={handleInputChange}
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white ${
                            formErrors.ownershipHistory ? 'border-red-500' : 'border-gray-500/50'
                          }`}
                        >
                          <option value="" className="text-gray-800">Select History</option>
                          {ownershipHistories.map(history => (
                            <option key={history} value={history} className="text-gray-800">
                              {history === 'first' ? 'First Owner' : 
                               history === 'second' ? 'Second Owner' :
                               history === 'third' ? 'Third Owner' :
                               history === 'fourth' ? 'Fourth Owner' : 'Fifth+ Owner'}
                            </option>
                          ))}
                        </select>
                        {formErrors.ownershipHistory && (
                          <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.ownershipHistory}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Legal & Certification Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Road Tax Status
                        </label>
                        <select
                          name="roadTaxStatus"
                          value={formData.roadTaxStatus}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-500/50 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white"
                        >
                          {taxStatuses.map(status => (
                            <option key={status} value={status} className="text-gray-800">
                              {status.charAt(0).toUpperCase() + status.slice(1)} Tax
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Insurance Status
                        </label>
                        <select
                          name="insuranceStatus"
                          value={formData.insuranceStatus}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-500/50 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white"
                        >
                          {insuranceStatuses.map(status => (
                            <option key={status} value={status} className="text-gray-800">
                              {status.charAt(0).toUpperCase() + status.slice(1)} Insurance
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Vehicle Certification
                        </label>
                        <select
                          name="certification"
                          value={formData.certification}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-500/50 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white"
                        >
                          {certifications.map(cert => (
                            <option key={cert} value={cert} className="text-gray-800">
                              {cert.charAt(0).toUpperCase() + cert.slice(1)} Certification
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Features Section */}
                    <div>
                      <label className="block text-2xl font-black text-white mb-6 text-center">
                        🚀 Premium Features & Options
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-4 border-2 border-gray-500/50 rounded-2xl bg-white/5">
                        {featuresList.map(feature => (
                          <button
                            key={feature}
                            type="button"
                            onClick={() => handleFeatureToggle(feature)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                              formData.features.includes(feature)
                                ? 'border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25'
                                : 'border-gray-500/50 bg-white/5 text-gray-300 hover:border-blue-500/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                                formData.features.includes(feature)
                                  ? 'bg-blue-500 border-blue-500'
                                  : 'bg-white/10 border-gray-400'
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

                    {/* Additional Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-xl font-black text-white mb-4">Business Options</h3>
                        
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-gray-500/50">
                          <input
                            type="checkbox"
                            name="priceNegotiable"
                            checked={formData.priceNegotiable}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            id="priceNegotiable"
                          />
                          <label htmlFor="priceNegotiable" className="text-lg font-semibold text-white">
                            Price is negotiable
                          </label>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-gray-500/50">
                          <input
                            type="checkbox"
                            name="testDrive"
                            checked={formData.testDrive}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            id="testDrive"
                          />
                          <label htmlFor="testDrive" className="text-lg font-semibold text-white">
                            Test drive available
                          </label>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-gray-500/50">
                          <input
                            type="checkbox"
                            name="serviceRecords"
                            checked={formData.serviceRecords}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            id="serviceRecords"
                          />
                          <label htmlFor="serviceRecords" className="text-lg font-semibold text-white">
                            Service records available
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-black text-white mb-4">Warranty & Modifications</h3>
                        
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-gray-500/50">
                          <input
                            type="checkbox"
                            name="warranty"
                            checked={formData.warranty}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            id="warranty"
                          />
                          <label htmlFor="warranty" className="text-lg font-semibold text-white">
                            Dealer warranty included
                          </label>
                        </div>

                        {formData.warranty && (
                          <div>
                            <label className="block text-lg font-bold text-white mb-3">
                              Warranty Period (Months)
                            </label>
                            <input
                              type="number"
                              name="warrantyMonths"
                              value={formData.warrantyMonths}
                              onChange={handleInputChange}
                              placeholder="e.g., 12"
                              className="w-full p-4 border-2 border-gray-500/50 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-lg font-bold text-white mb-3">
                            Modifications Level
                          </label>
                          <select
                            name="modifications"
                            value={formData.modifications}
                            onChange={handleInputChange}
                            className="w-full p-4 border-2 border-gray-500/50 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white"
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
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaBuilding className="text-purple-400 text-3xl" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-3">Dealer & Media</h2>
                    <p className="text-xl text-gray-300">Corporate details & premium visuals</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-black text-white mb-6">Corporate Information</h3>
                      
                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Contact Person Name *
                        </label>
                        <input
                          type="text"
                          name="sellerName"
                          value={formData.sellerName}
                          onChange={handleInputChange}
                          placeholder="e.g., John Doe - Sales Manager"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                            formErrors.sellerName ? 'border-red-500' : 'border-gray-500/50'
                          }`}
                        />
                        {formErrors.sellerName && (
                          <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.sellerName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="e.g., Premium Auto Dealers Ltd"
                          className="w-full p-4 border-2 border-gray-500/50 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Dealer License Number
                        </label>
                        <input
                          type="text"
                          name="dealerLicense"
                          value={formData.dealerLicense}
                          onChange={handleInputChange}
                          placeholder="e.g., DL-2024-789456"
                          className="w-full p-4 border-2 border-gray-500/50 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-2xl font-black text-white mb-6">Contact Details</h3>

                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Business Phone *
                        </label>
                        <input
                          type="tel"
                          name="sellerPhone"
                          value={formData.sellerPhone}
                          onChange={handleInputChange}
                          placeholder="e.g., +254 712 345 678"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                            formErrors.sellerPhone ? 'border-red-500' : 'border-gray-500/50'
                          }`}
                        />
                        {formErrors.sellerPhone && (
                          <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.sellerPhone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Business Email *
                        </label>
                        <input
                          type="email"
                          name="sellerEmail"
                          value={formData.sellerEmail}
                          onChange={handleInputChange}
                          placeholder="e.g., sales@premiumauto.co.ke"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                            formErrors.sellerEmail ? 'border-red-500' : 'border-gray-500/50'
                          }`}
                        />
                        {formErrors.sellerEmail && (
                          <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                            <FaExclamationTriangle />
                            {formErrors.sellerEmail}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-white mb-3">
                          Preferred Contact Method
                        </label>
                        <select
                          name="preferredContact"
                          value={formData.preferredContact}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-500/50 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg transition-all duration-200 bg-white/5 backdrop-blur-sm text-white"
                        >
                          {contactMethods.map(method => (
                            <option key={method} value={method} className="text-gray-800">
                              {method === 'phone' ? 'Phone Only' :
                               method === 'email' ? 'Email Only' : 'Phone & Email'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-2xl font-black text-white mb-6 text-center">
                      📸 Premium Vehicle Photography ({imagePreviews.length}/10) *
                    </label>
                    
                    <div className={`border-3 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all duration-200 ${
                      formErrors.images ? 'border-red-300 bg-red-500/10' : 'border-gray-500/50 hover:border-blue-500/50 hover:bg-blue-500/10'
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
                          <div className="space-y-4">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                            <p className="text-lg font-semibold text-white">Uploading Premium Images...</p>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <FaUpload className="text-5xl md:text-6xl text-gray-400 mx-auto mb-6 transition-all duration-200" />
                            <p className="text-2xl font-bold text-white mb-3">
                              {imagePreviews.length > 0 ? 'Add More Premium Photos' : 'Upload Premium Vehicle Photos'}
                            </p>
                            <p className="text-lg text-gray-300 mb-4">
                              Showcase your vehicle with high-quality professional photography
                            </p>
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                              <FaCamera />
                              Choose Professional Photos
                            </div>
                          </>
                        )}
                      </label>
                    </div>
                    {formErrors.images && (
                      <p className="text-red-400 text-sm mt-3 flex items-center gap-2 justify-center">
                        <FaExclamationTriangle />
                        {formErrors.images}
                      </p>
                    )}

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-xl font-black text-white mb-6 text-center">
                          🖼️ Your Premium Gallery
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={preview.id} className="relative group">
                              <div className="aspect-square rounded-2xl overflow-hidden border-2 border-gray-500/50 group-hover:border-red-400 transition-all duration-200">
                                <img
                                  src={preview.url}
                                  alt={`Premium vehicle preview ${index + 1}`}
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
                                <div className="absolute bottom-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                  🏆 Featured Image
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Corporate Assurance */}
                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl p-6 border border-emerald-500/20">
                    <div className="flex items-center gap-4">
                      <FaCreditCard className="text-emerald-400 text-3xl" />
                      <div>
                        <h4 className="text-xl font-black text-white mb-2">Corporate Seller Assurance</h4>
                        <p className="text-emerald-200">
                          Your business information is verified and protected. Premium buyers trust corporate listings with 
                          complete transparency and professional service guarantees.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-white/10">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="w-full md:w-auto px-8 md:px-12 py-4 border-2 border-gray-500/50 rounded-2xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-lg text-white hover:border-blue-500/50"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  Step {currentStep + 1} of {steps.length}
                </div>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full md:w-auto px-8 md:px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 group"
                  >
                    <span className="flex items-center gap-3">
                      Continue
                      <FaBolt className="group-hover:animate-pulse" />
                    </span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 md:px-12 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Publishing Elite Listing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        <FaRocket className="group-hover:animate-bounce" />
                        Launch Premium Listing
                      </span>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Corporate Assurance Footer */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-emerald-500/20">
            <FaRocket className="text-emerald-400 text-2xl" />
            <div className="text-left">
              <div className="text-white font-bold text-lg">Corporate Seller Assurance</div>
              <div className="text-emerald-300 text-sm">Verified business • Premium support • Quality guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}