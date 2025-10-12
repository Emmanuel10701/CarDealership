"use client"

import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Browse Cars", href: "/cars" },
    { name: "Sell Your Car", href: "/sell" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" }
  ]

  const locations = [
    "Nairobi",
    "Nakuru", 
    "Nyeri",
    "Muranga",
    "Kiambu",
    "Thika"
  ]

  const socialLinks = [
    { name: "Facebook", icon: <FaFacebook />, href: "https://facebook.com/mainacars" },
    { name: "Twitter", icon: <FaTwitter />, href: "https://twitter.com/mainacars" },
    { name: "Instagram", icon: <FaInstagram />, href: "https://instagram.com/mainacars" },
    { name: "WhatsApp", icon: <FaWhatsapp />, href: "https://wa.me/254700000000" }
  ]

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-blue-400">Maina Cars</h3>
            <p className="text-lg text-gray-300 mb-6 max-w-md leading-relaxed">
              Your trusted platform for buying and selling quality vehicles across Central Kenya. 
              Find the perfect car with our advanced location-based filtering and connect with verified dealers.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300 transform hover:scale-110"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-lg text-gray-300 hover:text-white transition duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Locations */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-white">Contact & Locations</h4>
            
            {/* Contact Info */}
            <div className="mb-6">
              <div className="flex items-center mb-3 text-lg text-gray-300">
                <FaPhone className="mr-3 text-xl" />
                <div>
                  <div className="font-medium">+254 700 000 000</div>
                  <div className="text-sm text-gray-400">Mon-Sun, 8AM-8PM</div>
                </div>
              </div>
              <div className="flex items-center mb-3 text-lg text-gray-300">
                <FaEnvelope className="mr-3 text-xl" />
                <div>
                  <div className="font-medium">info@mainacars.com</div>
                  <div className="text-sm text-gray-400">Quick response</div>
                </div>
              </div>
              <div className="flex items-center text-lg text-gray-300">
                <FaMapMarkerAlt className="mr-3 text-xl" />
                <div>
                  <div className="font-medium">Nairobi, Kenya</div>
                  <div className="text-sm text-gray-400">Head Office</div>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div>
              <h5 className="font-semibold mb-2 text-lg text-gray-200">We Cover:</h5>
              <div className="flex flex-wrap gap-2">
                {locations.map((location, index) => (
                  <span 
                    key={index}
                    className="bg-gray-800 px-3 py-1 rounded-full text-lg text-gray-300"
                  >
                    {location}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <h4 className="text-xl font-semibold mb-2">Stay Updated</h4>
              <p className="text-lg text-gray-300">Get the latest car deals and offers in Central Kenya</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-0 text-lg"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 whitespace-nowrap text-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-lg text-gray-300 text-center md:text-left">
              <p>&copy; 2024 Maina Cars. All rights reserved. | Your Trusted Car Marketplace in Central Kenya</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-lg text-gray-300">
              <a href="/privacy" className="hover:text-white transition duration-300">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition duration-300">Terms of Service</a>
              <a href="/cookies" className="hover:text-white transition duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}