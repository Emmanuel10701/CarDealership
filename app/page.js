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
  FaCity, FaMountain, FaTree, FaLandmark,
  FaUmbrellaBeach, FaWater, FaFilter, FaSort
} from 'react-icons/fa'
import { IoMdSpeedometer } from 'react-icons/io'
import ChatBot from './components/chatbot/page'

// Comprehensive data
const CAROUSEL_CARS = [
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
    rating: "4.8"
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
    rating: "4.9"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1605218427368-35b019905561?auto=format&fit=crop&w=1200&q=80",
    title: "Porsche Macan",
    price: "KSh 6,500,000",
    location: "Central Kenya",
    mileage: "12k km",
    transmission: "PDK",
    fuel: "Petrol",
    year: "2023",
    rating: "5.0"
  }
]

const FEATURED_CARS = [
  {
    id: 1,
    name: "Toyota RAV4 2023",
    price: "3,200,000",
    location: "Nairobi",
    year: "2023",
    type: "SUV",
    mileage: "15,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop",
    rating: 4.8,
    features: ["Sunroof", "Leather Seats", "Backup Camera", "Apple CarPlay"],
    condition: "Excellent",
    engine: "2.5L",
    color: "Midnight Black"
  },
  {
    id: 2,
    name: "BMW X5 2022",
    price: "8,500,000",
    location: "Nairobi",
    year: "2022",
    type: "Luxury SUV",
    mileage: "18,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    rating: 4.9,
    features: ["Panoramic Roof", "Premium Sound", "Heated Seats", "HUD"],
    condition: "Like New",
    engine: "3.0L I6",
    color: "Mineral White"
  },
  {
    id: 3,
    name: "Mercedes C-Class 2022",
    price: "4,500,000",
    location: "Nakuru",
    year: "2022",
    type: "Sedan",
    mileage: "22,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=400&fit=crop",
    rating: 4.7,
    features: ["MBUX System", "LED Lights", "Keyless Go", "AMG Package"],
    condition: "Excellent",
    engine: "2.0L Turbo",
    color: "Selenite Grey"
  },
  {
    id: 4,
    name: "Toyota Hilux 2023",
    price: "4,200,000",
    location: "Thika",
    year: "2023",
    type: "Pickup",
    mileage: "12,000 km",
    transmission: "Manual",
    fuel: "Diesel",
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&h=400&fit=crop",
    rating: 4.8,
    features: ["4x4", "Tow Package", "Alloy Wheels", "Canopy"],
    condition: "Brand New",
    engine: "2.8L Diesel",
    color: "Attitude Black"
  }
]

const STATS = [
  { number: "2.5k+", label: "Happy Customers", icon: FaUsers, description: "Satisfied buyers across Kenya" },
  { number: "98%", label: "Satisfaction Rate", icon: FaHeart, description: "Customer happiness guaranteed" },
  { number: "8 Yrs", label: "Industry Experience", icon: FaAward, description: "Trusted since 2016" },
  { number: "1 Yr", label: "Warranty Included", icon: FaShieldAlt, description: "Peace of mind guaranteed" },
  { number: "24/7", label: "Support Available", icon: FaClock, description: "Always here to help" },
  { number: "200+", label: "Point Inspection", icon: FaCheck, description: "Comprehensive quality check" }
]

const FEATURES = [
  {
    icon: FaShieldAlt,
    title: "200-Point Comprehensive Inspection",
    description: "Every vehicle undergoes rigorous 200-point quality inspection by certified technicians ensuring top quality and reliability."
  },
  {
    icon: FaCertificate,
    title: "Certified Quality Assurance",
    description: "All vehicles come with verified service history reports and certified quality assurance with complete transparency."
  },
  {
    icon: FaHandshake,
    title: "Transparent Business Deals",
    description: "No hidden costs, complete price transparency, and honest vehicle condition reports for corporate clients."
  },
  {
    icon: FaRocket,
    title: "Streamlined Quick Process",
    description: "From listing to sale completion, our optimized process saves you valuable time and handles all paperwork efficiently."
  },
  {
    icon: FaTrophy,
    title: "Award Winning Service",
    description: "Voted Kenya's #1 automotive marketplace 2023 with multiple industry awards for excellence in service."
  },
  {
    icon: FaUserCheck,
    title: "Expert Professional Team",
    description: "Professional automotive experts providing personalized guidance and support 24/7 with years of industry experience."
  }
]

