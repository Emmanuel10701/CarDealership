"use client"

import { useState, useEffect, useCallback } from 'react'
import { 
  FaCar, 
  FaCheck, 
  FaTimes, 
  FaSearch,
  FaEye,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaClock,
  FaGasPump,
  FaTachometerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaImage,
  FaList,
  FaFilter,
  FaExclamationTriangle,
  FaSync,
  FaCog,
  FaEdit,
  FaTh,
  FaThList,
  FaTrash,
  FaUndo,
  FaCamera,
  FaPalette,
  FaCogs,
  FaShieldAlt,
  FaHistory,
  FaFileAlt,
  FaTags,
  FaCalendarAlt,
  FaRoad,
  FaShield,
  FaMoneyBillWave,
  FaCarCrash,
  FaPaintRoller,
  FaWrench,
  FaCertificate,
  FaArrowLeft,
  FaArrowRight,
  FaExpand,
  FaCaretDown,
  FaCaretUp,
  FaInfoCircle,
  FaBan
} from 'react-icons/fa'
import { CircularProgress, Backdrop } from '@mui/material'
import { toast, Toaster } from 'react-hot-toast'
import Image from "next/image"

export default function CarInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [rejectNotes, setRejectNotes] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [editingData, setEditingData] = useState({})
  const [activeTab, setActiveTab] = useState('all')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [expandedSections, setExpandedSections] = useState({
    specifications: true,
    condition: true,
    features: true,
    seller: true,
    admin: false
  })
  const inquiriesPerPage = 8

  // Helper functions
  const getCarStatus = useCallback((inquiry) => {
    return inquiry.status || inquiry.features?.adminData?.status || 'pending'
  }, [])

  const getAdminNotes = useCallback((inquiry) => {
    return inquiry.adminNotes || inquiry.features?.adminData?.adminNotes || ''
  }, [])

  const getRejectionReason = useCallback((inquiry) => {
    return inquiry.rejectionReason || inquiry.features?.adminData?.rejectionReason || ''
  }, [])

  const getReviewedAt = useCallback((inquiry) => {
    return inquiry.reviewedAt || inquiry.features?.adminData?.reviewedAt
  }, [])

  const getReviewedBy = useCallback((inquiry) => {
    return inquiry.reviewedBy || inquiry.features?.adminData?.reviewedBy
  }, [])

  // Image URL handler
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'null' || imagePath === 'undefined') {
      return `https://via.placeholder.com/400/1f2937/ffffff?text=No+Image`;
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads/')) {
      return `${window.location.origin}${imagePath}`;
    }
    
    if (!imagePath.includes('/') && imagePath.includes('.')) {
      return `${window.location.origin}/uploads/${imagePath}`;
    }
    
    return imagePath;
  };

  // Fetch inquiries from the API
  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sellyourcar')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setInquiries(result.data || [])
        console.log('Fetched cars with statuses:', result.data?.map(car => ({
          id: car.id,
          carName: car.carName,
          rootStatus: car.status,
          nestedStatus: car.features?.adminData?.status,
          finalStatus: getCarStatus(car)
        })))
        toast.success(`Loaded ${result.data?.length || 0} car listings`)
      } else {
        toast.error(result.error || 'Failed to fetch car listings')
      }
    } catch (error) {
      console.error('Error fetching car listings:', error)
      toast.error('Error loading car listings. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [getCarStatus])

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  // Filter inquiries based on search, status, and active tab
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.carName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.location?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || getCarStatus(inquiry) === statusFilter
    const matchesTab = activeTab === 'all' || getCarStatus(inquiry) === activeTab
    
    return matchesSearch && matchesStatus && matchesTab
  })

  // Pagination
  const indexOfLastInquiry = currentPage * inquiriesPerPage
  const indexOfFirstInquiry = indexOfLastInquiry - inquiriesPerPage
  const currentInquiries = filteredInquiries.slice(indexOfFirstInquiry, indexOfLastInquiry)
  const totalPages = Math.ceil(filteredInquiries.length / inquiriesPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Update car status using PATCH
  const updateCarStatus = async (carId, status, adminNotes = '', rejectionReason = '') => {
    try {
      setActionLoading(true)
      
      const response = await fetch(`/api/sellyourcar/${carId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
          adminNotes: adminNotes,
          rejectionReason: status === 'rejected' ? rejectionReason : '',
          reviewedBy: 'Admin',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast.success(`Car ${status} successfully!`)
        
        setInquiries(prev => prev.map(inq => {
          if (inq.id === carId) {
            const updatedInquiry = {
              ...inq,
              status: status,
              adminNotes: adminNotes,
              rejectionReason: status === 'rejected' ? rejectionReason : '',
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'Admin',
              features: {
                ...inq.features,
                adminData: {
                  ...inq.features?.adminData,
                  status: status,
                  adminNotes: adminNotes,
                  rejectionReason: status === 'rejected' ? rejectionReason : '',
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: 'Admin'
                }
              }
            }
            return updatedInquiry
          }
          return inq
        }))
        
        return result.data
      } else {
        throw new Error(result.error || `Failed to ${status} car`)
      }
    } catch (error) {
      console.error('Error updating car status:', error)
      toast.error(error.message || 'Error updating car status')
      return false
    } finally {
      setActionLoading(false)
    }
  }

  // Post to cardeal API
  const postToCarDeal = async (carData) => {
    try {
      console.log('🔄 Posting to cardeal API:', {
        carName: carData.carName,
        price: carData.price,
        files: carData.files,
        filesCount: carData.files?.length || 0,
        featuresCount: getFeatures(carData).length
      });

      const formData = new FormData();
      
      formData.append('carName', carData.carName || '');
      formData.append('price', carData.price?.toString() || '0');
      formData.append('location', carData.location || '');
      formData.append('year', carData.year?.toString() || '2023');
      formData.append('carType', carData.carType || '');
      formData.append('mileage', carData.mileage?.toString() || '0');
      formData.append('transmission', carData.transmission || '');
      formData.append('fuelType', carData.fuelType || '');
      formData.append('description', carData.description || '');
      
      formData.append('sellerName', 'Corporate Sellers');
      formData.append('sellerPhone', '0793472960');
      formData.append('sellerEmail', 'corpertesellerke@gmail.com');
      
      const features = getFeatures(carData);
      features.forEach(feature => {
        formData.append('features', feature);
      });
      
      if (carData.files && Array.isArray(carData.files)) {
        for (const filePath of carData.files) {
          if (filePath && typeof filePath === 'string') {
            try {
              const imageUrl = getImageUrl(filePath);
              const response = await fetch(imageUrl);
              if (response.ok) {
                const blob = await response.blob();
                const fileName = filePath.split('/').pop() || `car-image-${Date.now()}.jpg`;
                const file = new File([blob], fileName, { 
                  type: blob.type || 'image/jpeg'
                });
                formData.append('files', file);
              }
            } catch (error) {
              console.warn('❌ Error processing image:', filePath, error);
            }
          }
        }
      }

      const response = await fetch('/api/cardeal', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}. ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Successfully posted to cardeal:', result.data);
        toast.success('Car listing published to marketplace!');
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to publish to marketplace');
      }
    } catch (error) {
      console.error('❌ Error posting to cardeal:', error);
      toast.error('Error publishing to marketplace: ' + error.message);
      return false;
    }
  };

  // Delete from cardeal API when unapproving
  const deleteFromCarDeal = async (carReference) => {
    try {
      const response = await fetch(`/api/cardeal?reference=${carReference}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        toast.success('Car listing removed from marketplace!')
        return true
      } else {
        throw new Error(result.error || 'Failed to remove from marketplace')
      }
    } catch (error) {
      console.error('Error deleting from cardeal:', error)
      toast.error('Error removing from marketplace')
      return false
    }
  }

  // Update car data (edit functionality)
  const updateCarData = async (carId, updatedData) => {
    try {
      setActionLoading(true)
      
      const response = await fetch(`/api/sellyourcar/${carId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast.success('Car listing updated successfully!')
        setInquiries(prev => prev.map(inq => 
          inq.id === carId ? { ...inq, ...updatedData } : inq
        ))
        return true
      } else {
        throw new Error(result.error || 'Failed to update car listing')
      }
    } catch (error) {
      console.error('Error updating car data:', error)
      toast.error(error.message || 'Error updating car listing')
      return false
    } finally {
      setActionLoading(false)
    }
  }

  // Delete car listing
  const deleteCarListing = async (carId) => {
    try {
      setActionLoading(true)
      
      const response = await fetch(`/api/sellyourcar/${carId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast.success('Car listing deleted successfully!')
        setInquiries(prev => prev.filter(inq => inq.id !== carId))
        return true
      } else {
        throw new Error(result.error || 'Failed to delete car listing')
      }
    } catch (error) {
      console.error('Error deleting car:', error)
      toast.error(error.message || 'Error deleting car listing')
      return false
    } finally {
      setActionLoading(false)
    }
  }

  // Action handlers
  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry)
    setAdminNotes(getAdminNotes(inquiry))
    setShowDetailModal(true)
  }

  const handleApproveAndPublish = async (inquiry) => {
    setSelectedInquiry(inquiry)
    setShowApproveModal(true)
  }

  const handleReject = (inquiry) => {
    setSelectedInquiry(inquiry)
    setRejectNotes('')
    setShowRejectModal(true)
  }

  const handleEdit = (inquiry) => {
    setSelectedInquiry(inquiry)
    const features = inquiry.features || {}
    const condition = features.condition || {}
    const specifications = features.specifications || {}
    const sellerPreferences = features.sellerPreferences || {}
    
    setEditingData({
      carName: inquiry.carName || '',
      price: inquiry.price || 0,
      location: inquiry.location || '',
      year: inquiry.year || 2023,
      mileage: inquiry.mileage || 0,
      transmission: inquiry.transmission || 'Automatic',
      fuelType: inquiry.fuelType || 'Petrol',
      carType: inquiry.carType || 'Sedan',
      description: inquiry.description || '',
      engineSize: specifications.engineSize || '',
      color: specifications.color || '',
      doors: specifications.doors || '',
      seats: specifications.seats || '',
      carCondition: condition.carCondition || 'excellent',
      serviceHistory: condition.serviceHistory || 'full',
      accidentHistory: condition.accidentHistory || 'none',
      ownershipHistory: condition.ownershipHistory || '',
      roadTaxStatus: condition.roadTaxStatus || 'current',
      insuranceStatus: condition.insuranceStatus || 'comprehensive',
      modifications: condition.modifications || 'none',
      certification: condition.certification || 'none',
      priceNegotiable: sellerPreferences.priceNegotiable !== undefined ? sellerPreferences.priceNegotiable : true,
      testDrive: sellerPreferences.testDrive !== undefined ? sellerPreferences.testDrive : true,
      warranty: sellerPreferences.warranty || false,
      warrantyMonths: sellerPreferences.warrantyMonths || null,
      serviceRecords: sellerPreferences.serviceRecords !== undefined ? sellerPreferences.serviceRecords : true,
      originalPaint: sellerPreferences.originalPaint !== undefined ? sellerPreferences.originalPaint : true,
      companyName: sellerPreferences.companyName || '',
      dealerLicense: sellerPreferences.dealerLicense || '',
      preferredContact: sellerPreferences.preferredContact || 'phone'
    })
    setShowEditModal(true)
  }

  const handleDelete = (inquiry) => {
    setSelectedInquiry(inquiry)
    setShowDeleteModal(true)
  }

  // Image viewing
  const handleViewImage = (image, index, images) => {
    setSelectedImage(image)
    setCurrentImageIndex(index)
    setShowImageModal(true)
  }

  const handleNextImage = () => {
    const images = selectedInquiry?.files || []
    const nextIndex = (currentImageIndex + 1) % images.length
    setSelectedImage(images[nextIndex])
    setCurrentImageIndex(nextIndex)
  }

  const handlePrevImage = () => {
    const images = selectedInquiry?.files || []
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length
    setSelectedImage(images[prevIndex])
    setCurrentImageIndex(prevIndex)
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Confirm actions
  const confirmApproveAndPublish = async () => {
    if (selectedInquiry) {
      const updatedCar = await updateCarStatus(selectedInquiry.id, 'approved', adminNotes)
      
      if (updatedCar) {
        const cardealResult = await postToCarDeal(updatedCar)
        
        if (cardealResult) {
          await updateCarStatus(selectedInquiry.id, 'published', adminNotes)
        }
        
        setShowApproveModal(false)
        setShowDetailModal(false)
        setAdminNotes('')
      }
    }
  }

  const confirmReject = async () => {
    if (selectedInquiry) {
      if (!rejectNotes.trim()) {
        toast.error('Please provide a reason for rejection')
        return
      }
      
      const success = await updateCarStatus(selectedInquiry.id, 'rejected', adminNotes, rejectNotes)
      if (success) {
        setShowRejectModal(false)
        setShowDetailModal(false)
        setRejectNotes('')
        setAdminNotes('')
      }
    }
  }

  const handleUnapprove = async (inquiry) => {
    try {
      setActionLoading(true)
      
      if (getCarStatus(inquiry) === 'published') {
        await deleteFromCarDeal(inquiry.reference)
      }
      
      const success = await updateCarStatus(inquiry.id, 'pending', 'Listing unapproved and removed from marketplace')
      
      if (success) {
        toast.success('Car unapproved and removed from marketplace')
      }
    } catch (error) {
      console.error('Error unapproving car:', error)
      toast.error('Error unapproving car listing')
    } finally {
      setActionLoading(false)
    }
  }

  const confirmEdit = async () => {
    if (selectedInquiry) {
      const success = await updateCarData(selectedInquiry.id, editingData)
      if (success) {
        setShowEditModal(false)
        setShowDetailModal(false)
      }
    }
  }

  const confirmDelete = async () => {
    if (selectedInquiry) {
      if (getCarStatus(selectedInquiry) === 'published') {
        await deleteFromCarDeal(selectedInquiry.reference)
      }
      
      const success = await deleteCarListing(selectedInquiry.id)
      if (success) {
        setShowDeleteModal(false)
        setShowDetailModal(false)
      }
    }
  }

  const handleRestoreToApproved = async (inquiry) => {
    const success = await updateCarStatus(inquiry.id, 'approved', 'Restored from rejected status')
    if (success) {
      toast.success('Car restored to approved status')
    }
  }

  const handleRepublish = async (inquiry) => {
    const success = await updateCarStatus(inquiry.id, 'published', 'Republished listing')
    if (success) {
      toast.success('Car republished successfully')
    }
  }

  // Status badge component
  const getStatusBadge = (inquiry) => {
    const status = getCarStatus(inquiry)
    const statusConfig = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: FaClock,
        label: 'Pending Review'
      },
      approved: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: FaCheck,
        label: 'Approved'
      },
      published: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: FaStar,
        label: 'Published'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: FaTimes,
        label: 'Rejected'
      }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${config.color}`}>
        <IconComponent className="mr-2 text-sm" />
        {config.label}
      </span>
    )
  }

  // Get features from the nested structure
  const getFeatures = (inquiry) => {
    if (inquiry.features && Array.isArray(inquiry.features.selectedFeatures)) {
      return inquiry.features.selectedFeatures
    }
    return []
  }

  // Get specifications
  const getSpecifications = (inquiry) => {
    return inquiry.features?.specifications || {}
  }

  // Get condition details
  const getConditionDetails = (inquiry) => {
    return inquiry.features?.condition || {}
  }

  // Get seller preferences
  const getSellerPreferences = (inquiry) => {
    return inquiry.features?.sellerPreferences || {}
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not reviewed'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Statistics
  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => getCarStatus(i) === 'pending').length,
    approved: inquiries.filter(i => getCarStatus(i) === 'approved').length,
    published: inquiries.filter(i => getCarStatus(i) === 'published').length,
    rejected: inquiries.filter(i => getCarStatus(i) === 'rejected').length
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setActiveTab('all')
    setCurrentPage(1)
  }

  // Refresh data
  const handleRefresh = () => {
    fetchInquiries()
    toast.success('Data refreshed successfully!')
  }

  // ✅ FIXED: CarCard Component with safe image handling
  const CarCard = ({ inquiry }) => {
    // Add safety check for undefined inquiry
    if (!inquiry) {
      return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 text-center text-gray-500">
            <FaExclamationTriangle className="text-2xl mx-auto mb-2" />
            <p>Car data not available</p>
          </div>
        </div>
      );
    }

    // Safe destructuring with defaults
    const safeInquiry = {
      carName: inquiry.carName || 'Unnamed Car',
      file: inquiry.file || '',
      files: inquiry.files || [],
      year: inquiry.year || 'N/A',
      mileage: inquiry.mileage || 0,
      price: inquiry.price || 0,
      location: inquiry.location || 'Location not specified',
      fuelType: inquiry.fuelType || 'N/A',
      transmission: inquiry.transmission || 'N/A',
      carType: inquiry.carType || 'N/A',
      sellerName: inquiry.sellerName || 'Unknown Seller',
      id: inquiry.id
    };

    const mainImageUrl = getImageUrl(safeInquiry.file);
    const [imageLoadError, setImageLoadError] = useState(false);

    // Simple image error handler
    const handleCardImageError = () => {
      setImageLoadError(true);
    };

    const handleCardImageLoad = () => {
      setImageLoadError(false);
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
        <div className="relative bg-gray-100 min-h-64 flex items-center justify-center overflow-hidden">
          {/* Error State */}
          {imageLoadError && (
            <div className="w-full h-64 flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-500">
                <FaImage className="text-4xl mx-auto mb-2 opacity-50" />
                <p className="text-sm">Image not available</p>
                <p className="text-xs mt-1 truncate px-2">{safeInquiry.carName}</p>
              </div>
            </div>
          )}

          {/* Image */}
          {!imageLoadError && (
            <img 
              src={mainImageUrl}
              alt={safeInquiry.carName}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleCardImageError}
              onLoad={handleCardImageLoad}
            />
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            {getStatusBadge(inquiry)}
          </div>

          {/* Car Info Overlay */}
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
            {safeInquiry.year} • {safeInquiry.mileage?.toLocaleString()} km
          </div>

          {/* Image Count Badge */}
          {safeInquiry.files && safeInquiry.files.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
              +{safeInquiry.files.length - 1} more
            </div>
          )}
        </div>
        
        {/* Card Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900 truncate flex-1 mr-3">
              {safeInquiry.carName}
            </h3>
            <span className="text-2xl font-bold text-blue-600 whitespace-nowrap">
              KSh {safeInquiry.price?.toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-gray-600 text-lg">
              <FaMapMarkerAlt className="mr-3 text-gray-400 flex-shrink-0" />
              <span className="truncate">{safeInquiry.location}</span>
            </div>
            <div className="flex items-center justify-between text-base text-gray-600">
              <span className="flex items-center">
                <FaGasPump className="mr-2" />
                {safeInquiry.fuelType}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center">
                <FaCogs className="mr-2" />
                {safeInquiry.transmission}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center">
                <FaTachometerAlt className="mr-2" />
                {safeInquiry.carType}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-base text-gray-600">
              By: <span className="font-semibold">{safeInquiry.sellerName}</span>
            </div>
            <button
              onClick={() => handleViewDetails(inquiry)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} className="text-blue-600" />
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading car listings...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch the latest data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
      
      <Backdrop 
        open={actionLoading} 
        className="z-50 bg-black bg-opacity-50"
        sx={{ color: '#fff', zIndex: 1300 }}
      >
        <div className="text-center">
          <CircularProgress color="inherit" size={60} />
          <p className="mt-4 text-lg font-medium">Processing your request...</p>
        </div>
      </Backdrop>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Car Listings Management
              </h1>
              <p className="text-xl text-gray-600">
                Manage, review, and approve car listing submissions
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-2xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:shadow-xl"
            >
              <FaSync className="text-lg" />
              <span className="font-medium">Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards with Tabs */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            {[
              { 
                label: 'Total Listings', 
                value: stats.total, 
                color: 'blue', 
                icon: FaList,
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-600',
                tab: 'all'
              },
              { 
                label: 'Pending Review', 
                value: stats.pending, 
                color: 'yellow', 
                icon: FaClock,
                bgColor: 'bg-yellow-100',
                textColor: 'text-yellow-600',
                tab: 'pending'
              },
              { 
                label: 'Approved', 
                value: stats.approved, 
                color: 'green', 
                icon: FaCheck,
                bgColor: 'bg-green-100',
                textColor: 'text-green-600',
                tab: 'approved'
              },
              { 
                label: 'Published', 
                value: stats.published, 
                color: 'purple', 
                icon: FaStar,
                bgColor: 'bg-purple-100',
                textColor: 'text-purple-600',
                tab: 'published'
              },
              { 
                label: 'Rejected', 
                value: stats.rejected, 
                color: 'red', 
                icon: FaTimes,
                bgColor: 'bg-red-100',
                textColor: 'text-red-600',
                tab: 'rejected'
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl shadow-lg border-2 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                  activeTab === stat.tab ? 'border-blue-500' : 'border-gray-200'
                }`}
                onClick={() => {
                  setActiveTab(stat.tab)
                  setStatusFilter('all')
                  setCurrentPage(1)
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                    <stat.icon className={`${stat.textColor} text-2xl`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex space-x-1">
              {['all', 'pending', 'approved', 'published', 'rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab)
                    setCurrentPage(1)
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'all' && 'All Listings'}
                  {tab === 'pending' && 'Pending Review'}
                  {tab === 'approved' && 'Approved'}
                  {tab === 'published' && 'Published'}
                  {tab === 'rejected' && 'Rejected'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search by car name, seller, reference, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <FaTh className="text-lg" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <FaThList className="text-lg" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <FaFilter className="text-lg" />
                <span className="font-medium">Filter:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
              
              {(searchTerm || statusFilter !== 'all' || activeTab !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{currentInquiries.length}</span> of{' '}
            <span className="font-semibold">{filteredInquiries.length}</span> listings
          </p>
          {filteredInquiries.length > 0 && (
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Inquiries Display */}
        {currentInquiries.length > 0 ? (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {currentInquiries.map((inquiry) => (
                  <CarCard key={inquiry.id} inquiry={inquiry} />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                          Car Details
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                          Seller Info
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentInquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="hover:bg-gray-50 transition duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-4">
                              <img 
                                src={getImageUrl(inquiry.file)}
                                alt={inquiry.carName}
                                className="w-20 h-20 rounded-xl object-cover border border-gray-300"
                                onError={(e) => {
                                  e.target.src = `https://via.placeholder.com/80/1f2937/ffffff?text=IMG`;
                                }}
                              />
                              <div>
                                <div className="font-semibold text-gray-900 text-lg">{inquiry.carName}</div>
                                <div className="text-xl font-bold text-blue-600">
                                  KSh {inquiry.price?.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {inquiry.year} • {inquiry.mileage?.toLocaleString()} km • {inquiry.location}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 font-medium">{inquiry.sellerName}</div>
                            <div className="text-sm text-gray-600">{inquiry.sellerEmail}</div>
                            <div className="text-sm text-gray-600">{inquiry.sellerPhone}</div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(inquiry)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(inquiry)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 font-medium"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
            <FaCar className="text-8xl text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No car listings found</h3>
            <p className="text-gray-600 text-lg mb-6">
              {searchTerm || statusFilter !== 'all' || activeTab !== 'all'
                ? 'Try adjusting your search criteria or filters.' 
                : 'No car listings have been submitted yet.'}
            </p>
            {(searchTerm || statusFilter !== 'all' || activeTab !== 'all') && (
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition duration-200 font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredInquiries.length > inquiriesPerPage && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaChevronLeft />
              <span>Previous</span>
            </button>
            
            <span className="text-lg font-medium text-gray-700">
              Page {currentPage} of {totalPages} • {filteredInquiries.length} listings
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>Next</span>
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Detail Modal */}
      {showDetailModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedInquiry.carName}</h2>
                  <p className="text-lg text-gray-600 mt-1">Reference: {selectedInquiry.reference}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(selectedInquiry)}
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition duration-200"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column - Images */}
                <div className="xl:col-span-1">
                  <div className="sticky top-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <FaCamera className="mr-2 text-blue-600" />
                      Car Photos ({selectedInquiry.files?.length || 0})
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedInquiry.files && selectedInquiry.files.map((image, index) => {
                        const imageUrl = getImageUrl(image);
                        return (
                          <div key={index} className="relative group bg-gray-100 rounded-xl min-h-32 flex items-center justify-center">
                            <img
                              src={imageUrl}
                              alt={`${selectedInquiry.carName} - ${index + 1}`}
                              className="w-full h-32 object-cover rounded-xl cursor-pointer hover:opacity-90 transition duration-200"
                              onClick={() => handleViewImage(image, index, selectedInquiry.files)}
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/200/1f2937/ffffff?text=IMG`;
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-200 rounded-xl flex items-center justify-center">
                              <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition duration-200 text-2xl" />
                            </div>
                            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {(!selectedInquiry.files || selectedInquiry.files.length === 0) && (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                        <FaImage className="text-4xl mx-auto mb-3 text-gray-300" />
                        <p>No images available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaCar className="mr-2 text-blue-600" />
                        Basic Information
                      </span>
                      <button
                        onClick={() => toggleSection('basic')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedSections.basic ? <FaCaretUp /> : <FaCaretDown />}
                      </button>
                    </h3>
                    {expandedSections.basic && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Car Name</label>
                          <p className="text-lg font-semibold text-gray-900">{selectedInquiry.carName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                          <p className="text-2xl font-bold text-blue-600">KSh {selectedInquiry.price?.toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <p className="text-lg text-gray-900 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-gray-400" />
                            {selectedInquiry.location}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <p className="text-lg text-gray-900">{selectedInquiry.year}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                          <p className="text-lg text-gray-900 flex items-center">
                            <FaTachometerAlt className="mr-2 text-gray-400" />
                            {selectedInquiry.mileage?.toLocaleString()} km
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                          <p className="text-lg text-gray-900">{selectedInquiry.transmission}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                          <p className="text-lg text-gray-900 flex items-center">
                            <FaGasPump className="mr-2 text-gray-400" />
                            {selectedInquiry.fuelType}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
                          <p className="text-lg text-gray-900">{selectedInquiry.carType}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Specifications */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaCogs className="mr-2 text-green-600" />
                        Specifications
                      </span>
                      <button
                        onClick={() => toggleSection('specifications')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedSections.specifications ? <FaCaretUp /> : <FaCaretDown />}
                      </button>
                    </h3>
                    {expandedSections.specifications && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Engine Size</label>
                          <p className="text-lg text-gray-900">{getSpecifications(selectedInquiry).engineSize || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                          <p className="text-lg text-gray-900 flex items-center">
                            <FaPalette className="mr-2 text-gray-400" />
                            {getSpecifications(selectedInquiry).color || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Doors</label>
                          <p className="text-lg text-gray-900">{getSpecifications(selectedInquiry).doors || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                          <p className="text-lg text-gray-900">{getSpecifications(selectedInquiry).seats || 'Not specified'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Condition & History */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaHistory className="mr-2 text-purple-600" />
                        Condition & History
                      </span>
                      <button
                        onClick={() => toggleSection('condition')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedSections.condition ? <FaCaretUp /> : <FaCaretDown />}
                      </button>
                    </h3>
                    {expandedSections.condition && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Overall Condition</label>
                          <p className="text-lg font-semibold text-gray-900 capitalize">{getConditionDetails(selectedInquiry).carCondition || 'Excellent'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Service History</label>
                          <p className="text-lg text-gray-900 capitalize">{getConditionDetails(selectedInquiry).serviceHistory || 'Full'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Accident History</label>
                          <p className="text-lg text-gray-900 capitalize">{getConditionDetails(selectedInquiry).accidentHistory || 'None'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ownership</label>
                          <p className="text-lg text-gray-900">{getConditionDetails(selectedInquiry).ownershipHistory || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Road Tax</label>
                          <p className="text-lg text-gray-900 capitalize">{getConditionDetails(selectedInquiry).roadTaxStatus || 'Current'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                          <p className="text-lg text-gray-900 capitalize">{getConditionDetails(selectedInquiry).insuranceStatus || 'Comprehensive'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Modifications</label>
                          <p className="text-lg text-gray-900 capitalize">{getConditionDetails(selectedInquiry).modifications || 'None'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Certification</label>
                          <p className="text-lg text-gray-900 capitalize">{getConditionDetails(selectedInquiry).certification || 'None'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaTags className="mr-2 text-yellow-600" />
                        Features & Amenities
                      </span>
                      <button
                        onClick={() => toggleSection('features')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedSections.features ? <FaCaretUp /> : <FaCaretDown />}
                      </button>
                    </h3>
                    {expandedSections.features && (
                      <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                          {getFeatures(selectedInquiry).map((feature, index) => (
                            <div key={index} className="bg-white px-3 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                              {feature}
                            </div>
                          ))}
                        </div>
                        {getFeatures(selectedInquiry).length === 0 && (
                          <p className="text-gray-500 text-center py-4">No features specified</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Seller Information */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaUser className="mr-2 text-indigo-600" />
                        Seller Information
                      </span>
                      <button
                        onClick={() => toggleSection('seller')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedSections.seller ? <FaCaretUp /> : <FaCaretDown />}
                      </button>
                    </h3>
                    {expandedSections.seller && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Seller Name</label>
                          <p className="text-lg text-gray-900">{selectedInquiry.sellerName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <p className="text-lg text-gray-900 flex items-center">
                            <FaEnvelope className="mr-2 text-gray-400" />
                            {selectedInquiry.sellerEmail}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <p className="text-lg text-gray-900 flex items-center">
                            <FaPhone className="mr-2 text-gray-400" />
                            {selectedInquiry.sellerPhone}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
                          <p className="text-lg text-gray-900 capitalize">{getSellerPreferences(selectedInquiry).preferredContact || 'Phone'}</p>
                        </div>
                        {getSellerPreferences(selectedInquiry).companyName && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <p className="text-lg text-gray-900">{getSellerPreferences(selectedInquiry).companyName}</p>
                          </div>
                        )}
                        {getSellerPreferences(selectedInquiry).dealerLicense && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dealer License</label>
                            <p className="text-lg text-gray-900">{getSellerPreferences(selectedInquiry).dealerLicense}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Seller Preferences */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <FaMoneyBillWave className="mr-2 text-green-600" />
                      Seller Preferences
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          getSellerPreferences(selectedInquiry).priceNegotiable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <FaMoneyBillWave className="text-xl" />
                        </div>
                        <p className="text-sm font-medium">Price Negotiable</p>
                        <p className={`text-sm ${getSellerPreferences(selectedInquiry).priceNegotiable ? 'text-green-600' : 'text-red-600'}`}>
                          {getSellerPreferences(selectedInquiry).priceNegotiable ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          getSellerPreferences(selectedInquiry).testDrive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <FaCar className="text-xl" />
                        </div>
                        <p className="text-sm font-medium">Test Drive</p>
                        <p className={`text-sm ${getSellerPreferences(selectedInquiry).testDrive ? 'text-green-600' : 'text-red-600'}`}>
                          {getSellerPreferences(selectedInquiry).testDrive ? 'Available' : 'Not Available'}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          getSellerPreferences(selectedInquiry).warranty ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <FaShieldAlt className="text-xl" />
                        </div>
                        <p className="text-sm font-medium">Warranty</p>
                        <p className={`text-sm ${getSellerPreferences(selectedInquiry).warranty ? 'text-green-600' : 'text-red-600'}`}>
                          {getSellerPreferences(selectedInquiry).warranty ? `${getSellerPreferences(selectedInquiry).warrantyMonths || 0} months` : 'No'}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          getSellerPreferences(selectedInquiry).serviceRecords ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <FaFileAlt className="text-xl" />
                        </div>
                        <p className="text-sm font-medium">Service Records</p>
                        <p className={`text-sm ${getSellerPreferences(selectedInquiry).serviceRecords ? 'text-green-600' : 'text-red-600'}`}>
                          {getSellerPreferences(selectedInquiry).serviceRecords ? 'Available' : 'Not Available'}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          getSellerPreferences(selectedInquiry).originalPaint ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <FaPaintRoller className="text-xl" />
                        </div>
                        <p className="text-sm font-medium">Original Paint</p>
                        <p className={`text-sm ${getSellerPreferences(selectedInquiry).originalPaint ? 'text-green-600' : 'text-red-600'}`}>
                          {getSellerPreferences(selectedInquiry).originalPaint ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <FaFileAlt className="mr-2 text-blue-600" />
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Admin Section */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaCog className="mr-2 text-gray-600" />
                        Admin Information
                      </span>
                      <button
                        onClick={() => toggleSection('admin')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedSections.admin ? <FaCaretUp /> : <FaCaretDown />}
                      </button>
                    </h3>
                    {expandedSections.admin && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                            {getStatusBadge(selectedInquiry)}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Reviewed</label>
                            <p className="text-lg text-gray-900">{formatDate(getReviewedAt(selectedInquiry))}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reviewed By</label>
                            <p className="text-lg text-gray-900">{getReviewedBy(selectedInquiry) || 'Not reviewed'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID</label>
                            <p className="text-lg font-mono text-gray-900">{selectedInquiry.reference}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows="3"
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add admin notes here..."
                          />
                        </div>

                        {getCarStatus(selectedInquiry) === 'rejected' && getRejectionReason(selectedInquiry) && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <label className="block text-sm font-medium text-red-700 mb-1">Rejection Reason</label>
                            <p className="text-red-700">{getRejectionReason(selectedInquiry)}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-semibold"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleEdit(selectedInquiry)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition duration-200 font-semibold flex items-center space-x-2"
                  >
                    <FaEdit />
                    <span>Edit Listing</span>
                  </button>
                </div>

                <div className="flex space-x-3">
                  {getCarStatus(selectedInquiry) === 'rejected' && (
                    <button
                      onClick={() => handleRestoreToApproved(selectedInquiry)}
                      className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition duration-200 font-semibold flex items-center space-x-2"
                    >
                      <FaUndo />
                      <span>Restore to Approved</span>
                    </button>
                  )}
                  
                  {getCarStatus(selectedInquiry) === 'approved' && (
                    <button
                      onClick={() => handleRepublish(selectedInquiry)}
                      className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition duration-200 font-semibold flex items-center space-x-2"
                    >
                      <FaStar />
                      <span>Republish</span>
                    </button>
                  )}

                  {(getCarStatus(selectedInquiry) === 'approved' || getCarStatus(selectedInquiry) === 'published') && (
                    <button
                      onClick={() => handleUnapprove(selectedInquiry)}
                      className="px-6 py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition duration-200 font-semibold flex items-center space-x-2"
                    >
                      <FaBan />
                      <span>Unapprove</span>
                    </button>
                  )}

                  {getCarStatus(selectedInquiry) === 'pending' && (
                    <>
                      <button
                        onClick={() => handleReject(selectedInquiry)}
                        className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition duration-200 font-semibold flex items-center space-x-2"
                      >
                        <FaTimes />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApproveAndPublish(selectedInquiry)}
                        className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition duration-200 font-semibold flex items-center space-x-2"
                      >
                        <FaCheck />
                        <span>Approve & Publish</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDelete(selectedInquiry)}
                    className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition duration-200 font-semibold flex items-center space-x-2"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[60]">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white text-2xl p-3 hover:text-gray-300 transition duration-200 z-10 bg-black bg-opacity-50 rounded-full"
            >
              <FaTimes />
            </button>
            
            {/* Navigation Arrows */}
            {selectedInquiry?.files && selectedInquiry.files.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition duration-200 z-10"
                >
                  <FaArrowLeft className="text-xl" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition duration-200 z-10"
                >
                  <FaArrowRight className="text-xl" />
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-lg z-10">
                  {currentImageIndex + 1} / {selectedInquiry.files.length}
                </div>
              </>
            )}
            
            {/* Full-screen Image */}
            <img
              src={getImageUrl(selectedImage)}
              alt="Car preview"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/800/1f2937/ffffff?text=Image+Not+Available`;
              }}
            />
          </div>
        </div>
      )}

      {/* Approve & Publish Confirmation Modal */}
      {showApproveModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <FaCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Approve & Publish Car Listing</h3>
              <p className="text-gray-600 mb-6">
                This will approve the listing and publish it to the marketplace with corporate seller details.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-left">
                <p className="text-sm text-blue-800 font-medium">Seller will be updated to:</p>
                <p className="text-sm text-blue-700">Corporate Sellers</p>
                <p className="text-sm text-blue-700">0793472960</p>
                <p className="text-sm text-blue-700">corpertesellerke@gmail.com</p>
              </div>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApproveAndPublish}
                  className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition duration-200 font-medium"
                >
                  Approve & Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FaTimes className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Car Listing</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to reject <strong>"{selectedInquiry.carName}"</strong>?
              </p>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Reason for rejection (required)"
                rows="3"
                className="w-full p-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
                required
              />
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition duration-200 font-medium"
                >
                  Reject Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FaTrash className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Car Listing</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>"{selectedInquiry.carName}"</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition duration-200 font-medium"
                >
                  Delete Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}