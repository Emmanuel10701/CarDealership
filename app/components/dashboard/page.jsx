"use client"

import { useState, useEffect } from 'react'
import { 
  FaCar, 
  FaUsers, 
  FaList, 
  FaUserShield, 
  FaHome,
  FaBlog,
  FaMoneyBillWave,
  FaClock,
  FaChartBar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSync
} from 'react-icons/fa'
import { CircularProgress } from '@mui/material'

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, trend, trendColor = 'green' }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  const trendColorClasses = {
    green: 'text-green-600',
    red: 'text-red-600'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${colorClasses[color]}`}>
          <Icon className="text-2xl" />
        </div>
      </div>
      <div className="mt-4">
        <div className={`flex items-center text-sm ${trendColorClasses[trendColor]}`}>
          <FaChartBar className="mr-2" />
          <span>{trend}</span>
        </div>
      </div>
    </div>
  )
}

// Quick Action Button Component
function QuickActionButton({ icon: Icon, label, color, onClick, actionIcon, badge }) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100 text-blue-700',
    yellow: 'border-yellow-200 bg-yellow-50 hover:border-yellow-300 hover:bg-yellow-100 text-yellow-700',
    purple: 'border-purple-200 bg-purple-50 hover:border-purple-300 hover:bg-purple-100 text-purple-700',
    green: 'border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100 text-green-700'
  }

  const iconColorClasses = {
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    green: 'text-green-600'
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 border-2 rounded-2xl transition duration-300 ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`text-xl ${iconColorClasses[color]}`} />
        <span className="font-semibold text-gray-900 text-base">{label}</span>
      </div>
      {badge ? (
        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {badge}
        </span>
      ) : (
        <span className={`text-xl ${iconColorClasses[color]}`}>{actionIcon}</span>
      )}
    </button>
  )
}

// Quick Actions Component
function QuickActions({ onAddCar, setActiveTab, pendingInquiries }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <FaCheckCircle className="text-blue-600 text-lg" />
        Quick Actions
      </h3>
      <div className="space-y-4">
        <QuickActionButton
          icon={FaCar}
          label="Add New Car"
          color="blue"
          onClick={onAddCar}
          actionIcon="+"
        />
        <QuickActionButton
          icon={FaList}
          label="Review Inquiries"
          color="yellow"
          onClick={() => setActiveTab('inquiries')}
          badge={pendingInquiries}
        />
        <QuickActionButton
          icon={FaUserShield}
          label="Manage Team"
          color="purple"
          onClick={() => setActiveTab('admins')}
          actionIcon="→"
        />
        <QuickActionButton
          icon={FaBlog}
          label="Create Blog Post"
          color="green"
          onClick={() => setActiveTab('blog')}
          actionIcon="✎"
        />
      </div>
    </div>
  )
}

// Recent Activity Component
function RecentActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setActivities([
        { id: 1, action: 'New car added', target: 'Toyota Camry XLE', time: '2 hours ago', type: 'car' },
        { id: 2, action: 'Car listing updated', target: 'Honda CR-V EX', time: '5 hours ago', type: 'car' },
        { id: 3, action: 'New subscriber', target: 'john.doe@example.com', time: '1 day ago', type: 'subscriber' },
        { id: 4, action: 'Inquiry received', target: 'BMW X5 inquiry', time: '1 day ago', type: 'inquiry' },
        { id: 5, action: 'Blog post published', target: 'Summer Car Maintenance Tips', time: '2 days ago', type: 'blog' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <FaClock className="text-gray-600 text-lg" />
          Recent Activity
        </h3>
        <div className="flex justify-center py-8">
          <CircularProgress size={30} className="text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <FaClock className="text-gray-600 text-lg" />
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition duration-300">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                activity.type === 'car' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'inquiry' ? 'bg-green-100 text-green-600' :
                activity.type === 'subscriber' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {activity.type === 'car' && <FaCar className="text-sm" />}
                {activity.type === 'inquiry' && <FaList className="text-sm" />}
                {activity.type === 'subscriber' && <FaUsers className="text-sm" />}
                {activity.type === 'blog' && <FaBlog className="text-sm" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 text-base truncate">{activity.action}</p>
                <p className="text-sm text-gray-600 truncate">{activity.target}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// System Overview Component
function SystemOverview({ stats }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">System Overview</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <OverviewItem
          icon={FaCar}
          value={stats?.featuredCars || 0}
          label="Featured Cars"
          color="blue"
        />
        <OverviewItem
          icon={FaUsers}
          value={stats?.totalAdmins || 0}
          label="Team Members"
          color="green"
        />
        <OverviewItem
          icon={FaList}
          value={stats?.pendingInquiries || 0}
          label="Pending Actions"
          color="yellow"
        />
        <OverviewItem
          icon={FaUserShield}
          value="24/7"
          label="System Status"
          color="purple"
        />
      </div>
    </div>
  )
}

// Overview Item Component
function OverviewItem({ icon: Icon, value, label, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  return (
    <div className="text-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${colorClasses[color]}`}>
        <Icon className="text-2xl" />
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  )
}

