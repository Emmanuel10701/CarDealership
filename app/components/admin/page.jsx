// components/admin/page.js
"use client"

import { useState, useEffect } from 'react'
import { 
  FaUserShield, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaEnvelope, 
  FaPhone, 
  FaUser,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaKey
} from 'react-icons/fa'

const mockAdmins = [
  {
    id: 1,
    name: "John Admin",
    email: "john.admin@autokenya.com",
    phone: "+254712345678",
    role: "Super Admin",
    status: "active",
    lastLogin: "2024-01-20 14:30",
    createdAt: "2024-01-15",
    permissions: ["all"]
  },
  {
    id: 2,
    name: "Jane Manager",
    email: "jane.manager@autokenya.com",
    phone: "+254723456789",
    role: "Content Manager",
    status: "active",
    lastLogin: "2024-01-19 09:15",
    createdAt: "2024-01-10",
    permissions: ["cars", "subscribers", "inquiries"]
  },
  {
    id: 3,
    name: "Mike Moderator",
    email: "mike.moderator@autokenya.com",
    phone: "+254734567890",
    role: "Moderator",
    status: "inactive",
    lastLogin: "2024-01-18 16:45",
    createdAt: "2024-01-05",
    permissions: ["inquiries"]
  }
]

export default function AdminsManagement() {
  const [admins, setAdmins] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)

  useEffect(() => {
    setAdmins(mockAdmins)
  }, [])

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddAdmin = () => {
    setShowAddModal(true)
    setSelectedAdmin(null)
  }

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin)
    setShowAddModal(true)
  }

  const handleDeleteAdmin = (adminId) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter(admin => admin.id !== adminId))
    }
  }

  const handleSaveAdmin = (adminData) => {
    if (selectedAdmin) {
      // Edit existing admin
      setAdmins(admins.map(admin => 
        admin.id === selectedAdmin.id ? { ...admin, ...adminData } : admin
      ))
    } else {
      // Add new admin
      const newAdmin = {
        id: Date.now(),
        ...adminData,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never',
        status: 'active'
      }
      setAdmins([...admins, newAdmin])
    }
    setShowAddModal(false)
  }

  const toggleAdminStatus = (adminId) => {
    setAdmins(admins.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
        : admin
    ))
  }

  const resetPassword = (adminId) => {
    if (confirm('Reset password for this admin? They will receive an email with instructions.')) {
      // Password reset logic here
      alert('Password reset email sent!')
    }
  }

  return (
    <div>
      {/* Header and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search admins by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
          <button
            onClick={handleAddAdmin}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition duration-200 shadow-lg font-semibold text-lg"
          >
            <FaPlus />
            <span>Add New Admin</span>
          </button>
        </div>
      </div>

      {/* Admins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAdmins.map((admin) => (
          <div key={admin.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <FaUserShield className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{admin.name}</h3>
                  <p className="text-sm text-gray-600">{admin.role}</p>
                </div>
              </div>
              <button
                onClick={() => toggleAdminStatus(admin.id)}
                className={`p-2 rounded-xl transition duration-200 ${
                  admin.status === 'active' 
                    ? 'text-green-600 hover:bg-green-50' 
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                {admin.status === 'active' ? <FaCheckCircle /> : <FaTimesCircle />}
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <FaEnvelope className="text-gray-400" />
                <span className="text-sm">{admin.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaPhone className="text-gray-400" />
                <span className="text-sm">{admin.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaUser className="text-gray-400" />
                <span className="text-sm">Created: {admin.createdAt}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaShieldAlt className="text-gray-400" />
                <span className="text-sm">Last login: {admin.lastLogin}</span>
              </div>
            </div>

            {/* Permissions */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Permissions</h4>
              <div className="flex flex-wrap gap-1">
                {admin.permissions.map((permission, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                    {permission === 'all' ? 'All Access' : permission}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                admin.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {admin.status}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => resetPassword(admin.id)}
                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition duration-200"
                  title="Reset Password"
                >
                  <FaKey />
                </button>
                <button
                  onClick={() => handleEditAdmin(admin)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition duration-200"
                  title="Edit Admin"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteAdmin(admin.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition duration-200"
                  title="Delete Admin"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAdmins.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
          <FaUserShield className="text-8xl text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No admins found</h3>
          <p className="text-gray-600 text-lg mb-6">Try adjusting your search criteria or add a new admin.</p>
          <button
            onClick={handleAddAdmin}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold shadow-lg flex items-center gap-2 mx-auto"
          >
            <FaPlus />
            Add Your First Admin
          </button>
        </div>
      )}

      {/* Add/Edit Admin Modal */}
      {showAddModal && (
        <AddEditAdminModal
          admin={selectedAdmin}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveAdmin}
        />
      )}
    </div>
  )
}

// Add/Edit Admin Modal Component
function AddEditAdminModal({ admin, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    phone: admin?.phone || '',
    role: admin?.role || '',
    permissions: admin?.permissions || []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handlePermissionChange = (permission) => {
    setFormData(prev => {
      if (permission === 'all') {
        return { ...prev, permissions: ['all'] }
      }
      if (prev.permissions.includes('all')) {
        return { ...prev, permissions: [permission] }
      }
      if (prev.permissions.includes(permission)) {
        return { ...prev, permissions: prev.permissions.filter(p => p !== permission) }
      }
      return { ...prev, permissions: [...prev.permissions, permission] }
    })
  }

  const permissionOptions = [
    { value: 'all', label: 'All Access' },
    { value: 'cars', label: 'Cars Management' },
    { value: 'inquiries', label: 'Sell Inquiries' },
    { value: 'subscribers', label: 'Subscribers' },
    { value: 'admins', label: 'Admins Management' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {admin ? 'Edit Admin' : 'Add New Admin'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <FaTimes className="text-xl text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="+254 XXX XXX XXX"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Role
                </label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Content Manager">Content Manager</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Permissions
                </label>
                <div className="space-y-2">
                  {permissionOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(option.value)}
                        onChange={() => handlePermissionChange(option.value)}
                        className="rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                      />
                      <span className="text-lg text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-semibold text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition duration-200 font-semibold text-lg"
              >
                {admin ? 'Update Admin' : 'Add Admin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}