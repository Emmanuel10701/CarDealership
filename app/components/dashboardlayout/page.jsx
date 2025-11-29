'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FaBars, FaUserCircle, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa'
import Sidebar from '../sidebar/page' // Make sure this import path is correct

export default function DashboardLayout({ 
  children, 
  activePage, 
  onTabChange, 
  className = '',
  user,
  onLogout 
}) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Simulate initial loading sequence
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => {
      window.removeEventListener('resize', checkScreenSize)
      clearTimeout(loadingTimer)
    }
  }, [])

  // Show loading state
  if (!mounted || isLoading || !user) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Modern animated logo/icon */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
            >
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [0.8, 1.1, 0.8]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <FaCog className="text-3xl text-white" />
              </motion.div>
            </motion.div>
            
            {/* Animated text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
            >
              Admin Dashboard
            </motion.h2>
            
            {/* Modern loading bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full mx-auto mb-4"
            />
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-sm"
            >
              Initializing your workspace...
            </motion.p>
          </motion.div>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    onLogout();
  }

  return (
    <div className={`flex h-screen bg-gray-50 ${className}`}>
      {/* Sidebar Component - ADD THIS */}
      <Sidebar
        activePage={activePage}
        onTabChange={onTabChange}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        showMobileSidebar={showMobileSidebar}
        setShowMobileSidebar={setShowMobileSidebar}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-300">
        {/* Modern Enhanced Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-b border-gray-200 shadow-lg backdrop-blur-lg"
        >
          <div className="flex items-center justify-between px-4 py-4 md:px-6 lg:px-8">
            <div className="flex items-center space-x-3 md:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => isMobile ? setShowMobileSidebar(true) : setIsSidebarOpen(!isSidebarOpen)}
                className="p-3 rounded-2xl transition-all duration-200 border border-gray-200 bg-white hover:bg-gray-100 shadow-sm"
                aria-label="Toggle sidebar"
              >
                <FaBars className="text-lg text-gray-600" />
              </motion.button>
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 capitalize">
                  {activePage === 'dashboard' ? 'Dashboard' : activePage.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
                <p className="text-sm md:text-base mt-1 hidden sm:block text-gray-600">
                  {activePage === 'dashboard' 
                    ? 'Overview of your dealership' 
                    : `Manage your ${activePage}`}
                </p>
              </motion.div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {/* User Info Display */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="hidden md:flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200"
                >
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 text-sm">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">
                      {user.role?.toLowerCase().replace('_', ' ')}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Notifications */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-2xl transition-all duration-200 border border-gray-200 bg-white hover:bg-gray-100 relative"
                aria-label="Notifications"
              >
                <FaBell className="text-lg text-gray-600" />
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white"
                >
                  3
                </motion.span>
              </motion.button>

              {/* User Profile with Dropdown */}
              <div className="relative group">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-2xl transition-all duration-200 border border-gray-200 bg-white hover:bg-gray-100 flex items-center space-x-2"
                  aria-label="User profile"
                >
                  <FaUserCircle className="text-lg text-gray-600" />
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.name?.split(' ')[0]}
                  </span>
                </motion.button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-400 capitalize mt-1">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-semibold text-sm"
                  >
                    <FaSignOutAlt className="text-base" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content with Smooth Transitions */}
        <AnimatePresence mode="wait">
          <motion.main
            key={activePage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50/30"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}