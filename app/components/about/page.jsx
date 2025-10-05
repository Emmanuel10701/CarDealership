"use client"
import React from 'react'
import { FaCar, FaSearch, FaStar, FaCreditCard, FaTruck, FaPhone } from 'react-icons/fa'

export default function AboutUs() {
  const features = [
    {
      icon: <FaCar className="text-white text-2xl" />,
      title: "Wide Selection",
      description: "Hundreds of verified cars from trusted dealers across Central Kenya including Nairobi, Nakuru, Nyeri, and more"
    },
    {
      icon: <FaSearch className="text-white text-2xl" />,
      title: "Smart Location Filters",
      description: "Find cars specifically in your preferred Central Kenya location with our advanced geo-targeting"
    },
    {
      icon: <FaStar className="text-white text-2xl" />,
      title: "Quality Assured",
      description: "Every vehicle undergoes thorough inspection and verification by our expert team"
    },
    {
      icon: <FaCreditCard className="text-white text-2xl" />,
      title: "Secure Transactions",
      description: "Safe and secure payment processing with buyer protection for all your purchases"
    },
    {
      icon: <FaTruck className="text-white text-2xl" />,
      title: "Test Drive Arrangements",
      description: "We help arrange test drives in your preferred location across Central Kenya"
    },
    {
      icon: <FaPhone className="text-white text-2xl" />,
      title: "24/7 Support",
      description: "Our dedicated support team is always ready to assist you with any inquiries"
    }
  ]

  const stats = [
    { number: "500+", label: "Cars Available" },
    { number: "6", label: "Cities Covered" },
    { number: "50+", label: "Trusted Dealers" },
    { number: "95%", label: "Customer Satisfaction" }
  ]

  return (
    <section id="about" className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">Maina Cars</span>?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in finding the perfect vehicle across Central Kenya. 
            We connect you with verified dealers and quality cars in your preferred location.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Trusted by Car Buyers Across Central Kenya
            </h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Join thousands of satisfied customers who found their perfect car through our platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ready to Find Your Dream Car?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Browse our extensive collection or list your vehicle today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                Browse All Cars
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition duration-300">
                Sell Your Car
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}