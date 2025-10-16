// components/inquiries/CarInquiries.js
"use client"

import { useState, useEffect } from 'react'
import { 
  FaCar, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaSearch,
  FaEye,
  FaMapMarkerAlt,
  FaCalendar,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaClock,
  FaCog,
  FaGasPump,
  FaTachometerAlt,
  FaMoneyBillWave,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaImage,
  FaList
} from 'react-icons/fa'

const mockSellInquiries = [
  {
    id: 1,
    reference: "CAR001",
    carName: "Toyota RAV4 2021",
    year: "2021",
    price: "2,300,000",
    location: "Nairobi",
    carType: "SUV",
    mileage: "45,000 km",
    transmission: "Automatic",
    fuelType: "Petrol",
    features: ["Air Conditioning", "Leather Seats", "Sunroof", "Backup Camera", "Bluetooth", "Climate Control"],
    description: "Well maintained Toyota RAV4 with full service history. Perfect family SUV with low mileage. One owner, accident-free with comprehensive service records. Always serviced at Toyota Kenya.",
    sellerName: "John Kamau",
    sellerPhone: "+254712345678",
    sellerEmail: "john.kamau@example.com",
    images: [
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=350&fit=crop",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&h=350&fit=crop"
    ],
    status: "pending",
    submittedAt: "2024-01-20T10:30:00Z",
    approvedAt: null,
    reviewedBy: null,
    notes: "",
    priority: "medium"
  },
  {
    id: 2,
    reference: "CAR002",
    carName: "Honda Civic 2020",
    year: "2020",
    price: "1,800,000",
    location: "Nakuru",
    carType: "Sedan",
    mileage: "60,000 km",
    transmission: "Automatic",
    fuelType: "Petrol",
    features: ["Push Start", "Touchscreen", "Climate Control", "Keyless Entry", "Rear Camera"],
    description: "Sleek Honda Civic with excellent fuel economy. One owner, accident-free. Perfect for city driving with low maintenance costs. Recently serviced with new tires.",
    sellerName: "Jane Wanjiku",
    sellerPhone: "+254723456789",
    sellerEmail: "jane.wanjiku@example.com",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=350&fit=crop"
    ],
    status: "approved",
    submittedAt: "2024-01-18T14:20:00Z",
    approvedAt: "2024-01-19T09:15:00Z",
    reviewedBy: "Admin User",
    notes: "Good condition, well priced. Photos are clear and complete.",
    priority: "medium"
  }
]

