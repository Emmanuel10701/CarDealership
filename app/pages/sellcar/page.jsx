"use client"

import { useState } from 'react'
import { FaCar, FaMapMarkerAlt, FaCalendar, FaShieldAlt, FaTachometerAlt, FaCog, FaGasPump, FaMoneyBillWave, FaUpload, FaCheck, FaPhone, FaEnvelope, FaUser, FaCamera, FaRocket, FaStar, FaCheckCircle } from 'react-icons/fa'

export default function SellYourCar() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([])
  const [submissionResult, setSubmissionResult] = useState(null)

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
  })

  const carTypes = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Luxury', 'Convertible', 'Coupe', 'Minivan', 'Truck']
  const transmissions = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic']
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG']
  const locations = ['Nairobi', 'Nakuru', 'Nyeri', 'Muranga', 'Kiambu', 'Thika', 'Mombasa', 'Kisumu', 'Eldoret', 'Other']
  
  const featuresList = [
    'Air Conditioning', 'Leather Seats', 'Sunroof', 'Navigation', 'Backup Camera',
    'Bluetooth', 'Push Start', 'Keyless Entry', 'Climate Control', 'Alloy Wheels',
    'Parking Sensors', 'LED Lights', 'Premium Sound', 'Heated Seats', '4WD/AWD',
    'Tow Package', 'Roof Rails', 'Third Row Seating', 'Apple CarPlay', 'Android Auto',
    'Cruise Control', 'Power Windows', 'Power Locks', 'ABS Brakes', 'Airbags',
    'GPS Tracking', 'Alarm System', 'Fog Lights', 'Running Boards', 'Tinted Windows'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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

    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      name: file.name,
      type: file.type,
      size: file.size
    }))

    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
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

      const response = await fetch("/api/sellyourcar", {
        method: "POST",
        body: submitFormData,
      })

      const result = await response.json()

      if (result.success) {
        setSubmissionResult(result)
        setCurrentStep(5)
        // Clear form data
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
        })
        setImagePreviews([])
      } else {
        alert(`Submission failed: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred while submitting the form.")
    } finally {
      setIsSubmitting(false)
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
    })
    setImagePreviews([])
    setCurrentStep(1)
    setSubmissionResult(null)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.carName && formData.year && formData.price && formData.location
      case 2:
        return formData.carType && formData.mileage && formData.transmission && formData.fuelType
      case 3:
        return formData.description.length >= 50
      case 4:
        return formData.sellerName && formData.sellerPhone && formData.sellerEmail && imagePreviews.length >= 1
      default:
        return false
    }
  }

  const StepIndicator = ({ number, title, isActive, isCompleted }) => (
    <div className="flex items-center space-x-4">
      <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
        isCompleted 
          ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' 
          : isActive
          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
          : 'bg-white border-gray-300 text-gray-400'
      }`}>
        {isCompleted ? <FaCheck className="text-lg" /> : number}
      </div>
      <div className="flex-1 hidden sm:block">
        <div className={`text-sm font-semibold transition-all duration-300 ${
          isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'
        }`}>
          Step {number}
        </div>
        <div className={`text-lg font-bold transition-all duration-300 ${
          isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'
        }`}>
          {title}
        </div>
      </div>
    </div>
  )

  // Success Step
  if (currentStep === 5 && submissionResult?.success) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl">
              <FaCheckCircle className="text-green-500 text-4xl sm:text-6xl" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4 sm:mb-6">
              Thank You!
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Your car listing has been submitted successfully
            </p>

            {/* Reference Number */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 inline-block border border-green-200 shadow-lg">
              <div className="text-sm text-gray-500 mb-2">Reference Number</div>
              <div className="text-2xl sm:text-3xl font-black text-green-600">{submissionResult.reference}</div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-white/60 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-8 sm:mb-12">
              What Happens Next?
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                    <step.icon className="text-white text-2xl sm:text-3xl" />
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-xs sm:text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 sm:mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4 sm:space-y-6">
            <button 
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 mx-2 sm:mx-4"
            >
              <FaCar />
              List Another Car
            </button>
            <button 
              onClick={() => window.location.href = '/cars'}
              className="bg-gray-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 mx-2 sm:mx-4"
            >
              Browse Other Cars
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-sm border border-gray-100 mb-4 sm:mb-6">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-semibold text-sm sm:text-base">Sell Your Car in 4 Easy Steps</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sell Your Car
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            List your car on <span className="font-bold text-blue-600">Maina Cars</span> and connect with thousands of verified buyers across Kenya
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
            <StepIndicator 
              number={1} 
              title="Basic Info" 
              isActive={currentStep === 1} 
              isCompleted={currentStep > 1} 
            />
            <StepIndicator 
              number={2} 
              title="Specifications" 
              isActive={currentStep === 2} 
              isCompleted={currentStep > 2} 
            />
            <StepIndicator 
              number={3} 
              title="Description" 
              isActive={currentStep === 3} 
              isCompleted={currentStep > 3} 
            />
            <StepIndicator 
              number={4} 
              title="Contact & Photos" 
              isActive={currentStep === 4} 
              isCompleted={currentStep > 4} 
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaCar className="text-blue-600 text-2xl sm:text-3xl" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Tell Us About Your Car</h2>
                    <p className="text-lg sm:text-xl text-gray-600">Let's start with the basic details</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                          <FaCar className="text-blue-600 text-lg sm:text-xl" />
                          Car Model & Make
                        </label>
                        <input
                          type="text"
                          name="carName"
                          value={formData.carName}
                          onChange={handleInputChange}
                          placeholder="e.g., Toyota RAV4 2021"
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                          <FaCalendar className="text-blue-600 text-lg sm:text-xl" />
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
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                          <FaMoneyBillWave className="text-green-600 text-lg sm:text-xl" />
                          Asking Price (KSh)
                        </label>
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="e.g., 2,300,000"
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                          <FaMapMarkerAlt className="text-red-600 text-lg sm:text-xl" />
                          Car Location
                        </label>
                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
                          required
                        >
                          <option value="">Select Location</option>
                          {locations.map(location => (
                            <option key={location} value={location}>{location}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Specifications */}
              {currentStep === 2 && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaCog className="text-green-600 text-2xl sm:text-3xl" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Car Specifications</h2>
                    <p className="text-lg sm:text-xl text-gray-600">Tell us more about your car's features</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
                          Car Type
                        </label>
                        <select
                          name="carType"
                          value={formData.carType}
                          onChange={handleInputChange}
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          required
                        >
                          <option value="">Select Type</option>
                          {carTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                          <FaTachometerAlt className="text-blue-600 text-lg sm:text-xl" />
                          Mileage (km)
                        </label>
                        <input
                          type="text"
                          name="mileage"
                          value={formData.mileage}
                          onChange={handleInputChange}
                          placeholder="e.g., 45,000"
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                          <FaCog className="text-blue-600 text-lg sm:text-xl" />
                          Transmission
                        </label>
                        <select
                          name="transmission"
                          value={formData.transmission}
                          onChange={handleInputChange}
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          required
                        >
                          <option value="">Select Transmission</option>
                          {transmissions.map(trans => (
                            <option key={trans} value={trans}>{trans}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                          <FaGasPump className="text-blue-600 text-lg sm:text-xl" />
                          Fuel Type
                        </label>
                        <select
                          name="fuelType"
                          value={formData.fuelType}
                          onChange={handleInputChange}
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          required
                        >
                          <option value="">Select Fuel Type</option>
                          {fuelTypes.map(fuel => (
                            <option key={fuel} value={fuel}>{fuel}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                      Select Available Features
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-80 sm:max-h-96 overflow-y-auto p-3 sm:p-4">
                      {featuresList.map(feature => (
                        <button
                          key={feature}
                          type="button"
                          onClick={() => handleFeatureToggle(feature)}
                          className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-102 ${
                            formData.features.includes(feature)
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-200'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                              formData.features.includes(feature)
                                ? 'bg-blue-500 border-blue-500'
                                : 'bg-white border-gray-300'
                            }`}>
                              {formData.features.includes(feature) && (
                                <FaCheck className="text-white text-xs" />
                              )}
                            </div>
                            <span className="font-medium text-sm sm:text-base">{feature}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Description */}
              {currentStep === 3 && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaStar className="text-purple-600 text-2xl sm:text-3xl" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Describe Your Car</h2>
                    <p className="text-lg sm:text-xl text-gray-600">Help buyers fall in love with your car</p>
                  </div>
                  
                  <div>
                    <label className="block text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                      Detailed Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your car in detail. Include information about condition, service history, any accidents, special features, maintenance records, and why you're selling. Be honest and detailed to attract serious buyers..."
                      rows="6"
                      className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg resize-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      required
                    />
                    <div className={`text-base sm:text-lg font-semibold mt-2 sm:mt-3 ${
                      formData.description.length >= 50 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formData.description.length}/500 characters {formData.description.length >= 50 ? '✓' : '(minimum 50 required)'}
                    </div>
                  </div>

                  {/* Preview Card */}
                  {formData.carName && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-8 border-2 border-blue-100">
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6 text-center">Listing Preview</h3>
                      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <h4 className="text-xl sm:text-2xl font-black text-gray-900">{formData.carName}</h4>
                          <div className="text-2xl sm:text-3xl font-black text-blue-600">KSh {formData.price}</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-gray-600 mb-3 sm:mb-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <FaMapMarkerAlt className="text-gray-400 text-base sm:text-lg" />
                            <span className="font-semibold text-sm sm:text-base">{formData.location}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <FaCalendar className="text-gray-400 text-base sm:text-lg" />
                            <span className="font-semibold text-sm sm:text-base">{formData.year}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <FaTachometerAlt className="text-gray-400 text-base sm:text-lg" />
                            <span className="font-semibold text-sm sm:text-base">{formData.mileage} km</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <FaCar className="text-gray-400 text-base sm:text-lg" />
                            <span className="font-semibold text-sm sm:text-base">{formData.carType}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed line-clamp-3">
                          {formData.description || 'Your detailed description will appear here...'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Contact & Photos */}
              {currentStep === 4 && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaUser className="text-orange-600 text-2xl sm:text-3xl" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Contact & Photos</h2>
                    <p className="text-lg sm:text-xl text-gray-600">Final step! Add your details and car photos</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                          <FaUser className="text-blue-600 text-lg sm:text-xl" />
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="sellerName"
                          value={formData.sellerName}
                          onChange={handleInputChange}
                          placeholder="e.g., John Doe"
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                          <FaPhone className="text-green-600 text-lg sm:text-xl" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="sellerPhone"
                          value={formData.sellerPhone}
                          onChange={handleInputChange}
                          placeholder="e.g., +254 712 345 678"
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                          <FaEnvelope className="text-blue-600 text-lg sm:text-xl" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="sellerEmail"
                          value={formData.sellerEmail}
                          onChange={handleInputChange}
                          placeholder="e.g., your.email@example.com"
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          required
                        />
                      </div>

                      <div className="bg-blue-50 rounded-2xl p-4 sm:p-6 border-2 border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                          <FaShieldAlt className="text-blue-600" />
                          Privacy Protected
                        </h4>
                        <p className="text-blue-700 text-xs sm:text-sm">
                          Your contact information is secure and will only be shared with verified buyers.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                      Upload Car Photos ({imagePreviews.length}/10)
                    </label>
                    
                    <div className="border-3 border-dashed border-gray-300 rounded-3xl p-6 sm:p-8 md:p-12 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50">
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
                        <FaUpload className="text-4xl sm:text-5xl md:text-6xl text-gray-400 mx-auto mb-4 sm:mb-6 transition-all duration-200" />
                        <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">
                          {imagePreviews.length > 0 ? 'Add More Photos' : 'Click to Upload Photos'}
                        </p>
                        <p className="text-base sm:text-lg text-gray-500 mb-3 sm:mb-4">
                          Upload high-quality photos from different angles
                        </p>
                        <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-base sm:text-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105">
                          <FaCamera />
                          Choose Files
                        </div>
                      </label>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-6 sm:mt-8">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                          Your Car Photos
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
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
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-lg shadow-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-110"
                              >
                                ×
                              </button>
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                                {index === 0 && 'Main Photo'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-5 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-base sm:text-lg text-gray-700 hover:shadow-lg transform hover:scale-105"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  Step {currentStep} of 4
                </div>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isStepValid() || isSubmitting}
                    className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 sm:gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
          <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 text-center border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaUser className="text-blue-600 text-xl sm:text-2xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4">Reach Real Buyers</h3>
              <p className="text-gray-600 text-sm sm:text-base">Connect with thousands of verified buyers across Kenya</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 text-center border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaMoneyBillWave className="text-green-600 text-xl sm:text-2xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4">Get Best Price</h3>
              <p className="text-gray-600 text-sm sm:text-base">Receive competitive offers and sell at the right price</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 text-center border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaRocket className="text-purple-600 text-xl sm:text-2xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4">Quick & Easy</h3>
              <p className="text-gray-600 text-sm sm:text-base">Sell your car faster with our streamlined process</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}