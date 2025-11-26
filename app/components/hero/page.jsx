'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useMotionTemplate,
  useSpring,
  useTransform,
  useScroll,
  useVelocity,
  useAnimationFrame
} from 'framer-motion'
import { 
  FaCar, FaStar, FaMapMarkerAlt, FaCog, 
  FaGasPump, FaCalendar, FaHeart, FaArrowRight, 
  FaPlay, FaPause, FaSearch, FaShieldAlt, 
  FaAward, FaUsers, FaClock, FaTrophy, FaCrown,
  FaHandshake, FaGem, FaCheck, FaChevronLeft, FaChevronRight,
  FaBolt, FaPhone, FaEnvelope, FaWhatsapp, FaInstagram,
  FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaTiktok,
  FaFilter, FaSort, FaEye, FaShare, FaBookmark,
  FaMoneyBillWave, FaCreditCard, FaSync, FaLeaf,
  FaTools, FaUserCheck, FaCertificate, FaMedal,
  FaRocket, FaChartLine, FaGlobe, FaMobile,
  FaDesktop, FaTablet, FaCloud, FaDatabase,
  FaLock, FaUnlock, FaKey, FaUserShield,
  FaQrcode, FaBarcode, FaReceipt, FaFileInvoice,
  FaShapes, FaPalette, FaPaintBrush, FaEraser,
  FaVectorSquare, FaCube, FaCubes, FaShield,
  FaCrosshairs, FaBullseye, FaTarget, FaDice,
  FaChess, FaPuzzlePiece, FaGamepad, FaDiceD20,
  FaMagic, FaHatWizard, FaGhost, FaDragon,
  FaFire, FaWater, FaMountain, FaTree,
  FaSeedling, FaRecycle, FaSolarPanel, FaWind,
  FaCloudRain, FaSnowflake, FaUmbrella,
  FaSun, FaMoon, FaCloudSun, FaCloudMoon,
  FaMeteor, FaSatellite, FaSpaceShuttle,
  FaUserAstronaut, FaRobot, FaMicrochip,
  FaNetworkWired, FaServer, FaCode,
  FaTerminal, FaKeyboard, FaMouse,
  FaHeadphones, FaMicrophone, FaVideo,
  FaCamera, FaPhotoVideo, FaFilm,
  FaMusic, FaPodcast, FaRadio,
  FaTv, FaNewspaper, FaBook,
  FaGraduationCap, FaSchool, FaUniversity,
  FaBriefcase, FaSuitcase, FaLuggageCart,
  FaPlane, FaShip, FaTrain, FaBus,
  FaTaxi, FaMotorcycle, FaBicycle,
  FaWalking, FaRunning, FaHiking,
  FaSwimmer, FaSkiing, FaSnowboarding,
  FaBasketballBall, FaFootballBall, FaBaseballBall,
  FaVolleyballBall, FaTennisBall, FaGolfBall,
  FaHockeyPuck, FaTableTennis, FaBowlingBall,
  FaChessBoard, FaDiceFive, FaDiceFour,
  FaDiceThree, FaDiceTwo, FaDiceOne,
  FaDiceSix, FaDiceD6, FaDiceD12,
  FaDiceD20, FaDragon, FaHatCowboy,
  FaHatCowboySide, FaMask, FaTheaterMasks,
  FaMonument, FaLandmark, FaHome,
  FaBuilding, FaCity, FaUmbrellaBeach,
  FaMountain, FaTree, FaSeedling,
  FaRecycle, FaLeaf, FaFeather,
  FaPaw, FaDog, FaCat,
  FaHorse, FaCow, FaSheep,
  FaCrow, FaDove, FaFish,
  FaFrog, FaSpider, FaOtter,
  FaHippo, FaElephant, FaGiraffe,
  FaKiwiBird, FaOtter, FaPaw,
  FaSpider, FaFeatherAlt, FaEgg,
  FaDragon, FaSkullCrossbones,
  FaGhost, FaBookDead, FaFlask,
  FaVial, FaBeaker, FaMicroscope,
  FaDna, FaStethoscope, FaSyringe,
  FaPills, FaPrescriptionBottle,
  FaHeartbeat, FaLungs, FaBrain,
  FaTooth, FaBone, FaEyeDropper,
  FaClinicMedical, FaHospital,
  FaAmbulance, FaFirstAid,
  FaBandAid, FaCrutch, FaProcedures,
  FaXRay, FaTeeth, FaTeethOpen,
  FaUserMd, FaUserNurse, FaStaffSnake,
  FaStarOfLife, FaCross, FaAllergies,
  FaBacteria, FaVirus, FaVirusSlash,
  FaShieldVirus, FaHeadSideMask,
  FaHandHoldingMedical, FaHandsWash,
  FaPumpMedical, FaPumpSoap,
  FaHandsHelping, FaHandHoldingHeart,
  FaHandHoldingUsd, FaHandHoldingWater,
  FaHandPaper, FaHandPeace,
  FaHandPointDown, FaHandPointLeft,
  FaHandPointRight, FaHandPointUp,
  FaHandRock, FaHandScissors,
  FaHandSparkles, FaHands,
  FaPrayingHands, FaThumbsDown,
  FaThumbsUp, FaAngry, FaDizzy,
  FaFlushed, FaFrown, FaFrownOpen,
  FaGrimace, FaGrin, FaGrinAlt,
  FaGrinBeam, FaGrinBeamSweat,
  FaGrinHearts, FaGrinSquint,
  FaGrinSquintTears, FaGrinStars,
  FaGrinTears, FaGrinTongue,
  FaGrinTongueSquint, FaGrinTongueWink,
  FaGrinWink, FaKiss, FaKissBeam,
  FaKissWinkHeart, FaLaugh,
  FaLaughBeam, FaLaughSquint,
  FaLaughWink, FaMeh, FaMehBlank,
  FaMehRollingEyes, FaSadCry,
  FaSadTear, FaSmile, FaSmileBeam,
  FaSmileWink, FaSurprise, FaTired,
  FaRegAngry, FaRegDizzy,
  FaRegFlushed, FaRegFrown,
  FaRegFrownOpen, FaRegGrimace,
  FaRegGrin, FaRegGrinAlt,
  FaRegGrinBeam, FaRegGrinBeamSweat,
  FaRegGrinHearts, FaRegGrinSquint,
  FaRegGrinSquintTears, FaRegGrinStars,
  FaRegGrinTears, FaRegGrinTongue,
  FaRegGrinTongueSquint, FaRegGrinTongueWink,
  FaRegGrinWink, FaRegKiss,
  FaRegKissBeam, FaRegKissWinkHeart,
  FaRegLaugh, FaRegLaughBeam,
  FaRegLaughSquint, FaRegLaughWink,
  FaRegMeh, FaRegMehBlank,
  FaRegMehRollingEyes, FaRegSadCry,
  FaRegSadTear, FaRegSmile,
  FaRegSmileBeam, FaRegSmileWink,
  FaRegSurprise, FaRegTired
} from 'react-icons/fa'

