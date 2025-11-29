"use client"

import { useState, useEffect } from 'react'
import { 
  FaCar, 
  FaUsers, 
  FaList, 
  FaUserShield, 
  FaBlog,
  FaMoneyBillWave,
  FaClock,
  FaChartBar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSync,
  FaEnvelope,
  FaFileAlt,
  FaShoppingCart,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'

// API Service with JWT Authentication
const apiService = {
  // Get authentication token from localStorage
  getAuthToken() {
    const possibleTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
    for (const key of possibleTokenKeys) {
      const token = localStorage.getItem(key);
      if (token) {
        return token;
      }
    }
    return null;
  },

  // Fetch subscribers count
  async getSubscribers() {
    try {
      const token = this.getAuthToken();
      const response = await fetch('/api/subscriber', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch subscribers');
      const data = await response.json();
      return data.subscribers || [];
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      return [];
    }
  },

  // Fetch team admins
  async getTeamAdmins() {
    try {
      const token = this.getAuthToken();
      const response = await fetch('/api/register', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch team admins');
      const data = await response.json();
      return data.members || [];
    } catch (error) {
      console.error('Error fetching team admins:', error);
      return [];
    }
  },

  // Fetch car listings
  async getCarListings() {
    try {
      const token = this.getAuthToken();
      const response = await fetch('/api/cardeal', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch car listings');
      const data = await response.json();
      return data.carListings || [];
    } catch (error) {
      console.error('Error fetching car listings:', error);
      return [];
    }
  },

  // Fetch car inquiries (from sellyourcar)
  async getCarInquiries() {
    try {
      const token = this.getAuthToken();
      const response = await fetch('/api/sellyourcar', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch car inquiries');
      const data = await response.json();
      return data.data || []; // Fixed: using data.data from your response
    } catch (error) {
      console.error('Error fetching car inquiries:', error);
      return [];
    }
  },

  // Fetch blogs
  async getBlogs() {
    try {
      const token = this.getAuthToken();
      const response = await fetch('/api/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      return data.blogPosts || [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  },

  // Calculate pending inquiries count - CORRECTED based on your API response
  calculatePendingInquiries(inquiries) {
    return inquiries.filter(inquiry => 
      inquiry.status === 'pending' || 
      inquiry.features?.adminData?.status === 'pending'
    ).length;
  },

  // Calculate total revenue from ALL car listings (cardeal) - CORRECTED
  calculateRevenue(cars) {
    return cars.reduce((total, car) => total + (car.price || 0), 0);
  },

  // Calculate growth percentage compared to last week
  calculateGrowth(currentData, previousData, dataType) {
    if (previousData === 0) return currentData > 0 ? 100 : 0;
    return ((currentData - previousData) / previousData) * 100;
  },

  // Check if token is valid
  isTokenValid(token) {
    if (!token) return false;
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return tokenPayload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
}

// Stat Card Component with Growth Indicator
function StatCard({ title, value, icon: Icon, color, growth, loading }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    )
  }

  const isPositive = growth >= 0;
  const growthColor = isPositive ? 'text-green-600' : 'text-red-600';
  const growthIcon = isPositive ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {growth !== undefined && (
            <div className={`flex items-center text-sm ${growthColor}`}>
              {growthIcon}
              <span className="ml-1 font-medium">
                {Math.abs(growth).toFixed(1)}% {isPositive ? 'increase' : 'decrease'} from last week
              </span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${colorClasses[color]}`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  )
}

// Quick Action Button Component
function QuickActionButton({ icon: Icon, label, color, onClick, actionIcon, badge, loading }) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100 text-blue-700',
    yellow: 'border-yellow-200 bg-yellow-50 hover:border-yellow-300 hover:bg-yellow-100 text-yellow-700',
    purple: 'border-purple-200 bg-purple-50 hover:border-purple-300 hover:bg-purple-100 text-purple-700',
    green: 'border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100 text-green-700',
    orange: 'border-orange-200 bg-orange-50 hover:border-orange-300 hover:bg-orange-100 text-orange-700'
  }

  const iconColorClasses = {
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600'
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-between p-4 border-2 rounded-2xl bg-gray-100 border-gray-200 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
      </div>
    )
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
        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold min-w-6 h-6 flex items-center justify-center">
          {badge}
        </span>
      ) : (
        <span className={`text-xl ${iconColorClasses[color]}`}>{actionIcon}</span>
      )}
    </button>
  )
}

// Quick Actions Component
function QuickActions({ onAddCar, setActiveTab, stats, loading, user }) {
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
          loading={loading}
        />
        <QuickActionButton
          icon={FaList}
          label="Review Inquiries"
          color="yellow"
          onClick={() => setActiveTab('inquiries')}
          badge={stats?.pendingInquiries}
          loading={loading}
        />
        <QuickActionButton
          icon={FaUserShield}
          label="Manage Team"
          color="purple"
          onClick={() => setActiveTab('admins')}
          actionIcon="→"
          loading={loading}
        />
        <QuickActionButton
          icon={FaBlog}
          label="Create Blog Post"
          color="green"
          onClick={() => setActiveTab('blog')}
          actionIcon="✎"
          loading={loading}
        />
        <QuickActionButton
          icon={FaEnvelope}
          label="View Subscribers"
          color="orange"
          onClick={() => setActiveTab('subscribers')}
          badge={stats?.totalSubscribers}
          loading={loading}
        />
      </div>
      
      {/* User Info */}
      {user && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Logged in as</p>
              <p className="text-gray-600 text-sm">{user.name}</p>
              <p className="text-gray-500 text-xs capitalize">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Recent Activity Component
function RecentActivity({ activities, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <FaClock className="text-gray-600 text-lg" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <FaClock className="text-gray-600 text-lg" />
          Recent Activity
        </h3>
        <div className="text-center py-8 text-gray-500">
          <FaClock className="text-4xl mx-auto mb-4 text-gray-300" />
          <p>No recent activity</p>
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
                activity.type === 'blog' ? 'bg-orange-100 text-orange-600' :
                activity.type === 'team' ? 'bg-indigo-100 text-indigo-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {activity.type === 'car' && <FaCar className="text-sm" />}
                {activity.type === 'inquiry' && <FaList className="text-sm" />}
                {activity.type === 'subscriber' && <FaUsers className="text-sm" />}
                {activity.type === 'blog' && <FaBlog className="text-sm" />}
                {activity.type === 'team' && <FaUserShield className="text-sm" />}
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
function SystemOverview({ stats, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 animate-pulse">
        <h3 className="h-8 bg-gray-200 rounded w-48 mb-8"></h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">System Overview</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <OverviewItem
          icon={FaCar}
          value={stats?.totalCars || 0}
          label="Total Cars"
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
          icon={FaFileAlt}
          value={stats?.totalBlogs || 0}
          label="Blog Posts"
          color="orange"
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
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
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

// Main Dashboard Content Component
export default function DashboardContent({ onAddCar, setActiveTab, user: propUser }) {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalSubscribers: 0,
    pendingInquiries: 0,
    totalAdmins: 0,
    revenue: 0,
    totalBlogs: 0,
    growth: {
      cars: 0,
      subscribers: 0,
      inquiries: 0,
      revenue: 0
    }
  })
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    checkAuthentication();
    loadDashboardData();
  }, [])

  // Check authentication
  const checkAuthentication = () => {
    try {
      console.log('🔍 Checking authentication in DashboardContent...');
      
      // Check ALL possible localStorage keys for user data
      const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
      const possibleTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
      
      let userData = null;
      let token = null;
      
      // Find user data in any possible key
      for (const key of possibleUserKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`✅ Found user data in key: ${key}`);
          userData = data;
          break;
        }
      }
      
      // Find token in any possible key
      for (const key of possibleTokenKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`✅ Found token in key: ${key}`);
          token = data;
          break;
        }
      }
      
      if (!userData || !apiService.isTokenValid(token)) {
        console.log('❌ No valid authentication found');
        setAuthError(true);
        // Clear all auth data
        possibleUserKeys.forEach(key => localStorage.removeItem(key));
        possibleTokenKeys.forEach(key => localStorage.removeItem(key));
        router.push('/pages/login');
        return;
      }

      // Parse user data
      const parsedUser = JSON.parse(userData);
      console.log('✅ User authenticated:', parsedUser.name);
      setUser(parsedUser);
      
    } catch (error) {
      console.error('❌ Error checking authentication:', error);
      setAuthError(true);
      localStorage.clear();
      router.push('/pages/login');
    }
  }

  // Get the user's first name for a more personal greeting
  const getUserFirstName = () => {
    if (!user?.name) return 'Admin'
    
    // Extract first name from full name
    const firstName = user.name.split(' ')[0]
    return firstName
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check authentication first
      if (!apiService.getAuthToken()) {
        setAuthError(true);
        return;
      }

      // Fetch all data in parallel
      const [
        subscribers,
        teamAdmins,
        carListings,
        carInquiries,
        blogs
      ] = await Promise.all([
        apiService.getSubscribers(),
        apiService.getTeamAdmins(),
        apiService.getCarListings(),
        apiService.getCarInquiries(),
        apiService.getBlogs()
      ])

      // Calculate stats - CORRECTED based on your requirements
      const pendingInquiries = apiService.calculatePendingInquiries(carInquiries)
      const revenue = apiService.calculateRevenue(carListings) // Only from cardeal API
      
      // Calculate growth (simulated - in real app you'd compare with last week's data)
      const growth = {
        cars: apiService.calculateGrowth(carListings.length, Math.max(0, carListings.length - 2), 'cars'),
        subscribers: apiService.calculateGrowth(subscribers.length, Math.max(0, subscribers.length - 1), 'subscribers'),
        inquiries: apiService.calculateGrowth(pendingInquiries, Math.max(0, pendingInquiries - 1), 'inquiries'),
        revenue: apiService.calculateGrowth(revenue, Math.max(0, revenue - 500000), 'revenue')
      }

      // Update stats
      setStats({
        totalCars: carListings.length,
        totalSubscribers: subscribers.length,
        pendingInquiries,
        totalAdmins: teamAdmins.length,
        revenue: revenue.toLocaleString(),
        totalBlogs: blogs.length,
        growth
      })

      // Generate recent activities - FIXED: One latest from each API endpoint
      const recentActivities = generateRecentActivities(
        carListings,
        carInquiries,
        subscribers,
        teamAdmins,
        blogs
      )
      setActivities(recentActivities)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      if (error.message.includes('401') || error.message.includes('403')) {
        setAuthError(true);
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to load dashboard data. Please check your API endpoints.');
      }
    } finally {
      setLoading(false)
    }
  }

  // Generate recent activities - FIXED: Only one latest from each API
  const generateRecentActivities = (cars, inquiries, subscribers, teamAdmins, blogs) => {
    const activities = []

    // Get latest car listing
    if (cars.length > 0) {
      const latestCar = cars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      activities.push({
        id: `car-${latestCar.id}`,
        action: 'New car listed',
        target: latestCar.carName,
        time: formatTimeAgo(new Date(latestCar.createdAt)),
        type: 'car'
      })
    }

    // Get latest inquiry
    if (inquiries.length > 0) {
      const latestInquiry = inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      activities.push({
        id: `inquiry-${latestInquiry.id}`,
        action: 'New car inquiry',
        target: latestInquiry.carName,
        time: formatTimeAgo(new Date(latestInquiry.createdAt)),
        type: 'inquiry'
      })
    }

    // Get latest subscriber
    if (subscribers.length > 0) {
      const latestSubscriber = subscribers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      activities.push({
        id: `subscriber-${latestSubscriber.id}`,
        action: 'New subscriber',
        target: latestSubscriber.email,
        time: formatTimeAgo(new Date(latestSubscriber.createdAt)),
        type: 'subscriber'
      })
    }

    // Get latest team member
    if (teamAdmins.length > 0) {
      const latestTeamMember = teamAdmins.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      activities.push({
        id: `team-${latestTeamMember.id}`,
        action: 'New team member',
        target: latestTeamMember.name,
        time: formatTimeAgo(new Date(latestTeamMember.createdAt)),
        type: 'team'
      })
    }

    // Get latest blog post
    if (blogs.length > 0) {
      const latestBlog = blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      activities.push({
        id: `blog-${latestBlog.id}`,
        action: 'New blog post',
        target: latestBlog.title,
        time: formatTimeAgo(new Date(latestBlog.createdAt)),
        type: 'blog'
      })
    }

    // Sort by time (newest first) and limit to 5
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5)
  }

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  // Show authentication error
  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access the dashboard</p>
          <button
            onClick={() => router.push('/pages/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header with Admin Name */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white relative">
        {error && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <FaExclamationTriangle />
            API Error
          </div>
        )}
        
        {/* User Info */}
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-blue-100">Logged in as</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold mb-3">
          Welcome back, {getUserFirstName()}!
        </h1>
        <p className="text-blue-100 text-lg">
          {loading ? 'Loading your dealership data...' : 'Here\'s what\'s happening with your dealership today.'}
        </p>
        
        {/* Refresh Button */}
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="mt-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50"
        >
          <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-red-600 text-xl" />
            <div>
              <h3 className="text-red-800 font-semibold">Data Loading Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={loadDashboardData}
                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards with Growth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cars"
          value={stats.totalCars}
          icon={FaCar}
          color="blue"
          growth={stats.growth.cars}
          loading={loading}
        />
        <StatCard
          title="Subscribers"
          value={stats.totalSubscribers}
          icon={FaUsers}
          color="green"
          growth={stats.growth.subscribers}
          loading={loading}
        />
        <StatCard
          title="Pending Inquiries"
          value={stats.pendingInquiries}
          icon={FaList}
          color="yellow"
          growth={stats.growth.inquiries}
          loading={loading}
        />
        <StatCard
          title="Monthly Revenue"
          value={`KSh ${stats.revenue}`}
          icon={FaMoneyBillWave}
          color="purple"
          growth={stats.growth.revenue}
          loading={loading}
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions 
          onAddCar={onAddCar} 
          setActiveTab={setActiveTab} 
          stats={stats}
          loading={loading}
          user={user}
        />
        <RecentActivity 
          activities={activities}
          loading={loading}
        />
      </div>

      {/* System Overview */}
      <SystemOverview 
        stats={stats}
        loading={loading}
      />

      {/* Data Source Info */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Data Sources</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FaCar className="text-blue-600" />
            <span>Cars: {stats.totalCars}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUsers className="text-green-600" />
            <span>Subscribers: {stats.totalSubscribers}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUserShield className="text-purple-600" />
            <span>Team: {stats.totalAdmins}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBlog className="text-orange-600" />
            <span>Blogs: {stats.totalBlogs}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaShoppingCart className="text-yellow-600" />
            <span>Inquiries: {stats.pendingInquiries}</span>
          </div>
        </div>
      </div>
    </div>
  )
}