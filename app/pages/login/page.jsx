"use client"

import { useState } from 'react'
import { FaCar, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowLeft, FaUserShield, FaShieldAlt, FaCheckCircle, FaUsers, FaChartBar, FaCog, FaBell } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('credentials')

  const handleEmailLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Handle email/password login
    setTimeout(() => {
      setIsLoading(false)
      console.log('Admin login attempted')
    }, 2000)
  }

  const handleQuickAccess = (accessType) => {
    setIsLoading(true)
    // Handle quick access login
    setTimeout(() => {
      setIsLoading(false)
      console.log(`${accessType} access attempted`)
    }, 1500)
  }

  const TabButton = ({ active, onClick, children, icon: Icon }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex-1 ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon className="text-xl" />
      <span>{children}</span>
    </button>
  )

  const QuickAccessCard = ({ title, description, icon: Icon, color, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 ${color} hover:shadow-lg`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl ${color.replace('border', 'bg').replace('hover:border', 'bg')} bg-opacity-10`}>
          <Icon className={`text-2xl ${color.replace('border-', 'text-').replace('hover:border-', 'text-')}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </motion.button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-8">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition duration-300 mb-6 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to car listings
        </Link>

        <div className="flex flex-col xl:flex-row gap-8 items-stretch">
          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-gray-100 flex-1"
          >
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <FaUserShield className="text-white text-3xl" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Admin Access
              </h2>
              <p className="text-gray-600 text-xl">
                Secure access to AutoMarket Admin Panel
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-3 bg-gray-100 rounded-2xl p-2">
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
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleEmailLogin}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-3">
                    Admin Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-500 text-lg" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                      placeholder="admin@automarket.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-3">
                    Admin Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500 text-lg" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-gray-500 text-lg hover:text-gray-700 transition duration-300" />
                      ) : (
                        <FaEye className="text-gray-500 text-lg hover:text-gray-700 transition duration-300" />
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
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg"
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-lg text-gray-700">
                      Remember this device
                    </label>
                  </div>

                  <div className="text-lg">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition duration-300">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 px-6 rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 focus:ring-offset-2 transition-all duration-300 font-semibold text-lg shadow-lg shadow-blue-500/30"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign in to Dashboard'
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* Quick Access Tab */}
            {activeTab === 'quick' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <QuickAccessCard
                    title="Viewer Access"
                    description="Read-only access to analytics and reports"
                    icon={FaChartBar}
                    color="border-blue-500 hover:border-blue-600 text-blue-600"
                    onClick={() => handleQuickAccess('viewer')}
                  />
                  <QuickAccessCard
                    title="Moderator Access"
                    description="Content moderation and user management"
                    icon={FaUsers}
                    color="border-green-500 hover:border-green-600 text-green-600"
                    onClick={() => handleQuickAccess('moderator')}
                  />
                  <QuickAccessCard
                    title="Support Access"
                    description="Customer support and ticket management"
                    icon={FaBell}
                    color="border-orange-500 hover:border-orange-600 text-orange-600"
                    onClick={() => handleQuickAccess('support')}
                  />
                  <QuickAccessCard
                    title="System Access"
                    description="Technical and system configuration"
                    icon={FaCog}
                    color="border-purple-500 hover:border-purple-600 text-purple-600"
                    onClick={() => handleQuickAccess('system')}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <FaShieldAlt className="text-yellow-600 text-lg mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 text-sm">Security Notice</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        Quick access requires additional verification. All access attempts are logged and monitored.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Notice */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <FaShieldAlt className="text-green-500" />
                Secure admin access only. Unauthorized access is prohibited.
              </p>
            </div>
          </motion.div>

          {/* Admin Features Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white xl:w-96 flex flex-col justify-center"
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-bold mb-6">Admin Dashboard Features</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <FaCheckCircle className="text-green-300 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg">Manage Listings</h4>
                    <p className="text-blue-100">Add, edit, or remove car listings</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <FaUsers className="text-green-300 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg">User Management</h4>
                    <p className="text-blue-100">Manage dealers and user accounts</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <FaChartBar className="text-green-300 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg">Analytics & Reports</h4>
                    <p className="text-blue-100">View sales data and platform analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <FaShieldAlt className="text-green-300 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg">Content Moderation</h4>
                    <p className="text-blue-100">Review and approve user submissions</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaCog className="text-green-300 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg">System Settings</h4>
                    <p className="text-blue-100">Configure platform settings</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 mt-8">
                <h4 className="font-bold text-xl mb-3">Security Notice</h4>
                <p className="text-blue-100 text-lg">
                  This is a restricted access area. All activities are logged and monitored for security purposes.
                </p>
                <p className="text-green-300 font-semibold mt-3">Authorized Personnel Only</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Admin Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="text-blue-600 font-bold text-2xl mb-2">5000+</div>
            <div className="text-gray-700 font-semibold">Active Listings</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="text-blue-600 font-bold text-2xl mb-2">250+</div>
            <div className="text-gray-700 font-semibold">Verified Dealers</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="text-blue-600 font-bold text-2xl mb-2">24/7</div>
            <div className="text-gray-700 font-semibold">Admin Support</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="text-blue-600 font-bold text-2xl mb-2">99.9%</div>
            <div className="text-gray-700 font-semibold">Uptime</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}