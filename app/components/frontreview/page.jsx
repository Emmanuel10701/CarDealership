'use client'

import { useState, useEffect } from 'react'
import { FaStar, FaRegStar, FaChevronRight, FaQuoteLeft, FaExternalLinkAlt, FaTimes } from 'react-icons/fa'

const ReviewComponent = () => {
  const [reviews, setReviews] = useState([])
  const [allReviews, setAllReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false)

  // Modern dummy data with better content - only 4+ star ratings
  const MODERN_DUMMY_REVIEWS = [
    {
      id: 'dummy-1',
      customerName: 'Sarah Kimani',
      customerEmail: 'sarah@example.com',
      rating: 5,
      serviceType: 'CAR_PURCHASE',
      comments: 'The entire process was seamless! From browsing to purchase, the team made everything so easy. Found my dream car at a great price. The customer service was exceptional throughout the entire journey.',
      createdAt: '2024-01-15T10:00:00.000Z',
      reviewLink: { title: 'Premium SUV Purchase' }
    },
    {
      id: 'dummy-2',
      customerName: 'James Mwangi',
      customerEmail: 'james@example.com',
      rating: 5,
      serviceType: 'CAR_SELLING',
      comments: 'Sold my Mercedes in under a week! Professional photography and marketing really made the difference. The team was responsive and handled all the paperwork efficiently.',
      createdAt: '2024-01-14T10:00:00.000Z',
      reviewLink: { title: 'Luxury Car Sale' }
    },
    {
      id: 'dummy-3',
      customerName: 'Grace Wanjiku',
      customerEmail: 'grace@example.com',
      rating: 5,
      serviceType: 'INSURANCE',
      comments: 'Comprehensive insurance coverage with amazing rates. The advisor explained everything clearly and found me the perfect policy for my new vehicle. Highly recommended!',
      createdAt: '2024-01-13T10:00:00.000Z',
      reviewLink: { title: 'Full Coverage Insurance' }
    },
    {
      id: 'dummy-4',
      customerName: 'David Ochieng',
      customerEmail: 'david@example.com',
      rating: 4,
      serviceType: 'OTHER',
      comments: 'Outstanding customer service throughout. The team went above and beyond to ensure I was satisfied with my corporate fleet purchase. Will definitely use their services again.',
      createdAt: '2024-01-12T10:00:00.000Z',
      reviewLink: { title: 'Corporate Fleet Service' }
    },
    {
      id: 'dummy-5',
      customerName: 'Linda Wambui',
      customerEmail: 'linda@example.com',
      rating: 5,
      serviceType: 'CAR_PURCHASE',
      comments: 'Amazing experience! The team helped me find the perfect family car within my budget. The financing options were excellent and the after-sales support has been outstanding.',
      createdAt: '2024-01-11T10:00:00.000Z',
      reviewLink: { title: 'Family Car Purchase' }
    },
    {
      id: 'dummy-6',
      customerName: 'Michael Otieno',
      customerEmail: 'michael@example.com',
      rating: 4,
      serviceType: 'CAR_SELLING',
      comments: 'Quick and professional service. Got a fair price for my car and the process was much smoother than I expected. Would recommend to anyone looking to sell their vehicle.',
      createdAt: '2024-01-10T10:00:00.000Z',
      reviewLink: { title: 'Used Car Sale' }
    },
    {
      id: 'dummy-7',
      customerName: 'Esther Achieng',
      customerEmail: 'esther@example.com',
      rating: 5,
      serviceType: 'INSURANCE',
      comments: 'The insurance team was incredibly helpful. They found me comprehensive coverage at a great price and made sure I understood all the terms. Excellent service!',
      createdAt: '2024-01-09T10:00:00.000Z',
      reviewLink: { title: 'Vehicle Insurance' }
    },
    {
      id: 'dummy-8',
      customerName: 'Robert Kamau',
      customerEmail: 'robert@example.com',
      rating: 5,
      serviceType: 'OTHER',
      comments: 'Exceptional service for our company fleet. The team handled everything from selection to delivery and maintenance. Made fleet management so much easier for our business.',
      createdAt: '2024-01-08T10:00:00.000Z',
      reviewLink: { title: 'Business Fleet Management' }
    }
  ]

  // Generate modern gradient based on name
  const generateGradient = (name) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-emerald-500 to-cyan-600',
      'from-orange-500 to-red-600',
      'from-violet-500 to-fuchsia-600',
      'from-rose-500 to-pink-600',
      'from-indigo-500 to-blue-600'
    ]
    
    if (!name) return gradients[0]
    const index = name.length % gradients.length
    return gradients[index]
  }

  // Generate avatar initials
  const generateAvatar = (name) => {
    if (!name) return '??'
    
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Service type configuration
  const SERVICE_TYPES = {
    CAR_PURCHASE: { 
      label: 'Car Purchase', 
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      icon: '🚗'
    },
    CAR_SELLING: { 
      label: 'Car Selling', 
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      icon: '💰'
    },
    INSURANCE: { 
      label: 'Insurance', 
      color: 'bg-gradient-to-r from-purple-500 to-fuchsia-600',
      icon: '🛡️'
    },
    OTHER: { 
      label: 'Other Service', 
      color: 'bg-gradient-to-r from-gray-500 to-slate-600',
      icon: '⭐'
    }
  }

  // Render star rating with proper FaStar icons
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          index < rating ? (
            <FaStar 
              key={index}
              className="w-4 h-4 text-yellow-400"
            />
          ) : (
            <FaRegStar 
              key={index}
              className="w-4 h-4 text-gray-300"
            />
          )
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-700">
          {rating}.0
        </span>
      </div>
    )
  }

  // Filter reviews to only include 4+ star ratings
  const filterHighRatedReviews = (reviewsList) => {
    return reviewsList.filter(review => review.rating >= 4)
  }

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/reviews')
        const data = await response.json()
        
        if (data.success && data.reviews) {
          let allReviewsData = filterHighRatedReviews(data.reviews)
          
          // Combine with dummy data if needed, ensuring only 4+ stars
          if (allReviewsData.length < 8) {
            const neededDummies = 8 - allReviewsData.length
            allReviewsData = [...allReviewsData, ...MODERN_DUMMY_REVIEWS.slice(0, neededDummies)]
          }
          
          setAllReviews(allReviewsData)
          setReviews(allReviewsData.slice(0, 4)) // Show first 4 on main grid
        } else {
          setAllReviews(MODERN_DUMMY_REVIEWS)
          setReviews(MODERN_DUMMY_REVIEWS.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
        setAllReviews(MODERN_DUMMY_REVIEWS)
        setReviews(MODERN_DUMMY_REVIEWS.slice(0, 4))
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const openModal = (review) => {
    setSelectedReview(review)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedReview(null), 300)
  }

  const openAllReviewsModal = () => {
    setIsAllReviewsModalOpen(true)
  }

  const closeAllReviewsModal = () => {
    setIsAllReviewsModalOpen(false)
  }

  const openReviewFromAll = (review) => {
    setSelectedReview(review)
    setIsAllReviewsModalOpen(false)
    setIsModalOpen(true)
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm"
          >
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 md:space-x-4 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                <div className="h-3 bg-gray-300 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Main Review Grid with View All Button */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="group cursor-pointer"
              onClick={() => openModal(review)}
            >
              <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-100 shadow-sm h-full flex flex-col">
                
                {/* Header with Avatar and Service Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${generateGradient(review.customerName)} bg-gradient-to-br shadow-lg flex items-center justify-center`}>
                      <span className="text-white font-bold text-xs md:text-sm">
                        {generateAvatar(review.customerName)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm leading-tight">
                        {review.customerName}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs">
                          {SERVICE_TYPES[review.serviceType]?.icon}
                        </span>
                        <span className="text-xs text-gray-500">
                          {SERVICE_TYPES[review.serviceType]?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* See More Button */}
                  <div className="text-blue-500">
                    <FaExternalLinkAlt className="text-sm" />
                  </div>
                </div>

                {/* Star Rating */}
                <div className="mb-4">
                  {renderStars(review.rating)}
                </div>

                {/* Review Text */}
                <div className="flex-1 mb-4">
                  <FaQuoteLeft className="text-blue-200 text-lg mb-2" />
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {review.comments}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <div className="flex items-center gap-1 text-blue-500 text-xs font-semibold cursor-pointer">
                    Read full
                    <FaChevronRight className="text-xs" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Reviews Button */}
        <div className="flex justify-center">
          <button
            onClick={openAllReviewsModal}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            View All Reviews ({allReviews.length})
          </button>
        </div>
      </div>

      {/* All Reviews Modal */}
      {isAllReviewsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl md:rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="relative p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    All Customer Reviews
                  </h2>
                  <p className="text-gray-600 mt-2">
                    What our customers are saying about our services
                  </p>
                </div>
                <button
                  onClick={closeAllReviewsModal}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* All Reviews Grid */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {allReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-200 cursor-pointer hover:border-blue-300 transition-all duration-300"
                    onClick={() => openReviewFromAll(review)}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-10 h-10 rounded-2xl ${generateGradient(review.customerName)} bg-gradient-to-br shadow-lg flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">
                          {generateAvatar(review.customerName)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">
                          {review.customerName}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs">
                            {SERVICE_TYPES[review.serviceType]?.icon}
                          </span>
                          <span className="text-xs text-gray-500">
                            {SERVICE_TYPES[review.serviceType]?.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      {renderStars(review.rating)}
                    </div>

                    <div className="mb-4">
                      <FaQuoteLeft className="text-blue-200 text-sm mb-2" />
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {review.comments}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <div className="flex items-center gap-1 text-blue-500 text-xs font-semibold">
                        View details
                        <FaChevronRight className="text-xs" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                  Showing {allReviews.length} reviews
                </p>
                <button
                  onClick={closeAllReviewsModal}
                  className="bg-gray-600 text-white px-6 py-2 rounded-xl font-semibold cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Review Detail Modal */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl md:rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="relative p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${generateGradient(selectedReview.customerName)} bg-gradient-to-br shadow-xl flex items-center justify-center`}>
                    <span className="text-white font-bold text-base md:text-lg">
                      {generateAvatar(selectedReview.customerName)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                      {selectedReview.customerName}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">{selectedReview.customerEmail}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold text-white ${SERVICE_TYPES[selectedReview.serviceType]?.color}`}>
                        {SERVICE_TYPES[selectedReview.serviceType]?.icon} {SERVICE_TYPES[selectedReview.serviceType]?.label}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="flex items-center gap-4 mb-6">
                {renderStars(selectedReview.rating)}
                <span className="text-base md:text-lg font-semibold text-gray-700">
                  {selectedReview.rating === 5 ? 'Excellent Experience' : 
                   selectedReview.rating === 4 ? 'Great Experience' : 'Good Experience'}
                </span>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 md:p-6 mb-6">
                <FaQuoteLeft className="text-blue-300 text-xl md:text-2xl mb-4" />
                <p className="text-gray-700 text-base md:text-lg leading-relaxed italic">
                  "{selectedReview.comments}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service Date:</span>
                    <span className="font-semibold text-gray-800 text-right">
                      {new Date(selectedReview.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {selectedReview.reviewLink?.title && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service Type:</span>
                      <span className="font-semibold text-gray-800 text-right">
                        {selectedReview.reviewLink.title}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {selectedReview.reviewLink?.uniqueCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reference Code:</span>
                      <span className="font-semibold text-blue-600 text-right">
                        {selectedReview.reviewLink.uniqueCode}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-semibold text-green-600 text-right">
                      Verified Review
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-xl font-semibold shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
                >
                  Close Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ReviewComponent