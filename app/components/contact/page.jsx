"use client"
import { useState } from 'react'

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
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setIsSubmitting(false)
      alert('Thank you for your message! We will get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        contactMethod: 'phone'
      })
    }, 2000)
  }

  const contactMethods = [
    {
      icon: '📞',
      title: 'Call Us',
      description: 'Speak directly with our team',
      details: '+254 700 000 000',
      action: 'tel:+254700000000',
      buttonText: 'Call Now'
    },
    {
      icon: '💬',
      title: 'WhatsApp',
      description: 'Quick chat support',
      details: '+254 700 000 000',
      action: 'https://wa.me/254700000000',
      buttonText: 'Message Now'
    },
    {
      icon: '✉️',
      title: 'Email Us',
      description: 'Send us an email',
      details: 'info@autokenya.com',
      action: 'mailto:info@autokenya.com',
      buttonText: 'Send Email'
    },
    {
      icon: '📍',
      title: 'Visit Office',
      description: 'Come see us in person',
      details: 'Nairobi, Kenya',
      action: '#',
      buttonText: 'Get Directions'
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
      city: 'Nakuru',
      address: 'Kenya Road, Nakuru Town',
      phone: '+254 700 222 222',
      hours: 'Mon-Sat: 8AM - 6PM'
    },
    {
      city: 'Nyeri',
      address: 'Kimathi Way, Nyeri Town',
      phone: '+254 700 333 333',
      hours: 'Mon-Sat: 8AM - 6PM'
    },
    {
      city: 'Thika',
      address: 'General Kago Road, Thika',
      phone: '+254 700 444 444',
      hours: 'Mon-Sat: 8AM - 6PM'
    }
  ]

  return (
    <section id="contact" className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In <span className="text-blue-600">Touch</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about our cars or services? We're here to help! 
            Reach out to us through any of the following methods.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            {/* Contact Methods */}
            <div className="space-y-6 mb-8">
              {contactMethods.map((method, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {method.description}
                      </p>
                      <p className="text-gray-900 font-medium mb-3">
                        {method.details}
                      </p>
                      <a
                        href={method.action}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-300"
                      >
                        {method.buttonText}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Locations */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">📍 Our Locations</h3>
              <div className="space-y-4">
                {locations.map((location, index) => (
                  <div key={index} className="border-b border-blue-500 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-semibold text-yellow-300">{location.city}</h4>
                    <p className="text-blue-100 text-sm mb-1">{location.address}</p>
                    <p className="text-blue-100 text-sm mb-1">{location.phone}</p>
                    <p className="text-blue-200 text-xs">{location.hours}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Send us a Message
              </h3>
              <p className="text-gray-600 mb-6">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                      placeholder="+254 700 000 000"
                    />
                  </div>

                  {/* Contact Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      name="contactMethod"
                      value={formData.contactMethod}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    >
                      <option value="phone">Phone Call</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 resize-none"
                    placeholder="Tell us about your car needs, preferred models, budget, or any questions you have..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </span>
                  ) : (
                    '📨 Send Message'
                  )}
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-gray-600">
                  <div>
                    <div className="font-semibold">🚀 Quick Response</div>
                    <div>Within 24 hours</div>
                  </div>
                  <div>
                    <div className="font-semibold">🛡️ Secure</div>
                    <div>Your data is protected</div>
                  </div>
                  <div>
                    <div className="font-semibold">🎯 Expert Help</div>
                    <div>Car specialists ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-2">How do I schedule a test drive?</h4>
              <p className="text-gray-600 mb-4">
                You can schedule a test drive by calling us directly, using the contact form, or through WhatsApp. We'll arrange a convenient time and location for you.
              </p>
              
              <h4 className="font-semibold text-lg mb-2">Do you offer financing options?</h4>
              <p className="text-gray-600 mb-4">
                Yes! We partner with several banks and financial institutions to help you get the best financing options for your car purchase.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Can I sell my car through AutoKenya?</h4>
              <p className="text-gray-600 mb-4">
                Absolutely! We help individuals sell their cars quickly and at the best market price. Contact us for a free valuation.
              </p>
              
              <h4 className="font-semibold text-lg mb-2">Do you deliver cars to other cities?</h4>
              <p className="text-gray-600">
                We primarily serve Central Kenya but can arrange delivery to other major cities. Contact us to discuss delivery options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}