"use client"

import { useState, useEffect } from 'react'
import { FaCar, FaTimes, FaBars, FaPhone, FaEnvelope } from 'react-icons/fa'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/admin", label: "Admin" },
    { href: "/sell-your-car", label: "Sell Your Car" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href) => {
    setIsOpen(false)
    setActiveLink(href.replace('/', ''))
  }

  const isActive = (href) => activeLink === href.replace('/', '')

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-700/50' 
          : 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/30'
      }`}
      style={{ transform: 'translateY(0)' }}
    >
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo - Pushed from left edge */}
          <div className="flex items-center ml-4 lg:ml-8">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                isScrolled 
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}>
                <FaCar className="text-white text-sm lg:text-lg" />
              </div>
              <div>
                <h1 className={`text-lg lg:text-2xl font-medium tracking-tight transition-all duration-500 text-white`}>
                  CorporateSellers
                </h1>
                <p className={`text-xs font-normal tracking-wider transition-all duration-500 ${
                  isScrolled ? 'text-gray-400' : 'text-gray-400'
                }`}>
                  PREMIUM AUTO SOLUTIONS
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Menu - Pushed from right edge */}
          <div className="hidden lg:flex items-center space-x-2 mr-8">
            {menuItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2.5 rounded-lg text-sm font-normal transition-all duration-300 group ${
                  isActive(item.href) 
                    ? 'text-cyan-400 bg-gray-800/50 shadow-inner' 
                    : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/30'
                }`}
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
                {!isActive(item.href) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full group-hover:w-3/5 transition-all duration-300" />
                )}
              </a>
            ))}
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-6">
              <a
                href="tel:+254712345678"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-normal transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/30'
                    : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/30'
                }`}
              >
                <FaPhone className="text-sm" />
                Contact
              </a>
              
              <button
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2.5 rounded-lg text-sm font-normal hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10">Get Quote</span>
                <FaEnvelope className="relative z-10 text-sm group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden mr-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-3 rounded-lg transition-all duration-300 ${
                isScrolled
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-cyan-300'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-cyan-300'
              }`}
            >
              {isOpen ? (
                <FaTimes className="text-lg" />
              ) : (
                <FaBars className="text-lg" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="lg:hidden bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 mt-2 overflow-hidden transition-all duration-300"
            style={{ 
              opacity: isOpen ? 1 : 0,
              maxHeight: isOpen ? '500px' : '0',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-normal transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-cyan-400 bg-gray-700/50 shadow-inner'
                      : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-700/30'
                  }`}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </a>
              ))}
              
              {/* Mobile Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3">
                <a
                  href="tel:+254712345678"
                  className="bg-gray-700/50 text-gray-300 px-3 py-3 rounded-lg text-sm font-normal hover:text-cyan-300 hover:bg-gray-700/70 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaPhone className="text-sm" />
                  Call
                </a>
                
                <button
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-lg text-sm font-normal hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  onClick={() => handleNavClick('/sell-your-car')}
                >
                  <FaEnvelope className="text-sm" />
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scrolling Progress Bar */}
      <div 
        className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 absolute bottom-0 left-0 transition-transform duration-300"
        style={{ 
          transform: `scaleX(${isScrolled ? (typeof window !== 'undefined' ? window.scrollY / (document.body.scrollHeight - window.innerHeight) : 0) : 0})`,
          transformOrigin: 'left'
        }}
      />
    </nav>
  )
}