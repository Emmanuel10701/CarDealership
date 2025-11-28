"use client"

import { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUserShield, FaShieldAlt, FaCar, FaUsers, FaChartBar, FaSearchDollar } from 'react-icons/fa'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const router = useRouter()

  // Fetch car management statistics
  useEffect(() => {
    const fetchCarStats = async () => {
      try {
        setStatsLoading(true)
        
        // Simulate API calls for car management data
        const carStats = {
          totalListings: 1250,
          activeListings: 1180,
          totalDealers: 68,
          carsSoldToday: 42,
          pendingApprovals: 23,
          upcomingAuctions: 8,
          totalCarModels: 28,
          averagePrice: 94500
        }
        
        setStats(carStats)
      } catch (error) {
        console.error('Error fetching car stats:', error)
        // Set default stats
        setStats({
          totalListings: 0,
          activeListings: 0,
          totalDealers: 0,
          carsSoldToday: 0,
          pendingApprovals: 0,
          upcomingAuctions: 0,
          totalCarModels: 0,
          averagePrice: 0
        })
      } finally {
        setStatsLoading(false)
      }
    }

    fetchCarStats()
  }, [])

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Store token and user data in localStorage
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('auth-user', JSON.stringify(data.user))
        localStorage.setItem('auth-expires-at', data.expiresAt)

        toast.success('Login successful! Redirecting to dashboard...')
        
        // Redirect to car management dashboard
        setTimeout(() => {
          router.push('/pages/MainDashboard')
        }, 1000)
      } else {
        toast.error(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    router.push('/pages/forgotpassword')
    toast.info('redirected to password recovery page.')
  }

  // Car management features data
  const carFeatures = [
    {
      icon: FaCar,
      title: 'Vehicle Management',
      description: `Manage ${stats?.totalListings || 0} car listings and inventory`
    },
    {
      icon: FaUsers,
      title: 'Dealer Management',
      description: `${stats?.totalDealers || 0} verified dealers and partners`
    },
    {
      icon: FaChartBar,
      title: 'Sales Analytics',
      description: 'Track sales performance and market trends'
    },
    {
      icon: FaSearchDollar,
      title: 'Pricing Analysis',
      description: `KSH ${stats?.averagePrice?.toLocaleString() || 0} average price`
    }
  ]

  // Quick stats from car management data
  const quickStats = stats ? [
    { 
      label: 'Active Listings', 
      value: stats.activeListings.toLocaleString(),
      description: `Total: ${stats.totalListings} vehicles`
    },
    { 
      label: 'Verified Dealers', 
      value: stats.totalDealers.toString(),
      description: 'Partners & sellers'
    },
    { 
      label: 'Sold Today', 
      value: stats.carsSoldToday.toString(),
      description: 'Recent transactions'
    },
    { 
      label: 'Pending Approvals', 
      value: stats.pendingApprovals.toString(),
      description: 'Listings & updates'
    }
  ] : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 xl:p-6">
      <div className="w-full max-w-4xl mx-auto space-y-6 xl:space-y-8">
        {/* Header with Car Management Info */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200 mb-4">
            <FaCar className="text-blue-600 text-xl" />
            <span className="font-semibold text-gray-700">AutoMarket Management Portal</span>
          </div>
          <h1 className="text-2xl xl:text-3xl font-bold text-gray-900 mb-2">
            Vehicle Administration
          </h1>
          <p className="text-gray-600 text-base xl:text-lg">
            Secure access to car management system
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-stretch">
          {/* Login Card - Reduced Width */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 xl:p-8 space-y-6 xl:space-y-8 flex-1 max-w-lg mx-auto lg:max-w-md">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-4 xl:mb-6">
                <div className="bg-blue-600 p-3 xl:p-4 rounded-xl">
                  <FaUserShield className="text-white text-2xl xl:text-3xl" />
                </div>
              </div>
              <h2 className="text-xl xl:text-2xl font-bold text-gray-900 mb-2 xl:mb-3">
                Admin Access
              </h2>
              <p className="text-gray-600 text-sm xl:text-base">
                Secure access to AutoMarket Admin Panel
              </p>
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleEmailLogin}
              className="space-y-4 xl:space-y-6"
            >
              <div>
                <label htmlFor="email" className="block text-sm xl:text-base font-medium text-gray-700 mb-2 xl:mb-3">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 xl:pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 text-sm xl:text-base" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 xl:pl-12 pr-4 py-3 xl:py-4 text-sm xl:text-base border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="admin@automarket.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm xl:text-base font-medium text-gray-700 mb-2 xl:mb-3">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 xl:pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 text-sm xl:text-base" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 xl:pl-12 pr-10 xl:pr-12 py-3 xl:py-4 text-sm xl:text-base border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 xl:pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 text-sm xl:text-base hover:text-gray-600 transition-colors duration-200" />
                    ) : (
                      <FaEye className="text-gray-400 text-sm xl:text-base hover:text-gray-600 transition-colors duration-200" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 xl:h-4 w-4 xl:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me" className="ml-2 xl:ml-3 block text-sm xl:text-base text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm xl:text-base">
                  <button
                    onClick={handleForgotPassword}
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 xl:py-4 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-semibold text-sm xl:text-base disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 xl:gap-3">
                    <CircularProgress size={18} style={{ color: 'white' }} />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in to Dashboard'
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="text-center pt-4 xl:pt-6 border-t border-gray-200">
              <p className="text-xs xl:text-sm text-gray-500 flex items-center justify-center gap-2">
                <FaShieldAlt className="text-green-500 flex-shrink-0" />
                <span>Secure admin access only. Unauthorized access is prohibited.</span>
              </p>
            </div>
          </div>

          {/* Car Management Features Sidebar - Reduced Width */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 xl:p-8 text-gray-900 lg:w-80 flex flex-col justify-center">
            <div className="space-y-4 xl:space-y-6">
              <h3 className="text-lg xl:text-xl font-bold mb-4 xl:mb-6">Dashboard Features</h3>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 xl:gap-4 mb-4 xl:mb-6">
                {statsLoading ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  quickStats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="text-base xl:text-lg font-bold text-gray-800 mb-1">{stat.value}</div>
                      <div className="text-gray-600 text-xs xl:text-sm font-medium">{stat.label}</div>
                      <div className="text-gray-500 text-xs mt-1">{stat.description}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 xl:space-y-4">
                {carFeatures.map((feature, index) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <feature.icon className="text-blue-500 text-base xl:text-lg mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm xl:text-base">{feature.title}</h4>
                      <p className="text-gray-600 text-xs xl:text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-bold text-base xl:text-lg mb-2 flex items-center gap-2">
                  <FaShieldAlt className="text-blue-600" />
                  Security Notice
                </h4>
                <p className="text-gray-600 text-xs xl:text-sm leading-relaxed">
                  Restricted access area. All activities are logged and monitored.
                </p>
                <p className="text-green-600 font-semibold mt-2 text-xs xl:text-sm">Authorized Personnel Only</p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Stats - Simplified */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xl:gap-4 text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-3 xl:p-4 shadow-sm">
            <div className="text-blue-600 font-bold text-lg xl:text-xl mb-1">5000+</div>
            <div className="text-gray-700 font-semibold text-xs xl:text-sm">Active Listings</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 xl:p-4 shadow-sm">
            <div className="text-blue-600 font-bold text-lg xl:text-xl mb-1">250+</div>
            <div className="text-gray-700 font-semibold text-xs xl:text-sm">Verified Dealers</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 xl:p-4 shadow-sm">
            <div className="text-blue-600 font-bold text-lg xl:text-xl mb-1">24/7</div>
            <div className="text-gray-700 font-semibold text-xs xl:text-sm">Admin Support</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 xl:p-4 shadow-sm">
            <div className="text-blue-600 font-bold text-lg xl:text-xl mb-1">99.9%</div>
            <div className="text-gray-700 font-semibold text-xs xl:text-sm">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  )
}