const REGIONS = [
  { name: "Nairobi", cars: 245, icon: FaCity, description: "Capital City Hub" },
  { name: "Nakuru", cars: 89, icon: FaMountain, description: "Rift Valley Center" },
  { name: "Central Kenya", cars: 156, icon: FaTree, description: "Agricultural Heartland" },
  { name: "Rift Valley", cars: 78, icon: FaLandmark, description: "Scenic Routes" },
  { name: "Coastal", cars: 45, icon: FaUmbrellaBeach, description: "Beach Destinations" },
  { name: "Western Kenya", cars: 67, icon: FaWater, description: "Lake Region" }
]

const TESTIMONIALS = [
  {
    name: "Sarah Kimani",
    role: "Corporate Fleet Manager",
    company: "Nairobi Enterprises Ltd",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "Sold 15 company vehicles through this platform. The process was seamless and we got better prices than expected. Professional handling of corporate fleet sales is unmatched.",
    region: "Nairobi"
  },
  {
    name: "James Mwangi",
    role: "Auto Dealer Owner",
    company: "Premium Motors Nakuru",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "As a dealer in Nakuru, this platform has expanded my reach across Central Kenya. Professional service always, and the verification process builds trust with buyers instantly.",
    region: "Nakuru"
  },
  {
    name: "Grace Wambui",
    role: "Fleet Director",
    company: "Central Transport Solutions",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "The verification process and customer support made selling our fleet vehicles stress-free and profitable. Their corporate solutions are tailored for serious business.",
    region: "Central Kenya"
  }
]

const FAQS = [
  {
    question: "How do I list my corporate fleet vehicles for sale?",
    answer: "Simply register as a corporate seller, verify your business documentation, and use our bulk upload feature to list multiple vehicles simultaneously. Our dedicated corporate team will assist with professional photography and detailed listings."
  },
  {
    question: "What regions in Kenya do you serve?",
    answer: "We primarily serve Nairobi, Nakuru, and Central Kenya regions, with expanding services to Rift Valley, Coastal, and Western regions. Delivery and inspection services available nationwide."
  },
  {
    question: "Are there any fees for corporate sellers?",
    answer: "Basic listing is free for corporate partners. We charge a small success fee only when vehicles are sold. Premium features including featured listings and marketing packages are available."
  },
  {
    question: "How do you ensure vehicle quality and authenticity?",
    answer: "Every vehicle undergoes our comprehensive 200-point inspection process, history verification, and quality certification. We work with certified mechanics and use advanced diagnostic tools."
  }
]

const CORPORATE_BENEFITS = [
  {
    icon: FaUsers,
    title: "Dedicated Account Management",
    description: "Personalized service with dedicated account managers for corporate clients"
  },
  {
    icon: FaChartLine,
    title: "Market Intelligence",
    description: "Access to comprehensive market data and pricing analytics"
  },
  {
    icon: FaShieldAlt,
    title: "Enhanced Security",
    description: "Advanced security measures for corporate transactions"
  },
  {
    icon: FaRocket,
    title: "Expedited Processing",
    description: "Priority handling for corporate listings and sales"
  }
]