// --- UTILS ---
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

// Enhanced data with more content
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
    features: ["Sunroof", "Leather", "AWD", "Navigation", "Premium Sound"],
    seller: "Corporate Dealer",
    verified: true,
    views: 1247,
    saves: 89
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    title: "Subaru Outback Wilderness",
    price: "KSh 2,800,000",
    location: "Nakuru",
    mileage: "32k km",
    transmission: "CVT",
    fuel: "Petrol",
    year: "2022",
    rating: "4.9",
    color: "from-emerald-600 to-teal-500",
    features: ["EyeSight", "CarPlay", "Heated Seats", "Off-road", "Turbo"],
    seller: "Premium Motors",
    verified: true,
    views: 892,
    saves: 67
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1605218427368-35b019905561?auto=format&fit=crop&w=1200&q=80",
    title: "Porsche Macan GTS",
    price: "KSh 6,500,000",
    location: "Central Kenya",
    mileage: "12k km",
    transmission: "PDK",
    fuel: "Petrol",
    year: "2023",
    rating: "5.0",
    color: "from-purple-600 to-pink-500",
    features: ["Sport Chrono", "Panoramic", "Bose", "Performance", "Luxury"],
    seller: "Elite Auto Group",
    verified: true,
    views: 2156,
    saves: 134
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    title: "Mercedes-Benz GLE Coupe",
    price: "KSh 8,200,000",
    location: "Nairobi",
    mileage: "18k km",
    transmission: "Auto",
    fuel: "Diesel",
    year: "2022",
    rating: "4.9",
    color: "from-amber-600 to-orange-500",
    features: ["MBUX", "Air Suspension", "Premium", "Coupe", "AMG Line"],
    seller: "German Auto Experts",
    verified: true,
    views: 1789,
    saves: 112
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    title: "Land Rover Defender",
    price: "KSh 9,500,000",
    location: "Nakuru",
    mileage: "25k km",
    transmission: "Auto",
    fuel: "Diesel",
    year: "2021",
    rating: "4.7",
    color: "from-green-600 to-lime-500",
    features: ["Terrain Response", "Air Suspension", "Luxury", "4x4", "Adventure"],
    seller: "Safari Vehicles Ltd",
    verified: true,
    views: 1567,
    saves: 98
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    title: "BMW X5 M Competition",
    price: "KSh 12,800,000",
    location: "Central Kenya",
    mileage: "8k km",
    transmission: "Auto",
    fuel: "Petrol",
    year: "2023",
    rating: "5.0",
    color: "from-red-600 to-rose-500",
    features: ["M Sport", "Carbon Fiber", "Performance", "Luxury", "Tech Pack"],
    seller: "Bavarian Motors",
    verified: true,
    views: 2890,
    saves: 201
  }
]

