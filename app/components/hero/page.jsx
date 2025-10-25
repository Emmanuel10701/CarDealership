"use client"

import { useState, useEffect } from 'react'
import { FaCar, FaTrophy, FaShieldAlt, FaArrowDown, FaMoneyBillWave, FaPlay, FaPause, FaStar, FaHeart, FaCheck, FaMapMarkerAlt, FaCog, FaGasPump, FaCalendar } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function Hero() {
  const [currentCarIndex, setCurrentCarIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const featuredCars = [
    {
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      title: "Toyota RAV4 2021",
      price: "KSh 2,300,000",
      location: "Nairobi",
      mileage: "45,000 km",
      transmission: "Automatic",
      fuel: "Petrol",
      year: "2021",
      condition: "Excellent",
      rating: "4.8",
      features: ["Sunroof", "Leather Seats", "Backup Camera", "GPS"]
    },
    {
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      title: "Subaru Outback 2022",
      price: "KSh 2,800,000",
      location: "Nakuru",
      mileage: "32,000 km",
      transmission: "Automatic",
      fuel: "Petrol",
      year: "2022",
      condition: "Like New",
      rating: "4.9",
      features: ["AWD", "Apple CarPlay", "Heated Seats", "Premium Sound"]
    },
    {
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      title: "Mazda CX-5 2020",
      price: "KSh 1,900,000",
      location: "Nyeri",
      mileage: "58,000 km",
      transmission: "Automatic",
      fuel: "Diesel",
      year: "2020",
      condition: "Very Good",
      rating: "4.7",
      features: ["LED Lights", "Blind Spot Monitor", "Keyless Entry", "Climate Control"]
    }
  ]

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentCarIndex(prev => (prev + 1) % featuredCars.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextCar = () => {
    setCurrentCarIndex(prev => (prev + 1) % featuredCars.length)
  }

  const prevCar = () => {
    setCurrentCarIndex(prev => (prev - 1 + featuredCars.length) % featuredCars.length)
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-blue-50/80 to-purple-100/90 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full mix-blend-multiply filter blur-4xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-4xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/15 to-teal-400/15 rounded-full mix-blend-multiply filter blur-4xl opacity-30 animate-pulse delay-500"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-[0.02]"
             style={{
               backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px),
                                linear-gradient(to bottom, #64748b 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
      </div>

      <div className="relative w-full max-w-8xl mx-auto px-8 sm:px-12 lg:px-20 py-16">
        <div className="grid lg:grid-cols-2 gap-0 items-center w-full">
          {/* Left Content - Enhanced with more left padding */}
          <div className="w-full space-y-6 lg:pr-12">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold border border-blue-200/50 inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FaCar className="text-white text-xs" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Premier Car Marketplace • Central Kenya
                </span>
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-slate-800 leading-tight"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Discover Your 
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block mt-2">Dream Car Today</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl mb-8 text-slate-600 leading-relaxed max-w-2xl font-medium"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Premium selection of certified pre-owned vehicles across
              <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 6 major cities</span> in Central Kenya
            </motion.p>

            {/* Enhanced Stats */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {[
                { number: "500+", label: "Quality Cars", gradient: "from-green-500 to-emerald-500" },
                { number: "6", label: "Cities Served", gradient: "from-blue-500 to-cyan-500" },
                { number: "100%", label: "Inspected", gradient: "from-purple-500 to-pink-500" },
                { number: "1Y", label: "Warranty", gradient: "from-orange-500 to-red-500" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-white/60 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className={`text-xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1 group-hover:scale-105 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  <div className="text-xs font-semibold text-slate-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold text-base hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10">Explore Collection</span>
                <FaCar className="relative z-10 text-lg group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/80 backdrop-blur-lg border border-slate-300 text-slate-700 px-8 py-3 rounded-xl font-bold text-base hover:bg-white hover:border-slate-400 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <FaMoneyBillWave className="group-hover:scale-105 transition-transform duration-300" />
                Sell Your Car
              </motion.button>
            </motion.div>
          </div>

          {/* Right Content - Reduced width by 20% and increased height */}
          <motion.div 
            className="w-full lg:w-[80%] relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
          >
            {/* Enhanced Carousel Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCarIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <img 
                    src={featuredCars[currentCarIndex].image}
                    alt={featuredCars[currentCarIndex].title}
                    className="w-full h-72 lg:h-96 object-cover"
                  />
                  
                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Enhanced Car Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 border border-white/40 shadow-lg">
                      {/* Title and Rating */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-black text-slate-800">{featuredCars[currentCarIndex].title}</h3>
                        <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-1 rounded-full">
                          <FaStar className="text-white text-xs" />
                          <span className="text-white text-xs font-bold">{featuredCars[currentCarIndex].rating}</span>
                        </div>
                      </div>
                      
                      {/* Price and Location */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {featuredCars[currentCarIndex].price}
                        </span>
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                          <FaMapMarkerAlt className="text-white text-xs" />
                          {featuredCars[currentCarIndex].location}
                        </span>
                      </div>

                      {/* Enhanced Car Details */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="flex items-center gap-1 text-slate-600 text-xs">
                          <FaCog className="text-blue-500 text-xs" />
                          <span>{featuredCars[currentCarIndex].transmission}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 text-xs">
                          <FaGasPump className="text-green-500 text-xs" />
                          <span>{featuredCars[currentCarIndex].fuel}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 text-xs">
                          <FaCalendar className="text-purple-500 text-xs" />
                          <span>{featuredCars[currentCarIndex].year}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 text-xs">
                          <FaHeart className="text-pink-500 text-xs" />
                          <span>{featuredCars[currentCarIndex].condition}</span>
                        </div>
                      </div>

                      {/* Enhanced Feature Tags */}
                      <div className="flex flex-wrap gap-1">
                        {featuredCars[currentCarIndex].features.map((feature, index) => (
                          <span 
                            key={index}
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-slate-700 px-2 py-1 rounded-full text-xs font-semibold border border-blue-200/50 backdrop-blur-sm"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Carousel Controls */}
              <div className="absolute top-1/2 left-3 right-3 transform -translate-y-1/2 flex justify-between">
                <motion.button 
                  onClick={prevCar}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/90 backdrop-blur-lg w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white transition-all duration-300 border border-white/40 shadow-lg hover:shadow-xl"
                >
                  <span className="text-slate-700 text-base font-bold">‹</span>
                </motion.button>
                <motion.button 
                  onClick={nextCar}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/90 backdrop-blur-lg w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white transition-all duration-300 border border-white/40 shadow-lg hover:shadow-xl"
                >
                  <span className="text-slate-700 text-base font-bold">›</span>
                </motion.button>
              </div>

              {/* Enhanced Play/Pause Button */}
              <motion.button 
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-lg w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white transition-all duration-300 border border-white/40 shadow-lg"
              >
                {isAutoPlaying ? <FaPause className="text-slate-700 text-xs" /> : <FaPlay className="text-slate-700 text-xs" />}
              </motion.button>

              {/* Enhanced Carousel Indicators */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                {featuredCars.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentCarIndex(index)}
                    whileHover={{ scale: 1.1 }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentCarIndex === index 
                        ? 'bg-white shadow-md' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Trust Indicators */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-slate-600 mb-6 text-base font-medium">Trusted by thousands of satisfied car buyers</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Full Vehicle Inspection", "No Hidden Costs", "Test Drive Available", "Flexible Financing", "Instant Approval", "Free Delivery"].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-white/80 backdrop-blur-lg px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group text-sm"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <FaCheck className="text-white text-xs" />
                </div>
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-slate-600 text-center cursor-pointer group"
          >
            <div className="text-xs mb-2 font-medium group-hover:text-slate-800 transition-colors duration-300">Discover More</div>
            <div className="w-10 h-10 bg-white/80 backdrop-blur-lg rounded-xl flex items-center justify-center border border-slate-200 shadow-md group-hover:shadow-lg transition-all duration-300 mx-auto group-hover:scale-105">
              <FaArrowDown className="text-slate-600 group-hover:text-slate-800 transition-colors duration-300 text-sm" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}