export default function Home() {
  const router = useRouter()
  const [currentCarIndex, setCurrentCarIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFaq, setActiveFaq] = useState(null)
  const carouselIntervalRef = useRef(null)

  useEffect(() => {
    carouselIntervalRef.current = setInterval(() => {
      setCurrentCarIndex((prev) => (prev + 1) % CAROUSEL_CARS.length)
    }, 5000)

    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current)
      }
    }
  }, [])

  const nextCar = () => {
    setCurrentCarIndex((prev) => (prev + 1) % CAROUSEL_CARS.length)
  }

  const prevCar = () => {
    setCurrentCarIndex((prev) => (prev - 1 + CAROUSEL_CARS.length) % CAROUSEL_CARS.length)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleViewAllListings = () => {
    router.push('/carlisting')
  }

  const handleCarClick = (carId) => {
    router.push(`/carlisting?car=${carId}`)
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const currentCar = CAROUSEL_CARS[currentCarIndex]

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-blue-600 font-semibold text-sm">Corporate Sellers Platform</span>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Kenya's Premier{' '}
                <span className="text-blue-600">Car Marketplace</span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Connecting corporate sellers across Nairobi, Nakuru & Central Kenya with verified buyers. 
                Experience premium service, transparency, and unmatched value.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 p-2">
                  <FaSearch className="ml-3 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Search brand, model, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 px-4 py-3 text-base"
                  />
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                  >
                    Find Cars
                  </button>
                </div>
              </form>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
                {STATS.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <stat.icon className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-xl">{stat.number}</div>
                        <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                        <div className="text-gray-500 text-xs">{stat.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Car Carousel */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="relative h-64 sm:h-80 lg:h-96">
                  <img 
                    src={currentCar.image} 
                    alt={currentCar.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    {currentCar.year}
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {currentCar.location}
                  </div>

                  <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FaStar className="text-xs" />
                    {currentCar.rating}
                  </div>

                  {/* Carousel Controls */}
                  <button 
                    onClick={prevCar}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <FaChevronLeft className="text-gray-700" />
                  </button>
                  
                  <button 
                    onClick={nextCar}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <FaChevronRight className="text-gray-700" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{currentCar.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FaMapMarkerAlt className="text-blue-500" />
                        {currentCar.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{currentCar.price}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center text-sm text-gray-600 mb-4">
                    <div>
                      <FaCog className="mx-auto text-blue-500 mb-1" />
                      <div>{currentCar.transmission}</div>
                    </div>
                    <div>
                      <FaGasPump className="mx-auto text-green-500 mb-1" />
                      <div>{currentCar.fuel}</div>
                    </div>
                    <div>
                      <IoMdSpeedometer className="mx-auto text-purple-500 mb-1" />
                      <div>{currentCar.mileage}</div>
                    </div>
                    <div>
                      <FaCalendar className="mx-auto text-orange-500 mb-1" />
                      <div>{currentCar.year}</div>
                    </div>
                  </div>

                  <button 
                    onClick={handleViewAllListings}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    View Our Listings
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Serving <span className="text-blue-600">All Kenya</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with buyers and sellers across major regions in Kenya with our extensive network
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {REGIONS.map((region, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <region.icon className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{region.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">{region.cars}+</p>
                <p className="text-gray-600 text-sm">Cars Available</p>
                <p className="text-gray-500 text-xs mt-2">{region.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Featured <span className="text-blue-600">Vehicles</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of premium quality vehicles with comprehensive 200-point inspections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            {FEATURED_CARS.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleCarClick(car.id)}
              >
                <div className="relative h-48">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                      {car.year}
                    </span>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                      {car.location}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
                    <FaStar className="text-xs" />
                    {car.rating}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{car.name}</h3>
                    <div className="text-blue-600 font-bold text-lg">KSh {car.price}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <IoMdSpeedometer className="text-blue-500" />
                      <span>{car.mileage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCog className="text-purple-500" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGasPump className="text-green-500" />
                      <span>{car.fuel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span className="truncate">{car.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {car.features.slice(0, 2).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                    {car.features.length > 2 && (
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium">
                        +{car.features.length - 2} more
                      </span>
                    )}
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={handleViewAllListings}
              className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center gap-3"
            >
              <FaCar />
              View All Listings
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Why Choose <span className="text-blue-600">CorporateSellers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience automotive excellence with our comprehensive suite of premium services designed for corporate sellers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <div key={index} className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Benefits */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Corporate <span className="text-blue-600">Benefits</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Exclusive advantages designed for corporate sellers and serious business clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CORPORATE_BENEFITS.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Trusted by <span className="text-blue-600">Corporate Leaders</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from businesses that have transformed their vehicle sales with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-gray-500 text-xs">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm mr-1" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{testimonial.region}</span>
                  <span className="text-blue-600 font-semibold">Verified Corporate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about premium vehicle sales and corporate services
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-gray-800 text-lg pr-4">{faq.question}</span>
                  {activeFaq === index ? (
                    <FaChevronLeft className="text-blue-500 transform -rotate-90" />
                  ) : (
                    <FaChevronRight className="text-blue-500 transform rotate-90" />
                  )}
                </button>
                {activeFaq === index && (
                  <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Sell Your Vehicles?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of corporate sellers across Kenya who trust our platform for seamless, profitable vehicle sales with unmatched service quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg transition-colors flex items-center gap-3">
              <FaRocket />
              Start Selling Today
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-lg transition-colors flex items-center gap-3">
              <FaPhone />
              Contact Corporate Team
            </button>
          </div>
        </div>
      </section>

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  )
}