const STATS = [
  { number: "2.5k+", label: "Happy Customers", icon: FaUsers, color: "text-blue-400", description: "Satisfied buyers across Kenya" },
  { number: "98%", label: "Satisfaction Rate", icon: FaHeart, color: "text-rose-400", description: "Customer happiness guaranteed" },
  { number: "8 Yrs", label: "Industry Experience", icon: FaAward, color: "text-amber-400", description: "Trusted since 2016" },
  { number: "1 Yr", label: "Warranty Included", icon: FaShieldAlt, color: "text-emerald-400", description: "Peace of mind guaranteed" },
  { number: "24/7", label: "Support Available", icon: FaClock, color: "text-purple-400", description: "Always here to help" },
  { number: "200+", label: "Point Inspection", icon: FaCheck, color: "text-cyan-400", description: "Comprehensive quality check" }
]

const FEATURES = [
  { 
    icon: FaShieldAlt, 
    title: "200-Point Inspection", 
    description: "Every vehicle undergoes rigorous 200-point quality inspection by certified technicians.",
    color: "from-blue-500 to-cyan-500"
  },
  { 
    icon: FaCertificate, 
    title: "Certified Quality", 
    description: "All vehicles come with verified history reports and certified quality assurance.",
    color: "from-emerald-500 to-teal-500"
  },
  { 
    icon: FaHandshake, 
    title: "Transparent Deals", 
    description: "No hidden costs, complete price transparency, and honest vehicle condition reports.",
    color: "from-purple-500 to-pink-500"
  },
  { 
    icon: FaRocket, 
    title: "Quick Process", 
    description: "From listing to sale completion, our streamlined process saves you time and effort.",
    color: "from-orange-500 to-red-500"
  },
  { 
    icon: FaTrophy, 
    title: "Award Winning", 
    description: "Voted Kenya's #1 automotive marketplace 2023 with multiple industry awards.",
    color: "from-amber-500 to-yellow-500"
  },
  { 
    icon: FaUserCheck, 
    title: "Expert Team", 
    description: "Professional automotive experts providing guidance and support 24/7.",
    color: "from-indigo-500 to-blue-500"
  },
  { 
    icon: FaMoneyBillWave, 
    title: "Best Prices", 
    description: "Competitive pricing with market analysis to ensure you get the best value.",
    color: "from-green-500 to-emerald-500"
  },
  { 
    icon: FaSync, 
    title: "Easy Trade-In", 
    description: "Seamless trade-in process for your current vehicle with instant valuation.",
    color: "from-rose-500 to-pink-500"
  },
  { 
    icon: FaLeaf, 
    title: "Eco Friendly", 
    description: "Promoting sustainable automotive practices and eco-friendly vehicle options.",
    color: "from-lime-500 to-green-500"
  }
]

