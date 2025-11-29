"use client"

import { useState, useEffect } from 'react'
import { 
  FaLink, 
  FaStar, 
  FaCopy, 
  FaShareAlt, 
  FaPlus, 
  FaTrash,
  FaChartBar,
  FaComments,
  FaEdit,
  FaEye,
  FaQrcode,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaChevronRight,
  FaSearch,
  FaFilter,
  FaSort,
  FaTimes,
  FaDownload,
  FaRedo,
  FaGoogle,
  FaSpinner,
  FaUser,
  FaCalendar,
  FaPhone,
  FaMapMarkerAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaCrown,
  FaMedal,
  FaAward,
  FaSortAmountDown,
  FaSortAmountUp
} from 'react-icons/fa'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'

export default function ReviewManager() {
  const [reviewLinks, setReviewLinks] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedLink, setSelectedLink] = useState(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showReviewsModal, setShowReviewsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState(null)
  const [qrUrl, setQrUrl] = useState('')
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsSort, setReviewsSort] = useState('newest')
  
  const [newLink, setNewLink] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    fetchReviewLinks()
  }, [])

  const fetchReviewLinks = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/review-links')
      const data = await response.json()
      
      if (data.success) {
        setReviewLinks(data.reviewLinks)
      }
    } catch (error) {
      console.error('Error fetching review links:', error)
      toast.error('Failed to load review links')
    } finally {
      setRefreshing(false)
    }
  }

  const fetchReviewsForLink = async (linkId) => {
    try {
      setReviewsLoading(true)
      const response = await fetch(`/api/review-links/by-id/${linkId}`)
      const data = await response.json()
      
      if (data.success) {
        return data.reviewLink
      }
      return null
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews')
      return null
    } finally {
      setReviewsLoading(false)
    }
  }

  // Filter and sort links
  const filteredLinks = reviewLinks
    .filter(link => {
      const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           link.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === 'all' || link.status === filterStatus
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'most-reviews':
          return (b.reviews?.length || 0) - (a.reviews?.length || 0)
        case 'highest-rated':
          return getAverageRating(b.reviews) - getAverageRating(a.reviews)
        default:
          return 0
      }
    })

  // Sort reviews based on selected criteria
  const getSortedReviews = (reviews) => {
    if (!reviews) return []
    
    return [...reviews].sort((a, b) => {
      switch (reviewsSort) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'highest-rated':
          return b.rating - a.rating
        case 'lowest-rated':
          return a.rating - b.rating
        case 'best-comments':
          // Prioritize reviews with longer comments
          const aCommentLength = a.comments?.length || 0
          const bCommentLength = b.comments?.length || 0
          return bCommentLength - aCommentLength
        default:
          return 0
      }
    })
  }

  const createReviewLink = async (e) => {
    e.preventDefault();
    
    if (!newLink.title.trim()) {
      toast.error('Please enter a title for the review link');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/review-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newLink,
          createdById: 'user-id-here'
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Review link created successfully!');
        setReviewLinks([data.reviewLink, ...reviewLinks]);
        setNewLink({ title: '', description: '' });
        setShowCreateForm(false);
        
        toast.info(`Review link created: ${data.publicUrl}`, {
          duration: 6000
        });
      } else {
        toast.error(data.error || 'Failed to create review link');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const confirmDelete = (link) => {
    setLinkToDelete(link)
    setShowDeleteModal(true)
  }

  const deleteReviewLink = async () => {
    if (!linkToDelete) return;

    try {
      const response = await fetch(`/api/review-links/by-id/${linkToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Review link deleted successfully');
        setReviewLinks(reviewLinks.filter(link => link.id !== linkToDelete.id));
        setShowDeleteModal(false);
        setLinkToDelete(null);
      } else {
        toast.error(data.error || 'Failed to delete review link');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Link copied to clipboard!')
  }

  const shareOnSocialMedia = (url, platform) => {
    let shareUrl = ''
    const message = `Share your experience with CorporateSellers: ${url}`
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
        break
      case 'gmail':
        shareUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=Share Your Experience&body=${encodeURIComponent(message)}`
        break
      default:
        return
    }
    
    window.open(shareUrl, '_blank')
  }

  const generateQRCode = (url) => {
    setQrUrl(url)
    setShowQRModal(true)
  }

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `qr-code-${selectedLink?.uniqueCode || 'review'}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const viewReviews = async (link) => {
    setSelectedLink(link)
    setShowReviewsModal(true)
    // Refresh reviews data when opening modal
    const updatedLink = await fetchReviewsForLink(link.id)
    if (updatedLink) {
      setSelectedLink(updatedLink)
    }
  }

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-emerald-600'
    if (rating >= 3) return 'text-amber-600'
    return 'text-rose-600'
  }

  const getRatingBadge = (rating) => {
    if (rating >= 4.5) return { color: 'bg-gradient-to-r from-yellow-400 to-amber-500', icon: FaCrown, label: 'Excellent' }
    if (rating >= 4) return { color: 'bg-emerald-500', icon: FaAward, label: 'Great' }
    if (rating >= 3) return { color: 'bg-blue-500', icon: FaMedal, label: 'Good' }
    if (rating >= 2) return { color: 'bg-orange-500', icon: FaThumbsUp, label: 'Fair' }
    return { color: 'bg-red-500', icon: FaThumbsDown, label: 'Poor' }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200', label: 'Active' },
      INACTIVE: { color: 'bg-gray-500/10 text-gray-700 border-gray-200', label: 'Inactive' },
      ARCHIVED: { color: 'bg-orange-500/10 text-orange-700 border-orange-200', label: 'Archived' }
    }
    
    const config = statusConfig[status] || statusConfig.INACTIVE
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getRatingDisplay = (reviews) => {
    const avgRating = getAverageRating(reviews)
    const reviewCount = reviews?.length || 0
    
    return (
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className={`w-2 h-2 rounded-full ${
                star <= Math.round(avgRating) ? 'bg-amber-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <span className={`text-sm font-semibold ${getRatingColor(avgRating)}`}>
          {avgRating}
        </span>
        <span className="text-xs text-gray-500">({reviewCount})</span>
      </div>
    )
  }

  const StarRating = ({ rating, size = 'sm' }) => {
    const sizeClass = size === 'lg' ? 'text-lg' : 'text-sm'
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const ServiceTypeBadge = ({ serviceType }) => {
    const serviceConfig = {
      CAR_PURCHASE: { color: 'bg-blue-100 text-blue-800', label: 'Car Purchase' },
      CAR_SELLING: { color: 'bg-green-100 text-green-800', label: 'Car Selling' },
      TEST_DRIVE: { color: 'bg-purple-100 text-purple-800', label: 'Test Drive' },
      MAINTENANCE: { color: 'bg-orange-100 text-orange-800', label: 'Maintenance' },
      FINANCING: { color: 'bg-indigo-100 text-indigo-800', label: 'Financing' },
      INSURANCE: { color: 'bg-red-100 text-red-800', label: 'Insurance' },
      OTHER: { color: 'bg-gray-100 text-gray-800', label: 'Other Service' }
    }
    
    const config = serviceConfig[serviceType] || serviceConfig.OTHER
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const ReviewRankingBadge = ({ index, total }) => {
    if (index === 0) return (
      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
        <FaCrown className="text-xs" />
        #1 Best
      </div>
    )
    if (index === 1) return (
      <div className="flex items-center gap-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
        <FaMedal className="text-xs" />
        #2 Great
      </div>
    )
    if (index === 2) return (
      <div className="flex items-center gap-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
        <FaAward className="text-xs" />
        #3 Good
      </div>
    )
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-xl shadow-xs border border-gray-100">
              <FaComments className="text-blue-600 text-lg" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              Review Manager
            </h1>
          </div>
          <p className="text-gray-600 ml-11">Create and manage customer review links</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchReviewLinks}
            disabled={refreshing}
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-xs border border-gray-200 font-medium cursor-pointer disabled:opacity-50"
          >
            <FaRedo className={`text-sm ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <FaPlus className="text-sm relative z-10" />
            <span className="relative z-10">Create New Link</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            label: 'Total Links', 
            value: reviewLinks.length, 
            icon: FaLink, 
            color: 'blue',
            change: '+2 this week'
          },
          { 
            label: 'Active Links', 
            value: reviewLinks.filter(link => link.status === 'ACTIVE').length,
            icon: FaComments, 
            color: 'emerald',
            change: 'All systems operational'
          },
          { 
            label: 'Total Reviews', 
            value: reviewLinks.reduce((total, link) => total + (link.reviews?.length || 0), 0),
            icon: FaStar, 
            color: 'amber',
            change: '+12 today'
          },
          { 
            label: 'Avg Rating', 
            value: reviewLinks.length > 0 ? 
              (reviewLinks.reduce((total, link) => {
                const avg = getAverageRating(link.reviews)
                return total + parseFloat(avg)
              }, 0) / reviewLinks.length).toFixed(1) : '0.0',
            icon: FaChartBar, 
            color: 'purple',
            change: 'Trending up'
          }
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-gray-200/60 p-6 hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-xl`}>
                <stat.icon className={`text-${stat.color}-600 text-lg`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-gray-200/60 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search review links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-text"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-reviews">Most Reviews</option>
              <option value="highest-rated">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create Review Link Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Create Review Link</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={createReviewLink} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  required
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 cursor-text"
                  placeholder="e.g., November Car Sales Feedback"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 resize-none cursor-text"
                  rows="3"
                  placeholder="Describe what this review link is for..."
                />
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FaComments className="text-blue-600" />
                  How it works
                </h4>
                <ul className="text-sm text-blue-800 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Unique review link generated automatically
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Share via email, SMS, or social media
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Customers rate 1-5 stars and leave comments
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    All reviews appear in your dashboard
                  </li>
                </ul>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-medium transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    'Create Review Link'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && linkToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="text-red-500 text-2xl" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Review Link
                </h4>
                <p className="text-gray-600">
                  Are you sure you want to delete <strong>"{linkToDelete.title}"</strong>? 
                  This action cannot be undone and all associated reviews will be permanently deleted.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition duration-200 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteReviewLink}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition duration-200 cursor-pointer font-medium"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">QR Code</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
            
            <div className="p-6 text-center">
              <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block mb-4">
                <QRCodeSVG 
                  id="qr-code-svg"
                  value={qrUrl}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
              
              <p className="text-sm text-gray-600 mb-4 break-all">{qrUrl}</p>
              
              <div className="flex gap-3">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium cursor-pointer"
                >
                  <FaDownload className="text-sm" />
                  Download
                </button>
                <button
                  onClick={() => copyToClipboard(qrUrl)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium cursor-pointer"
                >
                  <FaCopy className="text-sm" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Reviews Modal */}
      {showReviewsModal && selectedLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedLink.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedLink.reviews?.length || 0} Customer Reviews • 
                  Average Rating: <span className="font-semibold">{getAverageRating(selectedLink.reviews)}/5</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select 
                  value={reviewsSort}
                  onChange={(e) => setReviewsSort(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest-rated">Highest Rated</option>
                  <option value="lowest-rated">Lowest Rated</option>
                  <option value="best-comments">Best Comments</option>
                </select>
                <button
                  onClick={() => setShowReviewsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              {reviewsLoading ? (
                <div className="text-center py-12">
                  <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading reviews...</p>
                </div>
              ) : selectedLink.reviews?.length === 0 ? (
                <div className="text-center py-12">
                  <FaComments className="text-gray-300 text-4xl mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
                  <p className="text-gray-600">No customers have submitted reviews for this link yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {getSortedReviews(selectedLink.reviews).map((review, index) => {
                    const ratingBadge = getRatingBadge(review.rating)
                    const BadgeIcon = ratingBadge.icon
                    
                    return (
                      <div key={review.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Ranking Badge */}
                            <ReviewRankingBadge index={index} total={selectedLink.reviews.length} />
                            
                            {/* Customer Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <FaUser className="text-white text-sm" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {review.customerName || 'Anonymous Customer'}
                                    </p>
                                    {review.customerEmail && (
                                      <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <FaEnvelope className="text-xs" />
                                        {review.customerEmail}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Rating and Service */}
                              <div className="flex items-center gap-4 flex-wrap">
                                <div className={`inline-flex items-center gap-2 ${ratingBadge.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                                  <BadgeIcon className="text-xs" />
                                  {ratingBadge.label} • {review.rating}/5
                                </div>
                                <ServiceTypeBadge serviceType={review.serviceType} />
                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                  <FaCalendar className="text-xs" />
                                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                            
                            {/* Star Rating */}
                            <div className="text-right">
                              <StarRating rating={review.rating} size="lg" />
                              <p className="text-xs text-gray-500 mt-1">Rating</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Comments */}
                        {review.comments && (
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <FaComments className="text-blue-500" />
                              Customer Feedback
                            </h5>
                            <p className="text-gray-700 leading-relaxed">{review.comments}</p>
                            {review.comments.length > 200 && (
                              <p className="text-xs text-gray-500 mt-2">
                                {review.comments.length} characters • Detailed feedback
                              </p>
                            )}
                          </div>
                        )}
                        
                        {/* Review Status */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              review.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                              review.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {review.status}
                            </span>
                            <span>Review #{review.id.slice(-6)}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Submitted {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Links List */}
      <div className="space-y-6">
        {filteredLinks.length === 0 && !showCreateForm ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-gray-200/60">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaComments className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Review Links Found</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first review link to start collecting customer feedback'
              }
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl cursor-pointer"
            >
              Create Your First Link
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredLinks.map((link) => {
              const publicUrl = `${window.location.origin}/review/${link.uniqueCode}`
              const avgRating = getAverageRating(link.reviews)
              
              return (
                <div 
                  key={link.id} 
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-gray-200/60 p-6 hover:shadow-md transition-all duration-300 hover:border-gray-300/60 cursor-default"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-xl mt-1">
                          <FaLink className="text-blue-600 text-lg" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                              {link.title}
                            </h4>
                            {getStatusBadge(link.status)}
                          </div>
                          
                          {link.description && (
                            <p className="text-gray-600 mb-3">{link.description}</p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-500 cursor-pointer">
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                {link.uniqueCode}
                              </span>
                            </div>
                            <div 
                              className="flex items-center gap-2 text-gray-500 cursor-pointer"
                              onClick={() => viewReviews(link)}
                            >
                              <FaComments className="text-emerald-500 text-base" />
                              <span>{link.reviews?.length || 0} reviews</span>
                            </div>
                            <div 
                              className="cursor-pointer"
                              onClick={() => viewReviews(link)}
                            >
                              {getRatingDisplay(link.reviews)}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {new Date(link.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <button
                      onClick={() => copyToClipboard(publicUrl)}
                      className="inline-flex items-center gap-3 bg-gray-100 text-gray-700 px-5 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 text-base font-medium hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <FaCopy className="text-lg" />
                      Copy Link
                    </button>
                    
                    <button
                      onClick={() => generateQRCode(publicUrl)}
                      className="inline-flex items-center gap-3 bg-purple-100 text-purple-700 px-5 py-3 rounded-xl hover:bg-purple-200 transition-all duration-200 text-base font-medium hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <FaQrcode className="text-lg" />
                      QR Code
                    </button>
                    
                    <button
                      onClick={() => viewReviews(link)}
                      className="inline-flex items-center gap-3 bg-blue-100 text-blue-700 px-5 py-3 rounded-xl hover:bg-blue-200 transition-all duration-200 text-base font-medium hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <FaEye className="text-lg" />
                      View Reviews
                    </button>

                    <button
                      onClick={() => confirmDelete(link)}
                      className="inline-flex items-center gap-3 bg-rose-100 text-rose-700 px-5 py-3 rounded-xl hover:bg-rose-200 transition-all duration-200 text-base font-medium hover:scale-105 active:scale-95 cursor-pointer ml-auto"
                    >
                      <FaTrash className="text-lg" />
                      Delete
                    </button>
                  </div>

                  {/* Share Options */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-3">Share via:</p>
                    <div className="flex gap-3">
                      {[
                        { platform: 'whatsapp', icon: FaWhatsapp, color: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 hover:scale-105', size: 'text-xl' },
                        { platform: 'facebook', icon: FaFacebook, color: 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105', size: 'text-xl' },
                        { platform: 'twitter', icon: FaTwitter, color: 'bg-sky-100 text-sky-500 hover:bg-sky-200 hover:scale-105', size: 'text-xl' },
                        { platform: 'gmail', icon: FaGoogle, color: 'bg-red-100 text-red-600 hover:bg-red-200 hover:scale-105', size: 'text-xl' }
                      ].map(({ platform, icon: Icon, color, size }) => (
                        <button
                          key={platform}
                          onClick={() => shareOnSocialMedia(publicUrl, platform)}
                          className={`p-4 rounded-xl transition-all duration-200 ${color} active:scale-95 cursor-pointer`}
                          title={`Share on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                        >
                          <Icon className={size} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}