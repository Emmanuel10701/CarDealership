'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FaCar, FaStar, FaMapMarkerAlt, FaCog, 
  FaGasPump, FaCalendar, FaHeart, FaArrowRight, 
  FaSearch, FaShieldAlt, FaAward, FaUsers, 
  FaClock, FaCheck, FaPhone, FaEnvelope,
  FaChevronLeft, FaChevronRight, FaHandshake,
  FaMoneyBillWave, FaSync, FaLeaf, FaUserCheck,
  FaCertificate, FaTrophy, FaRocket, FaChartLine,
  FaCity, FaMountain, FaTree,
  FaUmbrellaBeach, FaWater, FaFilter, FaSort,
  FaCheckCircle, FaLock, FaDownload, FaBolt,
  FaDollarSign, FaThumbsUp, FaMedal,
  FaTimes, FaGlobe, FaBuilding, FaChevronDown, FaQuestionCircle,
  FaCogs, FaPaintBrush, FaTachometerAlt, FaKey,
  FaCarSide, FaCarBattery, FaSatellite, FaToolbox,
  FaFan, FaTemperatureHigh, FaParking, FaWind,
  FaGamepad, FaMobileAlt, FaWifi, FaBluetooth,
  FaCamera, FaVideo, FaMusic, FaSun,
  FaSnowflake, FaHotTub, FaChair
} from 'react-icons/fa'
import { IoMdSpeedometer } from 'react-icons/io'
import { GiCarWheel, GiCarDoor } from 'react-icons/gi'
import { TbSteeringWheel } from 'react-icons/tb'
import ChatBot from './components/chatbot/page'
import ReviewComponent from './components/frontreview/page'
import FAQComponent from './components/FAQsections/page'

import Image from 'next/image'

// First, add this import at the top if not already there
import { motion, AnimatePresence } from 'framer-motion'



// Extended modern features
const MODERN_FEATURES = [
  {
    id: 'ai-inspection',
    icon: FaStar,
    title: "AI-Powered Inspection",
    description: "Advanced computer vision analysis for comprehensive vehicle assessment.",
    detail: "Our AI system scans 200+ points using computer vision, detecting issues human inspectors might miss. Real-time analysis with 99.8% accuracy rate.",
    color: "from-purple-600 to-pink-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50"
  },
  {
    id: 'virtual-tour',
    icon: FaVideo,
    title: "360° Virtual Tour",
    description: "Immersive virtual reality experience for remote vehicle inspection.",
    detail: "Walk around vehicles virtually with our 360° capture technology. Zoom into details, check interiors, and experience the car from anywhere.",
    color: "from-blue-600 to-cyan-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
  },
  {
    id: 'blockchain',
    icon: FaLock,
    title: "Blockchain Verification",
    description: "Immutable ownership history and transaction records.",
    detail: "Every vehicle's history is stored on blockchain for tamper-proof verification. Track ownership, accidents, and service history securely.",
    color: "from-green-600 to-emerald-600",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50"
  },
  {
    id: 'smart-analytics',
    icon: FaChartLine,
    title: "Smart Pricing Analytics",
    description: "Real-time market intelligence for optimal pricing.",
    detail: "Our algorithms analyze market trends, demand patterns, and competitor pricing to suggest the best selling price for your vehicle.",
    color: "from-orange-600 to-red-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50"
  },
  {
    id: 'instant-finance',
    icon: FaBolt,
    title: "Instant Finance Approval",
    description: "Get financing decisions in under 5 minutes.",
    detail: "Integrated with multiple lenders for instant pre-approval. Competitive rates and flexible terms tailored to your needs.",
    color: "from-indigo-600 to-purple-600",
    bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50"
  },
  {
    id: 'delivery-network',
    icon: FaCarSide,
    title: "Nationwide Delivery",
    description: "Door-to-door delivery across Kenya.",
    detail: "Our logistics network ensures safe, insured delivery anywhere in Kenya. Real-time tracking and professional handling.",
    color: "from-teal-600 to-blue-600",
    bgColor: "bg-gradient-to-br from-teal-50 to-blue-50"
  }
]

