'use client'

import { useState } from 'react'
import { FaSearch, FaTimes, FaPhone, FaEnvelope, FaQuestionCircle, FaChevronDown, FaStar, FaFilter, FaRocket, FaShieldAlt, FaClock, FaMoneyBill, FaCar, FaUsers } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const FAQComponent = () => {
  const [activeFaq, setActiveFaq] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Support info
  const SUPPORT_PHONE = '0791596795'
  const SUPPORT_EMAIL = 'corporatesellerke@gmail.com'

  // Enhanced FAQ data with icons and colors
  const TOP_FAQS = [
    {
      id: 1,
      question: "How do I list my car for sale on your platform?",
      answer: `Listing your car is simple: 1) Visit our 'Sell Your Car' page, 2) Fill in your vehicle details (make, model, year, condition), 3) Upload clear photos, 4) Set your asking price, 5) Submit for review. Corporate sellers can email ${SUPPORT_EMAIL} or call ${SUPPORT_PHONE} for bulk listing assistance. We connect buyers and sellers across Central Kenya including Nairobi and Nakuru regions.`,
      category: "Selling",
      icon: FaRocket,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      id: 2,
      question: "What documents do corporate sellers need to provide?",
      answer: `For corporate sellers, we require: Company registration certificate, KRA PIN certificate, Director's national IDs, Authorization letter, Original logbook, NTSA clearance, and valid insurance. Contact us at ${SUPPORT_PHONE} or ${SUPPORT_EMAIL} for corporate account setup and bulk vehicle management.`,
      category: "Documentation",
      icon: FaShieldAlt,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50"
    },
    {
      id: 3,
      question: "How do you verify vehicle authenticity?",
      answer: "We conduct thorough verification including: NTSA document checks, mechanical inspection by certified technicians, VIN validation, service history audit, and ownership verification. Corporate fleets receive expedited verification with detailed condition reports for each vehicle.",
      category: "Verification",
      icon: FaShieldAlt,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50"
    },
    {
      id: 4,
      question: "What payment options are available?",
      answer: `Corporate payment options include: Bank transfers (for bulk purchases), Escrow services (secured transactions), Payment plans (staggered payments), and invoice-based systems. For corporate accounts, contact ${SUPPORT_EMAIL} to discuss customized payment solutions.`,
      category: "Payment",
      icon: FaMoneyBill,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50"
    },
    {
      id: 5,
      question: "How long does the selling process take?",
      answer: `Corporate sales are expedited: Listing setup (2 hours), Verification (12-24 hours), Buyer matching (1-3 days), Documentation (1-2 days). For urgent corporate disposals, call ${SUPPORT_PHONE} for priority service. We specialize in connecting corporate sellers with serious buyers.`,
      category: "Timeline",
      icon: FaClock,
      color: "from-violet-500 to-indigo-500",
      bgColor: "bg-gradient-to-br from-violet-50 to-indigo-50"
    },
    {
      id: 6,
      question: "What are your fees for corporate sellers?",
      answer: "Corporate rates: 2.5% commission (capped at KSh 75,000 per vehicle) with bulk discounts available. Includes marketing across our Central Kenya network, verification, paperwork handling, and buyer vetting. Contact us for customized corporate packages.",
      category: "Pricing",
      icon: FaMoneyBill,
      color: "from-rose-500 to-red-500",
      bgColor: "bg-gradient-to-br from-rose-50 to-red-50"
    },
    {
      id: 7,
      question: "How do I browse cars available for purchase?",
      answer: "Visit our 'Car Listing' page to browse available vehicles. You can filter by make, model, price range, location (Nairobi, Nakuru, Central Kenya), and features. Create an account to save favorites and receive notifications for new listings matching your criteria.",
      category: "Buying",
      icon: FaCar,
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-teal-50 to-cyan-50"
    },
    {
      id: 8,
      question: "How do I contact your support team?",
      answer: `Call us at ${SUPPORT_PHONE} for immediate assistance or email ${SUPPORT_EMAIL}. Visit our 'Contact Us' page for our Nairobi and Nakuru office locations. Corporate inquiries get priority response within 2 hours during business hours.`,
      category: "Support",
      icon: FaUsers,
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50"
    }
  ]

  // Enhanced categories with icons (using FaStar instead of FaSparkles)
  const categories = [
    { 
      id: 'all', 
      name: 'All Questions', 
      count: TOP_FAQS.length,
      icon: FaStar,
      color: 'from-gray-600 to-slate-700'
    },
    { 
      id: 'selling', 
      name: 'Selling', 
      count: TOP_FAQS.filter(f => f.category === 'Selling').length,
      icon: FaRocket,
      color: 'from-blue-600 to-cyan-600'
    },
    { 
      id: 'buying', 
      name: 'Buying', 
      count: TOP_FAQS.filter(f => f.category === 'Buying').length,
      icon: FaCar,
      color: 'from-emerald-600 to-green-600'
    },
    { 
      id: 'payment', 
      name: 'Payment', 
      count: TOP_FAQS.filter(f => f.category === 'Payment' || f.category === 'Pricing').length,
      icon: FaMoneyBill,
      color: 'from-amber-600 to-orange-600'
    },
    { 
      id: 'support', 
      name: 'Support', 
      count: TOP_FAQS.filter(f => f.category === 'Support' || f.category === 'Documentation' || f.category === 'Verification' || f.category === 'Timeline').length,
      icon: FaUsers,
      color: 'from-purple-600 to-pink-600'
    }
  ]

  // Filter FAQs
  const filteredFAQs = TOP_FAQS.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
      faq.category.toLowerCase() === selectedCategory.toLowerCase()
    
    return matchesSearch && matchesCategory
  })

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id)
  }

  // Ultra Modern FAQ Item
  const ModernFAQItem = ({ faq, isActive, index }) => {
    const IconComponent = faq.icon

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={`relative overflow-hidden rounded-xl mb-3 transition-all duration-300 ${
          isActive 
            ? 'shadow-lg shadow-blue-500/10' 
            : 'shadow-sm hover:shadow-md'
        }`}
      >
        {/* Gradient border effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${faq.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        <button
          onClick={() => toggleFaq(faq.id)}
          className={`w-full p-4 text-left flex items-start justify-between relative z-10 ${
            isActive ? faq.bgColor : 'bg-white'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${faq.color} flex items-center justify-center text-white text-sm flex-shrink-0`}>
              <IconComponent />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                {faq.question}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${faq.color} text-white`}>
                  {faq.category}
                </span>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={`ml-3 mt-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <FaChevronDown className="text-sm" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <div className="pl-12">
                  <p className="text-gray-600 leading-relaxed text-xs mb-3">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <section className="py-10 sm:py-12 lg:py-14 px-3 sm:px-5 lg:px-6 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm">
              <FaQuestionCircle />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Frequently Asked
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-lg sm:text-xl lg:text-2xl">
                Questions
              </span>
            </h1>
          </div>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get instant answers to the most common questions about buying, selling, 
            and managing your vehicles with our corporate platform.
          </p>
        </motion.div>

        {/* Enhanced Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-xs ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <Icon className="text-xs" />
                  <span>{category.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    selectedCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Modern Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-xl border border-gray-200">
              <div className="flex items-center">
                <FaSearch className="ml-3 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-2 pr-8 py-2.5 text-sm placeholder-gray-400 text-gray-900 focus:outline-none"
                />
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="text-xs" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between max-w-md mx-auto px-3">
            <div className="text-xs font-medium text-gray-700">
              Showing <span className="text-blue-600">{filteredFAQs.length}</span> of {TOP_FAQS.length} questions
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-800 font-medium text-xs"
              >
                Clear search
              </button>
            )}
          </div>
        </motion.div>

        {/* Enhanced FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10"
        >
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-dashed border-gray-300">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-base font-bold text-gray-800 mb-2">No results found</h3>
              <p className="text-gray-500 text-xs mb-6 max-w-md mx-auto">
                We couldn't find any questions matching your search. Try different keywords.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:shadow-lg transition-all"
              >
                View All Questions
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filteredFAQs.map((faq, index) => (
                  <ModernFAQItem
                    key={faq.id}
                    faq={faq}
                    isActive={activeFaq === faq.id}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Premium Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative overflow-hidden rounded-xl"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600"></div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
          </div>

          <div className="relative p-6 sm:p-7 text-white">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-base sm:text-lg font-bold mb-3">
                Still Have Questions?
                <span className="block text-cyan-200 text-sm mt-1">We're Here to Help</span>
              </h3>
              <p className="text-xs text-blue-100 mb-6 leading-relaxed">
                Our dedicated corporate support team is available 24/7 to assist you with 
                any questions about vehicle transactions, documentation, or fleet management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={`tel:${SUPPORT_PHONE}`}
                  className="group flex items-center gap-3 px-5 py-3 bg-white text-blue-600 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all duration-200 shadow-md"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                    <FaPhone className="text-xs" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Call us now</div>
                    <div className="text-sm font-black">{SUPPORT_PHONE}</div>
                  </div>
                </a>
                
                <div className="text-white/80 text-xs">or</div>
                
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="group flex items-center gap-3 px-5 py-3 bg-blue-800/50 backdrop-blur-sm border border-blue-700 text-white rounded-lg font-semibold text-sm hover:bg-blue-900/70 transition-all duration-200 shadow-md"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                    <FaEnvelope className="text-xs" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-blue-200">Email us at</div>
                    <div className="text-xs font-black">{SUPPORT_EMAIL}</div>
                  </div>
                </a>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/20">
                <p className="text-blue-100 text-xs">
                  Average response time: <span className="font-bold">Under 15 minutes</span> for corporate clients
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default FAQComponent