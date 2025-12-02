'use client'

import { useState, useEffect } from 'react'
import { FaStar, FaRegStar, FaChevronRight, FaQuoteLeft, FaExternalLinkAlt, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

// Modern dummy data - only 4+ star ratings
const MODERN_DUMMY_REVIEWS = [
  {
    id: 'dummy-1',
    customerName: 'Sarah Kimani',
    customerEmail: 'sarah@example.com',
    rating: 5,
    serviceType: 'CAR_PURCHASE',
    comments: 'The entire process was seamless! From browsing to purchase, the team made everything so easy. Found my dream car at a great price.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reviewLink: { title: 'Premium SUV Purchase', uniqueCode: 'SUV24-001' },
    isDummy: true
  },
  {
    id: 'dummy-2',
    customerName: 'James Mwangi',
    customerEmail: 'james@example.com',
    rating: 5,
    serviceType: 'CAR_SELLING',
    comments: 'Sold my Mercedes in under a week! Professional photography and marketing made all the difference.',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    reviewLink: { title: 'Luxury Car Sale', uniqueCode: 'LUX24-002' },
    isDummy: true
  },
  {
    id: 'dummy-3',
    customerName: 'Grace Wanjiku',
    customerEmail: 'grace@example.com',
    rating: 5,
    serviceType: 'INSURANCE',
    comments: 'Comprehensive insurance coverage with amazing rates. The advisor explained everything clearly.',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    reviewLink: { title: 'Full Coverage Insurance' },
    isDummy: true
  },
  {
    id: 'dummy-4',
    customerName: 'David Ochieng',
    customerEmail: 'david@example.com',
    rating: 4,
    serviceType: 'OTHER',
    comments: 'Outstanding customer service. The team went above and beyond for our corporate fleet purchase.',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    reviewLink: { title: 'Corporate Fleet Service' },
    isDummy: true
  },
]

const SERVICE_TYPES = {
  CAR_PURCHASE: { 
    label: 'Car Purchase', 
    color: 'bg-gradient-to-r from-green-500 to-emerald-600',
    icon: '🚗',
    bgColor: 'bg-green-50'
  },
  CAR_SELLING: { 
    label: 'Car Selling', 
    color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    icon: '💰',
    bgColor: 'bg-blue-50'
  },
  INSURANCE: { 
    label: 'Insurance', 
    color: 'bg-gradient-to-r from-purple-500 to-fuchsia-600',
    icon: '🛡️',
    bgColor: 'bg-purple-50'
  },
  OTHER: { 
    label: 'Other Service', 
    color: 'bg-gradient-to-r from-gray-500 to-slate-600',
    icon: '⭐',
    bgColor: 'bg-gray-50'
  }
}

const ReviewComponent = () => {
  const [reviews, setReviews] = useState([])
  const [allReviews, setAllReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false)

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

  // Format date relative or absolute
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          index < rating ? (
            <FaStar 
              key={index}
              className="w-4 h-4 text-yellow-400 fill-yellow-400"
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

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        
        // Fetch real reviews from API
        const response = await fetch('/api/reviews')
        const data = await response.json()
        
        let realReviews = []
        
        if (data.success && data.reviews && Array.isArray(data.reviews)) {
          realReviews = filterHighRatedReviews(data.reviews).map(review => ({
            ...review,
            isDummy: false
          }))
        }
        
        // Combine real reviews with dummy if less than 4 real reviews
        let combinedReviews = [...realReviews]
        
        if (realReviews.length < 4) {
          const neededDummies = 4 - realReviews.length
          const selectedDummies = MODERN_DUMMY_REVIEWS.slice(0, neededDummies)
          combinedReviews = [...realReviews, ...selectedDummies]
        }
        
        // Ensure we have at least 4 reviews to display
        if (combinedReviews.length < 4) {
          combinedReviews = [
            ...combinedReviews,
            ...MODERN_DUMMY_REVIEWS.slice(0, 4 - combinedReviews.length)
          ]
        }
        
        // Sort by date (newest first)
        combinedReviews.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        
        setAllReviews(combinedReviews)
        setReviews(combinedReviews.slice(0, 4)) // Show first 4 on main grid
        
      } catch (error) {
        console.error('Error fetching reviews:', error)
        // Fallback to dummy data on error
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
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      setSelectedReview(null)
      document.body.style.overflow = 'unset'
    }, 300)
  }

  const openAllReviewsModal = () => {
    setIsAllReviewsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeAllReviewsModal = () => {
    setIsAllReviewsModalOpen(false)
    document.body.style.overflow = 'unset'
  }

  const openReviewFromAll = (review) => {
    setSelectedReview(review)
    setIsAllReviewsModalOpen(false)
    setIsModalOpen(true)
  }

  // Modern Review Card Component
  const ReviewCard = ({ review, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 h-full flex flex-col">
        
        {/* Header with Avatar and Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-2xl ${generateGradient(review.customerName)} bg-gradient-to-br shadow-lg flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">
                {generateAvatar(review.customerName)}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm leading-tight">
                {review.customerName}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${SERVICE_TYPES[review.serviceType]?.color}`}>
                  {SERVICE_TYPES[review.serviceType]?.icon}
                </span>
                <span className="text-xs text-gray-500">
                  {SERVICE_TYPES[review.serviceType]?.label}
                </span>
              </div>
            </div>
          </div>
          
          {/* Dummy Badge if applicable */}
          {review.isDummy && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              Sample
            </span>
          )}
        </div>

        {/* Star Rating */}
        <div className="mb-4">
          {renderStars(review.rating)}
        </div>

        {/* Review Text */}
        <div className="flex-1 mb-4">
          <div className="flex items-start gap-2">
            <FaQuoteLeft className="text-blue-100 text-lg flex-shrink-0 mt-1" />
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {review.comments}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500 font-medium">
            {formatDate(review.createdAt)}
          </span>
          <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold cursor-pointer group-hover:gap-2 transition-all">
            Read full
            <FaChevronRight className="text-xs" />
          </div>
        </div>
      </div>
    </motion.div>
  )

  // Loading skeleton with modern design
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="h-px bg-gray-100"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Main Review Grid */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onClick={() => openModal(review)}
            />
          ))}
        </div>

        {/* View All Reviews Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAllReviewsModal}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            View All Reviews ({allReviews.length})
            <FaChevronRight className="text-sm" />
          </motion.button>
        </div>
      </div>

      {/* All Reviews Modal */}
      <AnimatePresence>
        {isAllReviewsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeAllReviewsModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl md:rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative p-6 md:p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                      Customer Reviews
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Real feedback from our customers
                    </p>
                  </div>
                  <button
                    onClick={closeAllReviewsModal}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <FaTimes className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* All Reviews Grid */}
              <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {allReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onClick={() => openReviewFromAll(review)}
                    />
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">
                    Showing {allReviews.length} reviews
                    {allReviews.some(r => r.isDummy) && ' (including sample reviews)'}
                  </p>
                  <button
                    onClick={closeAllReviewsModal}
                    className="bg-gray-600 text-white px-6 py-2 rounded-xl font-semibold cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single Review Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl md:rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative p-6 md:p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl ${generateGradient(selectedReview.customerName)} bg-gradient-to-br shadow-xl flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {generateAvatar(selectedReview.customerName)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                          {selectedReview.customerName}
                        </h2>
                        {selectedReview.isDummy && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Sample Review
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm md:text-base">{selectedReview.customerEmail}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${SERVICE_TYPES[selectedReview.serviceType]?.color}`}>
                          {SERVICE_TYPES[selectedReview.serviceType]?.icon} {SERVICE_TYPES[selectedReview.serviceType]?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <FaTimes className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-8 overflow-y-auto">
                <div className="flex items-center gap-4 mb-6">
                  {renderStars(selectedReview.rating)}
                  <span className="text-lg font-semibold text-gray-700">
                    {selectedReview.rating === 5 ? 'Excellent Experience' : 
                     selectedReview.rating === 4 ? 'Great Experience' : 'Good Experience'}
                  </span>
                </div>

                <div className={`rounded-2xl p-6 mb-6 ${SERVICE_TYPES[selectedReview.serviceType]?.bgColor}`}>
                  <FaQuoteLeft className="text-gray-400 text-2xl mb-4" />
                  <p className="text-gray-700 text-lg leading-relaxed">
                    "{selectedReview.comments}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service Date:</span>
                      <span className="font-semibold text-gray-800">
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
                        <span className="font-semibold text-gray-800">
                          {selectedReview.reviewLink.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {selectedReview.reviewLink?.uniqueCode && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Reference Code:</span>
                        <span className="font-semibold text-blue-600">
                          {selectedReview.reviewLink.uniqueCode}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-semibold text-green-600">
                        {selectedReview.isDummy ? 'Sample Review' : 'Verified Review'}
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
                  >
                    Close Review
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ReviewComponent