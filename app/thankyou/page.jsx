// app/admin/page.js
"use client"

import { useState } from 'react'
import DashboardLayout from '../components/dashboardlayout/page'
import CarsManagement from '../components/cars/page'
import SubscribersManagement from '../components/subscriber/page'
import CarInquiries from '../components/CarInquiry/page'
import AdminsManagement from "../components/admin/page"
import CarModal from '../components/carmodel/page'
import CarDetailsModal from '../components/cardetail/page'
import DeleteConfirmationModal from '../components/deletemodel/page'

import { 
  FaCar, 
  FaUsers, 
  FaList, 
  FaUserShield, 
  FaChartBar,
  FaMoneyBillWave,
  FaEye,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa'

// Mock data for dashboard stats
const dashboardStats = {
  totalCars: 45,
  totalSubscribers: 128,
  pendingInquiries: 8,
  totalAdmins: 4,
  revenue: '2,340,000',
  featuredCars: 12
}

const recentActivities = [
  { id: 1, action: 'New car added', target: 'Toyota RAV4 2021', time: '2 hours ago', type: 'car' },
  { id: 2, action: 'Inquiry approved', target: 'Honda Civic 2020', time: '5 hours ago', type: 'inquiry' },
  { id: 3, action: 'New subscriber', target: 'john.doe@example.com', time: '1 day ago', type: 'subscriber' },
  { id: 4, action: 'Car updated', target: 'Mazda CX-5 2019', time: '1 day ago', type: 'car' }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showCarModal, setShowCarModal] = useState(false)
  const [showCarDetails, setShowCarDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [carToDelete, setCarToDelete] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleAddCar = () => {
    setSelectedCar(null)
    setIsEditing(false)
    setShowCarModal(true)
  }

  const handleEditCar = (car) => {
    setSelectedCar(car)
    setIsEditing(true)
    setShowCarModal(true)
  }

  const handleViewCar = (car) => {
    setSelectedCar(car)
    setShowCarDetails(true)
  }

  const handleDeleteCar = (car) => {
    setCarToDelete({ ...car, type: 'Car' })
    setShowDeleteConfirm(true)
  }

  const handleSaveCar = (carData) => {
    console.log('Saving car:', carData)
    setShowCarModal(false)
  }

  const handleDeleteConfirm = () => {
    console.log('Deleting:', carToDelete)
    setShowDeleteConfirm(false)
    setCarToDelete(null)
  }

  // Enhanced Dashboard Content
  const DashboardContent = () => (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cars</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalCars}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FaCar className="text-blue-600 text-2xl" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <FaChartBar className="mr-1" />
              <span>+12% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Subscribers</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalSubscribers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <FaUsers className="text-green-600 text-2xl" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <FaChartBar className="mr-1" />
              <span>+8% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Inquiries</p>
              <p className="text-3xl font-bold text-yellow-600">{dashboardStats.pendingInquiries}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <FaClock className="text-yellow-600 text-2xl" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-red-600">
              <FaEye className="mr-1" />
              <span>Needs attention</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-green-600">KSh {dashboardStats.revenue}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <FaMoneyBillWave className="text-purple-600 text-2xl" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <FaChartBar className="mr-1" />
              <span>+15% from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-blue-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleAddCar}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition duration-200"
            >
              <div className="flex items-center gap-3">
                <FaCar className="text-blue-600 text-xl" />
                <span className="font-semibold text-gray-900">Add New Car</span>
              </div>
              <span className="text-blue-600">+</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl hover:border-yellow-500 hover:bg-yellow-50 transition duration-200"
            >
              <div className="flex items-center gap-3">
                <FaList className="text-yellow-600 text-xl" />
                <span className="font-semibold text-gray-900">Review Inquiries</span>
              </div>
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                {dashboardStats.pendingInquiries}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('admins')}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition duration-200"
            >
              <div className="flex items-center gap-3">
                <FaUserShield className="text-purple-600 text-xl" />
                <span className="font-semibold text-gray-900">Manage Admins</span>
              </div>
              <span className="text-purple-600">→</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaClock className="text-gray-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition duration-200">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'car' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'inquiry' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'car' && <FaCar className="text-sm" />}
                    {activity.type === 'inquiry' && <FaList className="text-sm" />}
                    {activity.type === 'subscriber' && <FaUsers className="text-sm" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.target}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FaCar className="text-blue-600 text-2xl" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardStats.featuredCars}</p>
            <p className="text-sm text-gray-600">Featured Cars</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FaUsers className="text-green-600 text-2xl" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalAdmins}</p>
            <p className="text-sm text-gray-600">Admin Users</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FaList className="text-yellow-600 text-2xl" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingInquiries}</p>
            <p className="text-sm text-gray-600">Pending Actions</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FaUserShield className="text-purple-600 text-2xl" />
            </div>
            <p className="text-2xl font-bold text-gray-900">24/7</p>
            <p className="text-sm text-gray-600">System Status</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'cars':
        return (
          <CarsManagement
            onAddCar={handleAddCar}
            onEditCar={handleEditCar}
            onViewCar={handleViewCar}
            onDeleteCar={handleDeleteCar}
          />
        )
      case 'subscribers':
        return <SubscribersManagement />
      case 'inquiries':
        return <CarInquiries />
      case 'admins':
        return <AdminsManagement />
      case 'dashboard':
      default:
        return <DashboardContent />
    }
  }

  return (
    <DashboardLayout activePage={activeTab} onTabChange={setActiveTab}>
      {/* Dynamic Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">
          {activeTab === 'dashboard' ? 'Admin Dashboard' : activeTab.replace(/([A-Z])/g, ' $1').trim()}
        </h1>
        <p className="text-xl text-gray-600">
          {activeTab === 'dashboard' 
            ? 'Overview of your car dealership management system' 
            : `Manage your ${activeTab} efficiently`}
        </p>
      </div>

      {renderContent()}

      {/* Modals */}
      <CarModal
        isOpen={showCarModal}
        onClose={() => setShowCarModal(false)}
        onSave={handleSaveCar}
        selectedCar={selectedCar}
        isEditing={isEditing}
      />

      <CarDetailsModal
        isOpen={showCarDetails}
        onClose={() => setShowCarDetails(false)}
        car={selectedCar}
        onEdit={handleEditCar}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        item={carToDelete}
      />
    </DashboardLayout>
  )
}