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
  FaBan,
  FaCubes,
  FaIdCard,
  FaBuilding,
  FaToolbox,
  FaCarBattery,
  FaSnowflake,
  FaSun,
  FaMusic,
  FaBluetooth,
  FaWifi,
  FaKey,
  FaLock,
  FaEyeSlash,
  FaParking,
  FaUmbrella,
  FaBriefcase,
  FaHeart,
  FaLeaf,
  FaBolt,
  FaTint,
  FaWind,
  FaMobile,
  FaSatellite,
  FaFilm,
  FaGamepad,
  FaUserFriends,
  FaBaby,
  FaDog,
  FaBox,
  FaTruck,
  FaMotorcycle,
  FaBicycle
} from 'react-icons/fa'
import { CircularProgress, Backdrop } from '@mui/material'
import { toast, Toaster } from 'react-hot-toast'

// ✅ FIXED: ImageGalleryItem with proper image mapping
const ImageGalleryItem = ({ image, index, inquiry, onViewImage }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  // ✅ SIMPLIFIED: Direct image URL mapping from database
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, use it directly
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path starting with /uploads, construct the full URL
    if (imagePath.startsWith('/uploads/')) {
      return `${window.location.origin}${imagePath}`;
    }
    
    // If it's just a filename, assume it's in uploads folder
    if (!imagePath.includes('/') && imagePath.includes('.')) {
      return `${window.location.origin}/uploads/${imagePath}`;
    }
    
    return imagePath;
  };

  const imageUrl = getImageUrl(image);

  if (!imageUrl) {
    return (
      <div className="relative bg-gray-100 rounded-xl min-h-32 flex items-center justify-center">
        <div className="text-center text-gray-500 p-4">
          <FaImage className="text-2xl mx-auto mb-2 opacity-50" />
          <p className="text-xs">No image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group bg-gray-100 rounded-xl min-h-32 flex items-center justify-center overflow-hidden">
      {/* Loading state */}
      {imgLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Error state */}
      {imgError ? (
        <div className="text-center text-gray-500 p-4">
          <FaImage className="text-2xl mx-auto mb-2 opacity-50" />
          <p className="text-xs">Failed to load</p>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={`${inquiry.carName} - ${index + 1}`}
          className={`w-full h-32 object-cover rounded-xl cursor-pointer hover:opacity-90 transition duration-200 ${
            imgLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={() => onViewImage(image, index, inquiry.files)}
          onError={() => {
            setImgError(true);
            setImgLoading(false);
          }}
          onLoad={() => setImgLoading(false)}
          loading="lazy"
        />
      )}
      
      {/* Image number badge */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {index + 1}
      </div>
    </div>
  );
};

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
    basic: true,
    specifications: true,
    condition: true,
    features: true,
    seller: true,
    preferences: true,
    admin: false
  })

  const inquiriesPerPage = 8

  // ✅ SIMPLIFIED: Direct image URL mapping
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
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
        console.log('✅ Fetched cars:', result.data?.length)
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
  }, [])

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  // Filter inquiries based on search, status, and active tab
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.carName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.carType?.toLowerCase().includes(searchTerm.toLowerCase())
    
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

// ✅ FIXED: Post to cardeal API WITHOUT description truncation (after schema fix)
const postToCarDeal = async (carData) => {
  try {
    console.log('🔄 Posting to cardeal API for approved car:', {
      carName: carData.carName,
      price: carData.price,
      descriptionLength: carData.description?.length || 0
    });

    const formData = new FormData();
    
    // ✅ ONLY REQUIRED FIELDS for cardeal API:
    formData.append('carName', carData.carName || '');
    formData.append('price', carData.price?.toString() || '0');
    formData.append('location', carData.location || '');
    formData.append('year', carData.year?.toString() || '2023');
    formData.append('carType', carData.carType || '');
    formData.append('mileage', carData.mileage?.toString() || '0');
    formData.append('transmission', carData.transmission || '');
    formData.append('fuelType', carData.fuelType || '');
    
    // ✅ FIXED: NO TRUNCATION - send full description (schema is now TEXT)
    const description = carData.description || '';
    formData.append('description', description);
    
    console.log('📝 Description (full length):', {
      length: description.length,
      preview: description.substring(0, 100) + (description.length > 100 ? '...' : '')
    });
    
    // ✅ Use default corporate seller details (REQUIRED)
    formData.append('sellerName', 'Corporate Sellers');
    formData.append('sellerPhone', '254793472960');
    formData.append('sellerEmail', 'corporatesellerske@gmail.com');
    
    // ✅ Features (optional but included)
    const features = getFeatures(carData);
    features.forEach(feature => {
      formData.append('features', feature);
    });
    
    // ✅ Files/images (optional but important)
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
              console.log('✅ Added image:', fileName);
            }
          } catch (error) {
            console.warn('❌ Error processing image:', filePath, error);
          }
        }
      }
    }

    console.log('📤 Sending approved car to cardeal API:', {
      carName: carData.carName,
      price: carData.price,
      location: carData.location,
      year: carData.year,
      descriptionLength: description.length,
      featuresCount: features.length,
      imagesCount: formData.getAll('files').length
    });

    const response = await fetch('/api/cardeal', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Cardeal API Response Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      });
      throw new Error(`Failed to publish to marketplace: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Successfully published car to marketplace:', result.data);
      return result.data;
    } else {
      console.error('❌ Cardeal API returned error:', result.error);
      throw new Error(result.error || 'Failed to publish to marketplace');
    }
  } catch (error) {
    console.error('❌ Error publishing car to marketplace:', error);
    throw error;
  }
};
  // Update car status using PATCH
  const updateCarStatus = async (carId, status, adminNotes = '', rejectionReason = '') => {
    try {
      setActionLoading(true)
      console.log('🔄 Starting status update...', {
        carId,
        status,
        adminNotes,
        rejectionReason
      })

      const patchData = {
        status: status,
        adminNotes: adminNotes,
        rejectionReason: status === 'rejected' ? rejectionReason : '',
        reviewedBy: 'Admin',
      }

      console.log('📤 Sending PATCH request with data:', patchData)

      const response = await fetch(`/api/sellyourcar/${carId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patchData),
      })

      console.log('📥 Received response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ PATCH request failed:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        })
        throw new Error(`HTTP error! status: ${response.status}. ${errorText}`)
      }

      const result = await response.json()
      console.log('✅ PATCH response success:', result)

      if (result.success) {
        console.log(`✅ Car ${status} successfully!`)
        toast.success(`Car ${status} successfully!`)
        
        // Update local state immediately
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
            console.log('🔄 Updated local state for car:', carId)
            return updatedInquiry
          }
          return inq
        }))
        
        return result.data
      } else {
        console.error('❌ PATCH response indicates failure:', result)
        throw new Error(result.error || `Failed to ${status} car`)
      }
    } catch (error) {
      console.error('❌ Error in updateCarStatus:', error)
      toast.error(error.message || 'Error updating car status')
      return false
    } finally {
      setActionLoading(false)
    }
  }

  // ✅ Delete from cardeal API when unpublishing
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
        return true
      } else {
        throw new Error(result.error || 'Failed to remove from marketplace')
      }
    } catch (error) {
      console.error('Error deleting from cardeal:', error)
      throw error
    }
  }

  // ✅ Make entire card clickable
  const handleCardClick = (inquiry) => {
    setSelectedInquiry(inquiry)
    setAdminNotes(getAdminNotes(inquiry))
    setShowDetailModal(true)
  }

  const handleApprove = (inquiry) => {
    setSelectedInquiry(inquiry)
    setShowApproveModal(true)
  }

  const handleReject = (inquiry) => {
    setSelectedInquiry(inquiry)
    setRejectNotes('')
    setShowRejectModal(true)
  }

  // ✅ Edit functionality
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

  // ✅ Update car data (edit functionality)
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

// ✅ FIXED: Simplified approve process - update to published directly, then post to cardeal
const confirmApprove = async () => {
  if (selectedInquiry) {
    try {
      setActionLoading(true)
      console.log('🔄 Starting approve & publish process for car:', selectedInquiry.id)
      
      // ✅ STEP 1: First update status to 'published' via PATCH
      console.log('📤 Step 1: Updating status to "published" via PATCH...')
      const success = await updateCarStatus(selectedInquiry.id, 'published', adminNotes || 'Car approved and published to marketplace')
      
      if (!success) {
        console.error('❌ Step 1: Failed to update status to published')
        toast.error('Failed to approve and publish car')
        return
      }
      
      console.log('✅ Step 1: Status updated to "published" successfully')
      
      // ✅ STEP 2: Now post to cardeal API after status is published
      console.log('📤 Step 2: Posting to cardeal API...')
      try {
        const cardealResult = await postToCarDeal(selectedInquiry)
        console.log('✅ Step 2: Successfully posted to cardeal API')
        
        toast.success('Car approved and published to marketplace!')
        
        // ✅ CLOSE BOTH MODALS after successful approval
        setShowApproveModal(false)
        setShowDetailModal(false)
        setAdminNotes('')
        
        // ✅ Refresh the data to show updated status
        console.log('🔄 Refreshing inquiries data...')
        fetchInquiries()
        
      } catch (error) {
        console.error('❌ Step 2: Failed to post to cardeal API:', error)
        // Even if cardeal fails, the car status is still published
        toast.success('Car approved! (Marketplace sync pending)')
        
        // ✅ STILL CLOSE BOTH MODALS even if cardeal fails (since status update was successful)
        setShowApproveModal(false)
        setShowDetailModal(false)
        setAdminNotes('')
        fetchInquiries()
      }
    } catch (error) {
      console.error('❌ Error in approve process:', error)
      toast.error('Error approving car: ' + error.message)
    } finally {
      setActionLoading(false)
    }
  }
}

  // ✅ REMOVED: Unpublish functionality - No separate unpublish

  // ✅ Restore from rejected to pending
  const handleRestoreFromRejected = async (inquiry) => {
    console.log('🔄 Restoring from rejected to pending for car:', inquiry.id)
    const success = await updateCarStatus(inquiry.id, 'pending', 'Restored from rejected status')
    if (success) {
      console.log('✅ Car restored to pending status successfully')
      toast.success('Car restored to pending status')
      setShowDetailModal(false)
      fetchInquiries()
    } else {
      console.error('❌ Failed to restore car to pending status')
    }
  }

  // ✅ REMOVED: Unapprove functionality - No unapprove button

  // ✅ REMOVED: Separate publish functionality - Approve already publishes

  const confirmReject = async () => {
    if (selectedInquiry) {
      if (!rejectNotes.trim()) {
        toast.error('Please provide a reason for rejection')
        return
      }
      
      console.log('🔄 Starting reject process for car:', selectedInquiry.id)
      
      const success = await updateCarStatus(selectedInquiry.id, 'rejected', adminNotes, rejectNotes)
      if (success) {
        console.log('✅ Car rejected successfully')
        setShowRejectModal(false)
        setShowDetailModal(false)
        setRejectNotes('')
        setAdminNotes('')
        fetchInquiries()
      } else {
        console.error('❌ Failed to reject car')
      }
    }
  }

  // ✅ Delete car listing with cardeal cleanup
  const confirmDelete = async () => {
    if (selectedInquiry) {
      try {
        setActionLoading(true)
        
        // If car is published, remove from cardeal first
        if (getCarStatus(selectedInquiry) === 'published') {
          try {
            await deleteFromCarDeal(selectedInquiry.reference)
            toast.success('Removed from marketplace')
          } catch (error) {
            console.warn('Could not remove from marketplace:', error)
          }
        }
        
        // Then delete from main database
        const response = await fetch(`/api/sellyourcar/${selectedInquiry.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
          toast.success('Car listing deleted successfully!')
          setInquiries(prev => prev.filter(inq => inq.id !== selectedInquiry.id))
          setShowDeleteModal(false)
          setShowDetailModal(false)
        } else {
          throw new Error(result.error || 'Failed to delete car listing')
        }
      } catch (error) {
        console.error('Error deleting car:', error)
        toast.error(error.message || 'Error deleting car listing')
      } finally {
        setActionLoading(false)
      }
    }
  }

  // ✅ Confirm edit functionality
  const confirmEdit = async () => {
    if (selectedInquiry) {
      const success = await updateCarData(selectedInquiry.id, editingData)
      if (success) {
        setShowEditModal(false)
        setShowDetailModal(false)
        fetchInquiries()
      }
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

  // Feature icons mapping
  const getFeatureIcon = (feature) => {
    const iconMap = {
      // Comfort & Convenience
      'air conditioning': FaSnowflake,
      'climate control': FaSun,
      'cruise control': FaTachometerAlt,
      'power steering': FaCog,
      'power windows': FaWrench,
      'power mirrors': FaEye,
      'keyless entry': FaKey,
      'remote start': FaBolt,
      'sunroof': FaSun,
      'moonroof': FaSun,
      'leather seats': FaCar,
      'heated seats': FaSun,
      'ventilated seats': FaWind,
      
      // Entertainment
      'premium audio': FaMusic,
      'navigation system': FaMapMarkerAlt,
      'bluetooth': FaBluetooth,
      'apple carplay': FaMobile,
      'android auto': FaMobile,
      'touchscreen': FaMobile,
      'backup camera': FaCamera,
      'parking sensors': FaParking,
      
      // Safety
      'abs brakes': FaCarCrash,
      'traction control': FaCarCrash,
      'stability control': FaCarCrash,
      'airbags': FaShieldAlt,
      'lane assist': FaRoad,
      'blind spot monitor': FaEye,
      'rear cross traffic alert': FaCar,
      'automatic emergency braking': FaCarCrash,
      'adaptive cruise control': FaTachometerAlt,
      
      // Exterior
      'alloy wheels': FaCog,
      'fog lights': FaCar,
      'led lights': FaBolt,
      'xenon lights': FaBolt,
      'power tailgate': FaCar,
      'running boards': FaTruck,
      'tow package': FaTruck,
      'roof rack': FaTruck,
      
      // Interior
      'third row seating': FaUserFriends,
      'captain chairs': FaUser,
      'fold flat seats': FaCar,
      'cargo cover': FaBox,
      'all weather mats': FaTint,
      'child safety locks': FaBaby,
      'pet friendly': FaDog
    }

    const lowerFeature = feature.toLowerCase()
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerFeature.includes(key)) {
        return icon
      }
    }
    return FaCog // Default icon
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

  // ✅ UPDATED: CarCard Component with mobile responsiveness
  const CarCard = ({ inquiry }) => {
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
    const [imageLoading, setImageLoading] = useState(true);

    return (
      <div 
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
        onClick={() => handleCardClick(inquiry)}
      >
        <div className="relative bg-gray-100 min-h-48 sm:min-h-64 flex items-center justify-center overflow-hidden">
          {/* Error State */}
          {(!mainImageUrl || imageLoadError) ? (
            <div className="w-full h-48 sm:h-64 flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-500">
                <FaImage className="text-3xl sm:text-4xl mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">Image not available</p>
              </div>
            </div>
          ) : (
            <>
              <img 
                src={mainImageUrl}
                alt={safeInquiry.carName}
                className={`w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onError={() => {
                  setImageLoadError(true);
                  setImageLoading(false);
                }}
                onLoad={() => setImageLoading(false)}
                loading="lazy"
              />
              
              {/* Loading overlay */}
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </>
          )}

          {/* Status Badge */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            {getStatusBadge(inquiry)}
          </div>

          {/* Car Info Overlay */}
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black bg-opacity-70 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium backdrop-blur-sm">
            {safeInquiry.year} • {safeInquiry.mileage?.toLocaleString()} km
          </div>

          {/* Image Count Badge */}
          {safeInquiry.files && safeInquiry.files.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black bg-opacity-70 text-white px-1 sm:px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
              +{safeInquiry.files.length - 1}
            </div>
          )}
        </div>
        
        {/* Card Content */}
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate flex-1 mr-2 sm:mr-3">
              {safeInquiry.carName}
            </h3>
            <span className="text-xl sm:text-2xl font-bold text-blue-600 whitespace-nowrap">
              KSh {safeInquiry.price?.toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
            <div className="flex items-center text-gray-600 text-sm sm:text-lg">
              <FaMapMarkerAlt className="mr-2 sm:mr-3 text-gray-400 flex-shrink-0 text-sm sm:text-base" />
              <span className="truncate text-sm sm:text-base">{safeInquiry.location}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-base text-gray-600">
              <span className="flex items-center">
                <FaGasPump className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                <span className="text-xs sm:text-sm">{safeInquiry.fuelType}</span>
              </span>
              <span className="text-gray-300 text-xs">•</span>
              <span className="flex items-center">
                <FaCogs className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                <span className="text-xs sm:text-sm">{safeInquiry.transmission}</span>
              </span>
              <span className="text-gray-300 text-xs">•</span>
              <span className="flex items-center">
                <FaTachometerAlt className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                <span className="text-xs sm:text-sm">{safeInquiry.carType}</span>
              </span>
            </div>
          </div>

          {/* Features Preview */}
          {getFeatures(inquiry).length > 0 && (
            <div className="mb-3 sm:mb-4">
              <div className="flex flex-wrap gap-1">
                {getFeatures(inquiry).slice(0, 3).map((feature, index) => {
                  const IconComponent = getFeatureIcon(feature);
                  return (
                    <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                      <IconComponent className="mr-1 text-xs" />
                      {feature.length > 12 ? feature.substring(0, 12) + '...' : feature}
                    </span>
                  );
                })}
                {getFeatures(inquiry).length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                    +{getFeatures(inquiry).length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-200">
            <div className="text-sm sm:text-base text-gray-600">
              By: <span className="font-semibold">{safeInquiry.sellerName}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <CircularProgress size={60} className="text-blue-600" />
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading car listings...</p>
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

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">
                Car Listings Management
              </h1>
              <p className="text-base sm:text-xl text-gray-600">
                Manage, review, and approve car listing submissions
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center cursor-pointer  border-trasparent hover:border-black hover:border-2 space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-white text-gray-700 rounded-2xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <FaSync className="text-lg" />
              <span className="font-medium text-sm sm:text-base">Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards with Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-4 sm:mb-6">
            {[
              { 
                label: 'Total', 
                value: stats.total, 
                color: 'blue', 
                icon: FaList,
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-600',
                tab: 'all'
              },
              { 
                label: 'Pending', 
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
                className={`bg-white rounded-2xl shadow-lg border-2 p-3 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
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
                    <p className="text-xs font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-xl sm:text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                  <div className={`p-2 sm:p-3 ${stat.bgColor} rounded-xl`}>
                    <stat.icon className={`${stat.textColor} text-base sm:text-2xl`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 sm:p-4">
            <div className="flex flex-wrap gap-1 sm:gap-0 sm:space-x-1">
              {['all', 'pending', 'approved', 'published', 'rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab)
                    setCurrentPage(1)
                  }}
                  className={`flex-1 py-2 cursor-pointer border border-transparent hover:border-black hover:border-2 sm:py-3 px-2 sm:px-4 rounded-xl font-medium transition-all duration-200 text-xs sm:text-base ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'all' && 'All'}
                  {tab === 'pending' && 'Pending'}
                  {tab === 'approved' && 'Approved'}
                  {tab === 'published' && 'Published'}
                  {tab === 'rejected' && 'Rejected'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
                <input
                  type="text"
                  placeholder="Search by car name, seller, reference, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-4 items-center w-full lg:w-auto justify-between lg:justify-end">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition duration-200 cursor-pointer border border-transparent hover:border-black hover:border-2 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <FaTh className="text-sm sm:text-lg" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition duration-200 cursor-pointer border border-transparent hover:border-black hover:border-2 ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <FaThList className="text-sm sm:text-lg" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <FaFilter className="text-base sm:text-lg" />
                <span className="font-medium hidden sm:block text-sm">Filter:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white flex-1 sm:flex-none"
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
                  className="px-3 sm:px-4 py-2 sm:py-3 cursor-pointer border border-transparent hover:border-black hover:border-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium text-xs sm:text-base"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-gray-600 text-sm sm:text-base">
            Showing <span className="font-semibold">{currentInquiries.length}</span> of{' '}
            <span className="font-semibold">{filteredInquiries.length}</span> listings
          </p>
          {filteredInquiries.length > 0 && (
            <p className="text-xs sm:text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Inquiries Display */}
        {currentInquiries.length > 0 ? (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider">
                          Car Details
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider">
                          Seller Info
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentInquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="hover:bg-gray-50 transition duration-200">
                          <td className="px-3 sm:px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative flex-shrink-0">
                                <img 
                                  src={getImageUrl(inquiry.file)}
                                  alt={inquiry.carName}
                                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl object-cover border border-gray-300"
                                  onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/80/1f2937/ffffff?text=IMG`;
                                  }}
                                />
                                {inquiry.files && inquiry.files.length > 1 && (
                                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                                    +{inquiry.files.length - 1}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg truncate">{inquiry.carName}</div>
                                <div className="text-base sm:text-lg md:text-xl font-bold text-blue-600">
                                  KSh {inquiry.price?.toLocaleString()}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 truncate">
                                  {inquiry.year} • {inquiry.mileage?.toLocaleString()} km • {inquiry.location}
                                </div>
                                {getFeatures(inquiry).length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {getFeatures(inquiry).slice(0, 2).map((feature, index) => (
                                      <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                                        {feature.length > 15 ? feature.substring(0, 15) + '...' : feature}
                                      </span>
                                    ))}
                                    {getFeatures(inquiry).length > 2 && (
                                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                                        +{getFeatures(inquiry).length - 2}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="text-xs sm:text-sm text-gray-900 font-medium truncate">{inquiry.sellerName}</div>
                            <div className="text-xs sm:text-sm text-gray-600 truncate">{inquiry.sellerEmail}</div>
                            <div className="text-xs sm:text-sm text-gray-600 truncate">{inquiry.sellerPhone}</div>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            {getStatusBadge(inquiry)}
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
                              <button
                                onClick={() => handleCardClick(inquiry)}
                                className="px-2 sm:px-3 py-1 sm:py-2 cursor-pointer border border-transparent hover:border-black hover:border-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 font-medium text-xs sm:text-sm"
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
          <div className="text-center py-8 sm:py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
            <FaCar className="text-4xl sm:text-6xl md:text-8xl text-gray-300 mx-auto mb-3 sm:mb-6" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No car listings found</h3>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-md mx-auto px-4">
              {searchTerm || statusFilter !== 'all' || activeTab !== 'all'
                ? 'Try adjusting your search criteria or filters.' 
                : 'No car listings have been submitted yet.'}
            </p>
            {(searchTerm || statusFilter !== 'all' || activeTab !== 'all') && (
              <button
                onClick={resetFilters}
                className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer border border-transparent hover:border-black hover:border-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition duration-200 font-semibold text-sm sm:text-base"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredInquiries.length > inquiriesPerPage && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-4 sm:mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center cursor-pointer border border-transparent hover:border-black hover:border-2 space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition duration-200 w-full sm:w-auto justify-center text-sm sm:text-base ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaChevronLeft />
              <span>Previous</span>
            </button>
            
            <span className="text-sm sm:text-lg font-medium text-gray-700 text-center">
              Page {currentPage} of {totalPages} • {filteredInquiries.length} listings
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center  cursor-pointer border border-transparent hover:border-black hover:border-2 space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition duration-200 w-full sm:w-auto justify-center text-sm sm:text-base ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>Next</span>
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Detail Modal - Mobile Responsive */}
      {showDetailModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">{selectedInquiry.carName}</h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1">Reference: {selectedInquiry.reference}</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 self-end sm:self-auto">
                  {getStatusBadge(selectedInquiry)}
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 sm:p-3 text-gray-400 cursor-pointer border border-transparent hover:border-black hover:border-2 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition duration-200"
                  >
                    <FaTimes className="text-base sm:text-xl" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {/* Left Column - Images */}
                <div className="xl:col-span-1">
                  <div className="sticky top-2 sm:top-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                      <FaCamera className="mr-2 text-blue-600" />
                      Car Photos ({selectedInquiry.files?.length || 0})
                    </h3>
                    
                    {/* Image Gallery */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      {selectedInquiry.files && selectedInquiry.files.map((image, index) => (
                        <ImageGalleryItem 
                          key={index}
                          image={image}
                          index={index}
                          inquiry={selectedInquiry}
                          onViewImage={handleViewImage}
                        />
                      ))}
                    </div>
                    
                    {/* No images state */}
                    {(!selectedInquiry.files || selectedInquiry.files.length === 0) && (
                      <div className="text-center py-4 sm:py-8 text-gray-500 bg-gray-50 rounded-xl">
                        <FaImage className="text-2xl sm:text-4xl mx-auto mb-2 sm:mb-3 text-gray-300" />
                        <p className="text-sm sm:text-base">No images available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="xl:col-span-2 space-y-3 sm:space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-2xl p-3 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaCar className="mr-2 text-blue-600" />
                        Basic Information
                      </span>
                      <button
                        onClick={() => toggleSection('basic')}
                        className="text-gray-400 cursor-pointer border border-transparent hover:border-black hover:border-2  hover:text-gray-600"
                      >
                        {expandedSections.basic ? <FaCaretUp /> : <FaCaretDown />}
                      </button>
                    </h3>
                    {expandedSections.basic && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Car Name</label>
                          <p className="text-sm sm:text-lg font-semibold text-gray-900 break-words">{selectedInquiry.carName}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Price</label>
                          <p className="text-lg sm:text-2xl font-bold text-blue-600">KSh {selectedInquiry.price?.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Location</label>
                          <p className="text-sm sm:text-lg text-gray-900 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-gray-400 flex-shrink-0" />
                            <span className="break-words">{selectedInquiry.location}</span>
                          </p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Year</label>
                          <p className="text-sm sm:text-lg text-gray-900">{selectedInquiry.year}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Mileage</label>
                          <p className="text-sm sm:text-lg text-gray-900 flex items-center">
                            <FaTachometerAlt className="mr-2 text-gray-400 flex-shrink-0" />
                            {selectedInquiry.mileage?.toLocaleString()} km
                          </p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Transmission</label>
                          <p className="text-sm sm:text-lg text-gray-900">{selectedInquiry.transmission}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                          <p className="text-sm sm:text-lg text-gray-900 flex items-center">
                            <FaGasPump className="mr-2 text-gray-400 flex-shrink-0" />
                            {selectedInquiry.fuelType}
                          </p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Car Type</label>
                          <p className="text-sm sm:text-lg text-gray-900">{selectedInquiry.carType}</p>
                        </div>
                        {selectedInquiry.description && (
                          <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200 sm:col-span-2 lg:col-span-3">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                            <p className="text-gray-700 text-xs sm:text-base mt-1 line-clamp-3 break-words">
                              {selectedInquiry.description}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Specifications */}
                  <div className="bg-gray-50 rounded-2xl p-3 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaCogs className="mr-2 text-green-600" />
                        Specifications
                      </span>
                      <button
                        onClick={() => toggleSection('specifications')}
                        className="text-gray-400 cursor-pointer border border-transparent hover:border-black hover:border-2 hover:text-gray-600"
                      >
                        {expandedSections.specifications ? <FaCaretUp /> : <FaCaretDown />}
                      </button>
                    </h3>
                    {expandedSections.specifications && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Engine Size</label>
                          <p className="text-sm sm:text-lg text-gray-900">{getSpecifications(selectedInquiry).engineSize || 'Not specified'}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Color</label>
                          <p className="text-sm sm:text-lg text-gray-900 flex items-center">
                            <FaPalette className="mr-2 text-gray-400 flex-shrink-0" />
                            {getSpecifications(selectedInquiry).color || 'Not specified'}
                          </p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Doors</label>
                          <p className="text-sm sm:text-lg text-gray-900">{getSpecifications(selectedInquiry).doors || 'Not specified'}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Seats</label>
                          <p className="text-sm sm:text-lg text-gray-900">{getSpecifications(selectedInquiry).seats || 'Not specified'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Condition & History */}
                  <div className="bg-gray-50 rounded-2xl p-3 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaHistory className="mr-2 text-purple-600" />
                        Condition & History
                      </span>
                      <button
                        onClick={() => toggleSection('condition')}
                        className="text-gray-400 cursor-pointer border border-transparent hover:border-black hover:border-2  hover:text-gray-600"
                      >
                        {expandedSections.condition ? <FaCaretUp /> : <FaCaretDown />}
                      </button>
                    </h3>
                    {expandedSections.condition && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Overall Condition</label>
                          <p className="text-sm sm:text-lg font-semibold text-gray-900 capitalize">{getConditionDetails(selectedInquiry).carCondition || 'Excellent'}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Service History</label>
                          <p className="text-sm sm:text-lg text-gray-900 capitalize">{getConditionDetails(selectedInquiry).serviceHistory || 'Full'}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Accident History</label>
                          <p className="text-sm sm:text-lg text-gray-900 capitalize">{getConditionDetails(selectedInquiry).accidentHistory || 'None'}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Ownership</label>
                          <p className="text-sm sm:text-lg text-gray-900">{getConditionDetails(selectedInquiry).ownershipHistory || 'Not specified'}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Road Tax</label>
                          <p className="text-sm sm:text-lg text-gray-900 capitalize">{getConditionDetails(selectedInquiry).roadTaxStatus || 'Current'}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Insurance</label>
                          <p className="text-sm sm:text-lg text-gray-900 capitalize">{getConditionDetails(selectedInquiry).insuranceStatus || 'Comprehensive'}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Modifications</label>
                          <p className="text-sm sm:text-lg text-gray-900 capitalize">{getConditionDetails(selectedInquiry).modifications || 'None'}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Certification</label>
                          <p className="text-sm sm:text-lg text-gray-900 capitalize">{getConditionDetails(selectedInquiry).certification || 'None'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  {getFeatures(selectedInquiry).length > 0 && (
                    <div className="bg-gray-50 rounded-2xl p-3 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center justify-between">
                        <span className="flex items-center">
                          <FaTags className="mr-2 text-yellow-600" />
                          Features ({getFeatures(selectedInquiry).length})
                        </span>
                        <button
                          onClick={() => toggleSection('features')}
                          className="text-gray-400 cursor-pointer border border-transparent hover:border-black hover:border-2  hover:text-gray-600"
                        >
                          {expandedSections.features ? <FaCaretUp /> : <FaCaretDown />}
                        </button>
                      </h3>
                      {expandedSections.features && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {getFeatures(selectedInquiry).map((feature, index) => {
                            const IconComponent = getFeatureIcon(feature);
                            return (
                              <div key={index} className="bg-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-700 border border-gray-200 flex items-center">
                                <IconComponent className="mr-1 sm:mr-2 text-blue-600 text-xs flex-shrink-0" />
                                <span className="break-words">{feature}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Seller Information */}
                  <div className="bg-gray-50 rounded-2xl p-3 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaUser className="mr-2 text-indigo-600" />
                        Seller Information
                      </span>
                      <button
                        onClick={() => toggleSection('seller')}
                        className="text-gray-400 cursor-pointer border border-transparent hover:border-black hover:border-2  hover:text-gray-600"
                      >
                        {expandedSections.seller ? <FaCaretUp /> : <FaCaretDown />}
                      </button>
                    </h3>
                    {expandedSections.seller && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Seller Name</label>
                          <p className="text-sm sm:text-lg text-gray-900 break-words">{selectedInquiry.sellerName}</p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                          <p className="text-sm sm:text-lg text-gray-900 flex items-center">
                            <FaEnvelope className="mr-2 text-gray-400 flex-shrink-0" />
                            <span className="break-words">{selectedInquiry.sellerEmail}</span>
                          </p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <p className="text-sm sm:text-lg text-gray-900 flex items-center">
                            <FaPhone className="mr-2 text-gray-400 flex-shrink-0" />
                            {selectedInquiry.sellerPhone}
                          </p>
                        </div>
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
                          <p className="text-sm sm:text-lg text-gray-900 capitalize">{getSellerPreferences(selectedInquiry).preferredContact || 'Phone'}</p>
                        </div>
                        {getSellerPreferences(selectedInquiry).companyName && (
                          <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200 sm:col-span-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <p className="text-sm sm:text-lg text-gray-900">{getSellerPreferences(selectedInquiry).companyName}</p>
                          </div>
                        )}
                        {getSellerPreferences(selectedInquiry).dealerLicense && (
                          <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200 sm:col-span-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Dealer License</label>
                            <p className="text-sm sm:text-lg text-gray-900">{getSellerPreferences(selectedInquiry).dealerLicense}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Seller Preferences */}
                  <div className="bg-gray-50 rounded-2xl p-3 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaMoneyBillWave className="mr-2 text-green-600" />
                        Seller Preferences
                      </span>
                      <button
                        onClick={() => toggleSection('preferences')}
                        className="text-gray-400 cursor-pointer border border-transparent hover:border-black hover:border-2  hover:text-gray-600"
                      >
                        {expandedSections.preferences ? <FaCaretUp /> : <FaCaretDown />}
                      </button>
                    </h3>
                    {expandedSections.preferences && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                        <div className="text-center bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 ${
                            getSellerPreferences(selectedInquiry).priceNegotiable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            <FaMoneyBillWave className="text-sm sm:text-xl" />
                          </div>
                          <p className="text-xs sm:text-sm font-medium">Price Negotiable</p>
                          <p className={`text-xs sm:text-sm ${getSellerPreferences(selectedInquiry).priceNegotiable ? 'text-green-600' : 'text-red-600'}`}>
                            {getSellerPreferences(selectedInquiry).priceNegotiable ? 'Yes' : 'No'}
                          </p>
                        </div>
                        <div className="text-center bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 ${
                            getSellerPreferences(selectedInquiry).testDrive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            <FaCar className="text-sm sm:text-xl" />
                          </div>
                          <p className="text-xs sm:text-sm font-medium">Test Drive</p>
                          <p className={`text-xs sm:text-sm ${getSellerPreferences(selectedInquiry).testDrive ? 'text-green-600' : 'text-red-600'}`}>
                            {getSellerPreferences(selectedInquiry).testDrive ? 'Available' : 'Not Available'}
                          </p>
                        </div>
                        <div className="text-center bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 ${
                            getSellerPreferences(selectedInquiry).warranty ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            <FaShieldAlt className="text-sm sm:text-xl" />
                          </div>
                          <p className="text-xs sm:text-sm font-medium">Warranty</p>
                          <p className={`text-xs sm:text-sm ${getSellerPreferences(selectedInquiry).warranty ? 'text-green-600' : 'text-red-600'}`}>
                            {getSellerPreferences(selectedInquiry).warranty ? `${getSellerPreferences(selectedInquiry).warrantyMonths || 0} months` : 'No'}
                          </p>
                        </div>
                        <div className="text-center bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 ${
                            getSellerPreferences(selectedInquiry).serviceRecords ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            <FaFileAlt className="text-sm sm:text-xl" />
                          </div>
                          <p className="text-xs sm:text-sm font-medium">Service Records</p>
                          <p className={`text-xs sm:text-sm ${getSellerPreferences(selectedInquiry).serviceRecords ? 'text-green-600' : 'text-red-600'}`}>
                            {getSellerPreferences(selectedInquiry).serviceRecords ? 'Available' : 'Not Available'}
                          </p>
                        </div>
                        <div className="text-center bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 ${
                            getSellerPreferences(selectedInquiry).originalPaint ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            <FaPaintRoller className="text-sm sm:text-xl" />
                          </div>
                          <p className="text-xs sm:text-sm font-medium">Original Paint</p>
                          <p className={`text-xs sm:text-sm ${getSellerPreferences(selectedInquiry).originalPaint ? 'text-green-600' : 'text-red-600'}`}>
                            {getSellerPreferences(selectedInquiry).originalPaint ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {selectedInquiry.description && (
                    <div className="bg-gray-50 rounded-2xl p-3 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                        <FaFileAlt className="mr-2 text-blue-600" />
                        Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-white p-2 sm:p-4 rounded-xl border border-gray-200 text-sm sm:text-base">
                        {selectedInquiry.description}
                      </p>
                    </div>
                  )}

                  {/* Admin Section */}
                  <div className="bg-gray-50 rounded-2xl p-3 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaCog className="mr-2 text-gray-600" />
                        Admin Information
                      </span>
                      <button
                        onClick={() => toggleSection('admin')}
                        className="text-gray-400 cursor-pointer border border-transparent hover:border-black hover:border-2  hover:text-gray-600"
                      >
                        {expandedSections.admin ? <FaCaretUp /> : <FaCaretDown />}
                      </button>
                    </h3>
                    {expandedSections.admin && (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                          <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Current Status</label>
                            {getStatusBadge(selectedInquiry)}
                          </div>
                          <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Last Reviewed</label>
                            <p className="text-sm sm:text-lg text-gray-900">{formatDate(getReviewedAt(selectedInquiry))}</p>
                          </div>
                          <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Reviewed By</label>
                            <p className="text-sm sm:text-lg text-gray-900">{getReviewedBy(selectedInquiry) || 'Not reviewed'}</p>
                          </div>
                          <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Reference ID</label>
                            <p className="text-sm sm:text-lg font-mono text-gray-900 break-all">{selectedInquiry.reference}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows="3"
                            className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="Add admin notes here..."
                          />
                        </div>

                        {getCarStatus(selectedInquiry) === 'rejected' && getRejectionReason(selectedInquiry) && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-2 sm:p-4">
                            <label className="block text-xs sm:text-sm font-medium text-red-700 mb-1">Rejection Reason</label>
                            <p className="text-red-700 text-sm sm:text-base break-words">{getRejectionReason(selectedInquiry)}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ✅ UPDATED: Action Buttons with simplified workflow */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-8 mt-4 sm:mt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
  onClick={() => setShowDetailModal(false)}
  className="
    px-3 sm:px-6 py-2 sm:py-3 
    border-2 border-gray-300 rounded-2xl 
    text-gray-700 font-semibold text-sm sm:text-base 
    cursor-pointer 
    hover:border-black hover:bg-gray-50 
    transition duration-200
  "
>
  Close
</button>

                  <button
                    onClick={() => handleEdit(selectedInquiry)}
                    className="px-3 sm:px-6 py-2 sm:py-3 cursor-pointer border border-transparent hover:border-black hover:border-2  bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition duration-200 font-semibold flex items-center space-x-2 justify-center text-sm sm:text-base"
                  >
                    <FaEdit />
                    <span>Edit Listing</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {/* Rejected State - Only Restore option */}
                  {getCarStatus(selectedInquiry) === 'rejected' && (
                    <button
                      onClick={() => handleRestoreFromRejected(selectedInquiry)}
                      className="px-3 cursor-pointer border border-transparent hover:border-black hover:border-2 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition duration-200 font-semibold flex items-center space-x-2 justify-center text-sm sm:text-base"
                    >
                      <FaUndo />
                      <span>Restore to Pending</span>
                    </button>
                  )}
                  
                  {/* Published State - No action buttons (as requested) */}
                  
                  {/* Approved State - No action buttons (as requested) */}

                  {/* Pending State - Approve OR Reject */}
                  {getCarStatus(selectedInquiry) === 'pending' && (
                    <>
                      <button
                        onClick={() => handleReject(selectedInquiry)}
                        className="px-3 cursor-pointer border border-transparent hover:border-black hover:border-2  sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition duration-200 font-semibold flex items-center space-x-2 justify-center text-sm sm:text-base"
                      >
                        <FaTimes />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApprove(selectedInquiry)}
                        className="px-3 cursor-pointer border border-transparent hover:border-black hover:border-2  sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition duration-200 font-semibold flex items-center space-x-2 justify-center text-sm sm:text-base"
                      >
                        <FaCheck />
                        <span>Approve & Publish</span>
                      </button>
                    </>
                  )}

                  {/* Delete button - always available */}
                  <button
                    onClick={() => handleDelete(selectedInquiry)}
                    className="px-3 sm:px-6 py-2  cursor-pointer border border-transparent hover:border-black hover:border-2 sm:py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition duration-200 font-semibold flex items-center space-x-2 justify-center text-sm sm:text-base"
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

      {/* Edit Modal */}
      {showEditModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Car Listing</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 cursor-pointer border border-transparent hover:border-black hover:border-2  hover:bg-gray-100 rounded-lg transition duration-200"
                >
                  <FaTimes className="text-base sm:text-lg text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Car Name</label>
                  <input
                    type="text"
                    value={editingData.carName}
                    onChange={(e) => setEditingData({...editingData, carName: e.target.value})}
                    className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={editingData.price}
                      onChange={(e) => setEditingData({...editingData, price: parseFloat(e.target.value)})}
                      className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      value={editingData.year}
                      onChange={(e) => setEditingData({...editingData, year: parseInt(e.target.value)})}
                      className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                    <input
                      type="number"
                      value={editingData.mileage}
                      onChange={(e) => setEditingData({...editingData, mileage: parseInt(e.target.value)})}
                      className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editingData.location}
                      onChange={(e) => setEditingData({...editingData, location: e.target.value})}
                      className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingData.description}
                    onChange={(e) => setEditingData({...editingData, description: e.target.value})}
                    rows="3"
                    className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 cursor-pointer border  hover:border-black hover:border-2 sm:px-6 py-2 sm:py-3  border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-medium text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmEdit}
                    className="px-4 sm:px-6 py-2 cursor-pointer border border-transparent hover:border-black hover:border-2  sm:py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition duration-200 font-medium text-sm sm:text-base"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-green-100 mb-3 sm:mb-4">
                <FaCheck className="h-5 sm:h-6 w-5 sm:w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Approve & Publish Car Listing</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to approve <strong>"{selectedInquiry.carName}"</strong>?
                This will publish it to the marketplace immediately.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 sm:px-6 py-2 sm:py-3  cursor-pointer border  hover:border-black hover:border-2  border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApprove}
                  className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer border border-transparent hover:border-black hover:border-2  bg-green-600 text-white rounded-2xl hover:bg-green-700 transition duration-200 font-medium text-sm sm:text-base"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-red-100 mb-3 sm:mb-4">
                <FaTimes className="h-5 sm:h-6 w-5 sm:w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Car Listing</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Are you sure you want to reject <strong>"{selectedInquiry.carName}"</strong>?
              </p>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Reason for rejection (required)"
                rows="3"
                className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 sm:mb-6 text-sm sm:text-base"
                required
              />
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 sm:px-6 py-2 sm:py-3 border cursor-pointer  hover:border-black hover:border-2  border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer border border-transparent hover:border-black hover:border-2  bg-red-600 text-white rounded-2xl hover:bg-red-700 transition duration-200 font-medium text-sm sm:text-base"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-red-100 mb-3 sm:mb-4">
                <FaTrash className="h-5 sm:h-6 w-5 sm:w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Car Listing</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to delete <strong>"{selectedInquiry.carName}"</strong>? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4  cursor-pointer  hover:border-black hover:border-2  sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer border border-transparent hover:border-black hover:border-2  bg-red-600 text-white rounded-2xl hover:bg-red-700 transition duration-200 font-medium text-sm sm:text-base"
                >
                  Delete Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-2 sm:p-4 z-[60]">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 sm:top-4  right-2 sm:right-4 text-white text-lg sm:text-2xl p-2 sm:p-3 hover:text-gray-300 transition duration-200 z-10 bg-black bg-opacity-50 rounded-full"
            >
              <FaTimes />
            </button>
            
            {/* Navigation Arrows */}
            {selectedInquiry?.files && selectedInquiry.files.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 sm:p-4 rounded-full hover:bg-opacity-70 transition duration-200 z-10"
                >
                  <FaArrowLeft className="text-base sm:text-xl" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 sm:p-4 rounded-full hover:bg-opacity-70 transition duration-200 z-10"
                >
                  <FaArrowRight className="text-base sm:text-xl" />
                </button>
                                
                {/* Image Counter */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-sm sm:text-lg z-10">
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
    </div>
  )
}