const REGIONS = [
  { name: "Nairobi", cars: 245, icon: FaCity, color: "from-blue-500 to-cyan-500" },
  { name: "Nakuru", cars: 89, icon: FaMountain, color: "from-emerald-500 to-teal-500" },
  { name: "Central Kenya", cars: 156, icon: FaTree, color: "from-purple-500 to-pink-500" },
  { name: "Rift Valley", cars: 78, icon: FaLandmark, color: "from-orange-500 to-red-500" },
  { name: "Coastal", cars: 45, icon: FaUmbrellaBeach, color: "from-amber-500 to-yellow-500" },
  { name: "Western", cars: 67, icon: FaWater, color: "from-indigo-500 to-blue-500" }
]

const TESTIMONIALS = [
  {
    name: "Sarah Kimani",
    role: "Corporate Fleet Manager",
    company: "Nairobi Enterprises Ltd",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "Sold 15 company vehicles through this platform. The process was seamless and we got better prices than expected.",
    region: "Nairobi"
  },
  {
    name: "James Mwangi",
    role: "Auto Dealer Owner",
    company: "Premium Motors Nakuru",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "As a dealer in Nakuru, this platform has expanded my reach across Central Kenya. Professional service always.",
    region: "Nakuru"
  },
  {
    name: "Grace Wambui",
    role: "Fleet Director",
    company: "Central Transport Solutions",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "The verification process and customer support made selling our fleet vehicles stress-free and profitable.",
    region: "Central Kenya"
  }
]

const FAQS = [
  {
    question: "How do I list my corporate fleet vehicles for sale?",
    answer: "Simply register as a corporate seller, verify your business, and use our bulk upload feature to list multiple vehicles simultaneously. Our team will assist with professional photography and detailed listings."
  },
  {
    question: "What regions in Kenya do you serve?",
    answer: "We primarily serve Nairobi, Nakuru, and Central Kenya regions, with expanding services to Rift Valley, Coastal, and Western regions. Delivery and inspection services available nationwide."
  },
  {
    question: "Are there any fees for corporate sellers?",
    answer: "Basic listing is free for corporate partners. We charge a small success fee only when vehicles are sold. Premium features like featured listings and marketing packages are available."
  },
  {
    question: "How do you ensure vehicle quality and authenticity?",
    answer: "Every vehicle undergoes our comprehensive 200-point inspection process, history verification, and quality certification. We work with certified mechanics and use advanced diagnostic tools."
  },
  {
    question: "What payment methods do you support?",
    answer: "We support bank transfers, mobile money, credit/debit cards, and financing options through our partner institutions. All transactions are secure and insured."
  },
  {
    question: "How long does the selling process take?",
    answer: "Most corporate sellers complete sales within 2-4 weeks. With our premium service, we can expedite the process to 7-14 days through targeted marketing and buyer matching."
  }
]

// Advanced Components
function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  })

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

  const directionFactor = useRef(1)
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="parallax overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div className="flex whitespace-nowrap flex-nowrap" style={{ x }}>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
      </motion.div>
    </div>
  )
}

function wrap(min, max, v) {
  const range = max - min
  const mod = (((v - min) % range) + range) % range
  return mod + min
}

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

function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[80px] animate-pulse delay-300" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <FloatingElements />
    </div>
  )
}

