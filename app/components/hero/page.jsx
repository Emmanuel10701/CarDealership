'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useMotionTemplate,
  useSpring,
  useTransform 
} from 'framer-motion'
import { 
  FaCar, FaStar, FaMapMarkerAlt, FaCog, 
  FaGasPump, FaCalendar, FaHeart, FaArrowRight, 
  FaPlay, FaPause, FaSearch, FaShieldAlt, 
  FaAward, FaUsers, FaClock, FaTrophy, FaCrown,
  FaHandshake, FaGem, FaCheck, FaChevronLeft, FaChevronRight,
  FaBolt
} from 'react-icons/fa'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// --- UTILS ---
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// --- DATA ---
const CARS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
    title: "Toyota RAV4 Hybrid",
    price: "KSh 2,300,000",
    location: "Nairobi",
    mileage: "45k km",
    transmission: "Auto",
    fuel: "Hybrid",
    year: "2021",
    rating: "4.8",
    color: "from-blue-600 to-cyan-500",
    features: ["Sunroof", "Leather", "AWD"],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    title: "Subaru Outback",
    price: "KSh 2,800,000",
    location: "Nakuru",
    mileage: "32k km",
    transmission: "CVT",
    fuel: "Petrol",
    year: "2022",
    rating: "4.9",
    color: "from-emerald-600 to-teal-500",
    features: ["EyeSight", "CarPlay", "Heated Seats"],
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1605218427368-35b019905561?auto=format&fit=crop&w=1200&q=80",
    title: "Porsche Macan",
    price: "KSh 6,500,000",
    location: "Karen",
    mileage: "12k km",
    transmission: "PDK",
    fuel: "Petrol",
    year: "2023",
    rating: "5.0",
    color: "from-purple-600 to-pink-500",
    features: ["Sport Chrono", "Panoramic", "Bose"],
  }
]

const STATS = [
  { number: "2.5k+", label: "Happy Customers", icon: FaUsers, color: "text-blue-400" },
  { number: "98%", label: "Satisfaction", icon: FaHeart, color: "text-rose-400" },
  { number: "8 Yrs", label: "Experience", icon: FaAward, color: "text-amber-400" },
  { number: "1 Yr", label: "Warranty", icon: FaShieldAlt, color: "text-emerald-400" }
]

const FEATURES = [
  { icon: FaShieldAlt, title: "200-Point Check", description: "Comprehensive vehicle analysis." },
  { icon: FaCheck, title: "Certified Quality", description: "Verified history & mileage." },
  { icon: FaHandshake, title: "Transparent Deals", description: "Zero hidden costs, ever." },
  { icon: FaClock, title: "Quick Process", description: "Paperwork in 30 minutes." },
  { icon: FaTrophy, title: "Award Winning", description: "Voted #1 Dealer 2023." },
  { icon: FaUsers, title: "Expert Team", description: "Professional guidance 24/7." }
]

// --- COMPONENTS ---

// 1. Spotlight Card (Mouse tracking hover effect)
function SpotlightCard({ children, className = "", color = "rgba(59, 130, 246, 0.15)" }) {
  const divRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative border border-white/10 bg-slate-900/50 overflow-hidden rounded-2xl",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${color},
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}

// 2. 3D Tilt Wrapper for Car Card
function TiltWrapper({ children }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [5, -5])
  const rotateY = useTransform(x, [-100, 100], [-5, 5])

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, z: 100 }}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.1}
      whileHover={{ cursor: "grab" }}
      whileTap={{ cursor: "grabbing" }}
      className="perspective-1000 w-full"
    >
      {children}
    </motion.div>
  )
}