// API Service with fallback data
const apiService = {
  async getDashboardStats() {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) {
        // If API fails, return fallback data
        console.warn('Dashboard API not available, using fallback data')
        return this.getFallbackStats()
      }
      return await response.json()
    } catch (error) {
      console.warn('Failed to fetch dashboard stats, using fallback data:', error)
      return this.getFallbackStats()
    }
  },

  getFallbackStats() {
    // Return realistic fallback data
    return {
      totalCars: 24,
      totalSubscribers: 128,
      pendingInquiries: 8,
      totalAdmins: 4,
      revenue: '2,340,000',
      featuredCars: 6
    }
  }
}

// Main Dashboard Content Component
export default function DashboardContent({ onAddCar, setActiveTab }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const dashboardStats = await apiService.getDashboardStats()
      setStats(dashboardStats)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      setError('Failed to load dashboard data')
      // Set fallback stats even on error
      setStats(apiService.getFallbackStats())
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <CircularProgress size={40} className="text-blue-600 mx-auto mb-4" />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white relative">
        {error && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <FaExclamationTriangle />
            Using demo data
          </div>
        )}
        <h1 className="text-3xl lg:text-4xl font-bold mb-3">Welcome back, Admin!</h1>
        <p className="text-blue-100 text-lg">Here's what's happening with your dealership today.</p>
        
        {/* Refresh Button */}
        <button
          onClick={loadDashboardStats}
          className="mt-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          <FaSync className="text-sm" />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-yellow-600 text-xl" />
            <div>
              <h3 className="text-yellow-800 font-semibold">Demo Mode</h3>
              <p className="text-yellow-700 text-sm">
                Dashboard is showing demo data. The API endpoint is not available.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cars"
          value={stats?.totalCars || 0}
          icon={FaCar}
          color="blue"
          trend="+12% from last month"
        />
        <StatCard
          title="Subscribers"
          value={stats?.totalSubscribers || 0}
          icon={FaUsers}
          color="green"
          trend="+8% from last month"
        />
        <StatCard
          title="Pending Inquiries"
          value={stats?.pendingInquiries || 0}
          icon={FaClock}
          color="yellow"
          trend="Needs attention"
          trendColor="red"
        />
        <StatCard
          title="Monthly Revenue"
          value={`KSh ${stats?.revenue || '0'}`}
          icon={FaMoneyBillWave}
          color="purple"
          trend="+15% from last month"
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions onAddCar={onAddCar} setActiveTab={setActiveTab} pendingInquiries={stats?.pendingInquiries} />
        <RecentActivity />
      </div>

      {/* System Overview */}
      <SystemOverview stats={stats} />

      {/* API Status Info */}
      <div className="bg-gray-50 rounded-2xl p-6 text-center">
        <p className="text-gray-600 text-sm">
          To connect real data, create an API endpoint at <code className="bg-gray-200 px-2 py-1 rounded">/api/dashboard/stats</code>
        </p>
      </div>
    </div>
  )
}