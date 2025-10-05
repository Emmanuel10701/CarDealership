"use client"

import { useState } from 'react'
import { FaCar, FaTrophy, FaShieldAlt, FaArrowDown, FaMoneyBillWave } from 'react-icons/fa'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')

  const locations = [
    'Nairobi', 'Nakuru', 'Nyeri', 'Muranga', 'Kiambu', 'Thika'
  ]

  const carTypes = [
    'SUV', 'Sedan', 'Hatchback', 'Pickup', 'Luxury', 'Van'
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    // Handle search logic here
    console.log('Searching for:', searchQuery)
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="bg-blue-500 bg-opacity-20 text-blue-200 px-4 py-2 rounded-full text-sm font-semibold">
                <FaCar className="inline-block text-lg" /> Trusted Second-Hand Car Marketplace in Central Kenya
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Quality Used 
              <span className="text-yellow-300 block">Cars Available</span>
            </h1>
            
            <p className="text-xl sm:text-2xl mb-8 max-w-2xl leading-relaxed text-blue-100">
              Discover the best deals on certified pre-owned vehicles across 
              <span className="text-yellow-300 font-semibold"> Nairobi, Nakuru, Nyeri, Muranga, Kiambu, and Thika</span>
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 max-w-md lg:max-w-full">
              <div className="text-center p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm border border-white border-opacity-20">
                <div className="text-2xl sm:text-3xl font-bold text-green-500">300+</div>
                <div className="text-sm text-blue-200">Used Cars</div>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm border border-white border-opacity-20">
                <div className="text-2xl sm:text-3xl font-bold text-black">6</div>
                <div className="text-sm text-blue-200">Cities Covered</div>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm border border-white border-opacity-20">
                <div className="text-2xl sm:text-3xl font-bold text-green-500">100%</div>
                <div className="text-sm text-blue-700">Inspected</div>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm border border-white border-opacity-20">
                <div className="text-2xl sm:text-3xl font-bold text-blue-700">1Y</div>
                <div className="text-sm text-blue-700">Warranty</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center">
                <FaCar className="mr-2" /> Browse Used Cars
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-900 transition duration-300 shadow-lg flex items-center justify-center">
                <FaMoneyBillWave className="mr-2" /> Sell Your Car
              </button>
            </div>
          </div>

          {/* Right Content - Car Image with Overlay */}
          <div className="relative">
            {/* Main Car Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
              <img 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Quality Used Cars in Kenya"
                className="w-full h-96 object-cover"
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              
              {/* Overlay Content */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <h3 className="text-xl font-bold mb-2">Toyota RAV4 2021</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-300 font-bold text-lg">KSh 2,300,000</span>
                    <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">Nairobi</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span>45,000 km</span>
                    <span>Automatic</span>
                    <span>Petrol</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Cars Badges */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center hover:bg-white/20 transition duration-300">
                <FaTrophy className="text-2xl mb-2 text-yellow-300" />
                <div className="font-semibold">Certified</div>
                <div className="text-sm text-blue-200">Quality Checked</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center hover:bg-white/20 transition duration-300">
                <FaShieldAlt className="text-2xl mb-2 text-yellow-300" />
                <div className="font-semibold">Warranty</div>
                <div className="text-sm text-blue-200">1 Year Included</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-blue-200 mb-6">Trusted by thousands of car buyers across Central Kenya</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-80">
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="font-semibold">✓ Full Inspection</span>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="font-semibold">✓ No Hidden Costs</span>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="font-semibold">✓ Test Drive Available</span>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="font-semibold">✓ Financing Options</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-white text-center">
            <div className="text-sm mb-2">Scroll to explore</div>
            <FaArrowDown className="text-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}