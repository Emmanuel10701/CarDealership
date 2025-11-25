"use client"

import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Importing React Icons
import { FaUsers, FaPaperPlane, FaCar, FaTag, FaRocket, FaCog, FaSearch, FaMapMarkerAlt, FaPhoneAlt, FaSyncAlt, FaTimes } from 'react-icons/fa'


// --- COMPONENTS ---

// Modern Spinner Component
function ModernSpinner({ size = 24, color = 'text-blue-600' }) {
  return (
    <div className="flex items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${color}`}
        style={{ width: size, height: size }}
      ></div>
    </div>
  )
}

// Subscriber Card Component (DELETE BUTTON REMOVED)
function SubscriberCard({ subscriber }) { // Removed onDelete and actionLoading props
  const getInitials = (name, email) => {
    const text = name || email.split('@')[0];
    return text.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  const getSourceBadge = (source) => {
    const styles = {
      website: 'bg-blue-500/20 text-blue-600',
      contact_form: 'bg-emerald-500/20 text-emerald-600',
      referral: 'bg-purple-500/20 text-purple-600',
      social_media: 'bg-pink-500/20 text-pink-600',
      api_import: 'bg-yellow-500/20 text-yellow-600'
    }
    return styles[source] || 'bg-gray-500/20 text-gray-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:border-blue-200">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-md group-hover:scale-105 transition-transform duration-300">
                {getInitials(subscriber.name, subscriber.email)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full shadow-lg ${
                subscriber.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {subscriber.name}
              </h3>
              <p className="text-blue-600 font-medium text-sm truncate max-w-[200px]">{subscriber.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4 pt-2 border-t border-gray-100">
          <div className="text-sm text-gray-600 flex items-center space-x-2">
            <FaPhoneAlt className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{subscriber.phone || 'No phone provided'}</span>
          </div>
          {subscriber.location && (
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <FaMapMarkerAlt className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{subscriber.location}</span>
            </div>
          )}
        </div>

        {/* Source and Date */}
        <div className="flex justify-between items-center">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceBadge(subscriber.source)}`}>
            {subscriber.source?.replace('_', ' ') || 'unknown'}
          </span>
          <div className="text-xs text-gray-500 font-medium">
            Joined: {new Date(subscriber.subscribedAt).toLocaleDateString()}
          </div>
        </div>
        
        {/* No action buttons section for deleting */}
      </div>
    </div>
  )
}

// Email Modal Component (Kept same)
function EmailModal({ onClose, onSend, loading, subscribersCount }) {
  
  const emailTemplates = [
    { id: 'new_listings', name: 'New Listings', icon: FaCar, subject: 'New Cars Available', category: 'promotions' },
    { id: 'monthly_promotions', name: 'Promotions', icon: FaTag, subject: 'Exclusive Monthly Deals', category: 'promotions' },
    { id: 'newsletter', name: 'Newsletter', icon: FaRocket, subject: 'AutoDealer Monthly News', category: 'updates' },
    { id: 'custom', name: 'Custom', icon: FaCog, subject: '', category: 'custom' }
  ]

  const [emailData, setEmailData] = useState({
    template: 'new_listings',
    subject: emailTemplates[0].subject,
    message: '',
    emailType: 'new_listings'
  })

  useEffect(() => {
    handleTemplateSelect(emailData.template);
  }, []);

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
      toast.error('Subject and message content are required')
      return
    }
    try {
      await onSend(emailData)
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl lg:max-w-3xl border border-gray-100 my-8">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaPaperPlane className="text-blue-600" /> Send Bulk Email
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - MAX HEIGHT AND SCROLLING APPLIED HERE */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* Subscriber Count Alert */}
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm font-medium">
            This email will be sent to **{subscribersCount}** active subscribers.
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">1. Choose Template</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

          {/* Subject and Message Inputs */}
          <div className="space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">2. Email Subject *</label>
              <input
                type="text"
                required
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="Enter a compelling subject line..."
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">3. Email Message (Supports HTML) *</label>
              <textarea
                required
                value={emailData.message}
                onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-y"
                placeholder="Write your email content here..."
              />
            </div>
          </div>
        </div>

        {/* Modal Footer (Action Buttons) */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl sticky bottom-0 z-10">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <ModernSpinner size={20} color='text-white' />
                Sending...
              </>
            ) : (
              <>
                <FaPaperPlane className="w-4 h-4" />
                <span>Send to All</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component (Kept same)
function StatCard({ title, value, color, icon: Icon }) {
  const iconColorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-emerald-600 bg-emerald-100',
    orange: 'text-orange-600 bg-orange-100',
    purple: 'text-purple-600 bg-purple-100'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${iconColorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

// Email Template Card Component (Kept same)
function EmailTemplateCard({ template, isSelected, onClick }) {
  const Icon = template.icon
  const getCategoryColor = (category) => {
    const colors = {
      promotions: 'from-red-500 to-orange-500',
      updates: 'from-blue-500 to-purple-500',
      custom: 'from-gray-500 to-gray-600'
    }
    return colors[category] || 'from-blue-500 to-purple-500'
  }

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg border-2 p-3 cursor-pointer transition-all duration-300 hover:shadow-md ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryColor(template.category)} flex-shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{template.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{template.subject || 'Custom message'}</p>
        </div>
      </div>
    </div>
  )
}

// Main Subscribers Management Component
export default function SubscribersManagement() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // --- API SERVICE (DELETE SUBSCRIBER REMOVED) ---
  const subscribersApiService = {
    async getSubscribers() {
      const response = await fetch('/api/subscriber')
      if (!response.ok) throw new Error('Failed to fetch subscribers')
      const data = await response.json()
      
      const rawSubscribers = data.subscribers || [];

      return rawSubscribers.map(sub => ({
        id: sub.id,
        email: sub.email,
        name: sub.name || sub.email.split('@')[0].replace(/[._]/g, ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        subscribedAt: sub.createdAt, 
        status: sub.status || 'active', 
        phone: sub.phone || 'N/A', 
        location: sub.location || 'Unknown',
        source: sub.source || 'api_import',
      }));
    },
    
    // DELETE SUBSCRIBER LOGIC REMOVED
    
    async sendBulkEmail(emailData) {
      const response = await fetch('/api/sendmail', {
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
  // --- END API SERVICE ---


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

  // DELETE HANDLER REMOVED (handleDeleteSubscriber)
  
  const handleSendEmail = async (emailData) => {
    try {
      setActionLoading(true)
      await subscribersApiService.sendBulkEmail(emailData)
      setShowEmailModal(false)
      toast.success('Email send initiated successfully! Check console for detailed stats.')
    } catch (err) {
      toast.error(err.message || 'Failed to send email!')
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const filteredSubscribers = subscribers.filter(subscriber =>
    (subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.phone?.includes(searchTerm)) &&
    subscriber.status === 'active' 
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSubscribers = filteredSubscribers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage)

  const activeSubscribers = subscribers.filter(sub => sub.status === 'active').length
  const totalSubscribers = subscribers.length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ModernSpinner size={60} />
          <span className="text-xl text-gray-600 mt-4 block">Loading subscriber dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Subscriber Dashboard</h1>
            <p className="text-gray-500">View and manage all active email subscribers.</p>
          </div>
          <button
            onClick={() => setShowEmailModal(true)}
            disabled={activeSubscribers === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
          >
            <FaPaperPlane className="w-5 h-5" />
            Send Bulk Email
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
          title="Avg. Open Rate" 
          value="45.2%" 
          color="purple" 
          icon={FaRocket}
        />
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <FaSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, phone, or location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200"
              />
            </div>
          </div>
          
          <button
            onClick={loadSubscribers}
            className="px-5 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-semibold shadow-md flex items-center gap-2 flex-shrink-0"
          >
            <FaSyncAlt className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Subscribers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {currentSubscribers.map((subscriber) => (
          <SubscriberCard
            key={subscriber.id}
            subscriber={subscriber}
            // onDelete and actionLoading props are no longer passed
          />
        ))}
      </div>

      {/* Empty State */}
      {currentSubscribers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUsers className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {searchTerm ? 'No subscribers found' : 'No active subscribers to display'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm ? 'Try clearing your search or checking for inactive accounts.' : 'Subscribers will appear here once they are added via the API or website forms.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredSubscribers.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 bg-white rounded-xl shadow-lg gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold disabled:opacity-50`}
          >
            &larr; Previous
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Page **{currentPage}** of **{totalPages}**
            </span>
            <span className="text-sm text-gray-500">
              ({filteredSubscribers.length} total active)
            </span>
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold disabled:opacity-50`}
          >
            Next &rarr;
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