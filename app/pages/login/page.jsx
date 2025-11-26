"use client"

import { useState } from 'react'
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowLeft, FaUserShield, FaShieldAlt, FaCheckCircle, FaUsers, FaChartBar, FaCog, FaBell } from 'react-icons/fa'
import Link from 'next/link'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('credentials')

  const router = useRouter()

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
        
        // Redirect to admin dashboard
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

  const handleQuickAccess = (accessType) => {
    setIsLoading(true)
    toast.info(`${accessType} access requires credentials login`)
    setTimeout(() => {
      setIsLoading(false)
      setActiveTab('credentials')
    }, 1500)
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    toast.info('Password reset functionality coming soon. Please contact administrator.')
  }

  const TabButton = ({ active, onClick, children, icon: Icon }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center space-x-2 px-4 py-3 xl:px-6 xl:py-4 rounded-xl font-semibold text-base xl:text-lg transition-colors duration-200 flex-1 min-w-0 ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      type="button"
    >
      <Icon className="text-lg xl:text-xl flex-shrink-0" />
      <span className="truncate">{children}</span>
    </button>
  )

  const QuickAccessCard = ({ title, description, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className={`p-4 xl:p-6 rounded-xl text-left transition-colors duration-200 border ${color} hover:bg-gray-50 w-full`}
      disabled={isLoading}
      type="button"
    >
      <div className="flex items-start space-x-3 xl:space-x-4">
        <div className={`p-2 xl:p-3 rounded-lg ${color.replace('border', 'bg').replace('hover:border', 'bg')} bg-opacity-10 flex-shrink-0`}>
          <Icon className={`text-xl xl:text-2xl ${color.replace('border-', 'text-').replace('hover:border-', 'text-')}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base xl:text-lg mb-1 xl:mb-2 truncate">{title}</h3>
          <p className="text-gray-600 text-xs xl:text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </button>
  )

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 xl:p-6">
      <div className="max-w-6xl w-full space-y-6 xl:space-y-8">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center text-sm xl:text-base text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 xl:mb-6"
        >
          <FaArrowLeft className="mr-2 flex-shrink-0" />
          <span>Back to car listings</span>
        </Link>

        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-stretch">
          {/* Login Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 xl:p-8 space-y-6 xl:space-y-8 flex-1 min-w-0">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-4 xl:mb-6">
                <div className="bg-blue-600 p-3 xl:p-4 rounded-xl">
                  <FaUserShield className="text-white text-2xl xl:text-3xl" />
                </div>
              </div>
              <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 mb-2 xl:mb-3">
                Admin Access
              </h2>
              <p className="text-gray-600 text-base xl:text-lg">
                Secure access to AutoMarket Admin Panel
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 xl:space-x-3 bg-gray-100 rounded-xl p-2">
              <TabButton
                active={activeTab === 'credentials'}
                onClick={() => setActiveTab('credentials')}
                icon={FaLock}
              >
                Credentials
              </TabButton>
              <TabButton
                active={activeTab === 'quick'}
                onClick={() => setActiveTab('quick')}
                icon={FaShieldAlt}
              >
                Quick Access
              </TabButton>
            </div>

            {/* Credentials Tab */}
            {activeTab === 'credentials' && (
              <form
                onSubmit={handleEmailLogin}
                className="space-y-4 xl:space-y-6"
              >
                <div>
                  <label htmlFor="email" className="block text-base xl:text-lg font-medium text-gray-700 mb-2 xl:mb-3">
                    Admin Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 xl:pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400 text-base xl:text-lg" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 xl:pl-12 pr-4 py-3 xl:py-4 text-base xl:text-lg border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="admin@automarket.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-base xl:text-lg font-medium text-gray-700 mb-2 xl:mb-3">
                    Admin Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 xl:pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 text-base xl:text-lg" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 xl:pl-12 pr-10 xl:pr-12 py-3 xl:py-4 text-base xl:text-lg border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
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
                        <FaEyeSlash className="text-gray-400 text-base xl:text-lg hover:text-gray-600 transition-colors duration-200" />
                      ) : (
                        <FaEye className="text-gray-400 text-base xl:text-lg hover:text-gray-600 transition-colors duration-200" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 xl:gap-0">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 xl:h-5 w-4 xl:w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <label htmlFor="remember-me" className="ml-2 xl:ml-3 block text-base xl:text-lg text-gray-700">
                      Remember this device
                    </label>
                  </div>

                  <div className="text-base xl:text-lg">
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
                  className="w-full bg-blue-600 text-white py-4 xl:py-5 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-semibold text-base xl:text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 xl:gap-3">
                      <CircularProgress size={20} style={{ color: 'white' }} />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign in to Dashboard'
                  )}
                </button>
              </form>
            )}

            {/* Quick Access Tab */}
            {activeTab === 'quick' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xl:gap-4">
                  <QuickAccessCard
                    title="Viewer Access"
                    description="Read-only access to analytics and reports"
                    icon={FaChartBar}
                    color="border-blue-500 text-blue-600"
                    onClick={() => handleQuickAccess('viewer')}
                  />
                  <QuickAccessCard
                    title="Moderator Access"
                    description="Content moderation and user management"
                    icon={FaUsers}
                    color="border-green-500 text-green-600"
                    onClick={() => handleQuickAccess('moderator')}
                  />
                  <QuickAccessCard
                    title="Support Access"
                    description="Customer support and ticket management"
                    icon={FaBell}
                    color="border-orange-500 text-orange-600"
                    onClick={() => handleQuickAccess('support')}
                  />
                  <QuickAccessCard
                    title="System Access"
                    description="Technical and system configuration"
                    icon={FaCog}
                    color="border-purple-500 text-purple-600"
                    onClick={() => handleQuickAccess('system')}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FaShieldAlt className="text-blue-600 text-lg mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-blue-800 text-sm">Security Notice</h4>
                      <p className="text-blue-700 text-sm mt-1">
                        Quick access requires additional verification. All access attempts are logged and monitored.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="text-center pt-4 xl:pt-6 border-t border-gray-200">
              <p className="text-xs xl:text-sm text-gray-500 flex items-center justify-center gap-2">
                <FaShieldAlt className="text-green-500 flex-shrink-0" />
                <span>Secure admin access only. Unauthorized access is prohibited.</span>
              </p>
            </div>
          </div>

          {/* Admin Features Sidebar */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 xl:p-8 text-gray-900 xl:w-96 flex flex-col justify-center">
            <div className="space-y-4 xl:space-y-6">
              <h3 className="text-xl xl:text-2xl font-bold mb-4 xl:mb-6">Admin Dashboard Features</h3>
              
              <div className="space-y-3 xl:space-y-4">
                <div className="flex items-start gap-3 xl:gap-4">
                  <FaCheckCircle className="text-green-500 text-lg xl:text-xl mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-base xl:text-lg">Manage Listings</h4>
                    <p className="text-gray-600 text-sm xl:text-base">Add, edit, or remove car listings</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 xl:gap-4">
                  <FaUsers className="text-green-500 text-lg xl:text-xl mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-base xl:text-lg">User Management</h4>
                    <p className="text-gray-600 text-sm xl:text-base">Manage dealers and user accounts</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 xl:gap-4">
                  <FaChartBar className="text-green-500 text-lg xl:text-xl mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-base xl:text-lg">Analytics & Reports</h4>
                    <p className="text-gray-600 text-sm xl:text-base">View sales data and platform analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 xl:gap-4">
                  <FaShieldAlt className="text-green-500 text-lg xl:text-xl mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-base xl:text-lg">Content Moderation</h4>
                    <p className="text-gray-600 text-sm xl:text-base">Review and approve user submissions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 xl:gap-4">
                  <FaCog className="text-green-500 text-lg xl:text-xl mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-base xl:text-lg">System Settings</h4>
                    <p className="text-gray-600 text-sm xl:text-base">Configure platform settings</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 xl:p-6 mt-6 xl:mt-8">
                <h4 className="font-bold text-lg xl:text-xl mb-2 xl:mb-3">Security Notice</h4>
                <p className="text-gray-600 text-sm xl:text-base leading-relaxed">
                  This is a restricted access area. All activities are logged and monitored for security purposes.
                </p>
                <p className="text-green-600 font-semibold mt-2 xl:mt-3 text-sm xl:text-base">Authorized Personnel Only</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-4 xl:p-6 shadow-sm">
            <div className="text-blue-600 font-bold text-xl xl:text-2xl mb-1 xl:mb-2">5000+</div>
            <div className="text-gray-700 font-semibold text-sm xl:text-base">Active Listings</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 xl:p-6 shadow-sm">
            <div className="text-blue-600 font-bold text-xl xl:text-2xl mb-1 xl:mb-2">250+</div>
            <div className="text-gray-700 font-semibold text-sm xl:text-base">Verified Dealers</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 xl:p-6 shadow-sm">
            <div className="text-blue-600 font-bold text-xl xl:text-2xl mb-1 xl:mb-2">24/7</div>
            <div className="text-gray-700 font-semibold text-sm xl:text-base">Admin Support</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 xl:p-6 shadow-sm">
            <div className="text-blue-600 font-bold text-xl xl:text-2xl mb-1 xl:mb-2">99.9%</div>
            <div className="text-gray-700 font-semibold text-sm xl:text-base">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  )
}