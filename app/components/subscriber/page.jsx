// components/subscribers/SubscribersManagement.js
"use client"

import { useState, useEffect } from 'react'
import { 
  FaUsers, 
  FaTrash, 
  FaSearch, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCalendar,
  FaCheck,
  FaTimes,
  FaPlus,
  FaPaperPlane,
  FaPhone,
  FaChevronLeft,
  FaChevronRight,
  FaImage,
  FaTimesCircle,
  FaTag,
  FaBell,
  FaCar,
  FaRocket,
  FaUserShield,
  FaCog,
  FaEye
} from 'react-icons/fa'

const mockSubscribers = [
  {
    id: 1,
    email: 'john.doe@example.com',
    name: 'John Doe',
    location: 'Nairobi',
    subscribedAt: '2024-01-15',
    status: 'active',
    phone: '+254712345678',
    source: 'website'
  },
  {
    id: 2,
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    location: 'Nakuru',
    subscribedAt: '2024-01-12',
    status: 'active',
    phone: '+254723456789',
    source: 'contact_form'
  },
  {
    id: 3,
    email: 'mike.wilson@example.com',
    name: 'Mike Wilson',
    location: 'Mombasa',
    subscribedAt: '2024-01-10',
    status: 'inactive',
    phone: '+254734567890',
    source: 'website'
  }
]

const mockAdmins = [
  {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+254712345678',
    role: 'Super Admin',
    status: 'active',
    lastLogin: '2024-01-20 14:30'
  }
]

const emailTemplates = [
  {
    id: 'new_listings',
    name: 'New Listings',
    icon: FaCar,
    subject: 'New Cars Available - Find Your Perfect Match!',
    category: 'promotions'
  },
  {
    id: 'promotions',
    name: 'Special Offers',
    icon: FaTag,
    subject: 'Exclusive Deals Just For You!',
    category: 'promotions'
  },
  {
    id: 'general',
    name: 'General Update',
    icon: FaBell,
    subject: 'Important Update from AutoDealer',
    category: 'updates'
  },
  {
    id: 'newsletter',
    name: 'Monthly Newsletter',
    icon: FaRocket,
    subject: 'AutoDealer Monthly Newsletter',
    category: 'updates'
  },
  {
    id: 'custom',
    name: 'Custom Message',
    icon: FaCog,
    subject: '',
    category: 'custom'
  }
]

