"use client"

import React, { useState } from 'react'
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaRocket, FaPaperPlane, 
  FaShieldAlt, FaFileContract, FaCookie, FaTimes, FaChevronDown,
  FaCheck, FaCar, FaUserShield, FaDatabase, FaEye
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function CorporateFooter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [expandedSection, setExpandedSection] = useState(null)

  const quickLinks = [
    { name: "Corporate Fleet", href: "/fleet" },
    { name: "Business Leasing", href: "/leasing" },
    { name: "Enterprise Solutions", href: "/enterprise" },
    { name: "Partner Dealers", href: "/dealers" },
    { name: "Investor Relations", href: "/investors" },
    { name: "Careers", href: "/careers" }
  ]

  const services = [
    "Fleet Management",
    "Vehicle Leasing",
    "Corporate Financing",
    "Maintenance Packages",
    "Insurance Services",
    "24/7 Support"
  ]

  const socialLinks = [
    { name: "LinkedIn", icon: <FaLinkedin />, href: "https://linkedin.com/company/corporateautokenya", color: "hover:bg-blue-700" },
    { name: "Twitter", icon: <FaTwitter />, href: "https://twitter.com/corporateautoke", color: "hover:bg-sky-500" },
    { name: "Facebook", icon: <FaFacebook />, href: "https://facebook.com/corporateautokenya", color: "hover:bg-blue-600" },
    { name: "Instagram", icon: <FaInstagram />, href: "https://instagram.com/corporateautoke", color: "hover:bg-pink-600" },
    { name: "WhatsApp", icon: <FaWhatsapp />, href: "https://wa.me/254700000000", color: "hover:bg-green-500" }
  ]

  const privacySections = [
    {
      id: 'data-collection',
      title: 'Data Collection & Usage',
      icon: <FaDatabase className="text-blue-400" />,
      content: `We collect information necessary to provide our corporate vehicle services, including:
• Business contact details for service delivery
• Vehicle preferences and requirements
• Communication history for quality assurance
• Usage data to improve our services

All data is processed in accordance with Kenyan data protection laws and used solely for service enhancement and business communication.`
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Security',
      icon: <FaUserShield className="text-green-400" />,
      content: `Your corporate data security is our priority:
• Enterprise-grade encryption for all data
• Regular security audits and compliance checks
• Limited access to authorized personnel only
• Secure data centers with 24/7 monitoring
• Compliance with GDPR and local data protection regulations

We implement industry-standard security measures to protect your information.`
    },
    {
      id: 'third-party',
      title: 'Third-Party Sharing',
      icon: <FaEye className="text-purple-400" />,
      content: `We may share information with:
• Verified partner dealerships for vehicle sourcing
• Financial institutions for financing arrangements
• Insurance providers for coverage processing
• Service partners for maintenance and support

All third parties are vetted and bound by strict confidentiality agreements. We never sell your data to marketing companies.`
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking',
      icon: <FaCookie className="text-amber-400" />,
      content: `Our website uses cookies to enhance your experience:
• Essential cookies for site functionality
• Analytics cookies for service improvement
• Preference cookies for personalized experience
• Marketing cookies for relevant business offers

You can control cookie preferences through your browser settings. Some features may not work properly without essential cookies.`
    }
  ]

  const termsContent = [
    {
      id: 'service-agreement',
      title: 'Service Agreement',
      content: `By using Corporate Auto Kenya services, you agree to:
• Provide accurate business information
• Use services for legitimate business purposes
• Maintain confidentiality of account credentials
• Comply with all applicable laws and regulations

We reserve the right to modify services and terms with 30 days notice.`
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      content: `All content, logos, and proprietary technology are owned by Corporate Auto Kenya.
• Business clients may use our platform for internal vehicle management
• Unauthorized reproduction of content is prohibited
• Trademarks and service marks are protected under Kenyan law`
    },
    {
      id: 'liability',
      title: 'Liability & Warranties',
      content: `While we strive for excellence:
• Services are provided "as is" without warranties
• We're not liable for indirect damages
• Vehicle condition and availability may vary
• Partner dealership terms apply to final transactions

Maximum liability is limited to service fees paid.`
    }
  ]

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 4000)
    }
  }

  const openModal = (modalType) => {
    setActiveModal(modalType)
    setExpandedSection(null)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setActiveModal(null)
    setExpandedSection(null)
    document.body.style.overflow = 'unset'
  }

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const Modal = ({ type, title, sections }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                {type === 'privacy' ? <FaShieldAlt className="text-white text-xl" /> : 
                 type === 'terms' ? <FaFileContract className="text-white text-xl" /> : 
                 <FaCookie className="text-white text-xl" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-blue-100">
                  {type === 'privacy' ? 'How we protect and use your data' : 
                   type === 'terms' ? 'Service terms and conditions' : 
                   'Our cookie usage policy'}
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <span className="font-semibold text-lg text-white">{section.title}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="text-gray-400" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedSection === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-gray-700 bg-gray-800/30">
                        <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                          {section.content}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <FaCheck className="text-blue-400 text-lg mt-1 flex-shrink-0" />
              <div>
                <p className="text-blue-300 font-medium">Last Updated: December 2024</p>
                <p className="text-blue-400/80 text-sm">
                  For questions about our policies, contact our legal team at legal@corporateauto.co.ke
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              By using our services, you acknowledge you've read and understood these policies
            </p>
            <button
              onClick={closeModal}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              I Understand
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )

  return (
    <>
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
                className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3"
              >
                <FaCar className="text-blue-400" />
                Corporate Auto Kenya
              </motion.h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Enterprise-grade vehicle solutions for businesses across Kenya. 
                Streamline your fleet management with our comprehensive corporate services, 
                premium vehicle selection, and dedicated business support.
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
                Business Solutions
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

            {/* Services & Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Our Services
              </h4>
              
              {/* Services List */}
              <div className="mb-6 space-y-3">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300"
                  >
                    <FaCheck className="mr-3 text-green-400 text-sm" />
                    <span className="text-gray-300 text-lg">{service}</span>
                  </motion.div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300">
                  <FaPhone className="mr-3 text-blue-400" />
                  <div>
                    <div className="font-semibold text-lg">+254 700 000 000</div>
                    <div className="text-sm text-gray-400">Business Hours</div>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                  <FaEnvelope className="mr-3 text-purple-400" />
                  <div>
                    <div className="font-semibold text-lg">corporate@auto.co.ke</div>
                    <div className="text-sm text-gray-400">Enterprise Support</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Newsletter Subscription */}
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
                  Business Insights
                  <FaRocket className="text-purple-400 animate-bounce" />
                </motion.h4>
                <p className="text-xl text-gray-300 max-w-2xl">
                  Get industry insights, fleet management tips, and exclusive corporate offers
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
                        placeholder="Enter your business email..."
                        className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 border-2 border-white/20 text-lg transition-all duration-300"
                        required
                        whileFocus={{ scale: 1.02 }}
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
                    Welcome to Corporate Auto Insights!
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
                  &copy; 2024 Corporate Auto Kenya. All rights reserved. |{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                    Enterprise Vehicle Solutions
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-lg">
                <motion.button 
                  onClick={() => openModal('privacy')}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:font-medium relative group flex items-center gap-2"
                  whileHover={{ y: -2 }}
                >
                  <FaShieldAlt className="text-blue-400" />
                  Privacy Policy
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </motion.button>
                <motion.button 
                  onClick={() => openModal('terms')}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:font-medium relative group flex items-center gap-2"
                  whileHover={{ y: -2 }}
                >
                  <FaFileContract className="text-purple-400" />
                  Terms of Service
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </motion.button>
                <motion.button 
                  onClick={() => openModal('cookies')}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:font-medium relative group flex items-center gap-2"
                  whileHover={{ y: -2 }}
                >
                  <FaCookie className="text-amber-400" />
                  Cookie Policy
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {activeModal === 'privacy' && (
          <Modal 
            type="privacy"
            title="Privacy Policy"
            sections={privacySections}
          />
        )}
      </AnimatePresence>

      {/* Terms of Service Modal */}
      <AnimatePresence>
        {activeModal === 'terms' && (
          <Modal 
            type="terms"
            title="Terms of Service"
            sections={termsContent}
          />
        )}
      </AnimatePresence>

      {/* Cookie Policy Modal */}
      <AnimatePresence>
        {activeModal === 'cookies' && (
          <Modal 
            type="cookies"
            title="Cookie Policy"
            sections={privacySections.filter(section => section.id === 'cookies' || section.id === 'data-collection')}
          />
        )}
      </AnimatePresence>
    </>
  )
}