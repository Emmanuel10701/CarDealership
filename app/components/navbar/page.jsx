"use client"

import { useState, useEffect } from 'react'
import { FaCar, FaTimes, FaBars, FaPhone, FaWhatsapp, FaSearch, FaEnvelope, FaUser } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)

  const menuItems = [
    { href: "#home", label: "Home" },
    { href: "#inventory", label: "Inventory" },
    { href: "#sell", label: "Sell Your Car" },
    { href: "#financing", label: "Financing" },
    { href: "#about", label: "About Us" },
    { href: "#contact", label: "Contact" },
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
    setActiveLink(href.replace('#', ''))
  }

  const isActive = (href) => activeLink === href.replace('#', '')

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-700/50' 
          : 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/30'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                isScrolled 
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}>
                <FaCar className="text-white text-lg" />
              </div>
              <div>
                <h1 className={`text-xl lg:text-2xl font-medium tracking-tight transition-all duration-500 text-white`}>
                  CorporateSellers
                </h1>
                <p className={`text-xs font-normal tracking-wider transition-all duration-500 ${
                  isScrolled ? 'text-gray-400' : 'text-gray-400'
                }`}>
                  PREMIUM AUTO SOLUTIONS
                </p>
              </div>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative px-4 py-2.5 rounded-lg text-sm font-normal transition-all duration-300 group ${
                  isActive(item.href) 
                    ? 'text-cyan-400 bg-gray-800/50 shadow-inner' 
                    : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/30'
                }`}
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
                {!isActive(item.href) && (
                  <motion.div 
                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full group-hover:w-3/5 transition-all duration-300"
                    whileHover={{ width: '60%' }}
                  />
                )}
              </motion.a>
            ))}
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              <motion.a
                href="#search"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-normal transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/30'
                    : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/30'
                }`}
              >
                <FaSearch className="text-sm" />
                Search
              </motion.a>
              
              <motion.a
                href="tel:+254712345678"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-normal transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/30'
                    : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/30'
                }`}
              >
                <FaPhone className="text-sm" />
                Contact
              </motion.a>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2.5 rounded-lg text-sm font-normal hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10">Get Quote</span>
                <FaEnvelope className="relative z-10 text-sm group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </div>
          </div>

          {/* Mobile menu button */}
          <motion.div 
            className="lg:hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
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
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 mt-2 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`block px-4 py-3 rounded-lg text-sm font-normal transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-cyan-400 bg-gray-700/50 shadow-inner'
                        : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-700/30'
                    }`}
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.label}
                  </motion.a>
                ))}
                
                {/* Mobile Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <motion.a
                    href="#search"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-700/50 text-gray-300 px-3 py-3 rounded-lg text-sm font-normal hover:text-cyan-300 hover:bg-gray-700/70 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaSearch className="text-sm" />
                    Search
                  </motion.a>
                  
                  <motion.a
                    href="tel:+254712345678"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-700/50 text-gray-300 px-3 py-3 rounded-lg text-sm font-normal hover:text-cyan-300 hover:bg-gray-700/70 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaPhone className="text-sm" />
                    Call
                  </motion.a>
                </div>
                
                {/* Get Quote Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-lg text-sm font-normal hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 mt-2"
                  onClick={() => handleNavClick('#sell')}
                >
                  <FaEnvelope className="text-sm" />
                  Get Quote
                </motion.button>
                
                {/* WhatsApp Quick Action */}
                <motion.a
                  href="https://wa.me/254712345678"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg text-sm font-normal hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                >
                  <FaWhatsapp className="text-base" />
                  WhatsApp
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrolling Progress Bar */}
      <motion.div 
        className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 absolute bottom-0 left-0"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isScrolled ? (window.scrollY / (document.body.scrollHeight - window.innerHeight)) : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.nav>
  )
}