"use client"

import { 
  FaUserCircle,
  FaTimes,
  FaChevronRight,
  FaChartLine,
  FaSignOutAlt
} from 'react-icons/fa'
import { 
  HiOutlineHome,
  HiHome,
  HiOutlineTruck,
  HiTruck,
  HiOutlineNewspaper,
  HiNewspaper,
  HiOutlineUserGroup,
  HiUserGroup,
  HiOutlineInbox,
  HiInbox,
  HiOutlineUsers,
  HiUsers
} from 'react-icons/hi'
import { useState, useEffect } from 'react'

export default function Sidebar({ 
  activePage, 
  onTabChange, 
  isSidebarOpen, 
  isMobile, 
  showMobileSidebar, 
  setShowMobileSidebar 
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: HiOutlineHome, 
      activeIcon: HiHome,
      description: 'Overview and analytics',
      color: 'text-blue-500'
    },
    { 
      id: 'cars', 
      label: 'Car Listings', 
      icon: HiOutlineTruck, 
      activeIcon: HiTruck,
      description: 'Manage vehicle inventory',
      color: 'text-green-500'
    },
    { 
      id: 'blog', 
      label: 'Blog Posts', 
      icon: HiOutlineNewspaper, 
      activeIcon: HiNewspaper,
      description: 'Content management',
      color: 'text-purple-500'
    },
    { 
      id: 'subscribers', 
      label: 'Subscribers', 
      icon: HiOutlineUserGroup, 
      activeIcon: HiUserGroup,
      description: 'Email list management',
      color: 'text-orange-500'
    },
    { 
      id: 'inquiries', 
      label: 'Car Inquiries', 
      icon: HiOutlineInbox, 
      activeIcon: HiInbox,
      description: 'Customer inquiries',
      color: 'text-red-500'
    },
    { 
      id: 'admins', 
      label: 'Team Management', 
      icon: HiOutlineUsers, 
      activeIcon: HiUsers,
      description: 'Staff and permissions',
      color: 'text-indigo-500'
    },
  ]

  const handleTabChange = (tabId) => {
    onTabChange(tabId)
    if (isMobile) {
      setShowMobileSidebar(false)
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-24 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-blue-600">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <HiTruck className="text-white text-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar - Widened by 15% */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300' : 'relative'}
        ${isMobile && !showMobileSidebar ? '-translate-x-full' : 'translate-x-0'}
        ${isSidebarOpen ? 'w-92' : isMobile ? 'w-92' : 'w-24'} 
        bg-white shadow-xl transition-all duration-300 flex flex-col
        lg:translate-x-0 border-r border-gray-200
        overflow-hidden
      `}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            {isSidebarOpen || isMobile ? (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <HiTruck className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">CorporateSellers</h1>
                  <p className="text-blue-100 text-sm">Admin Dashboard</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <HiTruck className="text-white text-xl" />
                </div>
              </div>
            )}
            {isMobile && (
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition duration-150"
              >
                <FaTimes className="text-white text-base" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = activePage === item.id ? item.activeIcon : item.icon
              const isActive = activePage === item.id
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-150 group ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`flex-shrink-0 transition-colors duration-150 ${
                      isActive ? item.color : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                      <Icon className="text-2xl" />
                    </div>
                    
                    {(isSidebarOpen || isMobile) && (
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-base">{item.label}</span>
                          {isActive && (
                            <FaChevronRight className="text-blue-500 text-sm" />
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* System Status */}
          {(isSidebarOpen || isMobile) && (
            <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <FaChartLine className="text-white text-base" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">System Status</p>
                  <p className="text-green-600 text-xs">All systems operational</p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* User Section */}
        <div className="p-5 border-t border-gray-200 bg-gray-50">
          {/* User Profile */}
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-200">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaUserCircle className="text-white text-xl" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            
            {(isSidebarOpen || isMobile) && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-base">Admin User</p>
                  <button className="p-1 hover:bg-gray-100 rounded transition duration-150">
                    <FaChevronRight className="text-gray-400 text-xs" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm">admin@corporatesellers.com</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-green-600 text-xs font-medium">Online</span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-gray-500 text-xs">Pro Plan</span>
                </div>
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          {(isSidebarOpen || isMobile) && (
            <button className="w-full flex items-center space-x-4 p-4 mt-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition duration-150">
              <FaSignOutAlt className="text-xl flex-shrink-0" />
              <span className="font-semibold text-base">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </>
  )
}