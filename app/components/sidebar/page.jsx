"use client"

import { useState, useEffect } from 'react'
import { 
  FaBars, 
  FaTimes, 
  FaCar, 
  FaUsers,
  FaSignOutAlt,
  FaHome,
  FaChevronDown,
  FaUserCircle,
  FaShieldAlt,
  FaList
} from 'react-icons/fa'

export default function DashboardLayout({ children, activePage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar when clicking on mobile overlay
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen, isMobile])

  const menuItems = [
    { name: 'Dashboard', icon: FaHome },
    { name: 'Cars', icon: FaCar },
    { name: 'Sell Inquiries', icon: FaList },
    { name: 'Subscribers', icon: FaUsers }
  ]

  const userMenuItems = [
    { name: 'Profile', icon: FaUserCircle },
    { name: 'Security', icon: FaShieldAlt },
    { name: 'Logout', icon: FaSignOutAlt },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Enhanced Mobile Responsiveness */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 lg:w-80 bg-gradient-to-b from-white to-gray-50/95 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200/60
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isMobile ? 'w-full max-w-sm' : ''}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section - Mobile Optimized */}
          <div className="flex items-center justify-between p-6 lg:p-8 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                <FaCar className="text-white text-sm lg:text-lg" />
              </div>
              <div>
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  AutoKenya
                </span>
                <p className="text-xs text-gray-500 font-medium mt-1 hidden lg:block">ADMIN PANEL</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100/80 transition duration-200"
            >
              <FaTimes className="text-gray-500 text-base" />
            </button>
          </div>

          {/* Navigation - Mobile Friendly */}
          <nav className="flex-1 px-4 lg:px-6 py-6 lg:py-8 space-y-2 lg:space-y-3">
            <div className="px-2 mb-4 lg:mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 lg:mb-4">
                Main Navigation
              </h3>
            </div>
            
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage?.toLowerCase() === item.name.toLowerCase()
              
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (isMobile) {
                      setSidebarOpen(false)
                    }
                  }}
                  className={`
                    group flex items-center justify-between w-full px-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-semibold transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-lg hover:border hover:border-gray-100'
                    }
                    ${isMobile ? 'text-base' : 'text-lg'}
                  `}
                >
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <Icon className={`${isMobile ? 'text-lg' : 'text-xl'} transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                    }`} />
                    <span className={isMobile ? 'text-base' : 'text-lg'}>{item.name}</span>
                  </div>
                  
                  {/* Badge for Sell Inquiries */}
                  {item.name === 'Sell Inquiries' && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      5
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* User Section - Mobile Optimized */}
          <div className="p-4 lg:p-6 border-t border-gray-200/60 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-r from-gray-50 to-white/80 border border-gray-200/50 shadow-sm">
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xs lg:text-sm">A</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm lg:text-base font-bold text-gray-900 truncate">Admin User</p>
                <p className="text-xs lg:text-sm text-gray-500 truncate hidden sm:block">Super Administrator</p>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg lg:rounded-xl hover:bg-gray-100/80 transition duration-200"
                >
                  <FaChevronDown className={`transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''} ${isMobile ? 'text-sm' : ''}`} />
                </button>
                
                {/* User Dropdown Menu - Mobile Responsive */}
                {userMenuOpen && (
                  <div className={`
                    absolute bottom-full right-0 mb-2 w-48 lg:w-56 bg-white rounded-xl lg:rounded-2xl shadow-2xl border border-gray-200/60 backdrop-blur-sm z-50
                    ${isMobile ? 'max-h-60 overflow-y-auto' : ''}
                  `}>
                    <div className="p-3 lg:p-4 border-b border-gray-200/60">
                      <p className="text-sm font-semibold text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500 mt-1">admin@autokenya.com</p>
                    </div>
                    
                    <div className="p-1 lg:p-2">
                      {userMenuItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setUserMenuOpen(false)
                              if (isMobile) {
                                setSidebarOpen(false)
                              }
                            }}
                            className="flex items-center space-x-3 w-full px-3 lg:px-4 py-2 lg:py-3 text-left text-gray-700 hover:bg-gray-50/80 rounded-lg lg:rounded-xl transition duration-200 text-sm lg:text-base"
                          >
                            <Icon className="text-gray-400 text-base lg:text-lg" />
                            <span className="font-medium">{item.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        {/* Top Bar - Mobile Optimized */}
        <header className="bg-white/90 lg:bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/60 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4 lg:py-5">
            <div className="flex items-center space-x-3 lg:space-x-6">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100/80 transition duration-200"
              >
                <FaBars className="text-gray-500 text-base" />
              </button>
              
              <div>
                <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent capitalize">
                  {activePage || 'Dashboard'}
                </h1>
                <p className="text-gray-500 text-xs lg:text-sm mt-1 hidden sm:block">
                  Manage your {activePage?.toLowerCase() || 'dashboard'} efficiently
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* User Menu for Top Bar - Mobile Optimized */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="text-right hidden lg:block xl:block">
                  <p className="text-sm lg:text-base font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs lg:text-sm text-gray-500">Super Admin</p>
                </div>
                
                <div className="relative">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg cursor-pointer">
                    <span className="text-white font-bold text-xs lg:text-sm">A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Mobile Optimized */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50/50 to-blue-50/30">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}