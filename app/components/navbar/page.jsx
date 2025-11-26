"use client"

import { useState, useEffect } from 'react'
import { FaCar, FaTimes, FaBars, FaPhone, FaEnvelope, FaUser, FaCalendar, FaDollarSign, FaCarSide, FaCheck, FaSpinner } from 'react-icons/fa'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carType: '',
    budget: '',
    preferredYear: '',
    features: '',
    timeline: ''
  })

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/blogs", label: "Blogs" },
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

  useEffect(() => {
    const currentPath = window.location.pathname
    setActiveLink(currentPath === '/' ? 'home' : currentPath.replace('/', ''))
  }, [])

  const handleNavClick = (href) => {
    setIsOpen(false)
    const link = href === '/' ? 'home' : href.replace('/', '')
    setActiveLink(link)
  }

  const isActive = (href) => {
    const link = href === '/' ? 'home' : href.replace('/', '')
    return activeLink === link
  }

  const handleGetQuoteClick = () => {
    setShowModal(true)
    setIsOpen(false)
  }

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setShowModal(false)
      setShowSuccess(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowSuccess(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          carType: '',
          budget: '',
          preferredYear: '',
          features: '',
          timeline: ''
        })
        
        // Auto close after success
        setTimeout(() => {
          setShowModal(false)
          setShowSuccess(false)
        }, 3000)
      } else {
        alert('There was an error submitting your request. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        setShowModal(false)
        setShowSuccess(false)
      }
    }

    if (showModal) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [showModal, isSubmitting])

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-700/50' 
            : 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/30'
        }`}
        style={{ transform: 'translateY(0)' }}
      >
        {/* ... (rest of your navbar code remains exactly the same) ... */}
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
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

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2 mr-8">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2.5 rounded-lg text-sm font-normal transition-all duration-300 group ${
                    isActive(item.href) 
                      ? 'text-cyan-400 bg-gray-800/50 shadow-inner border border-cyan-500/20' 
                      : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/30'
                  }`}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3/5 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-300" />
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
                  onClick={handleGetQuoteClick}
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
          <div
            className={`lg:hidden bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 mt-2 overflow-hidden transition-all duration-500 ${
              isOpen 
                ? 'max-h-96 opacity-100 transform translate-y-0' 
                : 'max-h-0 opacity-0 transform -translate-y-4'
            }`}
          >
            <div className="p-4 space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-normal transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-cyan-400 bg-gray-700/50 shadow-inner border border-cyan-500/20'
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
                  onClick={handleGetQuoteClick}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-lg text-sm font-normal hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  <FaEnvelope className="text-sm" />
                  Get Quote
                </button>
              </div>
            </div>
          </div>
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

      {/* Modern Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl transition-all duration-300"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl transform transition-all duration-500 scale-100 opacity-100 overflow-hidden border border-white/20 mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Notification */}
            {showSuccess && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <FaCheck className="text-white" />
                </div>
                <div>
                  <p className="font-semibold">Success!</p>
                  <p className="text-sm text-green-100">Your quote request has been submitted</p>
                </div>
              </div>
            )}

            {/* Modern Header */}
            <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 p-8">
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className={`text-white/80 hover:text-white transition-all duration-300 p-2 rounded-2xl hover:bg-white/10 backdrop-blur-sm ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl">
                  <FaCarSide className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Find Your Dream Car</h2>
                  <p className="text-blue-200 text-lg font-light">Get a personalized quote in minutes</p>
                </div>
              </div>
            </div>

            {/* Modern Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-gradient-to-br from-gray-50 to-white max-h-[70vh] overflow-y-auto">
              {/* Personal Info Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaUser className="text-blue-500" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaEnvelope className="text-blue-500" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Contact & Car Type */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaPhone className="text-blue-500" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaCarSide className="text-blue-500" />
                    Car Type *
                  </label>
                  <select
                    name="carType"
                    value={formData.carType}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select car type</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="coupe">Coupe</option>
                    <option value="convertible">Convertible</option>
                    <option value="luxury">Luxury</option>
                    <option value="sports">Sports Car</option>
                    <option value="electric">Electric Vehicle</option>
                  </select>
                </div>
              </div>

              {/* Budget & Year */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaDollarSign className="text-blue-500" />
                    Budget Range *
                  </label>
               <select
  name="budget"
  value={formData.budget}
  onChange={handleInputChange}
  required
  disabled={isSubmitting}
  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
>
  <option value="">Select budget</option>
  <option value="under-1m">Under KSh 1 Million</option>
  <option value="1m-2m">KSh 1 Million - 2 Million</option>
  <option value="2m-3m">KSh 2 Million - 3 Million</option>
  <option value="3m-5m">KSh 3 Million - 5 Million</option>
  <option value="5m-8m">KSh 5 Million - 8 Million</option>
  <option value="8m-12m">KSh 8 Million - 12 Million</option>
  <option value="over-12m">Over KSh 12 Million</option>
</select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaCalendar className="text-blue-500" />
                    Preferred Year
                  </label>
                  <select
                    name="preferredYear"
                    value={formData.preferredYear}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Any year</option>
                    <option value="2020-2023">2020-2023</option>
                    <option value="2017-2019">2017-2019</option>
                    <option value="2014-2016">2014-2016</option>
                    <option value="2010-2013">2010-2013</option>
                    <option value="before-2010">Before 2010</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Desired Features & Preferences
                </label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Leather seats, sunroof, navigation system, safety features, color preferences..."
                />
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaCalendar className="text-blue-500" />
                  Purchase Timeline *
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select timeline</option>
                  <option value="immediately">Immediately</option>
                  <option value="within-2weeks">Within 2 weeks</option>
                  <option value="1-2months">1-2 months</option>
                  <option value="3-6months">3-6 months</option>
                  <option value="just-browsing">Just browsing</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Get My Quote'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}