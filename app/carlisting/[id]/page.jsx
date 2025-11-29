"use client"

import { useState, useEffect } from 'react'
import { 
  FaMapMarkerAlt, FaCog, FaGasPump, FaBuilding, FaPhone, FaCalendar, 
  FaStar, FaHeart, FaShare, FaArrowLeft, FaArrowRight, FaPlay, FaPause,
  FaWhatsapp, FaUsers, FaPalette, FaShieldAlt, FaCertificate, FaCheck,
  FaEnvelope, FaCar, FaTimes, FaCarSide, FaTachometerAlt
} from 'react-icons/fa'
import { IoMdSpeedometer } from 'react-icons/io'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CircularProgress } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Head from 'next/head'

// API Service matching your car management structure
const carApiService = {
  async getCarById(id) {
    const response = await fetch(`/api/cardeal/${id}`)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Car not found')
      }
      throw new Error('Failed to fetch car details')
    }
    const data = await response.json()
    
    // Handle the API response structure - same as car management
    if (data.success && data.car) {
      return data.car
    } else if (data.carListing) {
      return data.carListing
    } else {
      throw new Error('Invalid car data format')
    }
  }
}

export default function CarDetailPage({ params }) {
  const [car, setCar] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [resolvedParams, setResolvedParams] = useState(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interestType: 'schedule_call'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // FIX: Resolve params promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  // FIX: Enhanced car details fetching with proper image mapping - CONSISTENT WITH CAR MANAGEMENT
  useEffect(() => {
    if (!resolvedParams?.id) return
    
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/cardeal/${resolvedParams.id}`)
        const result = await response.json()
        
        if (result.success) {
          const carData = result.car || result.carListing
          
          // CONSISTENT IMAGE MAPPING - Same as car management page
          const mapImages = (carData) => {
            // Priority 1: Multiple files array (same as car management)
            if (Array.isArray(carData.files) && carData.files.length > 0) {
              return carData.files.map(file => 
                file.startsWith('http') ? file : `/api/images${file}`
              )
            }
            
            // Priority 2: Single file (same as car management)
            if (carData.file) {
              return [carData.file.startsWith('http') ? carData.file : `/api/images${carData.file}`]
            }
            
            // Priority 3: Images array from API
            if (Array.isArray(carData.images) && carData.images.length > 0) {
              return carData.images.map(img => 
                img.startsWith('http') ? img : `/api/images${img}`
              )
            }
            
            // Fallback: Default car images
            return [
              'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop'
            ]
          }

          // CONSISTENT FEATURES MAPPING - Same as car management
          const mapFeatures = (carData) => {
            if (Array.isArray(carData.features)) {
              return carData.features
            }
            if (typeof carData.features === 'string') {
              return [carData.features]
            }
            return ['Power Steering', 'Air Conditioning', 'Bluetooth']
          }

          const transformedCar = {
            id: carData.id,
            name: carData.carName || carData.name,
            price: carData.price?.toLocaleString() || '0',
            location: carData.location,
            year: carData.year?.toString() || 'N/A',
            type: carData.carType || carData.type,
            mileage: carData.mileage ? `${carData.mileage.toLocaleString()} km` : 'Not specified',
            transmission: carData.transmission || 'Not specified',
            fuel: carData.fuelType || carData.fuel || 'Not specified',
            features: mapFeatures(carData),
            images: mapImages(carData),
            description: carData.description || `Premium ${carData.carName || carData.name} available for sale. Great condition and well maintained.`,
            dealer: carData.sellerName || carData.dealer || 'Premium Auto Dealer',
            phone: carData.sellerPhone || carData.phone || '+254700000000',
            email: carData.sellerEmail || carData.email,
            rating: 4.5,
            engine: carData.engine || 'Not specified',
            color: carData.color || 'Not specified',
            seats: carData.seats || 5,
            brand: carData.brand || carData.carName?.split(' ')[0] || 'Vehicle'
          }
          
          setCar(transformedCar)
          
          // Check if car is in favorites
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
          setIsFavorite(favorites.includes(carData.id))
        } else {
          throw new Error(result.error || 'Car not found')
        }
      } catch (error) {
        console.error('Error fetching car details:', error)
        toast.error('Failed to load car details')
        
        // Redirect to car listing after error
        setTimeout(() => {
          router.push('/carlisting')
        }, 3000)
      }
    }

    fetchCarDetails()
  }, [resolvedParams, router])

  // SEO Data - Dynamic based on car
  const seoData = car ? {
    title: `${car.year} ${car.name} for Sale in ${car.location} | KSh ${car.price} | Corporate Cars Elite`,
    description: `${car.year} ${car.name} for sale in ${car.location}. ${car.transmission} transmission, ${car.fuel} fuel, ${car.mileage}. Contact ${car.dealer} for details.`,
    keywords: `${car.name}, ${car.year} ${car.name}, used cars ${car.location}, ${car.brand} cars, car dealers ${car.location}`,
    canonical: `https://yourwebsite.com/cars/${car.id}/${generateCarSlug(car)}`,
    image: car.images[0],
    carData: car
  } : {
    title: "Car Details | Corporate Cars Elite",
    description: "Find premium used cars for sale in Kenya",
    canonical: "https://yourwebsite.com/cars"
  }

  // Generate SEO-friendly URL slug
  function generateCarSlug(car) {
    const baseSlug = `${car.year}-${car.name.toLowerCase().replace(/\s+/g, '-')}-${car.location.toLowerCase().replace(/\s+/g, '-')}`
    return baseSlug.replace(/[^a-z0-9-]/g, '')
  }

  // Generate structured data for SEO
  function generateStructuredData() {
    if (!car) return null

    return {
      "@context": "https://schema.org",
      "@type": "Vehicle",
      "name": car.name,
      "description": car.description || `${car.year} ${car.name} for sale in ${car.location}`,
      "image": car.images,
      "brand": {
        "@type": "Brand",
        "name": car.brand || car.name.split(' ')[0]
      },
      "model": car.name,
      "vehicleModelDate": car.year,
      "mileageFromOdometer": {
        "@type": "QuantitativeValue",
        "value": car.mileage?.replace(' km', '').replace(/,/g, '') || "0",
        "unitCode": "KMT"
      },
      "vehicleTransmission": car.transmission,
      "fuelType": car.fuel,
      "color": car.color,
      "numberOfForwardGears": car.transmission === "Automatic" ? "6" : "5",
      "vehicleSeatingCapacity": car.seats,
      "productionDate": car.year,
      "itemCondition": "https://schema.org/UsedCondition",
      "offers": {
        "@type": "Offer",
        "price": car.price?.toString().replace(/,/g, '') || "0",
        "priceCurrency": "KES",
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "CarDealer",
          "name": car.dealer,
          "telephone": car.phone,
          "address": car.location
        },
        "url": seoData.canonical
      }
    }
  }

  // Auto-play for image gallery
  useEffect(() => {
    if (!isAutoPlaying || !car) return
    
    const interval = setInterval(() => {
      setSelectedImageIndex(prev => (prev + 1) % car.images.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying, car])

  const nextImage = () => {
    if (car) {
      setSelectedImageIndex(prev => (prev + 1) % car.images.length)
    }
  }

  const prevImage = () => {
    if (car) {
      setSelectedImageIndex(prev => (prev - 1 + car.images.length) % car.images.length)
    }
  }

  const toggleFavorite = () => {
    if (!car) return
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    let newFavorites
    
    if (isFavorite) {
      newFavorites = favorites.filter(id => id !== car.id)
      toast.success('Removed from favorites')
    } else {
      newFavorites = [...favorites, car.id]
      toast.success('Added to favorites')
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/notifyme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          carId: car.id,
          carName: car.name,
          carPrice: car.price,
          dealer: car.dealer,
          source: 'car_listing_website'
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message || 'Thank you! We will contact you shortly.')
        setShowContactModal(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          interestType: 'schedule_call'
        })
      } else {
        throw new Error(result.error || 'Failed to submit form')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error.message || 'There was an error submitting your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const shareCar = async () => {
    if (!car) return
    
    const shareData = {
      title: `${car.year} ${car.name} for Sale - KSh ${car.price}`,
      text: `Check out this ${car.year} ${car.name} for KSh ${car.price} at ${car.dealer}, ${car.location}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success('Car shared successfully!')
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (!car) {
    return (
      <>
        <Head>
          <title>Loading... | Corporate Cars Elite</title>
          <meta name="description" content="Loading car details" />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
          <div className="text-center">
            <CircularProgress 
              size={60}
              sx={{
                color: '#3b82f6',
                marginBottom: '1rem'
              }}
            />
            <div className="text-white text-xl font-semibold">Loading car details...</div>
            <p className="text-gray-400 mt-2">Please wait while we fetch the vehicle information</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Enhanced SEO Head Section */}
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="vehicle" />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:site_name" content="Corporate Cars Elite" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.image} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
        />

        {/* Additional SEO Meta Tags */}
        <meta name="author" content="Corporate Cars Elite" />
        <meta name="robots" content="index, follow" />
        <meta name="vehicle:type" content="used car" />
        <meta name="vehicle:location" content={car.location} />
        <meta name="vehicle:price" content={car.price} />
        <meta name="vehicle:year" content={car.year} />
      </Head>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {/* Main Container with proper overflow handling */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
        {/* Breadcrumb Navigation with SEO-friendly structure */}
        <nav className="bg-gray-800/50 mt-[8%]" aria-label="Breadcrumb">
          <div className="w-full px-6 py-4 max-w-[1400px] mx-auto">
            <ol className="flex items-center space-x-3 text-lg text-gray-400 flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/" className="hover:text-white transition-colors text-xl" itemProp="item">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li className="flex items-center">
                <span className="mx-3 text-xl">/</span>
              </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/carlisting" className="hover:text-white transition-colors text-xl" itemProp="item">
                  <span itemProp="name">Cars for Sale</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <li className="flex items-center">
                <span className="mx-3 text-xl">/</span>
              </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span className="text-white text-xl font-semibold" itemProp="name">{car.name}</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </div>
        </nav>

        {/* Header */}
        <header className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-40">
          <div className="w-full px-4 py-4 max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition-all duration-200 px-2 py-1"
                aria-label="Go back to car listings"
              >
                <FaArrowLeft />
                <span className="whitespace-nowrap">Back to Listings</span>
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleFavorite}
                  className={`p-3 rounded-full backdrop-blur-lg transition-all duration-200 ${
                    isFavorite 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'bg-gray-800/80 text-gray-300 hover:bg-red-500 hover:text-white'
                  }`}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <FaHeart className={`text-lg ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={shareCar}
                  className="p-3 bg-gray-800/80 backdrop-blur-lg rounded-full text-gray-300 hover:bg-blue-500 hover:text-white transition-all duration-200"
                  aria-label="Share this car"
                >
                  <FaShare className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with responsive layout */}
        <main className="w-full px-4 py-8 max-w-[1400px] mx-auto" itemScope itemType="https://schema.org/Vehicle">
          <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 w-full">
            {/* Left Column - Images & Basic Info */}
            <div className="flex-1 w-full min-w-0">
              {/* Enhanced Image Gallery with SEO optimization */}
              <section 
                aria-label="Car images gallery" 
                className="relative w-full h-64 sm:h-80 md:h-96 xl:h-[500px] bg-gray-900 rounded-xl overflow-hidden mb-6"
              >
                <img
                  src={car.images[selectedImageIndex]}
                  alt={`${car.year} ${car.name} - View ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  loading="eager"
                  itemProp="image"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-lg w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 border border-white/20 text-white"
                  aria-label="Previous image"
                >
                  <FaArrowLeft className="text-sm sm:text-base" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-lg w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 border border-white/20 text-white"
                  aria-label="Next image"
                >
                  <FaArrowRight className="text-sm sm:text-base" />
                </button>

                {/* Auto-play Control */}
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/50 backdrop-blur-lg w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 border border-white/20 text-white"
                  aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isAutoPlaying ? <FaPause className="text-xs sm:text-sm" /> : <FaPlay className="text-xs sm:text-sm" />}
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-10 flex-wrap justify-center">
                  {car.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                        selectedImageIndex === index 
                          ? 'bg-white shadow-lg scale-125' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Thumbnail Strip */}
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex gap-2 overflow-x-auto pb-1 z-10 scrollbar-thin">
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-14 h-10 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedImageIndex === index 
                          ? 'border-blue-400 shadow-lg' 
                          : 'border-white/30 hover:border-white/50'
                      }`}
                      aria-label={`View thumbnail ${index + 1}`}
                    >
                      <img 
                        src={image} 
                        alt={`${car.year} ${car.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </section>

              {/* Quick Stats Grid */}
              <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6" aria-label="Car specifications">
                {[
                  { icon: IoMdSpeedometer, label: 'Mileage', value: car.mileage, color: 'blue', itemprop: 'mileageFromOdometer' },
                  { icon: FaCog, label: 'Transmission', value: car.transmission, color: 'purple', itemprop: 'vehicleTransmission' },
                  { icon: FaGasPump, label: 'Fuel Type', value: car.fuel, color: 'green', itemprop: 'fuelType' },
                  { icon: FaUsers, label: 'Seats', value: car.seats, color: 'cyan', itemprop: 'vehicleSeatingCapacity' }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="bg-gray-700/50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-gray-600 hover:border-blue-400/50 transition-all duration-300 min-w-0"
                    itemProp={item.itemprop}
                  >
                    <item.icon className={`text-${item.color}-400 text-lg sm:text-xl mx-auto mb-1 sm:mb-2`} />
                    <div className="text-white font-semibold text-xs sm:text-sm truncate" itemProp="value">{item.value}</div>
                    <div className="text-gray-400 text-xs truncate">{item.label}</div>
                  </div>
                ))}
              </section>

              {/* Modern Features Section */}
              <section className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FaCertificate className="text-amber-400" />
                  Vehicle Features & Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {car.features.map((feature, index) => (
                    <div
                      key={index}
                      className="group bg-gray-700/50 rounded-lg p-2 border border-gray-600 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 rounded flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                          <FaCheck className="text-blue-400 text-xs" />
                        </div>
                        <span className="text-gray-200 font-medium text-xs sm:text-xs truncate">
                          {feature}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column - Details & Actions */}
            <div className="xl:w-2/5 w-full min-w-0">
              {/* Header Section */}
              <section className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700 mb-4">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 break-words" itemProp="name">
                  {car.name}
                </h1>
                
                <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-blue-500/30 whitespace-nowrap">
                    <FaCalendar className="text-xs" />
                    <span itemProp="modelDate">{car.year}</span>
                  </span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-green-500/30 whitespace-nowrap">
                    <FaMapMarkerAlt className="text-xs" />
                    <span itemProp="address">{car.location}</span>
                  </span>
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-purple-500/30 whitespace-nowrap">
                    <FaCar className="text-xs" />
                    {car.type}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-2 sm:mb-3">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-400 mb-1 break-words" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span itemProp="price" content={car.price.replace(/,/g, '')}>KSh {car.price}</span>
                    <meta itemProp="priceCurrency" content="KES" />
                    <meta itemProp="availability" content="https://schema.org/InStock" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded border border-amber-500/30">
                      <FaStar className="text-amber-400 text-xs" />
                      <span className="text-amber-400 text-xs font-medium">{car.rating}/5</span>
                    </div>
                    <span className="text-green-400 text-xs font-medium">
                      {parseFloat(car.price.replace(/,/g, '')) > 5000000 ? 'Premium' : 'Great Value'}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-2 mb-3 flex-wrap">
                  <a
                    href={`tel:${car.phone}`}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-all duration-200 text-center font-semibold flex items-center justify-center gap-1 text-sm min-w-0"
                    itemProp="telephone"
                  >
                    <FaPhone />
                    <span className="truncate">Call Now</span>
                  </a>
                  <a
                    href={`https://wa.me/${car.phone.replace('+', '').replace(/\s/g, '')}`}
                    className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-all duration-200 text-center font-semibold flex items-center justify-center gap-1 text-sm min-w-0"
                  >
                    <FaWhatsapp />
                    <span className="truncate">WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-all duration-200 text-center font-semibold flex items-center justify-center gap-1 text-sm min-w-0"
                  >
                    <FaEnvelope />
                    <span className="truncate">Contact Me</span>
                  </button>
                </div>
              </section>

              {/* Description */}
              <section className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700 mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Vehicle Description</h2>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed" itemProp="description">
                  {car.description}
                </p>
              </section>

              {/* Specifications */}
              <section className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700 mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                  <FaCog className="text-blue-400" />
                  Technical Specifications
                </h3>
                <div className="space-y-1 sm:space-y-2">
                  {[
                    { label: 'Engine', value: car.engine, itemprop: 'vehicleEngine' },
                    { label: 'Transmission', value: car.transmission, itemprop: 'vehicleTransmission' },
                    { label: 'Fuel Type', value: car.fuel, itemprop: 'fuelType' },
                    { label: 'Mileage', value: car.mileage, itemprop: 'mileageFromOdometer' },
                    { label: 'Color', value: car.color, itemprop: 'color' },
                    { label: 'Seating Capacity', value: `${car.seats} seats`, itemprop: 'vehicleSeatingCapacity' }
                  ].map((spec, index) => (
                    <div key={index} className="flex justify-between items-center py-1 border-b border-gray-600 last:border-b-0">
                      <span className="text-gray-300 text-xs sm:text-sm">{spec.label}</span>
                      <span className="text-white font-semibold text-xs sm:text-sm text-right break-words max-w-[60%]" itemProp={spec.itemprop}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Dealer Information */}
              <section className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700" itemProp="seller" itemScope itemType="https://schema.org/CarDealer">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                  <FaBuilding className="text-green-400" />
                  Dealer Information
                </h3>
                <div className="space-y-1 sm:space-y-2">
                  {[
                    { label: 'Dealer Name', value: car.dealer, itemprop: 'name' },
                    { label: 'Location', value: car.location, itemprop: 'address' },
                    { label: 'Contact', value: car.phone, isLink: true, itemprop: 'telephone' }
                  ].map((info, index) => (
                    <div key={index} className="flex justify-between items-center py-1 border-b border-gray-600 last:border-b-0">
                      <span className="text-gray-300 text-xs sm:text-sm">{info.label}</span>
                      {info.isLink ? (
                        <a 
                          href={`tel:${info.value}`} 
                          className="text-blue-400 hover:text-blue-300 font-semibold text-xs sm:text-sm text-right break-words max-w-[60%]"
                          itemProp={info.itemprop}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <span className="text-white font-semibold text-xs sm:text-sm text-right break-words max-w-[60%]" itemProp={info.itemprop}>
                          {info.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Final Call to Action - Full Width */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-3 sm:p-4 text-center mt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              Ready to make it yours?
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm mb-3 sm:mb-4">
              Contact the dealer now for a test drive or more details
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <a
                href={`tel:${car.phone}`}
                className="bg-white text-blue-600 py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-100 transition-all duration-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2 flex-1 min-w-0"
              >
                <FaPhone className="text-xs sm:text-sm" />
                <span className="truncate">Call Dealer Now</span>
              </a>
              <a
                href={`https://wa.me/${car.phone.replace('+', '').replace(/\s/g, '')}`}
                className="bg-green-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-green-600 transition-all duration-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2 flex-1 min-w-0"
              >
                <FaWhatsapp className="text-xs sm:text-sm" />
                <span className="truncate">WhatsApp Dealer</span>
              </a>
              <button
                onClick={() => setShowContactModal(true)}
                className="bg-blue-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-600 transition-all duration-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2 flex-1 min-w-0"
              >
                <FaEnvelope className="text-xs sm:text-sm" />
                <span className="truncate">Connect With Me</span>
              </button>
              <Link 
                href="/carlisting"
                className="bg-gray-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-600 transition-all duration-200 font-bold text-sm sm:text-base flex items-center justify-center flex-1 min-w-0"
              >
                <span className="truncate">Continue Browsing</span>
              </Link>
            </div>
          </section>
        </main>
      </div>

      {/* Enhanced Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-2xl border border-gray-700 shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FaCarSide className="text-white text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white">Express Your Interest</h3>
                    <p className="text-blue-100 text-xs sm:text-sm">We'll connect you with the dealer</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-white hover:text-gray-200 transition-colors p-1 sm:p-2 rounded-lg hover:bg-white/10"
                >
                  <FaTimes className="text-lg sm:text-xl" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              {/* Car Info Summary */}
              <div className="bg-gray-700/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-600">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-base sm:text-lg truncate">{car.name}</h4>
                    <p className="text-gray-300 text-xs sm:text-sm truncate">{car.dealer} • {car.location}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-blue-400 font-bold text-lg sm:text-xl">KSh {car.price}</p>
                    <p className="text-green-400 text-xs sm:text-sm">Available Now</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      I'm interested in:
                    </label>
                    <select
                      name="interestType"
                      value={formData.interestType}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                    >
                      <option value="schedule_call">Schedule a Call</option>
                      <option value="test_drive">Schedule a Test Drive</option>
                      <option value="more_details">Get More Details</option>
                      <option value="price_negotiation">Price Negotiation</option>
                      <option value="financing">Financing Options</option>
                      <option value="trade_in">Trade-In Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Additional Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base resize-none"
                    placeholder="Tell us about your specific requirements, preferred contact time, or any questions you have..."
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <FaShieldAlt className="text-blue-400 text-base sm:text-lg mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-300 text-sm font-medium">Your information is secure</p>
                      <p className="text-blue-400/80 text-xs">We respect your privacy and will only use your information to connect you with the dealer regarding this vehicle.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress 
                        size={20}
                        sx={{ color: 'white' }}
                      />
                      <span>Submitting Your Request...</span>
                    </>
                  ) : (
                    <>
                      <FaEnvelope className="text-lg sm:text-xl" />
                      <span>Submit Interest Request</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-3 sm:mt-4 text-center">
                <p className="text-gray-400 text-xs sm:text-sm">
                  By submitting, you agree to be contacted by the dealer regarding this vehicle
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}