export default function ModernHome() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Autoplay Logic
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CARS.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextCar = () => setCurrentIndex((prev) => (prev + 1) % CARS.length)
  const prevCar = () => setCurrentIndex((prev) => (prev - 1 + CARS.length) % CARS.length)

  const currentCar = CARS[currentIndex]

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      {/* using min-h-dvh ensures it fits mobile viewports correctly but expands if zoomed */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center py-12 lg:py-0 overflow-hidden">
        
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-700" />
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* LEFT COLUMN: Content & Search */}
            <div className="w-full lg:w-1/2 space-y-8 lg:space-y-10 text-center lg:text-left pt-10 lg:pt-0">
              
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mx-auto lg:mx-0"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <FaCrown className="text-[10px] text-white" />
                </div>
                <span className="text-sm font-semibold tracking-wide text-slate-200">Corporate Sellers Edition</span>
              </motion.div>

              {/* Heading - Clamp for zoom safety */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[1.1] tracking-tight"
              >
                Discover <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentCar.color}`}>
                  Automotive Elite
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Kenya's premier destination for certified pre-owned luxury. 
                Experience transparency, quality, and unmatched service.
              </motion.p>

              {/* Search Bar - Modern Glass */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative max-w-lg mx-auto lg:mx-0 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                  <FaSearch className="ml-4 text-slate-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Search model, brand or year..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500 px-4 py-3 text-base"
                  />
                  <button className="hidden sm:flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
                    Explore
                  </button>
                </div>
              </motion.div>

              {/* Stats Row - Flex wrap for zoom safety */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4"
              >
                {STATS.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2 border border-white/5">
                    <stat.icon className={`text-xl ${stat.color}`} />
                    <div className="text-left">
                      <div className="font-bold text-white leading-none">{stat.number}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT COLUMN: The Car Carousel */}
            <div className="w-full lg:w-1/2 relative h-[500px] sm:h-[600px] flex items-center justify-center">
              <TiltWrapper>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={currentCar.id}
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="relative w-full max-w-lg mx-auto"
                  >
                    {/* Glass Card */}
                    <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                      
                      {/* Image Area */}
                      <div className="relative h-64 sm:h-80 w-full overflow-hidden group">
                        <motion.img 
                          layoutId={`img-${currentCar.id}`}
                          src={currentCar.image} 
                          alt={currentCar.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
                        
                        <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-2">
                           <FaGem className="text-blue-400" /> Premium Selection
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-6 sm:p-8 -mt-12 relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">{currentCar.title}</h2>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <FaMapMarkerAlt className="text-blue-500" /> {currentCar.location}
                              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                              <span className="flex items-center gap-1 text-yellow-400"><FaStar /> {currentCar.rating}</span>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                             <div className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${currentCar.color}`}>
                               {currentCar.price}
                             </div>
                             <div className="text-xs text-slate-500 line-through">Mkt: +15%</div>
                          </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-4 gap-2 mb-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                           {[
                             { icon: FaCog, val: currentCar.transmission },
                             { icon: FaGasPump, val: currentCar.fuel },
                             { icon: FaCalendar, val: currentCar.year },
                             { icon: FaCar, val: currentCar.mileage },
                           ].map((item, i) => (
                             <div key={i} className="flex flex-col items-center justify-center gap-1">
                               <item.icon className="text-slate-400 text-sm" />
                               <span className="text-[10px] sm:text-xs font-bold text-slate-200">{item.val}</span>
                             </div>
                           ))}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                          <button onClick={prevCar} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                            <FaChevronLeft className="text-sm" />
                          </button>
                          
                          <button className={`flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r ${currentCar.color} text-white shadow-lg hover:brightness-110 transition-all`}>
                            View Details
                          </button>

                          <button onClick={() => setIsAutoPlaying(!isAutoPlaying)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                            {isAutoPlaying ? <FaPause className="text-sm" /> : <FaPlay className="text-sm" />}
                          </button>

                          <button onClick={nextCar} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                            <FaChevronRight className="text-sm" />
                          </button>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </TiltWrapper>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-slate-900 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Why Corporate<span className="text-blue-500">Sellers</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We've reimagined the dealership experience. 
              No haggling, no hidden fees, just pure driving pleasure.
            </p>
          </div>

          {/* Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((feature, index) => (
              <SpotlightCard 
                key={index}
                className="p-8 h-full bg-slate-950/50 backdrop-blur-sm"
                color={index % 2 === 0 ? "rgba(59, 130, 246, 0.15)" : "rgba(168, 85, 247, 0.15)"}
              >
                <div className="flex flex-col items-start h-full">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="text-2xl text-blue-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-400 leading-relaxed mb-6 flex-grow">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    Learn more <FaArrowRight />
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>

        </div>
      </section>

    </div>
  )
}