export default function SubscribersManagement() {
  const [subscribers, setSubscribers] = useState([])
  const [admins, setAdmins] = useState(mockAdmins)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('subscribers')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [emailData, setEmailData] = useState({
    template: '',
    subject: '',
    message: '',
    attachments: []
  })
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Admin'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  useEffect(() => {
    setSubscribers(mockSubscribers)
  }, [])

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.subscribedAt.includes(searchTerm) ||
    subscriber.phone.includes(searchTerm)
  )

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.phone.includes(searchTerm)
  )

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSubscribers = filteredSubscribers.slice(indexOfFirstItem, indexOfLastItem)
  const currentAdmins = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(
    activeTab === 'subscribers' 
      ? filteredSubscribers.length / itemsPerPage 
      : filteredAdmins.length / itemsPerPage
  )

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

  const handleDeleteSubscriber = (subscriberId) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      setSubscribers(subscribers.filter(sub => sub.id !== subscriberId))
    }
  }

  const handleDeleteAdmin = (adminId) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter(admin => admin.id !== adminId))
    }
  }

  const handleSendEmail = () => {
    setEmailData({
      template: '',
      subject: '',
      message: '',
      attachments: []
    })
    setShowEmailModal(true)
  }

  const handleTemplateChange = (templateId) => {
    const template = emailTemplates.find(t => t.id === templateId)
    if (template) {
      setEmailData({
        ...emailData,
        template: templateId,
        subject: template.subject
      })
    }
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file)
    }))
    
    setEmailData({
      ...emailData,
      attachments: [...emailData.attachments, ...newAttachments]
    })
  }

  const handleRemoveAttachment = (attachmentId) => {
    const attachment = emailData.attachments.find(att => att.id === attachmentId)
    if (attachment?.preview) {
      URL.revokeObjectURL(attachment.preview)
    }
    setEmailData({
      ...emailData,
      attachments: emailData.attachments.filter(att => att.id !== attachmentId)
    })
  }

  const handleSendEmailSubmit = () => {
    console.log('Sending email to all subscribers:', emailData)
    setShowEmailModal(false)
    setEmailData({ template: '', subject: '', message: '', attachments: [] })
  }

  const handleAddAdmin = () => {
    setAdminData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'Admin'
    })
    setShowAdminModal(true)
  }

  const handleAddAdminSubmit = () => {
    const newAdmin = {
      id: admins.length + 1,
      ...adminData,
      status: 'active',
      lastLogin: 'Never'
    }
    setAdmins([...admins, newAdmin])
    setShowAdminModal(false)
    setAdminData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'Admin'
    })
  }

  const getSourceBadge = (source) => {
    const styles = {
      website: 'bg-blue-500/10 text-blue-600 border border-blue-200',
      contact_form: 'bg-green-500/10 text-green-600 border border-green-200',
      referral: 'bg-purple-500/10 text-purple-600 border border-purple-200'
    }
    return styles[source] || 'bg-gray-500/10 text-gray-600 border border-gray-200'
  }

  return (
    <div className="space-y-4 lg:space-y-6 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Modern Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100/50 rounded-2xl p-1 border border-gray-200">
        <button
          onClick={() => {setActiveTab('subscribers'); setCurrentPage(1)}}
          className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex-1 justify-center ${
            activeTab === 'subscribers'
              ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FaUsers className="w-4 h-4" />
          <span className="text-sm sm:text-base">Subscribers ({subscribers.length})</span>
        </button>
        <button
          onClick={() => {setActiveTab('admins'); setCurrentPage(1)}}
          className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex-1 justify-center ${
            activeTab === 'admins'
              ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FaUserShield className="w-4 h-4" />
          <span className="text-sm sm:text-base">Admins ({admins.length})</span>
        </button>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 sm:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
            />
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto mt-3 sm:mt-0">
          {activeTab === 'subscribers' && (
            <button
              onClick={handleSendEmail}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-sm flex-1 sm:flex-none justify-center"
            >
              <FaPaperPlane className="w-4 h-4" />
              <span>Email All</span>
            </button>
          )}
          {activeTab === 'admins' && (
            <button
              onClick={handleAddAdmin}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2.5 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-medium shadow-sm flex-1 sm:flex-none justify-center"
            >
              <FaPlus className="w-4 h-4" />
              <span>Add Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Mobile Card View */}
          <div className="sm:hidden divide-y divide-gray-100">
            {currentSubscribers.map((subscriber) => (
              <div key={subscriber.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{subscriber.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{subscriber.email}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    subscriber.status === 'active' 
                      ? 'bg-green-500/10 text-green-600' 
                      : 'bg-gray-500/10 text-gray-600'
                  }`}>
                    {subscriber.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-2">
                    <FaPhone className="w-3 h-3 text-gray-400" />
                    <span>{subscriber.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                    <span>{subscriber.location}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSourceBadge(subscriber.source)}`}>
                    {subscriber.source.replace('_', ' ')}
                  </span>
                  <button 
                    onClick={() => handleDeleteSubscriber(subscriber.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Subscriber
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider hidden xl:table-cell">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-base font-medium text-gray-900">
                          {subscriber.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                          <FaEnvelope className="w-3 h-3" />
                          <span>{subscriber.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900 flex items-center space-x-2">
                          <FaPhone className="w-3 h-3 text-gray-400" />
                          <span>{subscriber.phone}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                          <span>{subscriber.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSourceBadge(subscriber.source)}`}>
                        {subscriber.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        subscriber.status === 'active' 
                          ? 'bg-green-500/10 text-green-600' 
                          : 'bg-gray-500/10 text-gray-600'
                      }`}>
                        {subscriber.status === 'active' ? <FaCheck className="w-3 h-3 mr-1" /> : <FaTimes className="w-3 h-3 mr-1" />}
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Subscriber"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredSubscribers.length > itemsPerPage && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-white hover:shadow-sm border border-gray-300'
                }`}
              >
                <FaChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <span className="text-sm text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm border border-gray-300'
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {filteredSubscribers.length === 0 && (
            <div className="text-center py-12">
              <FaUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 mb-1">No subscribers found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Admins Tab */}
      {activeTab === 'admins' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Mobile Card View */}
          <div className="sm:hidden divide-y divide-gray-100">
            {currentAdmins.map((admin) => (
              <div key={admin.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{admin.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{admin.email}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600">
                    {admin.role}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-2">
                    <FaPhone className="w-3 h-3 text-gray-400" />
                    <span>{admin.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCalendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs">{admin.lastLogin}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    admin.status === 'active' 
                      ? 'bg-green-500/10 text-green-600' 
                      : 'bg-gray-500/10 text-gray-600'
                  }`}>
                    {admin.status}
                  </span>
                  <button 
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider hidden xl:table-cell">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-base font-medium text-gray-900">
                          {admin.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                          <FaEnvelope className="w-3 h-3" />
                          <span>{admin.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-gray-900 flex items-center space-x-2">
                        <FaPhone className="w-3 h-3 text-gray-400" />
                        <span>{admin.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600">
                          {admin.role}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          admin.status === 'active' 
                            ? 'bg-green-500/10 text-green-600' 
                            : 'bg-gray-500/10 text-gray-600'
                        }`}>
                          {admin.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                      {admin.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Admin"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredAdmins.length > itemsPerPage && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-white hover:shadow-sm border border-gray-300'
                }`}
              >
                <FaChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <span className="text-sm text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm border border-gray-300'
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {filteredAdmins.length === 0 && (
            <div className="text-center py-12">
              <FaUserShield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 mb-1">No admins found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search criteria or add a new admin.</p>
            </div>
          )}
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100/50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <FaPaperPlane className="w-5 h-5 text-blue-600" />
                <span>Send Email to All Subscribers</span>
              </h2>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Email Template</label>
                <select
                  value={emailData.template}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                >
                  <option value="">Select a template</option>
                  {emailTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Subject</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  placeholder="Enter email subject"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Message</label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50 resize-none"
                  placeholder="Write your email message here..."
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Attachments</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FaImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Click to upload images</div>
                    <div className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</div>
                  </label>
                </div>

                {/* Selected Files Preview */}
                {emailData.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Files:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {emailData.attachments.map((attachment) => (
                        <div key={attachment.id} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={attachment.preview} 
                            alt={attachment.name}
                            className="w-full h-20 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => handleRemoveAttachment(attachment.id)}
                              className="text-white hover:text-red-300 transition-colors"
                            >
                              <FaTimesCircle className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                            {attachment.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50/50">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmailSubmit}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-sm"
              >
                <FaPaperPlane className="w-4 h-4" />
                <span>Send to All Subscribers</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100/50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <FaPlus className="w-5 h-5 text-green-600" />
                <span>Add New Admin</span>
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {['name', 'email', 'phone', 'password'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {field}
                  </label>
                  <input
                    type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                    value={adminData[field]}
                    onChange={(e) => setAdminData({...adminData, [field]: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={adminData.role}
                  onChange={(e) => setAdminData({...adminData, role: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50/50">
              <button
                onClick={() => setShowAdminModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAdminSubmit}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2 shadow-sm"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}