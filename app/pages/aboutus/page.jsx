'use client'

import { useState } from 'react'
import { FaCar, FaUsers, FaAward, FaMapMarkerAlt, FaShieldAlt, FaHeart, FaChartLine, FaHandshake, FaStar, FaCheck, FaRocket, FaGlobe, FaTrophy, FaSmile, FaLeaf, FaBolt, FaPaintBrush, FaCogs, FaSatellite, FaCamera, FaBrain, FaNetworkWired } from 'react-icons/fa'
import { GiCarWheel, GiCarDoor } from 'react-icons/gi'
import { TbSteeringWheel } from 'react-icons/tb'
import { motion } from 'framer-motion'
import VideoModal from './VideoModal'

function VideoModalHolder({ isOpen, onClose, videoId }) {
  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-3xl bg-transparent rounded-lg">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white/10 text-white rounded-full p-2 hover:bg-white/20"
          aria-label="Close video"
        >
          ✕
        </button>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&muted=0`}
            title="Watch video"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
  ) : null
}

export default function ModernAbout() {
  const [videoOpen, setVideoOpen] = useState(false)
  const videoId = 'mPFFUWPXAFs'

  const stats = [
    { number: "2,500+", label: "Premium Vehicles Sold", icon: FaCar, color: "from-blue-600 to-cyan-500" },
    { number: "98.7%", label: "Customer Satisfaction", icon: FaStar, color: "from-purple-600 to-pink-500" },
    { number: "6 Cities", label: "Across Kenya", icon: FaMapMarkerAlt, color: "from-green-600 to-emerald-500" },
    { number: "KSh 50B+", label: "Total Transactions", icon: FaChartLine, color: "from-orange-600 to-red-500" }
  ]

  const values = [
    {
      icon: FaBrain,
      title: "AI-Powered Excellence",
      description: "Our advanced AI systems analyze 200+ vehicle data points for unparalleled accuracy in inspection and valuation.",
      color: "from-blue-600 to-purple-600",
      features: ["Machine Learning Models", "Predictive Analytics", "Real-time Diagnostics"]
    },
    {
      icon: FaShieldAlt,
      title: "Blockchain Security",
      description: "Every transaction and vehicle history is secured on immutable blockchain for complete transparency and trust.",
      color: "from-green-600 to-teal-600",
      features: ["Smart Contracts", "Immutable Records", "Fraud Prevention"]
    },
    {
      icon: FaSatellite,
      title: "Digital-First Experience",
      description: "Seamless online journey from virtual tours to digital paperwork and remote delivery.",
      color: "from-purple-600 to-pink-600",
      features: ["VR Showrooms", "Digital Contracts", "Contactless Delivery"]
    },
    {
      icon: FaNetworkWired,
      title: "Eco-Innovation",
      description: "Leading the shift to sustainable mobility with electric vehicles and carbon-neutral operations.",
      color: "from-emerald-600 to-cyan-600",
      features: ["EV Focus", "Carbon Offsets", "Green Logistics"]
    }
  ]

  const technology = [
    {
      title: "OBD-II Engine Diagnostics",
      description: "AI analyses on-board sensor streams to surface hidden engine, transmission and emissions issues instantly.",
      icon: FaCogs,
      accuracy: "99%"
    },
    {
      title: "VIN & History Verification",
      description: "Automated VIN decoding and tamper-proof history checks ensure every vehicle’s provenance and service records are validated.",
      icon: FaShieldAlt,
      accuracy: "100%"
    },
    {
      title: "360° Interior & Exterior Tours",
      description: "High-resolution, interactive tours and AI-annotated imagery highlight wear, options and equipment for buyer confidence.",
      icon: FaCamera,
      accuracy: "100%"
    },
    {
      title: "Predictive Maintenance & Pricing",
      description: "Machine learning forecasts maintenance needs and market pricing to maximise resale value and reduce buyer risk.",
      icon: FaChartLine,
      accuracy: "95%"
    }
  ]

  const milestones = [
    { 
      year: "2016", 
      event: "Digital Genesis", 
      description: "Launched Kenya's first AI-powered car marketplace",
      icon: FaRocket,
      highlight: true 
    },
    { 
      year: "2018", 
      event: "Blockchain Integration", 
      description: "Pioneered blockchain verification for vehicle history",
      icon: FaNetworkWired,
      highlight: true 
    },
    { 
      year: "2020", 
      event: "VR Revolution", 
      description: "Introduced virtual reality vehicle inspections",
      icon: FaGlobe 
    },
    { 
      year: "2024", 
      event: "AI Expansion", 
      description: "Launched predictive analytics and smart pricing",
      icon: FaBrain,
      highlight: true 
    }
  ]

  const achievements = [
    { number: "500+", label: "5-Star Reviews", icon: FaStar, suffix: "★" },
    { number: "1M+", label: "Data Points Analyzed", icon: FaBrain, suffix: "" },
    { number: "24/7", label: "AI Support", icon: FaBolt, suffix: "" },
    { number: "0", label: "Fraud Cases", icon: FaShieldAlt, suffix: "" }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Modern Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full" style={{
              backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* Floating Particles */}
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-40 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-70 delay-300"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-3 rounded-2xl mb-8">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center animate-pulse">
                    <FaBolt className="text-white text-sm" />
                  </div>
                  <span className="text-sm font-semibold tracking-wider">AI-POWERED • BLOCKCHAIN • VIRTUAL REALITY</span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Corporate Sellers
                  </span>
                  <br />
                  <span className="text-white">Platform</span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Connecting Buyers & Sellers
                  </span>
                </h1>

                <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed mb-10">
                  A dedicated online platform for corporate sellers to list and manage
                  automated, certified second‑hand cars. Seamlessly connect buyers and
                  sellers with AI-driven listings, verification, and streamlined workflows.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-xl">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="text-white text-sm" />
                      </div>
                      <div>
                        <div className="text-lg lg:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          {stat.number}
                        </div>
                        <div className="text-white/70 text-xs font-medium">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="/carlisitings"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                >
                  <FaRocket /> Explore Our Tech
                </a>

                {/* Watch Now opens YouTube modal */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setVideoOpen(true)}
                  className="bg-transparent border-2 border-white/20 text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-white/8 transition-all"
                >
                  Watch Now
                </motion.button>
              </div>

              {/* Video Modal */}
              {/*
                modal controlled by useState; iframe uses YouTube embed.
                Keeps UI intact — just overlays modal when opened.
              */}
              {typeof window !== 'undefined' && (
                <VideoModalHolder isOpen={videoOpen} onClose={() => setVideoOpen(false)} videoId={videoId} />
              )}
            </motion.div>

            {/* Right Content - Car Visualization */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/20">
                {/* make image shorter in height and use contain so full car is visible and appears wider */}
                <img
                  src="/car2.png"
                  alt="Modern Premium Car"
                  className="w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[420px] object-contain mx-auto transform hover:scale-102 transition-transform duration-700"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[420px] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-dashed border-white/30 rounded-3xl flex items-center justify-center">
                        <div class="text-center">
                          <FaCar class="text-white/50 text-7xl mb-6 mx-auto" />
                          <div class="text-white text-lg font-semibold mb-2">Modern Vehicle</div>
                          <div class="text-white/50">Image loading...</div>
                        </div>
                      </div>
                    `
                  }}
                />
                
                {/* subtle overlay preserved */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black/30 pointer-events-none"></div>
               </div>
 
               {/* Floating Elements (kept decorative) */}
               <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-white/10 backdrop-blur-sm"></div>
               <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-white/10 backdrop-blur-sm"></div>
             </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-white/60 text-sm font-medium">Scroll to explore</div>
          <div className="w-px h-16 bg-gradient-to-b from-cyan-400/50 to-transparent mx-auto mt-2"></div>
        </motion.div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Our Technology
              </span>
              <br />
              <span className="text-white">Stack</span>
            </h2>
            <p className="text-lg text-white/60 max-w-3xl mx-auto">
              Powered by cutting-edge technologies that redefine vehicle commerce
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {technology.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <tech.icon className="text-cyan-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{tech.title}</h3>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">{tech.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/40">Accuracy</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {tech.accuracy}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Achievement Stats */}
          <div className="bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20 rounded-3xl p-8 border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    {achievement.number}
                    <span className="text-cyan-400">{achievement.suffix}</span>
                  </div>
                  <div className="text-white/70 text-sm font-medium">{achievement.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black mb-6">
              <span className="text-white">Innovation</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Principles
              </span>
            </h2>
            <p className="text-lg text-white/60 max-w-3xl mx-auto">
              The core values that drive our technological evolution and customer experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center flex-shrink-0`}>
                    <value.icon className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{value.title}</h3>
                    <p className="text-white/70 leading-relaxed">{value.description}</p>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <div className="text-sm font-medium text-white/50 mb-3">Key Technologies</div>
                  <div className="flex flex-wrap gap-2">
                    {value.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm border border-white/10"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Evolution
              </span>
              <br />
              <span className="text-white">Timeline</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 ${milestone.highlight ? 'border-cyan-500/50' : ''}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl ${milestone.highlight ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-white/10'} flex items-center justify-center`}>
                          <milestone.icon className={`${milestone.highlight ? 'text-white' : 'text-cyan-400'} text-sm`} />
                        </div>
                        <div className={`text-xl font-bold ${milestone.highlight ? 'text-white' : 'text-white/80'}`}>
                          {milestone.year}
                        </div>
                      </div>
                      <h3 className={`text-lg font-semibold mb-2 ${milestone.highlight ? 'text-cyan-300' : 'text-white'}`}>
                        {milestone.event}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full ${milestone.highlight ? 'bg-cyan-500 animate-pulse' : 'bg-purple-500'}`}></div>
                    <div className={`absolute w-6 h-6 rounded-full ${milestone.highlight ? 'border-2 border-cyan-500/50' : 'border border-purple-500/30'}`}></div>
                  </div>
                  
                  {/* Empty Space */}
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(56, 189, 248, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-8">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Experience the Future
              </span>
              <br />
              <span className="text-white">of Car Trading</span>
            </h2>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
              Join thousands who trust our AI-powered platform for secure, transparent, 
              and seamless vehicle transactions.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/30 transition-all flex items-center gap-3"
              >
                <FaRocket /> Start Your Journey
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                Schedule Tech Demo
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-16">
              {[
                { icon: FaShieldAlt, text: 'Bank-Level Security' },
                { icon: FaBrain, text: 'AI-Powered' },
                { icon: FaSatellite, text: 'Digital-First' },
                { icon: FaLeaf, text: 'Eco-Conscious' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                    <item.icon className="text-cyan-400 text-xl" />
                  </div>
                  <span className="text-white/70 text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        ::selection {
          background-color: rgba(6, 182, 212, 0.3);
          color: #ffffff;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #2563eb);
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          button, 
          [role="button"] {
            min-height: 48px;
            min-width: 48px;
          }
        }
      `}</style>
    </div>
  )
}
