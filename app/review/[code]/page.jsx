"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { CircularProgress } from '@mui/material'

// Icons
import { 
  FaStar, 
  FaCheckCircle, 
  FaCar, 
  FaWrench, 
  FaMoneyBillWave, 
  FaShieldAlt,
  FaUser, 
  FaEnvelope,
  FaRedo,
  FaLink,
  FaHome,
  FaCog,
  FaHandshake,
  FaChartLine
} from 'react-icons/fa'

// Service types configuration
const SERVICE_TYPES = [
  { value: 'CAR_PURCHASE', label: 'Car Purchase', icon: FaCar, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { value: 'CAR_SELLING', label: 'Car Selling', icon: FaMoneyBillWave, color: 'text-green-600', bgColor: 'bg-green-50' },
  { value: 'TEST_DRIVE', label: 'Test Drive', icon: FaCar, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { value: 'MAINTENANCE', label: 'Maintenance', icon: FaWrench, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { value: 'FINANCING', label: 'Financing', icon: FaMoneyBillWave, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { value: 'INSURANCE', label: 'Insurance', icon: FaShieldAlt, color: 'text-red-600', bgColor: 'bg-red-50' },
  { value: 'OTHER', label: 'Other Service', icon: FaUser, color: 'text-gray-600', bgColor: 'bg-gray-50' }
]

export default function ReviewPage() {
  const [reviewLink, setReviewLink] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [errorDetails, setErrorDetails] = useState(null)
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    rating: 0,
    serviceType: 'CAR_PURCHASE',
    comments: '',
    wouldRecommend: null
  })

  const params = useParams()

  useEffect(() => {
    if (params.code) {
      fetchReviewLink()
    }
  }, [params.code])

  const fetchReviewLink = async () => {
    try {
      setLoading(true)
      setErrorDetails(null)
      
      const response = await fetch(`/api/review-links/by-code/${params.code}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      if (data.success) {
        setReviewLink(data.reviewLink)
      } else {
        setErrorDetails(data.debug || data.details)
        toast.error(data.error || 'Invalid review link')
      }
    } catch (error) {
      console.error('Error fetching review link:', error)
      setErrorDetails(error.message)
      toast.error('Failed to load review form')
    } finally {
      setLoading(false)
    }
  }

  const handleRating = (rating) => {
    setFormData({ ...formData, rating })
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setFormLoading(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewLinkCode: params.code,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          rating: formData.rating,
          serviceType: formData.serviceType,
          comments: formData.comments,
          wouldRecommend: formData.wouldRecommend,
          reviewLinkId: reviewLink?.id
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
        toast.success('Thank you for your valuable feedback! Your review has been submitted successfully.')
      } else {
        console.error('API Error:', data)
        toast.error(data.error || 'Failed to submit review. Please try again.')
      }
    } catch (error) {
      console.error('Submit review error:', error)
      toast.error('Network error. Please check your connection and try again.')
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <CircularProgress size={60} className="text-blue-600 mb-4" />
          <p className="text-gray-600">Loading review form...</p>
        </div>
      </div>
    )
  }

  if (!reviewLink && !loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLink className="text-red-500 text-2xl" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-3">Review Link Expired</h1>
          <p className="text-gray-600 mb-4 text-sm">
            This review link is no longer active or has been used.
          </p>
          
          {errorDetails && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-left">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Error Details:</h3>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <FaHome className="text-sm" />
              Return Home
            </button>
            
            <button
              onClick={fetchReviewLink}
              className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <FaRedo className="text-sm" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h1>
          <p className="text-gray-600 mb-6 text-sm">
            Your feedback has been submitted successfully and is now being processed.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.close()}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
            >
              Close Window
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <FaHome className="text-sm" />
              Visit Website
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentRating = hoverRating || formData.rating

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">CorporateSellers</h1>
        
        {/* Service Description Section */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <FaShieldAlt className="text-blue-600" />
              Your Experience Drives Our Excellence
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-left mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaCog className="text-blue-600" />
                  About Our Services
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  At CorporateSellers, we're committed to revolutionizing the automotive experience. 
                  Our comprehensive services include premium vehicle sourcing with 200+ point inspections, 
                  personalized financing solutions with competitive rates, extended warranty packages, 
                  and dedicated after-sales support. Each vehicle undergoes rigorous quality assurance 
                  and comes with transparent history reports and certified pre-owned certifications.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaChartLine className="text-green-600" />
                  How Your Review Helps
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Your honest feedback is the cornerstone of our continuous improvement. Each review 
                  helps us enhance vehicle quality standards, refine our customer service protocols, 
                  develop new features based on real user needs, and train our team to exceed expectations. 
                  We analyze every piece of feedback to implement meaningful changes that benefit future customers.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FaHandshake className="text-purple-600" />
                Our Commitment to You
              </h4>
              <p className="text-gray-700 text-sm">
                We read every review personally and use your insights to drive innovation in our services. 
                Your voice directly influences our training programs, service enhancements, and quality 
                control measures. Together, we're building a better automotive experience for everyone.
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Share your journey with us - your feedback shapes our future
        </p>
      </div>

      {/* Review Form */}
      <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Star Rating */}
          <div className="text-center space-y-4">
            <label className="block text-lg font-semibold text-gray-900">
              How would you rate your overall experience? *
            </label>

            <div className="flex justify-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-4xl focus:outline-none transition-transform duration-200 hover:scale-110 cursor-pointer transform-gpu min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <FaStar
                    className={`
                      ${star <= currentRating 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                      } 
                      transition-colors duration-200
                    `}
                  />
                </button>
              ))}
            </div>

            <div className="flex justify-between text-xs text-gray-500 px-2 max-w-xs mx-auto">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Service Type */}
          <div className="space-y-4">
            <label className="block text-base font-semibold text-gray-900">
              What service did you receive? *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {SERVICE_TYPES.map((service) => {
                const Icon = service.icon
                return (
                  <button
                    key={service.value}
                    type="button"
                    onClick={() => handleInputChange('serviceType', service.value)}
                    className={`
                      flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer min-h-[80px]
                      ${formData.serviceType === service.value
                        ? 'border-blue-500 bg-blue-50'
                        : `border-gray-200 hover:border-gray-300 ${service.bgColor}`
                      }
                    `}
                  >
                    <Icon className={`text-xl mb-2 ${service.color}`} />
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                      {service.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-4">
            <label className="block text-base font-semibold text-gray-900">
              Would you recommend CorporateSellers to others?
            </label>
            <div className="flex gap-3 justify-center flex-wrap">
              {[
                { value: true, label: "Yes", color: "bg-green-500 hover:bg-green-600" },
                { value: false, label: "No", color: "bg-red-500 hover:bg-red-600" }
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleInputChange('wouldRecommend', option.value)}
                  className={`
                    px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-200 cursor-pointer text-sm min-w-[100px] min-h-[44px]
                    ${formData.wouldRecommend === option.value
                      ? option.color + ' shadow-md'
                      : 'bg-gray-400 hover:bg-gray-500'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FaUser className="inline text-gray-400 mr-2" />
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 cursor-text text-sm min-h-[44px]"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FaEnvelope className="inline text-gray-400 mr-2" />
                Your Email (Optional)
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 cursor-text text-sm min-h-[44px]"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-900">
              Tell us about your experience (Optional)
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 cursor-text resize-none text-sm"
              placeholder="What did you appreciate most about our service? What could we improve to make your next experience even better? Your detailed feedback helps us serve you better."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {formData.comments.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formLoading || formData.rating === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer text-sm min-h-[44px] flex items-center justify-center gap-2"
          >
            {formLoading ? (
              <>
                <CircularProgress size={16} className="text-white" />
                Submitting Your Review...
              </>
            ) : (
              'Submit Your Review'
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By submitting this review, you help us improve our services for all customers.
          </p>
        </form>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-8 py-6 px-4 text-center">
        <p className="text-gray-600 text-xs">
          Powered by <span className="font-semibold text-blue-600">CorporateSellers</span> • Building Better Automotive Experiences Since 2010
        </p>
      </div>
    </div>
  )
}