export default function CarInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectNotes, setRejectNotes] = useState('')
  const [notes, setNotes] = useState('')
  const inquiriesPerPage = 8

  useEffect(() => {
    setInquiries(mockSellInquiries)
  }, [])

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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

  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry)
    setNotes(inquiry.notes || '')
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

  const confirmApprove = () => {
    if (selectedInquiry) {
      setInquiries(inquiries.map(inq => 
        inq.id === selectedInquiry.id 
          ? { 
              ...inq, 
              status: 'approved',
              approvedAt: new Date().toISOString(),
              reviewedBy: 'Current Admin',
              notes: notes
            }
          : inq
      ))
      setShowApproveModal(false)
      setShowDetailModal(false)
    }
  }

  const confirmReject = () => {
    if (selectedInquiry) {
      setInquiries(inquiries.map(inq => 
        inq.id === selectedInquiry.id 
          ? { 
              ...inq, 
              status: 'rejected',
              reviewedBy: 'Current Admin',
              notes: rejectNotes
            }
          : inq
      ))
      setShowRejectModal(false)
      setShowDetailModal(false)
    }
  }

  const handlePublish = (inquiry) => {
    setInquiries(inquiries.map(inq => 
      inq.id === inquiry.id 
        ? { ...inq, status: 'published' }
        : inq
    ))
  }

  const handleDelete = (inquiry) => {
    if (confirm(`Are you sure you want to delete inquiry ${inquiry.reference}?`)) {
      setInquiries(inquiries.filter(inq => inq.id !== inquiry.id))
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
      approved: { color: 'bg-green-100 text-green-800', icon: FaCheck },
      published: { color: 'bg-blue-100 text-blue-800', icon: FaStar },
      rejected: { color: 'bg-red-100 text-red-800', icon: FaTimes }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        <IconComponent className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { color: 'bg-gray-100 text-gray-800', label: 'Low' },
      medium: { color: 'bg-blue-100 text-blue-800', label: 'Medium' },
      high: { color: 'bg-red-100 text-red-800', label: 'High' }
    }
    
    const config = priorityConfig[priority] || priorityConfig.medium
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    )
  }

  // Statistics
  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    approved: inquiries.filter(i => i.status === 'approved').length,
    published: inquiries.filter(i => i.status === 'published').length,
    rejected: inquiries.filter(i => i.status === 'rejected').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Car Sell Inquiries</h1>
          <p className="text-xl text-gray-600">Manage car listings from individual sellers</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaList className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <FaCheck className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-blue-600">{stats.published}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaStar className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <FaTimes className="text-red-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by car name, seller name, reference, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
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
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
                          <img 
                            src={inquiry.images[0]} 
                            alt={inquiry.carName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-900">{inquiry.carName}</div>
                          <div className="text-lg font-bold text-blue-600">KSh {inquiry.price}</div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <FaMapMarkerAlt className="text-gray-400" />
                            <span>{inquiry.location}</span>
                            <span>•</span>
                            <span>{inquiry.year}</span>
                            <span>•</span>
                            <span>{inquiry.mileage}</span>
                          </div>
                          <div className="mt-1">
                            {getPriorityBadge(inquiry.priority)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="font-semibold">{inquiry.sellerName}</div>
                        <div className="text-gray-600">{inquiry.sellerEmail}</div>
                        <div className="text-gray-600">{inquiry.sellerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        {getStatusBadge(inquiry.status)}
                        <div className="text-xs text-gray-500">
                          Ref: {inquiry.reference}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(inquiry.submittedAt).toLocaleDateString()}
                      <div className="text-xs text-gray-500">
                        {new Date(inquiry.submittedAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(inquiry)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition duration-200"
                          title="View Details"
                        >
                          <FaEye className="text-lg" />
                        </button>
                        
                        {inquiry.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(inquiry)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition duration-200"
                              title="Approve"
                            >
                              <FaCheck className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleReject(inquiry)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition duration-200"
                              title="Reject"
                            >
                              <FaTimes className="text-lg" />
                            </button>
                          </>
                        )}
                        
                        {inquiry.status === 'approved' && (
                          <button
                            onClick={() => handlePublish(inquiry)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition duration-200"
                            title="Publish"
                          >
                            <FaStar className="text-lg" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(inquiry)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition duration-200"
                          title="Delete"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentInquiries.length === 0 && (
            <div className="text-center py-16">
              <FaCar className="text-8xl text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No inquiries found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>

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
              Page {currentPage} of {totalPages} • {filteredInquiries.length} inquiries
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

      {/* Detail Modal */}
      {showDetailModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Inquiry Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition duration-200"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Car Images */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaImage />
                    Car Photos
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedInquiry.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedInquiry.carName} - ${index + 1}`}
                        className="w-full h-48 object-cover rounded-2xl"
                      />
                    ))}
                  </div>
                </div>

                {/* Car Details */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCar />
                    Car Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Car Name</label>
                      <p className="text-lg font-semibold text-gray-900">{selectedInquiry.carName}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <p className="text-lg font-bold text-blue-600">KSh {selectedInquiry.price}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Year</label>
                        <p className="text-lg text-gray-900">{selectedInquiry.year}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <p className="text-lg text-gray-900 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          {selectedInquiry.location}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mileage</label>
                        <p className="text-lg text-gray-900 flex items-center gap-2">
                          <FaTachometerAlt className="text-gray-400" />
                          {selectedInquiry.mileage}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Transmission</label>
                        <p className="text-lg text-gray-900">{selectedInquiry.transmission}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                        <p className="text-lg text-gray-900 flex items-center gap-2">
                          <FaGasPump className="text-gray-400" />
                          {selectedInquiry.fuelType}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seller Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUser />
                    Seller Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-lg text-gray-900">{selectedInquiry.sellerName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-lg text-gray-900 flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        {selectedInquiry.sellerEmail}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-lg text-gray-900 flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        {selectedInquiry.sellerPhone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description & Features */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedInquiry.description}</p>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Features</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedInquiry.features.map((feature, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Admin Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="3"
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes about this inquiry..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-semibold"
                >
                  Close
                </button>
                {selectedInquiry.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleReject(selectedInquiry)}
                      className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition duration-200 font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedInquiry)}
                      className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition duration-200 font-semibold"
                    >
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <FaCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Approve Car Listing</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to approve <strong>"{selectedInquiry.carName}"</strong>? This will make it ready for publishing.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApprove}
                  className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition duration-200 font-medium"
                >
                  Approve Listing
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
                placeholder="Reason for rejection (optional)"
                rows="3"
                className="w-full p-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
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
    </div>
  )
}