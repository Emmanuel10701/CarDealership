"use client"

import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Modern Spinner Component
function ModernSpinner({ size = 24 }) {
  return (
    <div className="flex items-center justify-center">
      <div 
        className="animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
        style={{ width: size, height: size }}
      ></div>
    </div>
  )
}

// Subscriber Card Component
function SubscriberCard({ subscriber, onDelete, actionLoading }) {
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'
  }

  const getSourceBadge = (source) => {
    const styles = {
      website: 'bg-blue-500/20 text-blue-600',
      contact_form: 'bg-emerald-500/20 text-emerald-600',
      referral: 'bg-purple-500/20 text-purple-600',
      social_media: 'bg-pink-500/20 text-pink-600'
    }
    return styles[source] || 'bg-gray-500/20 text-gray-600'
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                {getInitials(subscriber.name)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full shadow-lg ${
                subscriber.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                {subscriber.name || 'Unknown Subscriber'}
              </h3>
              <p className="text-blue-600 font-medium text-sm">{subscriber.email}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            subscriber.status === 'active' 
              ? 'bg-emerald-500/20 text-emerald-700' 
              : 'bg-gray-500/20 text-gray-700'
          }`}>
            {subscriber.status}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-sm text-gray-600 font-medium">
            {subscriber.phone || 'No phone provided'}
          </div>
          {subscriber.location && (
            <div className="text-sm text-gray-600 font-medium">
              📍 {subscriber.location}
            </div>
          )}
        </div>

        {/* Source and Date */}
        <div className="flex justify-between items-center mb-4">
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSourceBadge(subscriber.source)} backdrop-blur-sm`}>
            {subscriber.source?.replace('_', ' ') || 'unknown'}
          </span>
          <div className="text-xs text-gray-500 font-medium">
            {new Date(subscriber.subscribedAt).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button 
            onClick={() => onDelete(subscriber.id)}
            disabled={actionLoading}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50 text-sm font-medium hover:scale-105"
          >
            {actionLoading ? <ModernSpinner size={16} /> : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Email Template Card Component
function EmailTemplateCard({ template, isSelected, onClick }) {
  const Icon = template.icon
  const getCategoryColor = (category) => {
    const colors = {
      promotions: 'from-orange-500 to-red-500',
      updates: 'from-blue-500 to-purple-500',
      custom: 'from-gray-500 to-gray-600'
    }
    return colors[category] || 'from-blue-500 to-purple-500'
  }

  return (
    <div 
      onClick={onClick}
      className={`bg-white/80 backdrop-blur-lg rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        isSelected 
          ? 'border-blue-500 bg-blue-50/50' 
          : 'border-white/20 hover:border-blue-300'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${getCategoryColor(template.category)}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
          <p className="text-xs text-gray-600 mt-1 truncate">{template.subject}</p>
        </div>
        {isSelected && (
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        )}
      </div>
    </div>
  )
}

// Email Modal Component
function EmailModal({ onClose, onSend, loading, subscribersCount }) {
  const [emailData, setEmailData] = useState({
    template: '',
    subject: '',
    message: '',
    emailType: 'new_listings'
  })

  const emailTemplates = [
    {
      id: 'new_listings',
      name: 'New Car Listings',
      icon: FaCar,
      subject: '🚗 New Cars Available - Find Your Perfect Match!',
      category: 'promotions'
    },
    {
      id: 'monthly_promotions',
      name: 'Monthly Promotions',
      icon: FaTag,
      subject: '🎁 Exclusive Monthly Deals Just For You!',
      category: 'promotions'
    },
    {
      id: 'newsletter',
      name: 'Monthly Newsletter',
      icon: FaRocket,
      subject: '📰 AutoDealer Monthly Newsletter',
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

  const handleTemplateSelect = (templateId) => {
    const template = emailTemplates.find(t => t.id === templateId)
    if (template) {
      setEmailData({
        ...emailData,
        template: templateId,
        subject: template.subject,
        emailType: templateId
      })
    }
  }

  const handleSend = async () => {
    if (!emailData.subject || !emailData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await onSend(emailData)
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl border border-white/20">
        <div className="p-6 border-b border-gray-200/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Send Email to Subscribers</h2>
              <p className="text-gray-600 mt-1">This will be sent to {subscribersCount} subscribers</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Template</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emailTemplates.map((template) => (
                <EmailTemplateCard
                  key={template.id}
                  template={template}
                  isSelected={emailData.template === template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                />
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject *</label>
            <input
              type="text"
              required
              value={emailData.subject}
              onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200"
              placeholder="Enter email subject..."
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Message *</label>
            <textarea
              required
              value={emailData.message}
              onChange={(e) => setEmailData({...emailData, message: e.target.value})}
              rows={8}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200 resize-none"
              placeholder="Write your email content here. You can include HTML formatting..."
            />
          </div>

          {/* Preview Info */}
          <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-blue-700">
              <FaPaperPlane className="w-4 h-4" />
              <span className="text-sm font-medium">This email will be sent to all active subscribers</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 p-6 border-t border-gray-200/30 bg-white/50 rounded-b-3xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 bg-white/50 border border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:bg-white/80 transition-all duration-200 font-semibold backdrop-blur-sm disabled:opacity-50 shadow-lg hover:shadow-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <ModernSpinner size={20} />
                Sending...
              </>
            ) : (
              <>
                <FaPaperPlane className="w-4 h-4" />
                Send to All Subscribers
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, color, icon: Icon }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600'
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

// Icons (you might want to import these from react-icons)
const FaUsers = ({ className }) => <span className={className}>👥</span>
const FaPaperPlane = ({ className }) => <span className={className}>✉️</span>
const FaCar = ({ className }) => <span className={className}>🚗</span>
const FaTag = ({ className }) => <span className={className}>🏷️</span>
const FaRocket = ({ className }) => <span className={className}>🚀</span>
const FaCog = ({ className }) => <span className={className}>⚙️</span>
const FaSearch = ({ className }) => <span className={className}>🔍</span>
const FaTrash = ({ className }) => <span className={className}>🗑️</span>

// Main Subscribers Management Component
export default function SubscribersManagement() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // API Service for Subscribers
  const subscribersApiService = {
    async getSubscribers() {
      const response = await fetch('/api/subscriber')
      if (!response.ok) throw new Error('Failed to fetch subscribers')
      const data = await response.json()
      return data.subscribers || []
    },

    async deleteSubscriber(id) {
      const response = await fetch(`/api/subscriber/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete subscriber')
      }
      return await response.json()
    },

    async sendBulkEmail(emailData) {
      const response = await fetch('/api/sendmail/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send emails')
      }
      return await response.json()
    }
  }

  useEffect(() => {
    loadSubscribers()
  }, [])

  const loadSubscribers = async () => {
    try {
      setLoading(true)
      const subscribersData = await subscribersApiService.getSubscribers()
      setSubscribers(subscribersData)
      toast.success('Subscribers loaded successfully!')
    } catch (err) {
      toast.error('Failed to load subscribers!')
      console.error('Error loading subscribers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSubscriber = async (id) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return

    try {
      setActionLoading(true)
      await subscribersApiService.deleteSubscriber(id)
      setSubscribers(prev => prev.filter(sub => sub.id !== id))
      toast.success('Subscriber removed successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to remove subscriber!')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSendEmail = async (emailData) => {
    try {
      setActionLoading(true)
      await subscribersApiService.sendBulkEmail(emailData)
      setShowEmailModal(false)
      toast.success('Email sent to all subscribers successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to send email!')
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  // Filter subscribers
  const filteredSubscribers = subscribers.filter(subscriber =>
    (subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.phone?.includes(searchTerm)) &&
    subscriber.status === 'active' // Only show active subscribers
  )

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSubscribers = filteredSubscribers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage)

  const activeSubscribers = subscribers.filter(sub => sub.status === 'active').length
  const totalSubscribers = subscribers.length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <ModernSpinner size={60} />
          <span className="text-xl text-gray-600 mt-4 block">Loading subscribers...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscribers Management</h1>
            <p className="text-gray-600">Manage your email subscribers and send promotional emails</p>
          </div>
          <button
            onClick={() => setShowEmailModal(true)}
            disabled={activeSubscribers === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaPaperPlane className="w-5 h-5" />
            Send Email to All
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Subscribers" 
          value={totalSubscribers} 
          color="blue" 
          icon={FaUsers}
        />
        <StatCard 
          title="Active Subscribers" 
          value={activeSubscribers} 
          color="green" 
          icon={FaPaperPlane}
        />
        <StatCard 
          title="Ready for Emails" 
          value={activeSubscribers} 
          color="purple" 
          icon={FaCar}
        />
      </div>

      {/* Search and Controls */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FaSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search subscribers by name, email, phone, or location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base backdrop-blur-sm transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={loadSubscribers}
              className="px-6 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Subscribers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {currentSubscribers.map((subscriber) => (
          <SubscriberCard
            key={subscriber.id}
            subscriber={subscriber}
            onDelete={handleDeleteSubscriber}
            actionLoading={actionLoading}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentSubscribers.length === 0 && (
        <div className="text-center py-16 bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaUsers className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? 'No subscribers found' : 'No subscribers yet'}
          </h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search criteria' : 'Subscribers will appear here once they sign up through your website forms'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredSubscribers.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200/30 bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Previous
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <span className="text-sm text-gray-500">
              ({filteredSubscribers.length} subscribers)
            </span>
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          onSend={handleSendEmail}
          loading={actionLoading}
          subscribersCount={activeSubscribers}
        />
      )}
    </div>
  )
}