// Modern car models with detailed features
const CAR_MODELS = [
  {
    id: 'premium-suv',
    name: 'Premium SUV',
    icon: FaCar,
    description: 'Luxury SUVs with advanced tech',
    features: [
      'Panoramic Sunroof',
      'Adaptive Cruise Control',
      '360° Camera',
      'Premium Sound System',
      'Heated/Cooled Seats',
      'Wireless Charging'
    ],
    priceRange: 'KSh 3M - 8M',
    popularBrands: ['Range Rover', 'Mercedes GLE', 'BMW X5', 'Audi Q7']
  },
  {
    id: 'electric-vehicles',
    name: 'Electric Vehicles',
    icon: FaCarBattery,
    description: 'Eco-friendly electric cars',
    features: [
      'Fast Charging',
      'Regenerative Braking',
      'Smart Battery Management',
      'One-Pedal Driving',
      'Over-the-Air Updates',
      'Eco Mode'
    ],
    priceRange: 'KSh 2.5M - 6M',
    popularBrands: ['Tesla', 'BYD', 'Kia EV6', 'Hyundai Ioniq']
  },
  {
    id: 'luxury-sedan',
    name: 'Luxury Sedan',
    icon: FaCarSide,
    description: 'Executive class sedans',
    features: [
      'Massage Seats',
      'Air Suspension',
      'Night Vision',
      'Head-Up Display',
      'Premium Leather',
      'Advanced Safety'
    ],
    priceRange: 'KSh 2M - 5M',
    popularBrands: ['Mercedes S-Class', 'BMW 7 Series', 'Audi A8', 'Lexus LS']
  },
  {
    id: 'sports-cars',
    name: 'Sports Cars',
    icon: FaTachometerAlt,
    description: 'High-performance vehicles',
    features: [
      'Launch Control',
      'Sport Exhaust',
      'Performance Brakes',
      'Track Mode',
      'Carbon Fiber Parts',
      'Active Aero'
    ],
    priceRange: 'KSh 4M - 12M',
    popularBrands: ['Porsche 911', 'Ferrari', 'Lamborghini', 'McLaren']
  }
]


// Technology features
const TECH_FEATURES = [
  { icon: FaCamera, label: '360 Camera' },
  { icon: FaBluetooth, label: 'Bluetooth 5.0' },
  { icon: FaWifi, label: 'Wi-Fi Hotspot' },
  { icon: FaMobileAlt, label: 'Apple CarPlay' },
  { icon: FaGamepad, label: 'Android Auto' },
  { icon: FaSatellite, label: 'GPS Navigation' },
  { icon: FaVideo, label: 'Dash Cam' },
  { icon: FaMusic, label: 'Premium Audio' },
  { icon: FaSun, label: 'Panoramic Roof' },
  { icon: FaSnowflake, label: 'Dual Climate' },
  { icon: FaHotTub, label: 'Heated Seats' },
  { icon: FaChair, label: 'Massage Seats' }
]



export default function ModernCarMarketplace() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFaq, setActiveFaq] = useState(null)
  const [latestCars, setLatestCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCorporateModal, setShowCorporateModal] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [selectedBenefit, setSelectedBenefit] = useState(null)
  const [selectedModel, setSelectedModel] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const modalRef = useRef(null)
  const [allCars, setAllCars] = useState([])
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [yearRange, setYearRange] = useState([2010, 2024])
  const [sortBy, setSortBy] = useState('newest')

const [selectedCategory, setSelectedCategory] = useState('all')

