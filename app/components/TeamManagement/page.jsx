"use client"

import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Modern Spinner Component
function ModernSpinner({ size = 24 }) {
  return (
    <div className="flex items-center justify-center">
      <div 
        className="animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"
        style={{ width: size, height: size }}
      ></div>
    </div>
  )
}

// User Detail Modal Component - Mobile Fixes Only
function UserDetailModal({ user, onClose, onEdit, onDeactivate, loading, currentUserId }) {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getPermissionBadges = () => {
    const badges = []
    if (user.canManageListings) {
      badges.push(<span key="manage" className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">Manage Listings</span>)
    }
    if (user.canApproveListings) {
      badges.push(<span key="approve" className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium">Approve Listings</span>)
    }
    if (user.canManageWebsite) {
      badges.push(<span key="website" className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium">Manage Website</span>)
    }
    return badges
  }

  const getRoleIcon = (role) => {
    switch(role) {
      case 'ADMIN': return '🔐'
      case 'MANAGER': return '👔'
      default: return '👤'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 overflow-hidden my-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-md">
                {getInitials(user.name)}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                  <span className="text-blue-600 font-medium capitalize flex items-center gap-1 text-sm sm:text-base">
                    {getRoleIcon(user.role)} {user.role.toLowerCase()}
                  </span>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    user.status === 'ACTIVE' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                    {user.status.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 sm:px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="text-sm font-medium text-gray-500 block mb-2">Contact Information</label>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium truncate">{user.email}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900 font-medium">{user.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="text-sm font-medium text-gray-500 block mb-2">Account Details</label>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Joined</p>
                      <p className="text-gray-900 font-medium">{new Date(user.joinDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Last Active</p>
                      <p className="text-gray-900 font-medium">{new Date(user.lastActive).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="text-sm font-medium text-gray-500 block mb-4">Permissions</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Manage Listings</span>
                    <div className={`w-10 h-6 flex items-center rounded-full p-1 ${user.canManageListings ? 'bg-blue-600 justify-end' : 'bg-gray-200 justify-start'}`}>
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Approve Listings</span>
                    <div className={`w-10 h-6 flex items-center rounded-full p-1 ${user.canApproveListings ? 'bg-emerald-600 justify-end' : 'bg-gray-200 justify-start'}`}>
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Manage Website</span>
                    <div className={`w-10 h-6 flex items-center rounded-full p-1 ${user.canManageWebsite ? 'bg-purple-600 justify-end' : 'bg-gray-200 justify-start'}`}>
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permission Badges */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="text-sm font-medium text-gray-500 block mb-3">Permission Tags</label>
                <div className="flex flex-wrap gap-2">
                  {getPermissionBadges()}
                  {getPermissionBadges().length === 0 && (
                    <span className="text-gray-400 text-sm">No permissions assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 sm:px-8 py-6 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onEdit(user)}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {loading ? <ModernSpinner size={20} /> : 'Edit User'}
            </button>
            {user.id !== currentUserId && (
              <button
                onClick={() => onDeactivate({ 
                  user, 
                  newStatus: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' 
                })}
                disabled={loading}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                  user.status === 'ACTIVE' 
                    ? 'bg-white border border-amber-300 text-amber-700' 
                    : 'bg-white border border-emerald-300 text-emerald-700'
                }`}
              >
                {user.status === 'ACTIVE' ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                    </svg>
                    {loading ? <ModernSpinner size={20} /> : 'Deactivate'}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {loading ? <ModernSpinner size={20} /> : 'Activate'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Team Member Card Component - Mobile Fixes Only
function TeamMemberCard({ member, onCardClick, currentUserId, isGridView = true }) {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getRoleIcon = (role) => {
    switch(role) {
      case 'ADMIN': return '🔐'
      case 'MANAGER': return '👔'
      default: return '👤'
    }
  }

  const getPermissionBadges = () => {
    const badges = []
    if (member.canManageListings) badges.push({ text: "Listings", color: "bg-blue-50 text-blue-700" })
    if (member.canApproveListings) badges.push({ text: "Approve", color: "bg-emerald-50 text-emerald-700" })
    if (member.canManageWebsite) badges.push({ text: "Website", color: "bg-purple-50 text-purple-700" })
    return badges
  }

  const getRoleColor = (role) => {
    switch(role) {
      case 'ADMIN': return 'bg-red-50 text-red-700'
      case 'MANAGER': return 'bg-orange-50 text-orange-700'
      default: return 'bg-blue-50 text-blue-700'
    }
  }

  if (!isGridView) {
    return (
      <div 
        onClick={() => onCardClick(member)}
        className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer"
      >
        <div className="p-4 flex items-center">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {getInitials(member.name)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
                member.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'
              }`}></div>
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {member.name}
                </h3>
                {member.id === currentUserId && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium flex-shrink-0">You</span>
                )}
              </div>
              <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                <span className="text-xs text-gray-600 truncate">{member.email}</span>
                <span className="hidden xs:inline text-gray-400">•</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(member.role)}`}>
                  {getRoleIcon(member.role)} {member.role.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 ml-3 flex-shrink-0">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
              member.status === 'ACTIVE' 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
              {member.status.toLowerCase()}
            </span>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {new Date(member.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      onClick={() => onCardClick(member)}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                {getInitials(member.name)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
                member.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {member.name}
                </h3>
                {member.id === currentUserId && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium flex-shrink-0">You</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(member.role)}`}>
                  {getRoleIcon(member.role)} {member.role.toLowerCase()}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                  member.status === 'ACTIVE' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                  {member.status.toLowerCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate" title={member.email}>
                {member.email}
              </p>
            </div>
          </div>
        </div>

        {member.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="truncate">{member.phone}</span>
          </div>
        )}

        {/* Permissions */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {getPermissionBadges().slice(0, 2).map((badge, index) => (
              <span key={index} className={`${badge.color} px-2 py-1 rounded text-xs font-medium`}>
                {badge.text}
              </span>
            ))}
            {getPermissionBadges().length > 2 && (
              <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                +{getPermissionBadges().length - 2}
              </span>
            )}
            {getPermissionBadges().length === 0 && (
              <span className="text-gray-400 text-xs">No permissions</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="truncate mr-2">Joined {new Date(member.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          <span className="text-blue-600 font-medium flex items-center gap-1 whitespace-nowrap">
            View
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

// Team Member Modal Component - Mobile Fixes Only
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
    { value: 'USER', label: 'User', icon: '👤' },
    { value: 'MANAGER', label: 'Manager', icon: '👔' },
    { value: 'ADMIN', label: 'Admin', icon: '🔐' }
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 my-auto max-h-[90vh] overflow-y-auto">
        <div className="px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-base">
                  {member ? '✏️' : '👥'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {member ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer flex-shrink-0"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                placeholder="Enter full name..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                placeholder="Enter email address..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                placeholder="Enter phone number..."
              />
            </div>

            {!member && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  type="password"
                  required={!member}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter password..."
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Role *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(role => (
                  <button
                    type="button"
                    key={role.value}
                    onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                    className={`px-4 py-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer ${
                      formData.role === role.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <span className="text-lg">{role.icon}</span>
                    <span className="text-sm font-medium truncate w-full text-center">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: 'ACTIVE' }))}
                  className={`px-4 py-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer ${
                    formData.status === 'ACTIVE' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${formData.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                  <span className="font-medium">Active</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: 'INACTIVE' }))}
                  className={`px-4 py-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer ${
                    formData.status === 'INACTIVE' 
                      ? 'border-gray-400 bg-gray-100' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${formData.status === 'INACTIVE' ? 'bg-gray-400' : 'bg-gray-300'}`}></div>
                  <span className="font-medium">Inactive</span>
                </button>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Permissions
            </label>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
              {[
                { key: 'canManageListings', label: 'Can manage car listings', color: 'blue' },
                { key: 'canApproveListings', label: 'Can approve listings', color: 'emerald' },
                { key: 'canManageWebsite', label: 'Can manage website content', color: 'purple' }
              ].map((permission) => (
                <label key={permission.key} className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData[permission.key]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [permission.key]: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 border-2 rounded flex items-center justify-center ${
                      formData[permission.key] 
                        ? `bg-${permission.color}-500 border-${permission.color}-500` 
                        : 'border-gray-300'
                    }`}>
                      {formData[permission.key] && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-700 font-medium">{permission.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold disabled:opacity-50 cursor-pointer w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
            >
              {loading ? (
                <>
                  <ModernSpinner size={20} />
                  {member ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {member ? 'Update Member' : 'Create Member'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Stat Card Component - Mobile Fixes Only
function StatCard({ title, value, color, icon }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    yellow: 'bg-amber-50 text-amber-700',
    purple: 'bg-purple-50 text-purple-700'
  }

  const iconColors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    yellow: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600'
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <div className={`w-8 h-8 bg-gradient-to-br ${iconColors[color]} rounded flex items-center justify-center`}>
            <span className="text-white">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Team Management Component - Mobile Fixes Only
export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [membersPerPage] = useState(12)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [deactivateConfirm, setDeactivateConfirm] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        setCurrentUserId(userData.id)
      } catch (err) {
        console.error('Error parsing user data:', err)
      }
    }
  }, [])

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

  const handleDeactivateMember = async (id, status) => {
    try {
      setActionLoading(true)
      if (status === 'INACTIVE') {
        const confirmDelete = window.confirm(
          'Deactivating will also delete this user account. Are you sure?'
        )
        if (!confirmDelete) {
          setActionLoading(false)
          return
        }
        await teamApiService.deleteTeamMember(id)
        setTeamMembers(prev => prev.filter(member => member.id !== id))
        toast.success('Team member deactivated and deleted successfully!')
      } else {
        const result = await teamApiService.updateTeamMember(id, { status })
        setTeamMembers(prev => prev.map(member => member.id === id ? result.member : member))
        toast.success('Team member activated successfully!')
      }
      setDeactivateConfirm(null)
      setSelectedUser(null)
    } catch (err) {
      toast.error(err.message || 'Failed to update member status!')
    } finally {
      setActionLoading(false)
    }
  }

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

  const indexOfLastMember = currentPage * membersPerPage
  const indexOfFirstMember = indexOfLastMember - membersPerPage
  const currentMembers = sortedMembers.slice(indexOfFirstMember, indexOfLastMember)
  const totalPages = Math.ceil(sortedMembers.length / membersPerPage)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <ModernSpinner size={60} />
          <span className="text-xl text-gray-600 mt-4 block">Loading team members...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header Section - Mobile Fixes Only */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your dealership team members and permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm sm:text-base"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl font-semibold cursor-pointer shadow-md flex items-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Team Member</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview - Mobile Fixes Only */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard 
          title="Total Members" 
          value={teamMembers.length} 
          color="blue"
          icon="👥"
        />
        <StatCard 
          title="Active Members" 
          value={teamMembers.filter(m => m.status === 'ACTIVE').length} 
          color="green"
          icon="✅"
        />
        <StatCard 
          title="Inactive" 
          value={teamMembers.filter(m => m.status === 'INACTIVE').length} 
          color="yellow"
          icon="⏸️"
        />
      </div>

      {/* Controls - Mobile Fixes Only */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white cursor-text"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer text-sm sm:text-base"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 flex items-center gap-2 cursor-pointer text-sm sm:text-base ${
                  viewMode === 'grid' 
                    ? 'bg-blue-50 text-blue-700 border-r border-gray-200' 
                    : 'bg-white text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 flex items-center gap-2 cursor-pointer text-sm sm:text-base ${
                  viewMode === 'list' 
                    ? 'bg-blue-50 text-blue-700 border-l border-gray-200' 
                    : 'bg-white text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            <button
              onClick={loadTeamMembers}
              className="px-4 sm:px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl cursor-pointer font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Team Members Grid/List - Mobile Fixes Only */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {currentMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onCardClick={setSelectedUser}
              currentUserId={currentUserId}
              isGridView={true}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {currentMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onCardClick={setSelectedUser}
              currentUserId={currentUserId}
              isGridView={false}
            />
          ))}
        </div>
      )}

      {/* Empty State - Mobile Fixes Only */}
      {currentMembers.length === 0 && (
        <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-2xl text-white">👥</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? 'No members found' : 'No team members available'}
          </h3>
          <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first team member to manage your dealership'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl cursor-pointer font-semibold shadow-md text-sm sm:text-base"
          >
            Add Your First Member
          </button>
        </div>
      )}

      {/* Pagination - Mobile Fixes Only */}
      {sortedMembers.length > membersPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4  bg-white rounded-xl border border-gray-100 gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 sm:px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl cursor-pointer font-semibold flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <span className="text-sm text-gray-500 hidden sm:inline">
              ({sortedMembers.length} total members)
            </span>
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 sm:px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl cursor-pointer font-semibold flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={setEditingMember}
          onDeactivate={setDeactivateConfirm}
          loading={actionLoading}
          currentUserId={currentUserId}
        />
      )}

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

      {/* Deactivate Confirmation Modal - Mobile Fixes Only */}
      {deactivateConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
            <div className="px-6 sm:px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {deactivateConfirm.newStatus === 'INACTIVE' ? 'Deactivate User' : 'Activate User'}
              </h2>
            </div>

            <div className="px-6 sm:px-8 py-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                    {deactivateConfirm.user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{deactivateConfirm.user?.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{deactivateConfirm.user?.email}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  {deactivateConfirm.newStatus === 'INACTIVE' ? (
                    <>
                      Are you sure you want to deactivate this user?
                      <br /><br />
                      <span className="text-amber-600 font-medium text-sm">
                        ⚠️ This action cannot be undone and will permanently delete the account.
                      </span>
                    </>
                  ) : (
                    'Are you sure you want to activate this user?'
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  onClick={() => setDeactivateConfirm(null)}
                  disabled={actionLoading}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold disabled:opacity-50 cursor-pointer w-full sm:w-auto text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeactivateMember(deactivateConfirm.user.id, deactivateConfirm.newStatus)}
                  disabled={actionLoading}
                  className={`px-6 sm:px-8 py-3 text-white rounded-xl font-semibold disabled:opacity-50 cursor-pointer w-full sm:w-auto shadow-md text-sm sm:text-base ${
                    deactivateConfirm.newStatus === 'INACTIVE' 
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700' 
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700'
                  }`}
                >
                  {actionLoading ? <ModernSpinner size={20} /> : (deactivateConfirm.newStatus === 'INACTIVE' ? 'Deactivate & Delete' : 'Activate')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}