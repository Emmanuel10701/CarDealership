'use client'

import { useState } from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCar, FaWhatsapp, FaPaperPlane, FaHeadset, FaCheckCircle, FaShieldAlt, FaBolt, FaRocket, FaLock, FaVideo, FaUsers, FaChartLine, FaAward, FaLeaf, FaNetworkWired, FaGlobe, FaMobileAlt, FaCogs, FaPaintBrush, FaUserCheck } from 'react-icons/fa'
import { GiCarWheel, GiCarDoor } from 'react-icons/gi'
import { TbSteeringWheel } from 'react-icons/tb'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ModernContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'email'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('🎉 Message sent successfully! We will respond shortly.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', contactMethod: 'email' })
      } else {
        throw new Error(result.message || 'Failed to send message')
      }
    } catch (error) {
      toast.error(`❌ ${error.message || 'There was an error sending your message. Please try again.'}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: FaPhone,
      title: "Phone",
      details: "+254 700 123 456",
      description: "Call us directly",
      color: "from-cyan-500 to-blue-600",
      action: "tel:+254791596795",
      badge: "Live"
    },
    {
      icon: FaWhatsapp,
      title: "WhatsApp",
      details: "+254 700 123 456",
      description: "Live chat with team",
      color: "from-green-500 to-emerald-600",
      action: "https://wa.me/254791596795",
      badge: "Live"
    },
    {
      icon: FaEnvelope,
      title: "Email",
      details: "corporatesellerske@gmail.com",
      description: "Send us a message",
      color: "from-purple-500 to-pink-600",
      action: "mailto:corporatesellerske@gmail.com",
      badge: "24h"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      details: "Central Kenya, Nairobi, Nakuru",
      description: "Our office locations",
      color: "from-orange-500 to-red-600",
      action: "#locations",
      badge: "3 Offices"
    }
  ]

  const techFeatures = [
    {
      icon: FaPhone,
      title: "Fast Response",
      description: "Quick callback service",
      color: "from-cyan-500/20 to-blue-500/20"
    },
    {
      icon: FaShieldAlt,
      title: "Secure",
      description: "Safe communication",
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: FaBolt,
      title: "Reliable",
      description: "Always available",
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: FaUsers,
      title: "Expert Team",
      description: "Professional support",
      color: "from-orange-500/20 to-red-500/20"
    }
  ]

  const inquiryTypes = [
    { id: 'general', label: 'General', icon: FaHeadset },
    { id: 'corporate', label: 'Corporate', icon: FaUsers },
    { id: 'technical', label: 'Support', icon: FaCogs },
    { id: 'finance', label: 'Finance', icon: FaChartLine },
    { id: 'vr', label: 'Inquiry', icon: FaVideo }
  ]

  const subjects = {
    general: [
      "Vehicle Inquiry",
      "Test Drive Request",
      "Price Information",
      "Availability Check"
    ],
    corporate: [
      "Fleet Management",
      "Bulk Purchase",
      "Partnership",
      "Enterprise Solutions"
    ],
    technical: [
      "Technical Support",
      "System Issues",
      "Feature Requests",
      "Account Help"
    ],
    finance: [
      "Payment Plans",
      "Insurance Inquiry",
      "Trade-in Value",
      "Financing Options"
    ],
    vr: [
      "General Question",
      "Feedback",
      "Complaint",
      "Other"
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {/* Hero Section with Car Image */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900"></div>
          
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full" style={{
              backgroundImage: `linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
              backgroundSize: '80px 80px'
            }}></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content - Reduced */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-lg mb-4">
                  <span className="text-xs font-semibold tracking-wider">CONTACT US • SUPPORT • CENTRAL KENYA</span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Get in Touch
                  </span>
                  <br />
                  <span className="text-white">With Our Team</span>
                </h1>
                
                <p className="text-base text-white/70 max-w-xl mb-6">
                  Reach out to our support team for inquiries, bookings, or partnership opportunities. We're here to help!
                </p>
              </div>

              {/* Compact Stats */}
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {[
                  { number: "24/7", label: "Available" },
                  { number: "2min", label: "Response" },
                  { number: "500+", label: "Clients" },
                  { number: "4.8★", label: "Rating" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-3"
                  >
                    <div className="text-lg font-bold text-cyan-300 mb-1">{stat.number}</div>
                    <div className="text-xs text-white/60 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Car Image */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20">
                <img 
                  src="/car1.png" 
                  alt="Premium Vehicle" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg border border-white/10 backdrop-blur-sm"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Methods - Compact */}
      <section className="py-16 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Contact Channels
              </span>
            </h2>
            <p className="text-sm text-white/60">Multiple ways to reach us</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-5 hover:border-cyan-500/30 hover:bg-white/8 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mb-3`}>
                  <method.icon className="text-white text-lg" />
                </div>
                
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold text-white">{method.title}</h3>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{method.badge}</span>
                </div>
                
                <p className="text-cyan-300 text-xs font-semibold mb-1">{method.details}</p>
                <p className="text-white/50 text-xs">{method.description}</p>
              </motion.a>
            ))}
          </div>

          {/* Tech Features - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {techFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                className="text-center p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <feature.icon className="text-cyan-400 text-base" />
                </div>
                <h4 className="font-bold text-white text-xs mb-1">{feature.title}</h4>
                <p className="text-white/40 text-xs">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
                  <p className="text-white/50 text-sm">Fill out the form and we'll get back to you soon</p>
                </div>

                {/* Inquiry Type Tabs */}
                <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                  {inquiryTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveTab(type.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-xs ${
                        activeTab === type.id
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <type.icon className="text-sm" />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-white font-semibold text-xs">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-white/30 text-sm"
                        placeholder="Your name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-white font-semibold text-xs">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-white/30 text-sm"
                        placeholder="+254 700 000 000"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-white font-semibold text-xs">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-white/30 text-sm"
                      placeholder="your@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  {/* Contact Method */}
                  <div className="space-y-2">
                    <label className="block text-white font-semibold text-xs">Contact Method *</label>
                    <select
                      name="contactMethod"
                      value={formData.contactMethod}
                      onChange={handleChange}
                      className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white text-sm appearance-none"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="email" className="bg-gray-900 text-xs">Email</option>
                      <option value="phone" className="bg-gray-900 text-xs">Phone</option>
                      <option value="whatsapp" className="bg-gray-900 text-xs">WhatsApp</option>
                    </select>
                  </div>
                  
                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="block text-white font-semibold text-xs">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-white/30 text-sm appearance-none"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="" className="bg-gray-900 text-xs">Select subject</option>
                      {subjects[activeTab]?.map((subject, idx) => (
                        <option key={idx} value={subject.toLowerCase()} className="bg-gray-900 text-xs">
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-white font-semibold text-xs">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none text-white placeholder-white/30 text-sm"
                      placeholder={`Your ${activeTab} inquiry...`}
                      required
                      disabled={isSubmitting}
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Info & Features - Compact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Why Contact Us</h2>
                
                <div className="space-y-3">
                  {[
                    { icon: FaPhone, title: "Quick Response", desc: "Fast support team" },
                    { icon: FaShieldAlt, title: "Secure", desc: "Your data is safe" },
                    { icon: FaBolt, title: "Reliable", desc: "Always available" },
                    { icon: FaUsers, title: "Expert Help", desc: "Knowledgeable staff" }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{item.title}</h3>
                        <p className="text-white/50 text-xs">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Response Times */}
              <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3">Response Times</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Phone</span>
                    <span className="font-semibold text-cyan-300">Immediate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">WhatsApp</span>
                    <span className="font-semibold text-green-300">&lt; 5 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Email</span>
                    <span className="font-semibold text-purple-300">&lt; 2 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Callback</span>
                    <span className="font-semibold text-orange-300">&lt; 24 hours</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            
            <p className="text-base text-white/70 max-w-xl mx-auto mb-8">
              Reach out today and let our team assist you with your vehicle needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="#contact-form"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-sm flex items-center gap-2"
              >
                <FaRocket /> Contact Us
              </motion.a>
              <motion.a
                href="tel:+254791596795"
                className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-lg font-semibold text-sm"
              >
                Call Now
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #06b6d4, #3b82f6); border-radius: 4px; }
        ::selection { background-color: rgba(6, 182, 212, 0.3); color: #ffffff; }
      `}</style>
    </div>
  )
}