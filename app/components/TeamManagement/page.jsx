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

// User Detail Modal Component
function UserDetailModal({ user, onClose, onEdit, onDelete, onStatusUpdate, loading }) {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getPermissionBadges = () => {
    const badges = []
    if (user.canManageListings) {
      badges.push(<span key="manage" className="bg-blue-500/20 text-blue-600 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Manage Listings</span>)
    }
    if (user.canApproveListings) {
      badges.push(<span key="approve" className="bg-emerald-500/20 text-emerald-600 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Approve Listings</span>)
    }
    if (user.canManageWebsite) {
      badges.push(<span key="website" className="bg-purple-500/20 text-purple-600 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Manage Website</span>)
    }
    return badges
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/30">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 cursor-pointer border border-transparent hover:border-black hover:border-2  rounded-xl transition-all duration-200 hover:scale-110"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {getInitials(user.name)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white rounded-full shadow-lg ${
                user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-blue-600 font-medium capitalize">{user.role.toLowerCase()}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                user.status === 'ACTIVE' 
                  ? 'bg-emerald-500/20 text-emerald-700' 
                  : 'bg-gray-500/20 text-gray-700'
              }`}>
                {user.status.toLowerCase()}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Email</label>
              <p className="text-gray-900 text-lg font-medium">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Phone</label>
                <p className="text-gray-900 text-lg font-medium">{user.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Joined</label>
              <p className="text-gray-900 text-lg font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-3">Permissions</label>
            <div className="flex flex-wrap gap-2">
              {getPermissionBadges()}
              {getPermissionBadges().length === 0 && (
                <span className="text-gray-400 text-sm">No permissions assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200/30 bg-white/50 rounded-b-3xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onEdit(user)}
              disabled={loading}
              className="flex-1 px-4 py-3 cursor-pointer border border-transparent hover:border-black hover:border-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {loading ? <ModernSpinner size={20} /> : 'Edit User'}
            </button>
            <button
              onClick={() => onStatusUpdate({ 
                user, 
                newStatus: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' 
              })}
              disabled={loading}
              className="flex-1 px-4 py-3 cursor-pointer border border-transparent hover:border-black hover:border-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {loading ? <ModernSpinner size={20} /> : user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => onDelete(user)}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-red-600cursor-pointer border border-transparent hover:border-black hover:border-2  text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {loading ? <ModernSpinner size={20} /> : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Team Member Card Component
function TeamMemberCard({ member, onCardClick }) {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getPermissionBadges = () => {
    const badges = []
    if (member.canManageListings) badges.push({ text: "Listings", color: "bg-blue-500/20 text-blue-600" })
    if (member.canApproveListings) badges.push({ text: "Approve", color: "bg-emerald-500/20 text-emerald-600" })
    if (member.canManageWebsite) badges.push({ text: "Website", color: "bg-purple-500/20 text-purple-600" })
    return badges
  }

  const getRoleColor = (role) => {
    switch(role) {
      case 'ADMIN': return 'from-red-500 to-pink-600'
      case 'MANAGER': return 'from-orange-500 to-red-600'
      default: return 'from-blue-500 to-purple-600'
    }
  }

  return (
    <div 
      onClick={() => onCardClick(member)}
      className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-105"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className={`w-14 h-14 bg-gradient-to-br ${getRoleColor(member.role)} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {getInitials(member.name)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full shadow-lg ${
                member.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                {member.name}
              </h3>
              <p className={`text-sm font-medium capitalize ${
                member.role === 'ADMIN' ? 'text-red-600' :
                member.role === 'MANAGER' ? 'text-orange-600' : 'text-blue-600'
              }`}>
                {member.role.toLowerCase()}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            member.status === 'ACTIVE' 
              ? 'bg-emerald-500/20 text-emerald-700' 
              : 'bg-gray-500/20 text-gray-700'
          }`}>
            {member.status.toLowerCase()}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-sm text-gray-600 font-medium truncate">
            {member.email}
          </div>
          {member.phone && (
            <div className="text-sm text-gray-600 font-medium">
              {member.phone}
            </div>
          )}
        </div>

        {/* Permissions */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {getPermissionBadges().slice(0, 2).map((badge, index) => (
              <span key={index} className={`${badge.color} px-2 py-1 rounded text-xs font-medium backdrop-blur-sm`}>
                {badge.text}
              </span>
            ))}
            {getPermissionBadges().length > 2 && (
              <span className="bg-gray-500/20 text-gray-600 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                +{getPermissionBadges().length - 2}
              </span>
            )}
            {getPermissionBadges().length === 0 && (
              <span className="text-gray-400 text-xs">No permissions</span>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Joined {new Date(member.joinDate).toLocaleDateString()}
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-t border-white/20">
        <div className="text-center">
          <span className="text-blue-600 text-sm font-semibold">View Details →</span>
        </div>
      </div>
    </div>
  )
}

// Team Member Modal Component
function TeamMemberModal({ onClose, onSave, member, loading }) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    role: member?.role || 'USER',
    status: member?.status || 'ACTIVE',
    canManageListings: member?.canManageListings || false,
    canApproveListings: member?.canApproveListings || false,
    canManageWebsite: member?.canManageWebsite || false,
    password: ''
  })

  const roles = [
    { value: 'USER', label: 'User' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'ADMIN', label: 'Admin' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const memberData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        canManageListings: formData.canManageListings,
        canApproveListings: formData.canApproveListings,
        canManageWebsite: formData.canManageWebsite,
        ...(formData.password && { password: formData.password })
      }
      await onSave(memberData)
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20">
        <div className="p-6 border-b border-gray-200/30">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {member ? 'Edit Team Member' : 'Add New Team Member'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 cursor-pointer border border-transparent hover:border-black hover:border-2 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200"
                placeholder="Enter full name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200"
                placeholder="Enter email address..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200"
                placeholder="Enter phone number..."
              />
            </div>

            {!member && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  required={!member}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter password..."
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Permissions
            </label>
            <div className="space-y-3 bg-white/50 p-4 rounded-2xl backdrop-blur-sm border border-gray-200/30">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="manage-listings"
                  checked={formData.canManageListings}
                  onChange={(e) => setFormData(prev => ({ ...prev, canManageListings: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="manage-listings" className="text-sm font-medium text-gray-700">
                  Can manage car listings
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="approve-listings"
                  checked={formData.canApproveListings}
                  onChange={(e) => setFormData(prev => ({ ...prev, canApproveListings: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="approve-listings" className="text-sm font-medium text-gray-700">
                  Can approve listings
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="manage-website"
                  checked={formData.canManageWebsite}
                  onChange={(e) => setFormData(prev => ({ ...prev, canManageWebsite: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="manage-website" className="text-sm font-medium text-gray-700">
                  Can manage website content
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200/30">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 cursor-pointer  bg-white/50 border border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:bg-white/80 transition-all duration-200 font-semibold backdrop-blur-sm disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <ModernSpinner size={20} />
                  {member ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                member ? 'Update Member' : 'Create Member'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    yellow: 'from-amber-500 to-amber-600',
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
          <div className="w-6 h-6 bg-white rounded opacity-80"></div>
        </div>
      </div>
    </div>
  )
}

// Main Team Management Component
export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [membersPerPage] = useState(8)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [statusUpdate, setStatusUpdate] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // API Service for Team Management
  const teamApiService = {
    async getTeamMembers() {
      const response = await fetch('/api/register')
      if (!response.ok) throw new Error('Failed to fetch team members')
      const data = await response.json()
      return data.members || []
    },

    async createTeamMember(memberData) {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create team member')
      }
      return await response.json()
    },

    async updateTeamMember(id, memberData) {
      const response = await fetch(`/api/register/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update team member')
      }
      return await response.json()
    },

    async deleteTeamMember(id) {
      const response = await fetch(`/api/register/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete team member')
      }
      return await response.json()
    }
  }

  useEffect(() => {
    loadTeamMembers()
  }, [])

  const loadTeamMembers = async () => {
    try {
      setLoading(true)
      const members = await teamApiService.getTeamMembers()
      setTeamMembers(members)
      toast.success('Team members loaded successfully!')
    } catch (err) {
      toast.error('Failed to load team members!')
      console.error('Error loading team members:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMember = async (memberData) => {
    try {
      setActionLoading(true)
      const result = await teamApiService.createTeamMember(memberData)
      setTeamMembers(prev => [result.member, ...prev])
      setShowCreateModal(false)
      toast.success('Team member created successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to create team member!')
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateMember = async (id, memberData) => {
    try {
      setActionLoading(true)
      const result = await teamApiService.updateTeamMember(id, memberData)
      setTeamMembers(prev => prev.map(member => member.id === id ? result.member : member))
      setEditingMember(null)
      setSelectedUser(null)
      toast.success('Team member updated successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to update team member!')
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteMember = async (id) => {
    try {
      setActionLoading(true)
      await teamApiService.deleteTeamMember(id)
      setTeamMembers(prev => prev.filter(member => member.id !== id))
      setDeleteConfirm(null)
      setSelectedUser(null)
      toast.success('Team member deleted successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to delete team member!')
    } finally {
      setActionLoading(false)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      setActionLoading(true)
      const result = await teamApiService.updateTeamMember(id, { status })
      setTeamMembers(prev => prev.map(member => member.id === id ? result.member : member))
      setStatusUpdate(null)
      setSelectedUser(null)
      toast.success(`Member ${status.toLowerCase()} successfully!`)
    } catch (err) {
      toast.error(err.message || 'Failed to update member status!')
    } finally {
      setActionLoading(false)
    }
  }

  // Filter and sort members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    return new Date(b.joinDate) - new Date(a.joinDate)
  })

  // Pagination
  const indexOfLastMember = currentPage * membersPerPage
  const indexOfFirstMember = indexOfLastMember - membersPerPage
  const currentMembers = sortedMembers.slice(indexOfFirstMember, indexOfLastMember)
  const totalPages = Math.ceil(sortedMembers.length / membersPerPage)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <ModernSpinner size={60} />
          <span className="text-xl text-gray-600 mt-4 block">Loading team members...</span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
            <p className="text-gray-600">Manage your dealership team members and permissions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            Add Team Member
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Members" value={teamMembers.length} color="blue" />
        <StatCard title="Active Members" value={teamMembers.filter(m => m.status === 'ACTIVE').length} color="green" />
        <StatCard title="Inactive" value={teamMembers.filter(m => m.status === 'INACTIVE').length} color="yellow" />
      </div>

      {/* Controls */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search members by name, email, or role..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 cursor-pointer rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base backdrop-blur-sm transition-all duration-200"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <button
              onClick={loadTeamMembers}
              className="px-6 py-3 bg-gray-600 text-white rounded-2xl cursor-pointer hover:bg-gray-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {currentMembers.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onCardClick={setSelectedUser}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentMembers.length === 0 && (
        <div className="text-center py-16 bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl text-white">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? 'No members found' : 'No team members available'}
          </h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first team member to manage your dealership'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            Add Your First Member
          </button>
        </div>
      )}

      {/* Pagination */}
      {sortedMembers.length > membersPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200/30 bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-6 py-3 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 ${
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
              ({sortedMembers.length} total members)
            </span>
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={setEditingMember}
          onDelete={setDeleteConfirm}
          onStatusUpdate={setStatusUpdate}
          loading={actionLoading}
        />
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <TeamMemberModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateMember}
          loading={actionLoading}
        />
      )}

      {editingMember && (
        <TeamMemberModal
          onClose={() => setEditingMember(null)}
          onSave={(data) => handleUpdateMember(editingMember.id, data)}
          member={editingMember}
          loading={actionLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
            <div className="p-6 border-b border-gray-200/30">
              <h2 className="text-2xl font-bold text-gray-900">
                Confirm Deletion
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the team member "<strong>{deleteConfirm?.name}</strong>"? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={actionLoading}
                  className="px-6 py-3 cursor-pointer bg-white/50 border border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:bg-white/80 transition-all duration-200 font-semibold backdrop-blur-sm disabled:opacity-50 shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMember(deleteConfirm.id)}
                  disabled={actionLoading}
                  className="px-8 py-3 cursor-pointer bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {actionLoading ? <ModernSpinner size={20} /> : 'Delete Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusUpdate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
            <div className="p-6 border-b border-gray-200/30">
              <h2 className="text-2xl font-bold text-gray-900">
                Confirm Status Change
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to {statusUpdate.newStatus === 'ACTIVE' ? 'activate' : 'deactivate'} the team member 
                "<strong>{statusUpdate.member?.name}</strong>"?
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setStatusUpdate(null)}
                  disabled={actionLoading}
                  className="px-6 py-3 cursor-pointer bg-white/50 border border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:bg-white/80 transition-all duration-200 font-semibold backdrop-blur-sm disabled:opacity-50 shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusUpdate(statusUpdate.member.id, statusUpdate.newStatus)}
                  disabled={actionLoading}
                  className={`px-8 py-3 ${
                    statusUpdate.newStatus === 'ACTIVE' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-amber-600 hover:bg-amber-700'
                  } text-white rounded-2xl cursor-pointer transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50`}
                >
                  {actionLoading ? <ModernSpinner size={20} /> : (statusUpdate.newStatus === 'ACTIVE' ? 'Activate' : 'Deactivate')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}