function RegionCard({ region, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <SpotlightCard className="p-6 h-full bg-slate-900/30 backdrop-blur-sm">
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${region.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <region.icon className="text-2xl text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{region.name}</h3>
          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-2">
            {region.cars}+ Cars
          </p>
          <p className="text-slate-400 text-sm">Available Now</p>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
      className="h-full"
    >
      <SpotlightCard className="p-6 h-full bg-slate-900/30 backdrop-blur-sm">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-4">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <h4 className="font-bold text-white">{testimonial.name}</h4>
              <p className="text-slate-400 text-sm">{testimonial.role}</p>
              <p className="text-slate-500 text-xs">{testimonial.company}</p>
            </div>
          </div>
          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-sm" />
            ))}
          </div>
          <p className="text-slate-300 mb-4 flex-grow">"{testimonial.text}"</p>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">{testimonial.region}</span>
            <span className="text-blue-400">Verified Seller</span>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}

function FAQItem({ faq, index, isOpen, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border border-white/10 rounded-2xl overflow-hidden bg-slate-900/30 backdrop-blur-sm"
    >
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-all duration-300"
        onClick={() => onClick(index)}
      >
        <span className="font-semibold text-white text-lg pr-4">{faq.question}</span>
        {isOpen ? (
          <FaChevronUp className="text-blue-400 flex-shrink-0" />
        ) : (
          <FaChevronDown className="text-blue-400 flex-shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 py-4 bg-blue-500/10 border-t border-blue-500/20"
          >
            <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function CarCard({ car, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <SpotlightCard className="h-full bg-slate-900/30 backdrop-blur-sm overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img
            src={car.image}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <FaStar className="text-yellow-400" /> {car.rating}
            </span>
            {car.verified && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <FaCheck /> Verified
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
              <FaBookmark className="text-sm" />
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
              <FaShare className="text-sm" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {car.title}
            </h3>
            <div className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${car.color}`}>
              {car.price}
            </div>
          </div>
          
          <div className="flex items-center text-slate-400 text-sm mb-4">
            <FaMapMarkerAlt className="text-blue-500 mr-1" />
            {car.location}
            <span className="mx-2">•</span>
            <span>{car.year}</span>
            <span className="mx-2">•</span>
            <span>{car.mileage}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center text-slate-400 text-sm">
              <FaCog className="mr-2" /> {car.transmission}
            </div>
            <div className="flex items-center text-slate-400 text-sm">
              <FaGasPump className="mr-2" /> {car.fuel}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {car.features.slice(0, 3).map((feature, i) => (
              <span
                key={i}
                className="bg-white/5 text-slate-300 px-2 py-1 rounded-full text-xs border border-white/10"
              >
                {feature}
              </span>
            ))}
            {car.features.length > 3 && (
              <span className="bg-white/5 text-slate-300 px-2 py-1 rounded-full text-xs border border-white/10">
                +{car.features.length - 3} more
              </span>
            )}
          </div>

          <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FaEye /> {car.views}
              </span>
              <span className="flex items-center gap-1">
                <FaBookmark /> {car.saves}
              </span>
            </div>
            <span className="text-blue-400">{car.seller}</span>
          </div>

          <button className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${car.color} hover:brightness-110 transition-all shadow-lg`}>
            View Details
          </button>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}

export default function ModernHome() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFaq, setActiveFaq] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState('all')

  // Enhanced autoplay logic
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CARS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextCar = () => setCurrentIndex((prev) => (prev + 1) % CARS.length)
  const prevCar = () => setCurrentIndex((prev) => (prev - 1 + CARS.length) % CARS.length)
  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? null : index)

  const currentCar = CARS[currentIndex]
  const filteredCars = selectedRegion === 'all' 
    ? CARS 
    : CARS.filter(car => car.location.toLowerCase().includes(selectedRegion.toLowerCase()))

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Enhanced Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center py-12 lg:py-0 overflow-hidden">
        <AnimatedBackground />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-8 lg:space-y-10 text-center lg:text-left pt-10 lg:pt-0">
              
              {/* Enhanced Badge */}
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

              {/* Enhanced Heading */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[1.1] tracking-tight"
              >
                Kenya's Premier <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentCar.color}`}>
                  Car Marketplace
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Connecting corporate sellers across Nairobi, Nakuru & Central Kenya with verified buyers. 
                Experience premium service, transparency, and unmatched value.
              </motion.p>

              {/* Enhanced Search */}
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
                    placeholder="Search brand, model, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500 px-4 py-3 text-base"
                  />
                  <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all whitespace-nowrap">
                    Find Cars
                  </button>
                </div>
              </motion.div>

              {/* Enhanced Stats */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-4"
              >
                {STATS.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5 hover:border-white/10 transition-colors">
                    <stat.icon className={`text-2xl ${stat.color}`} />
                    <div className="text-left">
                      <div className="font-bold text-white leading-none text-lg">{stat.number}</div>
                      <div className="text-xs text-slate-400 font-semibold tracking-wide">{stat.label}</div>
                      <div className="text-[10px] text-slate-500">{stat.description}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Enhanced Car Carousel */}
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
                    <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                      
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
                        
                        <div className="absolute bottom-4 left-4 bg-green-600/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
                           Verified • {currentCar.views} Views
                        </div>
                      </div>

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
                             <div className="text-xs text-slate-500">Best Price Guarantee</div>
                          </div>
                        </div>

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

                        <div className="flex items-center gap-3">
                          <button onClick={prevCar} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                            <FaChevronLeft className="text-sm" />
                          </button>
                          
                          <button className={`flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r ${currentCar.color} text-white shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2`}>
                            <FaEye className="text-xs" /> View Details
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

      {/* Enhanced Features Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Why Choose <span className="text-blue-500">AutoElite</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We've revolutionized the automotive marketplace with cutting-edge technology 
              and unparalleled service for corporate sellers across Kenya.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((feature, index) => (
              <SpotlightCard 
                key={index}
                className="p-8 h-full bg-slate-950/50 backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-300"
                color={index % 2 === 0 ? "rgba(59, 130, 246, 0.15)" : "rgba(168, 85, 247, 0.15)"}
              >
                <div className="flex flex-col items-start h-full">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="text-2xl text-white" />
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

      {/* Regions Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Serving <span className="text-blue-500">All Kenya</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Connect with buyers and sellers across major regions in Kenya with our extensive network.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {REGIONS.map((region, index) => (
              <RegionCard key={region.name} region={region} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Car Listings */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Featured <span className="text-blue-500">Vehicles</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Discover premium vehicles from trusted corporate sellers across Kenya.
            </p>
          </motion.div>

          {/* Region Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedRegion === 'all' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              All Regions
            </button>
            {REGIONS.map(region => (
              <button
                key={region.name}
                onClick={() => setSelectedRegion(region.name)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedRegion === region.name
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {region.name}
              </button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredCars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl">
              View All Vehicles
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Trusted by <span className="text-blue-500">Corporate Sellers</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Hear from businesses that have transformed their vehicle sales with our platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Frequently Asked <span className="text-blue-500">Questions</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Everything you need to know about selling your vehicles with AutoElite.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {FAQS.map((faq, index) => (
              <FAQItem 
                key={index}
                faq={faq}
                index={index}
                isOpen={activeFaq === index}
                onClick={toggleFaq}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
              Ready to Sell Your Vehicles?
            </h2>
            <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
              Join hundreds of corporate sellers across Kenya who trust our platform for seamless, profitable vehicle sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 text-lg shadow-2xl flex items-center gap-3">
                <FaRocket className="text-blue-500" /> Start Selling Today
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 text-lg flex items-center gap-3">
                <FaPhone /> Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Scrolling Text */}
      <div className="bg-slate-900 py-8 border-t border-white/10">
        <motion.div className="text-slate-400 text-sm font-semibold">
          <ParallaxText baseVelocity={-5}>
            🚗 • Premium Vehicles • Trusted Sellers • Verified Quality • Best Prices • Nationwide Delivery • 
          </ParallaxText>
        </motion.div>
      </div>
    </div>
  )
}