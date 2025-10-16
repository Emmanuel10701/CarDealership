"use client"

import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('home')

  const menuItems = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About Us" },
    { href: "#cars", label: "Browse Cars" },
    { href: "#contact", label: "Contact" },
  ]

  const handleNavClick = (href) => {
    setIsOpen(false)
    setActiveLink(href.replace('#', ''))
  }

  // Simple active link based on click
  const isActive = (href) => activeLink === href.replace('#', '')

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer">
                Maina Cars
              </h1>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-md text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                    isActive(item.href) 
                      ? 'text-blue-700 font-bold scale-110 bg-blue-50 px-6 shadow-md' 
                      : 'text-gray-900 hover:text-blue-600'
                  }`}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </a>
              ))}
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 animate-pulse">
                Sell Your Car
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-gray-900 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 hover:scale-110"
            >
              <svg className="h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 animate-slideIn">
            <div className="px-4 pt-3 pb-4 space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-4 rounded-md text-xl font-semibold border-b border-gray-100 transition-all duration-300 hover:bg-blue-50 ${
                    isActive(item.href)
                      ? 'text-blue-700 font-bold bg-blue-50 border-blue-200 scale-105'
                      : 'text-gray-900 hover:text-blue-600'
                  }`}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </a>
              ))}
              <button 
                className="w-full bg-blue-600 text-white px-4 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 text-xl font-bold mt-3 shadow-lg hover:shadow-xl active:scale-95 animate-pulse"
                onClick={() => handleNavClick('#sell')}
              >
                Sell Your Car
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </nav>
  )
}