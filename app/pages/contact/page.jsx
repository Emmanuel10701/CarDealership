'use client'

import { useState } from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCar, FaWhatsapp, FaPaperPlane, FaHeadset, FaCheckCircle, FaShieldAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

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
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: FaHeadset,
      title: "24/7 Support",
      details: "+254 700 123 456",
      description: "Round-the-clock customer service",
      color: "from-blue-500 to-cyan-500",
      action: "tel:+254700123456"
    },
    {
      icon: FaWhatsapp,
      title: "WhatsApp Chat",
      details: "+254 700 123 456",
      description: "Instant messaging support",
      color: "from-green-500 to-emerald-500",
      action: "https://wa.me/254700123456"
    },
    {
      icon: FaEnvelope,
      title: "Email Us",
      details: "hello@autocentral.co.ke",
      description: "Response within 2 hours",
      color: "from-purple-500 to-pink-500",
      action: "mailto:hello@autocentral.co.ke"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Showroom",
      details: "6 Locations",
      description: "Across Central Kenya",
      color: "from-orange-500 to-red-500",
      action: "#locations"
    }
  ]

  const locations = [
    {
      city: "Nairobi CBD",
      address: "Moi Avenue, Pioneer House",
      phone: "+254 700 111 111",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      city: "Nakuru Town",
      address: "Kenyatta Avenue, Mega Plaza",
      phone: "+254 700 222 222",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      city: "Nyeri Central",
      address: "Kimathi Way, Town Centre",
      phone: "+254 700 333 333",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ]

  const features = [
    {
      icon: FaShieldAlt,
      title: "Instant Response",
      description: "Get answers to your queries within minutes"
    },
    {
      icon: FaCheckCircle,
      title: "Expert Advice",
      description: "Professional guidance from car specialists"
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description: "Round-the-clock customer service"
    },
    {
      icon: FaCar,
      title: "Free Consultation",
      description: "Get personalized car recommendations"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Car Background Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        </div>

        {/* Animated Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500 rounded-full opacity-40 animate-pulse delay-700"></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-cyan-500 rounded-full opacity-50 animate-pulse delay-300"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-2xl text-base font-semibold border border-white/20 shadow-2xl mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <FaHeadset className="text-white text-sm" />
              </div>
              <span>24/7 Customer Support • Quick Response Guaranteed</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
              Get In 
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mt-2">Touch Today</span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-5xl mx-auto leading-relaxed font-light mb-12">
              Our team of automotive experts is ready to help you find the perfect vehicle 
              and answer all your questions about buying or selling.
            </p>

            {/* Quick Contact Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { number: "2h", label: "Avg. Response" },
                { number: "24/7", label: "Support" },
                { number: "98%", label: "Satisfaction" },
                { number: "6", label: "Locations" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center"
                >
                  <div className="text-2xl lg:text-3xl font-black text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-white/80 font-semibold text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-slate-800 mb-4 leading-tight">
              Multiple Ways to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Connect</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Choose your preferred method to get in touch with our automotive experts
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                  <method.icon className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">{method.title}</h3>
                <p className="text-slate-700 font-semibold text-lg mb-1">{method.details}</p>
                <p className="text-slate-600 text-sm">{method.description}</p>
              </motion.a>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <feature.icon className="text-white text-lg" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-1">{feature.title}</h4>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Locations */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
                <div className="text-center mb-8">
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mb-3">Send Us a Message</h2>
                  <p className="text-slate-600 text-lg">Get personalized assistance from our car experts</p>
                </div>
                
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6"
                  >
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-500 text-xl" />
                      <div>
                        <div className="font-semibold text-green-800">Message Sent Successfully!</div>
                        <div className="text-green-600 text-sm">We'll get back to you within 2 hours.</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6"
                  >
                    <div className="text-red-800 text-sm">
                      There was an error sending your message. Please try again or contact us directly.
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-slate-700 font-bold text-sm">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-slate-700 font-bold text-sm">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="+254 700 000 000"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-slate-700 font-bold text-sm">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-slate-700 font-bold text-sm">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select an option</option>
                      <option value="car-inquiry">Car Inquiry</option>
                      <option value="test-drive">Schedule Test Drive</option>
                      <option value="sell-car">Sell My Car</option>
                      <option value="financing">Financing Options</option>
                      <option value="service">Service & Maintenance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-slate-700 font-bold text-sm">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Tell us about your car needs, preferred models, budget, or any specific requirements..."
                      required
                      disabled={isSubmitting}
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="text-lg" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Locations */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              id="locations"
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
                <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mb-2">Our Locations</h2>
                <p className="text-slate-600 text-lg mb-8">Visit any of our showrooms across Central Kenya</p>
                
                <div className="space-y-6">
                  {locations.map((location, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                      className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200"
                    >
                      <img 
                        src={location.image}
                        alt={location.city}
                        className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-lg mb-1">{location.city}</h3>
                        <p className="text-slate-600 text-sm mb-2">{location.address}</p>
                        <p className="text-slate-700 font-semibold text-sm mb-1">{location.phone}</p>
                        <p className="text-slate-500 text-xs">{location.hours}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}