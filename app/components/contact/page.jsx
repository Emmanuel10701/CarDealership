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
  FaPaperPlane
} from 'react-icons/fa'

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
      // Success
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
      // Error from API
      alert(result.error || 'Something went wrong. Please try again.')
    }
  } catch (error) {
    // Network error
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
      color: 'bg-blue-500'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      description: 'Quick chat support',
      details: '+254 700 000 000',
      action: 'https://wa.me/254700000000',
      buttonText: 'Message Now',
      color: 'bg-green-500'
    },
    {
      icon: FaEnvelope,
      title: 'Email Us',
      description: 'Send us an email',
      details: 'info@autokenya.com',
      action: 'mailto:info@autokenya.com',
      buttonText: 'Send Email',
      color: 'bg-red-500'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Visit Office',
      description: 'Come see us in person',
      details: 'Nairobi, Kenya',
      action: '#',
      buttonText: 'Get Directions',
      color: 'bg-purple-500'
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

  return (
    <section id="contact" className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Get In <span className="text-blue-600">Touch</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Have questions about our cars or services? We're here to help! 
            Reach out to us through any of the following methods.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Methods */}
            <div className="space-y-6">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon
                return (
                  <div 
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-14 h-14 ${method.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {method.title}
                        </h3>
                        <p className="text-gray-600 text-base mb-3">
                          {method.description}
                        </p>
                        <p className="text-gray-900 font-semibold text-lg mb-4">
                          {method.details}
                        </p>
                        <a
                          href={method.action}
                          className={`inline-block ${method.color.replace('bg-', 'bg-')} text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition duration-300 transform hover:scale-105`}
                        >
                          {method.buttonText}
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Locations */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <h3 className="text-2xl font-bold">Our Locations</h3>
              </div>
              <div className="space-y-6">
                {locations.map((location, index) => (
                  <div key={index} className="border-b border-blue-500 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-lg text-yellow-300">{location.city}</h4>
                      <div className="flex items-center gap-1 text-blue-200 text-sm">
                        <FaClock className="text-xs" />
                        <span>{location.hours.split(':')[0]}</span>
                      </div>
                    </div>
                    <p className="text-blue-100 text-base mb-2">{location.address}</p>
                    <a 
                      href={`tel:${location.phone}`}
                      className="text-blue-100 text-base hover:text-white transition duration-300"
                    >
                      {location.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Send us a Message
                </h3>
                <p className="text-xl text-gray-600 font-medium">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-lg"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-lg"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-lg"
                        placeholder="+254 700 000 000"
                      />
                    </div>
                  </div>

                  {/* Contact Method */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Preferred Contact Method
                    </label>
                    <select
                      name="contactMethod"
                      value={formData.contactMethod}
                      onChange={handleChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-lg"
                    >
                      <option value="phone">Phone Call</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-lg"
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
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 resize-none text-lg"
                    placeholder="Tell us about your car needs, preferred models, budget, or any questions you have..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 px-6 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-blue-800 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <FaPaperPlane className="text-lg" />
                      Send Message
                    </span>
                  )}
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex justify-center mb-2">
                      <FaRocket className="text-2xl text-blue-600" />
                    </div>
                    <div className="font-bold text-gray-900 text-lg">Quick Response</div>
                    <div className="text-gray-600">Within 24 hours</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex justify-center mb-2">
                      <FaShieldAlt className="text-2xl text-green-600" />
                    </div>
                    <div className="font-bold text-gray-900 text-lg">Secure</div>
                    <div className="text-gray-600">Your data is protected</div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4">
                    <div className="flex justify-center mb-2">
                      <FaStar className="text-2xl text-amber-600" />
                    </div>
                    <div className="font-bold text-gray-900 text-lg">Expert Help</div>
                    <div className="text-gray-600">Car specialists ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get quick answers to common questions about our services
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <FaCar className="text-blue-600 text-xl" />
                  <h4 className="font-bold text-xl text-gray-900">How do I schedule a test drive?</h4>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  You can schedule a test drive by calling us directly, using the contact form, or through WhatsApp. We'll arrange a convenient time and location for you.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <FaMoneyBillWave className="text-green-600 text-xl" />
                  <h4 className="font-bold text-xl text-gray-900">Do you offer financing options?</h4>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Yes! We partner with several banks and financial institutions to help you get the best financing options for your car purchase.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <FaUser className="text-purple-600 text-xl" />
                  <h4 className="font-bold text-xl text-gray-900">Can I sell my car through AutoKenya?</h4>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Absolutely! We help individuals sell their cars quickly and at the best market price. Contact us for a free valuation.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <FaTruck className="text-orange-600 text-xl" />
                  <h4 className="font-bold text-xl text-gray-900">Do you deliver cars to other cities?</h4>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We primarily serve Central Kenya but can arrange delivery to other major cities. Contact us to discuss delivery options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}