// Add this search state with your other states


  // Category state with dynamic counts
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Vehicles', count: 0, icon: FaCar },
    { id: 'suv', name: 'SUVs', count: 0, icon: FaCarSide },
    { id: 'sedan', name: 'Sedans', count: 0, icon: FaCar },
    { id: 'hatchback', name: 'Hatchbacks', count: 0, icon: FaCar },
    { id: 'electric', name: 'Electric', count: 0, icon: FaCarBattery },
    { id: 'luxury', name: 'Luxury', count: 0, icon: FaMedal },
    { id: 'commercial', name: 'Commercial', count: 0, icon: FaCar }
  ])

  // Enhanced filter state
  const [filters, setFilters] = useState({
    transmission: '',
    fuelType: '',
    location: '',
    features: []
  })

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setShowCorporateModal(false)
        setSelectedFeature(null)
        setSelectedBenefit(null)
        setSelectedModel(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Function to get proper image URL from API
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/car1.png"
    if (imagePath.startsWith('http')) return imagePath
    
    // If it's already a valid path starting with /
    if (imagePath.startsWith('/')) {
      return imagePath
    }
    
    // If it's just a filename without path, add /carimages/ prefix
    if (imagePath.includes('.')) {
      return `/carimages/${imagePath}`
    }
    
    return "/car1.png"
  }

  // Fetch ALL cars from API with real data
  useEffect(() => {
    let mounted = true
    
    const fetchAllCars = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/cardeal')
        const data = await res.json()
        
        if (!mounted) return
        
        if (data.success && Array.isArray(data.carListings) && data.carListings.length) {
          // Process ALL cars from API
          const apiCars = data.carListings.map(car => ({
            id: car.id,
            carName: car.carName,
            price: Number(car.price) || 0,
            year: Number(car.year) || 2020,
            location: car.location || 'Unknown',
            carType: car.carType || 'Unknown',
            mileage: Number(car.mileage) || 0,
            transmission: car.transmission || 'Unknown',
            fuelType: car.fuelType || 'Unknown',
            description: car.description || '',
            features: Array.isArray(car.features) ? car.features : [],
            sellerName: car.sellerName || 'Unknown',
            file: car.file || '',
            files: Array.isArray(car.files) ? car.files : [],
            createdAt: car.createdAt || new Date().toISOString()
          }))
          
          // Store all cars for filtering
          setAllCars(apiCars)
          
          // Calculate price range from real data
          const prices = apiCars.map(car => car.price).filter(price => price > 0)
          const minPrice = prices.length > 0 ? Math.min(...prices) : 0
          const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000000
          
          // Calculate year range from real data
          const years = apiCars.map(car => car.year).filter(year => year > 1900)
          const minYear = years.length > 0 ? Math.min(...years) : 2010
          const maxYear = years.length > 0 ? Math.max(...years) : 2024
          
          // Update price and year range states with real data
          setPriceRange([minPrice, maxPrice])
          setYearRange([minYear, maxYear])
          
          // Calculate REAL category counts
          const calculateCategoryCounts = () => {
            const allCount = apiCars.length
            const suvCount = apiCars.filter(car => 
              car.carType?.toLowerCase().includes('suv') || 
              car.carName?.toLowerCase().includes('suv')
            ).length
            
            const sedanCount = apiCars.filter(car => 
              car.carType?.toLowerCase().includes('sedan') ||
              car.carName?.toLowerCase().includes('sedan')
            ).length
            
            const electricCount = apiCars.filter(car => 
              car.fuelType?.toLowerCase().includes('electric') ||
              car.carName?.toLowerCase().includes('electric') ||
              car.carName?.toLowerCase().includes('tesla')
            ).length
            
            const luxuryCount = apiCars.filter(car => 
              car.carType?.toLowerCase().includes('luxury') ||
              car.price > 3000000
            ).length
            
            // Update categories with real counts
            setCategories(prev => prev.map(cat => {
              if (cat.id === 'all') return { ...cat, count: allCount }
              if (cat.id === 'suv') return { ...cat, count: suvCount }
              if (cat.id === 'sedan') return { ...cat, count: sedanCount }
              if (cat.id === 'electric') return { ...cat, count: electricCount }
              if (cat.id === 'luxury') return { ...cat, count: luxuryCount }
              return cat
            }))
          }
          
          calculateCategoryCounts()
          
          // Display first 4 cars (sorted by newest first)
          const sortedCars = [...apiCars].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          )
          
          const displayCars = sortedCars.slice(0, 4).map(car => ({
            id: car.id,
            image: getImageUrl(car.file),
            title: car.carName,
            price: car.price,
            formattedPrice: `KSh ${car.price?.toLocaleString() || 'N/A'}`,
            location: car.location,
            mileage: `${car.mileage?.toLocaleString() || 'N/A'} km`,
            transmission: car.transmission,
            fuel: car.fuelType,
            year: car.year?.toString(),
            rating: "4.8",
            description: car.description?.substring(0, 100) + '...',
            features: Array.isArray(car.features) ? car.features : [],
            carType: car.carType,
            sellerName: car.sellerName,
            createdAt: car.createdAt,
            allImages: car.files || []
          }))
          
          setLatestCars(displayCars)
          
        } else {
          console.log('No cars found in API response')
        }
      } catch (err) {
        console.error('Error fetching cars:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    
    fetchAllCars()
    return () => { mounted = false }
  }, [])

  // Filter cars in real-time
  useEffect(() => {
    if (allCars.length === 0) return
    
    let filtered = [...allCars]
    
    // Apply price filter from real data
    filtered = filtered.filter(car => 
      car.price >= priceRange[0] && car.price <= priceRange[1]
    )
    
    // Apply year filter from real data
    filtered = filtered.filter(car => 
      car.year >= yearRange[0] && car.year <= yearRange[1]
    )
    
    // Apply transmission filter
    if (filters.transmission) {
      filtered = filtered.filter(car => 
        car.transmission?.toLowerCase() === filters.transmission.toLowerCase()
      )
    }
    
    // Apply fuel type filter
    if (filters.fuelType) {
      filtered = filtered.filter(car => 
        car.fuelType?.toLowerCase() === filters.fuelType.toLowerCase()
      )
    }
    
    // Apply category filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'suv') {
        filtered = filtered.filter(car => 
          car.carType?.toLowerCase().includes('suv') ||
          car.carName?.toLowerCase().includes('suv')
        )
      } else if (activeCategory === 'sedan') {
        filtered = filtered.filter(car => 
          car.carType?.toLowerCase().includes('sedan') ||
          car.carName?.toLowerCase().includes('sedan')
        )
      } else if (activeCategory === 'electric') {
        filtered = filtered.filter(car => 
          car.fuelType?.toLowerCase().includes('electric') ||
          car.carName?.toLowerCase().includes('electric') ||
          car.carName?.toLowerCase().includes('tesla')
        )
      } else if (activeCategory === 'luxury') {
        filtered = filtered.filter(car => 
          car.carType?.toLowerCase().includes('luxury') ||
          car.price > 3000000
        )
      }
    }
    
    // Apply sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'mileage') {
      filtered.sort((a, b) => a.mileage - b.mileage)
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    
    // Display first 4 filtered cars
    const displayCars = filtered.slice(0, 4).map(car => ({
      id: car.id,
      image: getImageUrl(car.file),
      title: car.carName,
      price: car.price,
      formattedPrice: `KSh ${car.price?.toLocaleString() || 'N/A'}`,
      location: car.location,
      mileage: `${car.mileage?.toLocaleString() || 'N/A'} km`,
      transmission: car.transmission,
      fuel: car.fuelType,
      year: car.year?.toString(),
      rating: "4.8",
      description: car.description?.substring(0, 100) + '...',
      features: Array.isArray(car.features) ? car.features : [],
      carType: car.carType,
      sellerName: car.sellerName,
      createdAt: car.createdAt,
      allImages: car.files || []
    }))
    
    setLatestCars(displayCars)
    
  }, [allCars, activeCategory, filters, priceRange, yearRange, sortBy])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/carlisting?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleViewAllListings = () => {
    const queryParams = new URLSearchParams()
    
    if (activeCategory !== 'all') queryParams.append('category', activeCategory)
    if (filters.transmission) queryParams.append('transmission', filters.transmission)
    if (filters.fuelType) queryParams.append('fuel', filters.fuelType)
    if (priceRange[0] > 0 || priceRange[1] < 10000000) {
      queryParams.append('minPrice', priceRange[0])
      queryParams.append('maxPrice', priceRange[1])
    }
    if (yearRange[0] > 2010 || yearRange[1] < 2024) {
      queryParams.append('minYear', yearRange[0])
      queryParams.append('maxYear', yearRange[1])
    }
    
    router.push(`/carlisting?${queryParams.toString()}`)
  }
  
  // Handle car click - navigate to car listing details
  const handleCarClick = (carId) => {
    console.log('Navigating to car:', carId)
    router.push(`/carlisting/${carId}`)
  }

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id)
  }

  const openFeatureModal = (feature) => {
    setSelectedFeature(feature)
    setSelectedBenefit(null)
    setSelectedModel(null)
    setShowCorporateModal(false)
    setTimeout(() => modalRef.current?.focus?.(), 0)
  }

  const openModelModal = (model) => {
    setSelectedModel(model)
    setSelectedFeature(null)
    setSelectedBenefit(null)
    setTimeout(() => modalRef.current?.focus?.(), 0)
  }

  const closeModals = () => {
    setSelectedFeature(null)
    setSelectedBenefit(null)
    setSelectedModel(null)
    setShowCorporateModal(false)
  }

  const backdropClickClose = (e) => {
    if (e.target === e.currentTarget) {
      closeModals()
    }
  }

 

  // Modern car card component with real API data
