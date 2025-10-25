"use client"

import { useState } from 'react'
import { 
  FaPhone, 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaShieldAlt, 
  FaRocket, 
  FaStar,
  FaCar,
  FaMoneyBillWave,
  FaTruck,
  FaUser,
  FaPaperPlane,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'phone'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

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
        alert(result.message || 'Thank you for your message! We will get back to you soon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          contactMethod: 'phone'
        })
      } else {
        alert(result.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: FaPhone,
      title: 'Call Us',
      description: 'Speak directly with our team',
      details: '+254 700 000 000',
      action: 'tel:+254700000000',
      buttonText: 'Call Now',
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      description: 'Quick chat support',
      details: '+254 700 000 000',
      action: 'https://wa.me/254700000000',
      buttonText: 'Message Now',
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      icon: FaEnvelope,
      title: 'Email Us',
      description: 'Send us an email',
      details: 'info@mainacars.com',
      action: 'mailto:info@mainacars.com',
      buttonText: 'Send Email',
      gradient: 'from-red-500 to-pink-500',
      bg: 'bg-gradient-to-br from-red-500 to-pink-500'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Visit Office',
      description: 'Come see us in person',
      details: 'Nairobi, Kenya',
      action: '#',
      buttonText: 'Get Directions',
      gradient: 'from-purple-500 to-indigo-500',
      bg: 'bg-gradient-to-br from-purple-500 to-indigo-500'
    }
  ]

  const locations = [
    {
      city: 'Nairobi',
      address: 'Moi Avenue, CBD',
      phone: '+254 700 111 111',
      hours: 'Mon-Sun: 8AM - 8PM'
    },
    {
      city: 'Nyeri',
      address: 'Kimathi Way, Nyeri Town',
      phone: '+254 700 333 333',
      hours: 'Mon-Sat: 8AM - 6PM'
    }
  ]

  const faqItems = [
    {
      question: "How do I schedule a test drive?",
      answer: "You can schedule a test drive by calling us directly, using the contact form, or through WhatsApp. We'll arrange a convenient time and location for you.",
      icon: FaCar
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes! We partner with several banks and financial institutions to help you get the best financing options for your car purchase.",
      icon: FaMoneyBillWave
    },
    {
      question: "Can I sell my car through Maina Cars?",
      answer: "Absolutely! We help individuals sell their cars quickly and at the best market price. Contact us for a free valuation.",
      icon: FaUser
    },
    {
      question: "Do you deliver cars to other cities?",
      answer: "We primarily serve Central Kenya but can arrange delivery to other major cities. Contact us to discuss delivery options.",
      icon: FaTruck
    }
  ]

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <section id="contact" className="relative py-20 lg:py-28 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-blue-600 uppercase mb-4 bg-blue-50 px-4 py-2 rounded-full"
          >
            <FaPaperPlane className="text-blue-500" />
            Get In Touch
          </motion.p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Contact{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Maina Cars
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Have questions about our cars or services? We're here to help! 
            Reach out to us through any of the following methods.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Methods */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon
                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100/50 transition-all duration-500 group-hover:border-blue-200/50">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${method.bg} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <IconComponent className="text-lg" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800">
                            {method.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 font-light">
                            {method.description}
                          </p>
                          <p className="text-gray-900 font-semibold text-base mb-4">
                            {method.details}
                          </p>
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={method.action}
                            className={`inline-block ${method.bg} text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition duration-300 shadow-lg hover:shadow-xl`}
                          >
                            {method.buttonText}
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Locations */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold">Our Locations</h3>
                </div>
                <div className="space-y-6">
                  {locations.map((location, index) => (
                    <div key={index} className="border-b border-white/20 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-lg text-yellow-300">{location.city}</h4>
                        <div className="flex items-center gap-1 text-blue-200 text-sm">
                          <FaClock className="text-xs" />
                          <span>{location.hours.split(':')[0]}</span>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm mb-2">{location.address}</p>
                      <a 
                        href={`tel:${location.phone}`}
                        className="text-white/90 text-sm hover:text-white transition duration-300 font-medium"
                      >
                        {location.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100/50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full translate-y-12 -translate-x-12" />
              
              <div className="relative">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    Send us a Message
                  </h3>
                  <p className="text-lg text-gray-600 font-light">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Full Name *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full p-4 pl-12 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-base backdrop-blur-sm"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Email Address *
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full p-4 pl-12 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-base backdrop-blur-sm"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full p-4 pl-12 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-base backdrop-blur-sm"
                          placeholder="+254 700 000 000"
                        />
                      </div>
                    </div>

                    {/* Contact Method */}
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Preferred Contact Method
                      </label>
                      <select
                        name="contactMethod"
                        value={formData.contactMethod}
                        onChange={handleChange}
                        className="w-full p-4 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-base backdrop-blur-sm"
                      >
                        <option value="phone">Phone Call</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-4 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-base backdrop-blur-sm"
                    >
                      <option value="">Select a subject</option>
                      <option value="car-inquiry">Car Inquiry</option>
                      <option value="test-drive">Schedule Test Drive</option>
                      <option value="sell-car">Sell My Car</option>
                      <option value="general">General Question</option>
                      <option value="complaint">Complaint</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full p-4 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 resize-none text-base backdrop-blur-sm"
                      placeholder="Tell us about your car needs, preferred models, budget, or any questions you have..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition duration-300" />
                    <span className="relative flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                      Sending Message...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="text-base" />
                          Send Message
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                {/* Additional Info */}
                <div className="mt-8 pt-8 border-t border-gray-200/50">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    {[
                      { icon: FaRocket, text: "Quick Response", subtext: "Within 24 hours", color: "blue" },
                      { icon: FaShieldAlt, text: "Secure", subtext: "Your data is protected", color: "green" },
                      { icon: FaStar, text: "Expert Help", subtext: "Car specialists ready", color: "amber" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -2 }}
                        className={`bg-${item.color}-50 rounded-xl p-4 backdrop-blur-sm border border-${item.color}-200/50`}
                      >
                        <div className="flex justify-center mb-2">
                          <item.icon className={`text-2xl text-${item.color}-600`} />
                        </div>
                        <div className="font-bold text-gray-900 text-sm">{item.text}</div>
                        <div className="text-gray-600 text-xs">{item.subtext}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100/50"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Get quick answers to common questions about our services
            </p>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl border border-gray-200/50 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <IconComponent className="text-blue-600 text-lg" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">{item.question}</h4>
                    </div>
                    {openFaq === index ? (
                      <FaChevronUp className="text-gray-400 text-lg" />
                    ) : (
                      <FaChevronDown className="text-gray-400 text-lg" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0">
                          <p className="text-gray-600 leading-relaxed font-light">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}