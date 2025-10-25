"use client"
import React from 'react'
import { FaCar, FaSearch, FaStar, FaCreditCard, FaTruck, FaPhone, FaShieldAlt, FaMapMarkerAlt, FaUsers, FaChartLine } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function AboutUs() {
  const features = [
    {
      icon: <FaCar className="text-white text-2xl" />,
      title: "Wide Selection",
      description: "Hundreds of verified cars from trusted dealers across Central Kenya including Nairobi, Nakuru, Nyeri, and more",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaSearch className="text-white text-2xl" />,
      title: "Smart Location Filters",
      description: "Find cars specifically in your preferred Central Kenya location with our advanced geo-targeting",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaStar className="text-white text-2xl" />,
      title: "Quality Assured",
      description: "Every vehicle undergoes thorough inspection and verification by our expert team",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: <FaCreditCard className="text-white text-2xl" />,
      title: "Secure Transactions",
      description: "Safe and secure payment processing with buyer protection for all your purchases",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaTruck className="text-white text-2xl" />,
      title: "Test Drive Arrangements",
      description: "We help arrange test drives in your preferred location across Central Kenya",
      gradient: "from-red-500 to-rose-500"
    },
    {
      icon: <FaPhone className="text-white text-2xl" />,
      title: "24/7 Premium Support",
      description: "Our dedicated support team is always ready to assist you with any inquiries",
      gradient: "from-indigo-500 to-blue-500"
    }
  ]

  const stats = [
    { number: "500+", label: "Vehicles Listed", icon: <FaCar className="text-blue-500" /> },
    { number: "6", label: "Major Regions Covered", icon: <FaMapMarkerAlt className="text-green-500" /> },
    { number: "50+", label: "Trusted Dealer Partners", icon: <FaUsers className="text-purple-500" /> },
    { number: "95%", label: "Customer Satisfaction", icon: <FaChartLine className="text-amber-500" /> }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section id="about" className="relative py-20 lg:py-28 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-blue-600 uppercase mb-4 bg-blue-50 px-4 py-2 rounded-full"
          >
            <FaShieldAlt className="text-blue-500" />
            Our Commitment
          </motion.p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Maina Cars
            </span>
            ?
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Your trusted partner in finding the perfect vehicle across Central Kenya. 
            We connect you with <strong className="font-semibold text-gray-800">verified dealers</strong> and{" "}
            <strong className="font-semibold text-gray-800">quality cars</strong>, right in your preferred location.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-100/50 transition-all duration-500 group-hover:border-blue-200/50">
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-light group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-500/5 p-8 sm:p-12 border border-gray-100/50">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition duration-300">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium tracking-wide text-sm uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="relative bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl p-12 shadow-2xl shadow-blue-500/10 border border-blue-200/20 backdrop-blur-sm max-w-5xl mx-auto overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
            
            <div className="relative">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Ready to Find Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dream Car</span>?
              </h3>
              <p className="text-gray-700 mb-8 text-xl font-light max-w-2xl mx-auto">
                Browse our extensive collection or become a verified dealer today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition duration-300" />
                  <span className="relative flex items-center gap-3">
                    <FaCar className="text-lg" />
                    Browse All Cars
                  </span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <span className="relative flex items-center gap-3">
                    <FaUsers className="text-lg" />
                    Become a Dealer
                  </span>
                </motion.button>
              </div>
              
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-500" />
                  <span>Verified Dealers</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <FaStar className="text-amber-500" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <FaCreditCard className="text-blue-500" />
                  <span>Secure Payments</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}