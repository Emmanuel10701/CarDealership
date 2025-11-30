"use client"

import React, { useState } from 'react'
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaRocket, FaPaperPlane, 
  FaShieldAlt, FaFileContract, FaCookie, FaTimes, FaChevronDown,
  FaCheck, FaArrowRight
} from 'react-icons/fa'
import { CircularProgress } from '@mui/material'
import Image from 'next/image'

export default function ModernCorporateFooter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [expandedSection, setExpandedSection] = useState(null)
  const [error, setError] = useState('')

  const navigationSections = [
    {
      title: "Solutions",
      links: [
        { name: "Corporate Fleet", href: "/fleet" },
        { name: "Business Leasing", href: "/leasing" },
        { name: "Enterprise Solutions", href: "/enterprise" },
        { name: "Partner Dealers", href: "/dealers" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Investor Relations", href: "/investors" },
        { name: "Careers", href: "/careers" },
        { name: "News & Insights", href: "/news" }
      ]
    },
    {
      title: "Services",
      links: [
        "Vehicle Sourcing",
        "Fleet Management", 
        "Corporate Financing",
        "Maintenance Packages",
        "Insurance Services",
        "24/7 Support"
      ]
    }
  ]

  const contactInfo = [
    {
      icon: <FaPhone className="text-blue-400" />,
      title: "Sales & Support",
      details: "+254 791 596 795",
      subtitle: "Mon-Fri 8AM-6PM"
    },
    {
      icon: <FaEnvelope className="text-purple-400" />,
      title: "Enterprise Support", 
      details: "info@corporatesellers.co.ke",
      subtitle: "24/7 Response"
    },
    {
      icon: <FaMapMarkerAlt className="text-green-400" />,
      title: "Headquarters",
      details: "Nairobi, Kenya",
      subtitle: "Westlands Business District"
    }
  ]

  // Custom Social Media Icons
  const XIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )

  const WhatsAppIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335 .157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.169-3.495-8.418"/>
    </svg>
  )

  const YouTubeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )

  const RedditIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.213 12.43a1.428 1.428 0 11-2.856 0 1.428 1.428 0 012.856 0zM7.143 10a1.429 1.429 0 100 2.858 1.429 1.429 0 000-2.858zm7.857-1.43c0 .79-.64 1.43-1.429 1.43a1.43 1.43 0 01-1.347-1.923l2.518-.595a1.43 1.43 0 011.258 1.088zm-1.347-3.334l-2.239 2.239a3.573 3.573 0 00-3.567-1.932l.768-2.417 2.068.431a1.43 1.43 0 112.682.933l2.068.431z" clipRule="evenodd" />
    </svg>
  )

  const socialLinks = [
    { 
      name: "X (Twitter)", 
      icon: <XIcon />, 
      href: "https://x.com/mainatim86", 
      color: "hover:bg-black" 
    },
    { 
      name: "WhatsApp", 
      icon: <WhatsAppIcon />, 
      href: "https://wa.me/254791596795", 
      color: "hover:bg-green-500" 
    },
    { 
      name: "YouTube", 
      icon: <YouTubeIcon />, 
      href: "https://youtube.com/@corporatesellers", 
      color: "hover:bg-red-600" 
    },
    { 
      name: "Reddit", 
      icon: <RedditIcon />, 
      href: "https://www.reddit.com/u/corporatesellerske", 
      color: "hover:bg-orange-500" 
    }
  ]

  const privacySections = [
    {
      id: 'data-collection',
      title: 'Data Collection & Usage',
      icon: <FaShieldAlt className="text-blue-400" />,
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
      icon: <FaShieldAlt className="text-green-400" />,
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
      icon: <FaShieldAlt className="text-purple-400" />,
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
      content: `By using Corporate Sellers services, you agree to:
• Provide accurate business information
• Use services for legitimate business purposes
• Maintain confidentiality of account credentials
• Comply with all applicable laws and regulations

We reserve the right to modify services and terms with 30 days notice.`
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      content: `All content, logos, and proprietary technology are owned by Corporate Sellers.
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

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/subscriber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubscribed(true)
        setEmail('')
        setTimeout(() => setIsSubscribed(false), 5000)
      } else {
        setError(data.error || 'Subscription failed. Please try again.')
      }
    } catch (error) {
      console.error('Error subscribing:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                {type === 'privacy' ? <FaShieldAlt className="text-white text-xl" /> : 
                 type === 'terms' ? <FaFileContract className="text-white text-xl" /> : 
                 <FaCookie className="text-white text-xl" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <p className="text-blue-100 text-sm">
                  {type === 'privacy' ? 'How we protect and use your data' : 
                   type === 'terms' ? 'Service terms and conditions' : 
                   'Our cookie usage policy'}
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] scrollbar-hide">
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <span className="font-semibold text-white text-base">{section.title}</span>
                  </div>
                  <div className={`transform transition-transform duration-300 ${expandedSection === section.id ? 'rotate-180' : ''}`}>
                    <FaChevronDown className="text-gray-400" />
                  </div>
                </button>
                
                {expandedSection === section.id && (
                  <div className="p-4 border-t border-gray-700 bg-gray-800/30">
                    <div className="text-gray-300 whitespace-pre-line leading-relaxed text-sm">
                      {section.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <FaCheck className="text-blue-400 text-base mt-1 flex-shrink-0" />
              <div>
                <p className="text-blue-300 font-medium text-sm">Last Updated: December 2024</p>
                <p className="text-blue-400/80 text-xs">
                  For questions about our policies, contact our legal team at legal@corporatesellers.co.ke
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-xs">
              By using our services, you acknowledge you've read and understood these policies
            </p>
            <button
              onClick={closeModal}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm cursor-pointer"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-purple-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-gray-900 to-purple-500/10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12">
            <div className="lg:col-span-4">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    {/* Replace this div with your logo image */}
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                      <Image 
                        src="/lll.png" 
                        alt="Corporate Sellers Logo"
                        width={56}
                        height={56}
                        className="w-full h-full object-contain p-1"
                        priority
                      />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Corporate Sellers
                      </h3>
                      <p className="text-gray-400 text-sm">Kenya</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed mb-4 text-sm md:text-base">
                    Your trusted partner for premium vehicle solutions in Kenya. 
                    We specialize in corporate fleet management, vehicle sourcing, 
                    and enterprise automotive services with unmatched expertise.
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {contactInfo.map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {contact.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm md:text-base">{contact.title}</p>
                        <p className="text-gray-300 text-xs md:text-sm">{contact.details}</p>
                        <p className="text-gray-400 text-xs">{contact.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${social.color} border border-white/20 cursor-pointer`}
                      aria-label={social.name}
                    >
                      <span className="text-base md:text-lg">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {navigationSections.map((section, sectionIndex) => (
                  <div
                    key={sectionIndex}
                  >
                    <h4 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-white flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      {section.title}
                    </h4>
                    <ul className="space-y-1 md:space-y-2">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a 
                            href={typeof link === 'string' ? '#' : link.href}
                            className="text-gray-300 hover:text-white transition-all duration-300 flex items-center py-1 text-sm md:text-base cursor-pointer"
                          >
                            <FaArrowRight className="mr-2 text-blue-400 text-xs" />
                            <span>
                              {typeof link === 'string' ? link : link.name}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 md:mt-8 p-4 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="text-center lg:text-left">
                    <h4 className="text-lg md:text-xl font-bold mb-1 flex items-center justify-center lg:justify-start gap-2">
                      <FaRocket className="text-blue-400" />
                      Business Insights
                    </h4>
                    <p className="text-gray-300 text-sm md:text-base">
                      Get industry insights and exclusive corporate offers
                    </p>
                  </div>
                  
                  {!isSubscribed ? (
                    <form 
                      onSubmit={handleSubscribe}
                      className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
                    >
                      <div className="relative flex-1 min-w-[200px] md:min-w-[250px]">
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                          }}
                          placeholder="Enter your business email..."
                          className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/20 text-sm md:text-base transition-all duration-300"
                          required
                        />
                        {error && (
                          <p className="text-red-400 text-xs mt-2 absolute -bottom-6 left-0">
                            {error}
                          </p>
                        )}
                      </div>
                      <button 
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap text-sm md:text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] md:min-w-[140px] h-[44px] md:h-[52px] cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <CircularProgress size={14} color="inherit" />
                            <span className="ml-1 md:ml-2">Submitting...</span>
                          </>
                        ) : (
                          <>
                            Subscribe
                            <FaPaperPlane className="text-xs" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-bold text-sm md:text-base shadow-xl flex items-center gap-2">
                      🎉 Welcome to Corporate Insights!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-4 md:pt-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-3 md:gap-4">
              <div className="text-gray-300 text-center lg:text-left">
                <p className="text-sm md:text-base">
                  &copy; 2024 Corporate Sellers Kenya. All rights reserved.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                <button 
                  onClick={() => openModal('privacy')}
                  className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-1 text-xs md:text-sm cursor-pointer"
                >
                  <FaShieldAlt className="text-blue-400 text-xs" />
                  Privacy
                </button>
                
                <button 
                  onClick={() => openModal('terms')}
                  className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-1 text-xs md:text-sm cursor-pointer"
                >
                  <FaFileContract className="text-purple-400 text-xs" />
                  Terms
                </button>
                
                <button 
                  onClick={() => openModal('cookies')}
                  className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-1 text-xs md:text-sm cursor-pointer"
                >
                  <FaCookie className="text-amber-400 text-xs" />
                  Cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {activeModal === 'privacy' && (
        <Modal 
          type="privacy"
          title="Privacy Policy"
          sections={privacySections}
        />
      )}

      {activeModal === 'terms' && (
        <Modal 
          type="terms"
          title="Terms of Service"
          sections={termsContent}
        />
      )}

      {activeModal === 'cookies' && (
        <Modal 
          type="cookies"
          title="Cookie Policy"
          sections={privacySections.filter(section => section.id === 'cookies' || section.id === 'data-collection')}
        />
      )}
    </>
  )
}