const ModernCarCard = ({ car }) => {

  // Always use fallback image
  const fixedImage = "/car1.png";

  return (
    <div 
      onClick={() => handleCarClick(car.id)}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={fixedImage}
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            FEATURED
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <button 
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white"
            onClick={(e) => {
              e.stopPropagation()
              // Add to favorites logic here
            }}
          >
            <FaHeart className="text-gray-600 hover:text-red-500" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-white font-bold text-lg">{car.title}</div>
          <div className="text-white/90 text-sm">{car.year} • {car.mileage}</div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-2xl font-bold text-gray-900">{car.formattedPrice}</div>
            <div className="text-sm text-gray-500">Negotiable Price</div>
          </div>
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
            <FaStar className="text-yellow-500 mr-1" />
            <span className="font-semibold">{car.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-4">
          <FaMapMarkerAlt className="mr-2" />
          <span>{car.location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <GiCarDoor className="mr-2" />
            <span>{car.carType}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <TbSteeringWheel className="mr-2" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaGasPump className="mr-2" />
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <IoMdSpeedometer className="mr-2" />
            <span>{car.mileage}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {car.features?.slice(0, 3).map((feature, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
              {feature}
            </span>
          ))}
        </div>
        
        <button 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group-hover:from-blue-700 group-hover:to-purple-700"
          onClick={(e) => {
            e.stopPropagation()
            handleCarClick(car.id)
          }}
        >
          View Details
        </button>
      </div>
    </div>
  )
}


  // Modern FAQ Item (removed "Read related articles" and "Contact support")
  const ModernFAQItem = ({ faq, isActive, onClick }) => (
    <div className={`rounded-xl border transition-all duration-300 ${isActive ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-blue-300'}`}>
      <button
        onClick={() => onClick(faq.id)}
        className="w-full p-6 text-left flex items-center justify-between"
        aria-expanded={isActive}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
            <FaQuestionCircle />
          </div>
          <div>
            <div className="font-semibold text-lg mb-1">{faq.question}</div>
            <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              {faq.category}
            </span>
          </div>
        </div>
        <div className={`text-xl transition-transform ${isActive ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}>
          <FaChevronDown />
        </div>
      </button>
      {isActive && (
        <div className="px-6 pb-6">
          <div className="pl-16 border-t pt-4">
            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      )}
    </div>
  )

 

  // Category descriptions for Browse by Category
  const categoryDescriptions = {
    'all': 'Explore our entire collection of verified vehicles from trusted sellers across Kenya',
    'suv': 'Premium SUVs with spacious interiors and advanced off-road capabilities',
    'sedan': 'Elegant sedans offering comfort, style, and excellent fuel efficiency',
    'hatchback': 'Compact and practical hatchbacks perfect for city driving',
    'electric': 'Eco-friendly electric vehicles with cutting-edge technology',
    'luxury': 'High-end luxury cars with premium features and exclusive finishes',
    'commercial': 'Commercial vehicles for business and fleet operations'
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Modals */}
      {showCorporateModal && (
        <div role="dialog" aria-modal="true" tabIndex={-1} onClick={backdropClickClose} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div ref={modalRef} className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                      <FaBuilding />
                    </div>
                    <div>
                      <h2 id="corp-modal-title" className="text-3xl font-bold text-gray-900">Corporate Benefits Suite</h2>
                      <p className="text-gray-600 mt-1">Premium advantages for corporate fleet managers across Kenya</p>
                    </div>
                  </div>
                </div>
                <button 
                  aria-label="Close corporate modal" 
                  onClick={() => setShowCorporateModal(false)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FaTimes className="text-gray-500 text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {MODERN_FEATURES.map(feature => (
                  <div 
                    key={feature.id}
                    className={`${feature.bgColor} rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}>
                        <feature.icon className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-1">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-4 mb-4">{feature.detail}</p>
                    <button 
                      onClick={() => {
                        setShowCorporateModal(false)
                        openFeatureModal(feature)
                      }}
                      className="font-medium hover:underline"
                    >
                      Learn more →
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <h3 className="font-bold text-xl mb-4">Ready to Transform Your Fleet Management?</h3>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => { setShowCorporateModal(false); router.push('/contact') }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Schedule Demo
                  </button>
                  <button 
                    onClick={() => setShowCorporateModal(false)}
                    className="bg-white border border-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Browse Vehicles
                  </button>
                  <button 
                    onClick={() => window.open('/corporate-brochure.pdf')}
                    className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800"
                  >
                    <FaDownload />
                    Download Brochure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedFeature && (
        <div role="dialog" aria-modal="true" onClick={backdropClickClose} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <button 
                aria-label="Close"
                onClick={closeModals}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg"
              >
                <FaTimes className="text-gray-500" />
              </button>
              
              <div className="flex items-start gap-6 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedFeature.color} flex items-center justify-center text-white text-2xl`}>
                  <selectedFeature.icon />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedFeature.title}</h3>
                  <p className="text-gray-600">{selectedFeature.description}</p>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">{selectedFeature.detail}</p>
                
                <div className="bg-gray-50 rounded-xl p-5 mb-6">
                  <h4 className="font-semibold mb-3">Key Benefits:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      <span>Increased efficiency by 40%</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      <span>Cost reduction up to 25%</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      <span>Time savings of 15+ hours monthly</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => { closeModals(); router.push('/contact') }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Get Started
                  </button>
                  <button 
                    onClick={closeModals}
                    className="border border-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedModel && (
        <div role="dialog" aria-modal="true" onClick={backdropClickClose} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <button 
                aria-label="Close"
                onClick={closeModals}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg"
              >
                <FaTimes className="text-gray-500" />
              </button>
              
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-3xl">
                  <selectedModel.icon />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedModel.name}</h2>
                  <p className="text-gray-600 text-lg">{selectedModel.description}</p>
                  <div className="mt-2 text-xl font-bold text-blue-600">{selectedModel.priceRange}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                  <div className="space-y-3">
                    {selectedModel.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaCheck className="text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Popular Brands</h3>
                  <div className="space-y-3">
                    {selectedModel.popularBrands.map((brand, idx) => (
                      <div key={idx} className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                        <div className="font-semibold">{brand}</div>
                        <div className="text-sm text-gray-600 mt-1">Available models starting from {selectedModel.priceRange.split(' - ')[0]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <div className="flex gap-4">
                  <button 
                    onClick={() => { closeModals(); router.push(`/carlisting?type=${selectedModel.id}`) }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Browse {selectedModel.name}
                  </button>
                  <button 
                    onClick={closeModals}
                    className="border border-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl mb-8 border border-white/20">
                <div className="flex">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
                  <span className="w-2 h-2 bg-cyan-400 rounded-full ml-1"></span>
                </div>
                <span className="text-sm font-semibold tracking-wider">TRUSTED BY 500+ CORPORATE FLEETS</span>
              </div>

              {/* Main Heading with reduced font sizes */}
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Premium Car
                </span>
                <br />
                <span className="text-white">Marketplace for</span>
                <br />
                <span className="text-white">Modern Kenya</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
                Sell your fleet with confidence using our AI-powered inspection, 
                blockchain verification, and instant finance options. Experience 
                the future of automotive transactions.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mb-12">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search brand, model, location, or features..."
                      className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Find Your Car
                  </button>
                </div>
              </form>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl">
                {[
                  { value: '500+', label: 'Premium Listings' },
                  { value: '98.7%', label: 'Satisfaction Rate' },
                  { value: '24h', label: 'Quick Sale' },
                  { value: '200+', label: 'Point Check' }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="text-2xl font-bold text-cyan-300 mb-1">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-10">
                <button
                  onClick={() => setShowCorporateModal(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-3 group"
                >
                  <FaStar className="group-hover:rotate-12 transition-transform" />
                  Explore Premium Features
                </button>
              <button
  onClick={() => router.push('/pages/contact')}
  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition-all duration-300"
>
  Contact Sales Team
</button>

              </div>
            </div>

            {/* Right Content - Car Image Only (Removed text overlay) */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/20">
                {latestCars.length > 0 && latestCars[0].image && latestCars[0].image !== '/car1.png' ? (
                  <img
                    src={getImageUrl(latestCars[0].image)}
                    alt={latestCars[0].title}
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = '/car1.png'
                    }}
                  />
                ) : (
                  <img
                    src="/car1.png"
                    alt="Modern Premium Car"
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl">
                FEATURED DEAL
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl flex items-center gap-2">
                <FaBolt /> INSTANT FINANCE
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#f9fafb" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Car Models Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Car Models</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of premium vehicles. Tap any model to explore detailed features and available options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {CAR_MODELS.map((model) => (
              <div
                key={model.id}
                onClick={() => openModelModal(model)}
                className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  <model.icon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{model.name}</h3>
                <p className="text-gray-600 mb-4">{model.description}</p>
                <div className="text-lg font-bold text-blue-600 mb-4">{model.priceRange}</div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {model.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
                <button className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Explore Models <FaArrowRight />
                </button>
              </div>
            ))}
          </div>

          {/* Technology Features */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold mb-4">Modern Technology Features</h3>
              <p className="text-white/80">Experience the latest automotive innovations</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {TECH_FEATURES.map((tech, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-colors">
                  <tech.icon className="text-2xl mb-2 mx-auto" />
                  <div className="text-sm font-medium">{tech.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

 {/* Latest Vehicles Section with Real API Data */}
<section className="py-16 sm:py-20 bg-white">
  <div className="container mx-auto px-4 sm:px-6 md:px-8">

    {/* Header + Controls */}
    <div className="flex flex-col lg:flex-row justify-between gap-6 mb-12">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Latest{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Premium Vehicles
          </span>
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Fresh listings from our verified sellers across Kenya
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap gap-3 w-full lg:w-auto">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 rounded-xl hover:bg-gray-50 w-full sm:w-auto"
        >
          <FaFilter /> Filters
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 rounded-xl bg-white w-full sm:w-auto"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="mileage">Mileage: Low to High</option>
        </select>

        <button
          onClick={handleViewAllListings}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold hover:shadow-lg w-full sm:w-auto"
        >
          View All Listings
        </button>
      </div>
    </div>

    {/* Filters Panel */}
    {showFilters && (
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">Price Range (KSh)</label>
            <div className="space-y-2">
              <input
                type="range"
                min={priceRange[0]}
                max={priceRange[1]}
                step="100000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full"
              />
              <div className="text-sm text-gray-600">
                KSh {priceRange[0].toLocaleString()} - KSh{" "}
                {priceRange[1].toLocaleString()}
              </div>
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium mb-2">Year Range</label>
            <div className="space-y-2">
              <input
                type="range"
                min={yearRange[0]}
                max={yearRange[1]}
                value={yearRange[1]}
                onChange={(e) =>
                  setYearRange([yearRange[0], parseInt(e.target.value)])
                }
                className="w-full"
              />
              <div className="text-sm text-gray-600">
                {yearRange[0]} - {yearRange[1]}
              </div>
            </div>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-sm font-medium mb-2">Transmission</label>
            <select
              value={filters.transmission}
              onChange={(e) =>
                setFilters({ ...filters, transmission: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Any</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Fuel Type</label>
            <select
              value={filters.fuelType}
              onChange={(e) =>
                setFilters({ ...filters, fuelType: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Any</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

        </div>
      </div>
    )}

    {/* Categories */}
    <div className="mb-8">
      <h3 className="text-lg sm:text-xl font-bold mb-3">Browse by Category</h3>

      <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm 
              whitespace-nowrap transition-all min-w-max snap-start
              ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            <category.icon className="text-base" />
            <span>{category.name}</span>

            <span
              className={`
                text-[10px] px-2 py-0.5 rounded-full
                ${
                  activeCategory === category.id
                    ? "bg-white/20"
                    : "bg-gray-300"
                }
              `}
            >
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>

    {/* Cars Grid (Loading / Data / Empty) */}
    {loading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-48 sm:h-56 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    ) : latestCars.length ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {latestCars.map((car) => (
          <ModernCarCard key={car.id} car={car} />
        ))}
      </div>
    ) : (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCar className="text-gray-400 text-3xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">No vehicles found</h3>
        <p className="text-gray-600 mb-6">Try adjusting your filters or check back later</p>
        <button
          onClick={() => setFilters({})}
          className="text-blue-600 font-semibold hover:text-blue-800"
        >
          Clear all filters
        </button>
      </div>
    )}
  </div>
</section>


      {/* Modern Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Platform</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've reimagined the car buying and selling experience with cutting-edge technology
              and customer-centric services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MODERN_FEATURES.map((feature) => (
              <div
                key={feature.id}
                onClick={() => openFeatureModal(feature)}
                className={`${feature.bgColor} rounded-2xl p-8 border border-gray-200 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-300 cursor-pointer group`}
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                    <feature.icon />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <button className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more <FaArrowRight />
                </button>
              </div>
            ))}
          </div>

          {/* Stats Banner */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10,000+', label: 'Happy Customers' },
                { value: 'KSh 50B+', label: 'Total Sales' },
                { value: '98.7%', label: 'Satisfaction Rate' },
                { value: '24/7', label: 'Support Available' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Customers Say</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from satisfied customers who have transformed their car buying and selling experience with our platform.
            </p>
          </div>

          <div className="px-[5%] py-[5%] md:px-[10%]">
            <ReviewComponent />
          </div>
        </div>
      </section>

<div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
<FAQComponent/>
</div>
      {/* ChatBot */}
      <ChatBot />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
        
        /* Selection color */
        ::selection {
          background-color: rgba(59, 130, 246, 0.3);
          color: #111827;
        }
        
        /* Focus styles */
        *:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* Responsive zoom */
        @media (min-width: 1400px) {
          .container {
            max-width: 1400px;
          }
        }
        
        @media (min-width: 1600px) {
          .container {
            max-width: 1600px;
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          /* Improve touch targets */
          button, 
          [role="button"],
          input,
          select {
            min-height: 48px;
          }
        }
      `}</style>
    </div>
  )
}