"use client"

import { useState, useEffect } from 'react'
import { FaCar, FaTimes, FaBars, FaPhone, FaWhatsapp, FaChevronDown } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)

  const menuItems = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About Us" },
    { href: "#cars", label: "Browse Cars" },
    { href: "#contact", label: "Contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
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
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-white/20' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20 lg:h-24">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
                isScrolled 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-700' 
                  : 'bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg border border-white/30'
              }`}>
                <FaCar className={`text-2xl ${
                  isScrolled ? 'text-white' : 'text-white'
                }`} />
              </div>
              <div>
                <h1 className={`text-3xl lg:text-4xl font-black tracking-tight transition-all duration-500 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent' 
                    : 'text-white'
                }`}>
                  MAINA CARS
                </h1>
                <p className={`text-xs font-semibold tracking-widest transition-all duration-500 ${
                  isScrolled ? 'text-gray-600' : 'text-white/80'
                }`}>
                  PREMIUM AUTO
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
                className={`relative px-6 py-3 rounded-2xl text-lg font-bold transition-all duration-500 group ${
                  isActive(item.href) 
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl shadow-blue-500/25 scale-105' 
                    : isScrolled 
                    ? 'text-gray-800 hover:text-blue-700 hover:bg-white/80 hover:shadow-lg'
                    : 'text-white hover:text-white hover:bg-white/20 hover:backdrop-blur-lg'
                }`}
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
                {!isActive(item.href) && (
                  <motion.div 
                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:w-3/5 transition-all duration-300"
                    whileHover={{ width: '60%' }}
                  />
                )}
              </motion.a>
            ))}
            
            {/* Contact Buttons */}
            <div className="flex items-center gap-3 ml-6">
              <motion.a
                href="tel:+254712345678"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-lg transition-all duration-500 ${
                  isScrolled
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                    : 'bg-white/20 backdrop-blur-lg text-white border border-white/30 hover:bg-white/30'
                }`}
              >
                <FaPhone className="text-sm" />
                Call Us
              </motion.a>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-500 shadow-2xl hover:shadow-3xl flex items-center gap-3 group relative overflow-hidden"
              >
                <span className="relative z-10">Sell Your Car</span>
                <FaCar className="relative z-10 text-xl group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </div>
          </div>

          {/* Mobile menu button */}
          <motion.div 
            className="lg:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-4 rounded-2xl transition-all duration-500 ${
                isScrolled
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  : 'bg-white/20 backdrop-blur-lg border border-white/30 text-white hover:bg-white/30'
              }`}
            >
              {isOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
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
              transition={{ duration: 0.4 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 mt-4 overflow-hidden"
            >
              <div className="p-6 space-y-3">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`block px-6 py-4 rounded-2xl text-xl font-bold transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                        : 'text-gray-800 hover:bg-gray-100 hover:scale-105'
                    }`}
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.label}
                  </motion.a>
                ))}
                
                {/* Mobile Contact Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <motion.a
                    href="tel:+254712345678"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-green-600 text-white px-4 py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <FaPhone className="text-base" />
                    Call
                  </motion.a>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-4 rounded-2xl font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    onClick={() => handleNavClick('#sell')}
                  >
                    <FaCar className="text-base" />
                    Sell Car
                  </motion.button>
                </div>
                
                {/* WhatsApp Quick Action */}
                <motion.a
                  href="https://wa.me/254712345678"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mt-3"
                >
                  <FaWhatsapp className="text-xl" />
                  Chat on WhatsApp
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrolling Progress Bar */}
      <motion.div 
        className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 absolute bottom-0 left-0"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isScrolled ? (window.scrollY / (document.body.scrollHeight - window.innerHeight)) : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.nav>
  )
}