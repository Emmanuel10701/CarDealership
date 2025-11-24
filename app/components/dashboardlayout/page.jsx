"use client"

import { useState, useEffect } from 'react'
import { FaBars, FaUserCircle, FaBell } from 'react-icons/fa'
import Sidebar from '../sidebar/page.jsx'

export default function DashboardLayout({ children, activePage, onTabChange }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [mounted, setMounted] = useState(false)

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

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activePage={activePage}
        onTabChange={onTabChange}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        showMobileSidebar={showMobileSidebar}
        setShowMobileSidebar={setShowMobileSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-200">
        {/* Modern Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4 md:px-6 lg:px-8">
            <div className="flex items-center space-x-3 md:space-x-4">
              <button
                onClick={() => isMobile ? setShowMobileSidebar(true) : setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 md:p-3 rounded-xl hover:bg-gray-100 transition duration-150 border border-gray-200"
                aria-label="Toggle sidebar"
              >
                <FaBars className="text-gray-600 text-base md:text-lg" />
              </button>
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 capitalize">
                  {activePage === 'dashboard' ? 'Dashboard' : activePage.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
                <p className="text-gray-600 text-sm md:text-base mt-1 hidden sm:block">
                  {activePage === 'dashboard' 
                    ? 'Overview of your dealership' 
                    : `Manage your ${activePage}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <button 
                className="p-2 md:p-3 rounded-xl hover:bg-gray-100 transition duration-150 border border-gray-200 relative"
                aria-label="Notifications"
              >
                <FaBell className="text-gray-600 text-base md:text-lg" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </button>
              <button 
                className="p-2 md:p-3 rounded-xl hover:bg-gray-100 transition duration-150 border border-gray-200"
                aria-label="User profile"
              >
                <FaUserCircle className="text-gray-600 text-base md:text-lg" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50/30">
          {children}
        </main>
      </div>
    </div>
  )
}