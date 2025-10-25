"use client"

import React, { useState } from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaRocket, FaPaperPlane } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Browse Cars", href: "/cars" },
    { name: "Sell Your Car", href: "/sell" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" }
  ]

  const locations = [
    "Nairobi", "Nakuru", "Nyeri", "Muranga", "Kiambu", "Thika"
  ]

  const socialLinks = [
    { name: "Facebook", icon: <FaFacebook />, href: "https://facebook.com/mainacars", color: "hover:bg-blue-600" },
    { name: "Twitter", icon: <FaTwitter />, href: "https://twitter.com/mainacars", color: "hover:bg-sky-500" },
    { name: "Instagram", icon: <FaInstagram />, href: "https://instagram.com/mainacars", color: "hover:bg-pink-600" },
    { name: "WhatsApp", icon: <FaWhatsapp />, href: "https://wa.me/254700000000", color: "hover:bg-green-500" }
  ]

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer id="contact" className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Maina Cars
            </motion.h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Your trusted platform for buying and selling quality vehicles across Central Kenya. 
              Find the perfect car with our advanced location-based filtering and connect with verified dealers.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-white/10 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${social.color} border border-white/20 hover:border-transparent`}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-2xl">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <a 
                    href={link.href} 
                    className="text-lg text-gray-300 hover:text-white transition-all duration-300 flex items-center group"
                  >
                    <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 group-hover:scale-150 transition-transform duration-300 shadow-lg"></span>
                    <span className="group-hover:font-medium">{link.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Locations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Contact & Locations
            </h4>
            
            {/* Contact Info */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300">
                <FaPhone className="mr-4 text-2xl text-blue-400" />
                <div>
                  <div className="font-semibold text-lg">+254 700 000 000</div>
                  <div className="text-sm text-gray-400">Mon-Sun, 8AM-8PM</div>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                <FaEnvelope className="mr-4 text-2xl text-purple-400" />
                <div>
                  <div className="font-semibold text-lg">info@mainacars.com</div>
                  <div className="text-sm text-gray-400">Quick response</div>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-400/50 transition-all duration-300">
                <FaMapMarkerAlt className="mr-4 text-2xl text-green-400" />
                <div>
                  <div className="font-semibold text-lg">Nairobi, Kenya</div>
                  <div className="text-sm text-gray-400">Head Office</div>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div>
              <h5 className="font-bold mb-3 text-lg text-gray-200">We Cover:</h5>
              <div className="flex flex-wrap gap-2">
                {locations.map((location, index) => (
                  <motion.span 
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 rounded-full text-lg text-gray-300 border border-white/10 backdrop-blur-sm hover:border-blue-400/30 transition-all duration-300"
                  >
                    {location}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter Subscription - EXTENDED & MODERN */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="border-t border-white/20 pt-12 pb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
              <motion.h4 
                className="text-3xl font-bold mb-3 flex items-center justify-center lg:justify-start gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <FaRocket className="text-blue-400 animate-bounce" />
                Stay Updated
                <FaRocket className="text-purple-400 animate-bounce" />
              </motion.h4>
              <p className="text-xl text-gray-300 max-w-2xl">
                Get exclusive car deals, early access to new listings, and special offers delivered to your inbox
              </p>
            </div>
            
            <AnimatePresence>
              {!isSubscribed ? (
                <motion.form 
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto min-w-[500px]"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative flex-1">
                    <motion.input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 border-2 border-white/20 text-lg transition-all duration-300"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 -z-10"
                      whileHover={{ opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <motion.button 
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center gap-3 whitespace-nowrap text-lg shadow-lg relative overflow-hidden"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setIsHovering(true)}
                    onHoverEnd={() => setIsHovering(false)}
                  >
                    <motion.span
                      animate={{ x: isHovering ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      Subscribe
                    </motion.span>
                    <motion.div
                      animate={{ x: isHovering ? 5 : 0, rotate: isHovering ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <FaPaperPlane />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform"
                      initial={{ x: "-100%" }}
                      animate={{ x: isHovering ? "200%" : "-100%" }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center gap-3"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    🎉
                  </motion.div>
                  Welcome to the Maina Cars family!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="border-t border-white/20 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-lg text-gray-300 text-center md:text-left">
              <p>
                &copy; 2024 Maina Cars. All rights reserved. |{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                  Your Trusted Car Marketplace in Central Kenya
                </span>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, index) => (
                <motion.a 
                  key={index}
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:font-medium relative group"
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}