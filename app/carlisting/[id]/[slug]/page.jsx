"use client"

import { useState, useEffect } from 'react'
import { 
  FaMapMarkerAlt, FaCog, FaGasPump, FaBuilding, FaPhone, FaCalendar, 
  FaStar, FaHeart, FaShare, FaArrowLeft, FaArrowRight, FaPlay, FaPause,
  FaUsers, FaPalette, FaShieldAlt, FaCertificate, FaCheck,
  FaEnvelope, FaCar, FaTimes, FaCarSide, FaTachometerAlt
} from 'react-icons/fa'
import { IoMdSpeedometer } from 'react-icons/io'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CircularProgress } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Head from 'next/head'

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [car, setCar] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interestType: 'schedule_call'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Base URL from environment
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://corporatecarselite.com'

  // IGNORE SLUG - ONLY USE ID FROM PARAMS
  useEffect(() => {
    console.log('🔍 All params received:', params)
    
    const fetchCarData = async () => {
      try {
        // ✅ ONLY USE THE ID - IGNORE THE SLUG COMPLETELY
        const carId = params.id
        console.log('🚗 Fetching car with ID:', carId)
        
        if (!carId) {
          throw new Error('No car ID provided')
        }

        const response = await fetch(`/api/cardeal/${carId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Car not found')
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('📦 API response:', result)
        
        if (result.success && result.carListing) {
          const carData = result.carListing
          
          // ✅ CORRECT IMAGE MAPPING - DIRECT PATHS FROM API
          const mapImages = (carData) => {
            const images = []
            
            // Priority 1: Multiple files array (from API response)
            if (Array.isArray(carData.files) && carData.files.length > 0) {
              carData.files.forEach(file => {
                if (file && file.trim() !== '') {
                  // Use direct path as provided by API - no /api/images prefix
                  const imagePath = file.startsWith('/') ? file : `/${file}`
                  images.push(imagePath)
                }
              })
            }
            
            // Priority 2: Single file (from API response)
            if (carData.file && carData.file.trim() !== '') {
              const mainImage = carData.file.startsWith('/') ? carData.file : `/${carData.file}`
              // Add to beginning if not already included
              if (!images.includes(mainImage)) {
                images.unshift(mainImage)
              }
            }
            
            console.log('🖼️ Mapped images:', images)
            return images
          }

          // ✅ CORRECT FEATURES MAPPING
          const mapFeatures = (carData) => {
            if (Array.isArray(carData.features)) {
              return carData.features.flatMap(feature => {
                if (typeof feature === 'string') {
                  // Handle comma-separated features
                  return feature.split(',').map(f => f.trim()).filter(f => f !== '')
                }
                return feature
              }).filter(f => f && f.trim() !== '')
            }
            if (typeof carData.features === 'string') {
              return carData.features.split(',').map(f => f.trim()).filter(f => f !== '')
            }
            return []
          }

          const transformedCar = {
            id: carData.id,
            name: carData.carName || 'Vehicle',
            price: carData.price?.toLocaleString() || '0',
            location: carData.location || 'Location not specified',
            year: carData.year?.toString() || 'N/A',
            type: carData.carType || 'Not specified',
            mileage: carData.mileage ? `${carData.mileage.toLocaleString()} km` : 'Not specified',
            transmission: carData.transmission || 'Not specified',
            fuel: carData.fuelType || 'Not specified',
            features: mapFeatures(carData),
            images: mapImages(carData),
            description: carData.description || `Premium ${carData.carName} available for sale.`,
            dealer: carData.sellerName || 'Premium Auto Dealer',
            phone: carData.sellerPhone || '+254700000000',
            email: carData.sellerEmail,
            rating: 4.5,
            engine: 'Not specified',
            color: 'Not specified',
            seats: 5,
            brand: carData.carName ? carData.carName.split(' ')[0] : 'Vehicle'
          }
          
          console.log('✅ Transformed car data:', transformedCar)
          setCar(transformedCar)
          
          // Check favorites
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
          setIsFavorite(favorites.includes(carData.id))
        } else {
          throw new Error(result.error || 'Invalid car data format')
        }
      } catch (error) {
        console.error('❌ Error fetching car:', error)
        toast.error(`Failed to load car details: ${error.message}`)
        setTimeout(() => router.push('/carlisting'), 3000)
      } finally {
        setLoading(false)
      }
    }

    fetchCarData()
  }, [params.id, router])

  // Generate SEO data function
  const generateSeoData = () => {
    if (!car) {
      return {
        title: "Car Details | Corporate Cars Elite - Premium Used Cars Kenya",
        description: "Find premium used cars for sale in Kenya. Browse Toyota, Nissan, Mercedes, BMW and more at Corporate Cars Elite.",
        keywords: "used cars kenya, cars for sale nairobi, toyota kenya, nissan kenya, mercedes kenya, car dealers kenya",
        canonical: `${baseUrl}/carlisting`,
        ogImage: `${baseUrl}/car1.png`,
        structuredData: null
      }
    }

    const priceNumber = parseInt(car.price.replace(/,/g, '')) || 0;
    const year = car.year || '2024';
    const location = car.location || 'Kenya';
    const transmission = car.transmission || 'Automatic';
    const fuelType = car.fuel || 'Petrol';
    const mileage = car.mileage || 'Not specified';
    
    const title = `${year} ${car.name} for Sale in ${location} | KSh ${car.price} | Corporate Cars Elite`;
    const description = `🏆 ${year} ${car.name} for sale in ${location}. ${transmission} transmission, ${fuelType} fuel, ${mileage}. Premium condition. Contact ${car.dealer} at ${car.phone}. Best price: KSh ${car.price}.`;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Vehicle",
      "name": car.name,
      "description": car.description || `${year} ${car.name} available for sale in ${location}`,
      "image": car.images && car.images.length > 0 ? car.images : [`${baseUrl}/car1.png`],
      "brand": {
        "@type": "Brand",
        "name": car.brand || car.name.split(' ')[0] || "Automotive"
      },
      "model": car.name,
      "vehicleModelDate": year,
      "mileageFromOdometer": {
        "@type": "QuantitativeValue",
        "value": mileage.replace(' km', '').replace(/,/g, '') || "0",
        "unitCode": "KMT"
      },
      "vehicleTransmission": transmission,
      "fuelType": fuelType,
      "color": car.color || "Various",
      "numberOfForwardGears": transmission === "Automatic" ? "6" : "5",
      "vehicleSeatingCapacity": car.seats || 5,
      "productionDate": year,
      "itemCondition": "https://schema.org/UsedCondition",
      "offers": {
        "@type": "Offer",
        "price": priceNumber.toString(),
        "priceCurrency": "KES",
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "CarDealer",
          "name": car.dealer,
          "telephone": car.phone,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": location,
            "addressCountry": "KE"
          }
        },
        "url": `${baseUrl}/carlisting/${car.id}`
      }
    };

    return {
      title,
      description,
      keywords: `${car.name}, ${year} ${car.name}, used ${car.name} kenya, ${car.name} price kenya, ${car.name} ${location}, ${car.brand} cars kenya, ${transmission} cars, ${fuelType} cars`,
      canonical: `${baseUrl}/carlisting/${car.id}`,
      ogImage: car.images && car.images.length > 0 ? car.images[0] : `${baseUrl}/car1.png`,
      structuredData,
      additionalMeta: {
        "car:year": year,
        "car:price": car.price,
        "car:location": location,
        "car:transmission": transmission,
        "car:fuel_type": fuelType,
        "car:dealer": car.dealer
      }
    };
  };

  // Auto-play for image gallery
  useEffect(() => {
    if (!isAutoPlaying || !car || !car.images || car.images.length === 0) return
    
    const interval = setInterval(() => {
      setSelectedImageIndex(prev => (prev + 1) % car.images.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying, car])

  const nextImage = () => {
    if (car && car.images && car.images.length > 0) {
      setSelectedImageIndex(prev => (prev + 1) % car.images.length)
    }
  }

  const prevImage = () => {
    if (car && car.images && car.images.length > 0) {
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

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Car Details | Corporate Cars Elite</title>
          <meta name="description" content="Loading premium vehicle details from Corporate Cars Elite - Kenya's trusted car marketplace" />
          <meta name="keywords" content="car details, vehicle information, car specifications kenya" />
          <link rel="canonical" href={`${baseUrl}/carlisting`} />
        </Head>
        {/* ✅ SAME BACKGROUND AS LISTING PAGE */}
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
          <div className="text-center">
            <CircularProgress size={60} sx={{ color: '#3b82f6', marginBottom: '1rem' }} />
            <div className="text-white text-xl font-semibold">Loading car details...</div>
            <p className="text-gray-400 mt-2">Car ID: {params.id}</p>
          </div>
        </div>
      </>
    )
  }

  if (!car) {
    return (
      <>
        <Head>
          <title>Car Not Found | Corporate Cars Elite</title>
          <meta name="description" content="The requested car was not found. Browse our extensive collection of premium used cars in Kenya." />
          <link rel="canonical" href={`${baseUrl}/carlisting`} />
        </Head>
        {/* ✅ SAME BACKGROUND AS LISTING PAGE */}
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
            <button 
              onClick={() => router.push('/carlisting')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse All Cars
            </button>
          </div>
        </div>
      </>
    )
  }

  // Check if we have images
  const hasImages = car.images && car.images.length > 0
  const currentImage = hasImages ? car.images[selectedImageIndex] : null
  const seoData = generateSeoData()

  return (
    <>
      {/* Comprehensive SEO Head Section */}
      <Head>
        {/* Primary Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="vehicle" />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:site_name" content="Corporate Cars Elite" />
        <meta property="og:locale" content="en_KE" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={seoData.canonical} />
        <meta property="twitter:title" content={seoData.title} />
        <meta property="twitter:description" content={seoData.description} />
        <meta property="twitter:image" content={seoData.ogImage} />

        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="Corporate Cars Elite" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Car Specific Meta Tags */}
        <meta name="vehicle:type" content="used car" />
        <meta name="vehicle:year" content={seoData.additionalMeta?.["car:year"]} />
        <meta name="vehicle:price" content={seoData.additionalMeta?.["car:price"]} />
        <meta name="vehicle:location" content={seoData.additionalMeta?.["car:location"]} />
        <meta name="vehicle:transmission" content={seoData.additionalMeta?.["car:transmission"]} />
        <meta name="vehicle:fuel_type" content={seoData.additionalMeta?.["car:fuel_type"]} />
        <meta name="vehicle:dealer" content={seoData.additionalMeta?.["car:dealer"]} />

        {/* Structured Data for Rich Snippets */}
        {seoData.structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.structuredData) }}
          />
        )}

        {/* Additional Schema for Breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": baseUrl
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Cars for Sale",
                  "item": `${baseUrl}/carlisting`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": car.name,
                  "item": seoData.canonical
                }
              ]
            })
          }}
        />

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CarDealer",
              "name": "Corporate Cars Elite",
              "description": "Premium used car dealership in Kenya offering quality vehicles with verified history and competitive pricing.",
              "url": baseUrl,
              "telephone": "+254791596795",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "KE",
                "addressLocality": "Nairobi"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-1.2921",
                "longitude": "36.8219"
              },
              "openingHours": "Mo-Fr 08:00-18:00, Sa 09:00-16:00",
              "priceRange": "$$",
              "image": `${baseUrl}/car1.png`
            })
          }}
        />
      </Head>

      <ToastContainer position="top-right" theme="dark" />
      
      {/* ✅ SAME BACKGROUND AS LISTING PAGE */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Enhanced Breadcrumb with Schema Markup */}
        <nav className="bg-gray-800/50 mt-[8%]" aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
          <div className="w-full px-6 py-4 max-w-[1400px] mx-auto">
            <ol className="flex items-center space-x-3 text-lg text-gray-400 flex-wrap">
              <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
                <Link href="/" className="hover:text-white transition-colors text-xl" itemProp="item">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li className="flex items-center">
                <span className="mx-3 text-xl">/</span>
              </li>
              <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
                <Link href="/carlisting" className="hover:text-white transition-colors text-xl" itemProp="item">
                  <span itemProp="name">Cars for Sale</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <li className="flex items-center">
                <span className="mx-3 text-xl">/</span>
              </li>
              <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
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
              <button onClick={() => router.back()} className="flex items-center gap-2 text-white hover:text-blue-400 transition-all duration-200">
                <FaArrowLeft /> Back to Listings
              </button>
              <div className="flex items-center gap-3">
                <button onClick={toggleFavorite} className={`p-3 rounded-full backdrop-blur-lg transition-all duration-200 ${
                  isFavorite ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-800/80 text-gray-300 hover:bg-red-500 hover:text-white'
                }`}>
                  <FaHeart className={`text-lg ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button onClick={shareCar} className="p-3 bg-gray-800/80 backdrop-blur-lg rounded-full text-gray-300 hover:bg-blue-500 hover:text-white transition-all duration-200">
                  <FaShare className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with Vehicle Schema */}
        <main className="w-full px-4 py-8 max-w-[1400px] mx-auto" itemScope itemType="https://schema.org/Vehicle">
          <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 w-full">
            
            {/* Left Column - Images */}
            <div className="flex-1 w-full min-w-0">
              {/* Image Gallery */}
              <section className="relative w-full h-64 sm:h-80 md:h-96 xl:h-[500px] bg-gray-900 rounded-xl overflow-hidden mb-6">
                {hasImages ? (
                  <>
                    <div className="relative w-full h-full">
                      <Image
                        src={currentImage}
                        alt={`${car.year} ${car.name} for sale in ${car.location} - Premium used car from Corporate Cars Elite`}
                        fill
                        className="object-cover transition-opacity duration-500"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        itemProp="image"
                      />
                    </div>
                    
                    {car.images.length > 1 && (
                      <>
                        <button onClick={prevImage} className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-lg w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 border border-white/20 text-white">
                          <FaArrowLeft className="text-sm sm:text-base" />
                        </button>
                        <button onClick={nextImage} className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-lg w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 border border-white/20 text-white">
                          <FaArrowRight className="text-sm sm:text-base" />
                        </button>
                        <button onClick={() => setIsAutoPlaying(!isAutoPlaying)} className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/50 backdrop-blur-lg w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 border border-white/20 text-white">
                          {isAutoPlaying ? <FaPause className="text-xs sm:text-sm" /> : <FaPlay className="text-xs sm:text-sm" />}
                        </button>
                      </>
                    )}

                    {/* Thumbnails */}
                    {car.images.length > 1 && (
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex gap-2 overflow-x-auto pb-1 z-10">
                        {car.images.map((image, index) => (
                          <button key={index} onClick={() => setSelectedImageIndex(index)} className={`flex-shrink-0 w-14 h-10 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                            selectedImageIndex === index ? 'border-blue-400 shadow-lg' : 'border-white/30 hover:border-white/50'
                          }`}>
                            <div className="relative w-full h-full">
                              <Image src={image} alt={`${car.name} view ${index + 1} - Corporate Cars Elite Kenya`} fill className="object-cover" sizes="80px" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <div className="text-center text-gray-400">
                      <FaCar className="text-4xl mx-auto mb-2" />
                      <p>No images available</p>
                    </div>
                  </div>
                )}
              </section>

              {/* Quick Stats */}
              <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6" aria-label="Vehicle specifications">
                {[
                  { icon: IoMdSpeedometer, label: 'Mileage', value: car.mileage, color: 'blue', itemprop: 'mileageFromOdometer' },
                  { icon: FaCog, label: 'Transmission', value: car.transmission, color: 'purple', itemprop: 'vehicleTransmission' },
                  { icon: FaGasPump, label: 'Fuel Type', value: car.fuel, color: 'green', itemprop: 'fuelType' },
                  { icon: FaUsers, label: 'Seats', value: car.seats, color: 'cyan', itemprop: 'vehicleSeatingCapacity' }
                ].map((item, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-gray-700 hover:border-blue-400/50 transition-all duration-300">
                    <item.icon className={`text-${item.color}-400 text-lg sm:text-xl mx-auto mb-1 sm:mb-2`} />
                    <div className="text-white font-semibold text-xs sm:text-sm truncate" itemProp={item.itemprop}>{item.value}</div>
                    <div className="text-gray-400 text-xs truncate">{item.label}</div>
                  </div>
                ))}
              </section>

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <section className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <FaCertificate className="text-amber-400" /> Vehicle Features & Amenities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {car.features.map((feature, index) => (
                      <div key={index} className="group bg-gray-800/50 rounded-lg p-2 border border-gray-700 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
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
              )}
            </div>

            {/* Right Column - Details */}
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

                <div className="mb-2 sm:mb-3">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-400 mb-1 break-words" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span itemProp="price" content={car.price.replace(/,/g, '')}>KSh {car.price}</span>
                    <meta itemProp="priceCurrency" content="KES" />
                    <meta itemProp="availability" content="https://schema.org/InStock" />
                    <meta itemProp="url" content={seoData.canonical} />
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

                <div className="flex flex-col sm:flex-row gap-2 mb-3 flex-wrap">
                  <a href={`tel:${car.phone}`} className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-all duration-200 text-center font-semibold flex items-center justify-center gap-1 text-sm min-w-0">
                    <FaPhone />
                    <span className="truncate">Call Now</span>
                  </a>
                  <button onClick={() => setShowContactModal(true)} className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-all duration-200 text-center font-semibold flex items-center justify-center gap-1 text-sm min-w-0">
                    <FaEnvelope />
                    <span className="truncate">Contact Dealer</span>
                  </button>
                </div>
              </section>

              {/* Description */}
              {car.description && (
                <section className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700 mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Vehicle Description</h2>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed" itemProp="description">
                    {car.description}
                  </p>
                </section>
              )}

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

          {/* Final Call to Action */}
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
              <button
                onClick={() => setShowContactModal(true)}
                className="bg-blue-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-600 transition-all duration-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2 flex-1 min-w-0"
              >
                <FaEnvelope className="text-xs sm:text-sm" />
                <span className="truncate">Get More Details</span>
              </button>
              <Link 
                href="/carlisting"
                className="bg-gray-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-600 transition-all duration-200 font-bold text-sm sm:text-base flex items-center justify-center flex-1 min-w-0"
              >
                <span className="truncate">Browse More Cars</span>
              </Link>
            </div>
          </section>
        </main>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
            <div className="bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-2xl border border-gray-700 shadow-2xl overflow-hidden my-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <FaCarSide className="text-white text-lg sm:text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-bold text-white">Contact Dealer</h3>
                      <p className="text-blue-100 text-xs sm:text-sm">Get more information about this vehicle</p>
                    </div>
                  </div>
                  <button onClick={() => setShowContactModal(false)} className="text-white hover:text-gray-200 transition-colors p-1 sm:p-2 rounded-lg hover:bg-white/10">
                    <FaTimes className="text-lg sm:text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
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
                      <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Full Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base" placeholder="Enter your email" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Phone Number *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base" placeholder="Enter your phone number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">I'm interested in:</label>
                      <select name="interestType" value={formData.interestType} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base">
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
                    <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Additional Message (Optional)</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} rows="3" className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base resize-none" placeholder="Tell us about your specific requirements, preferred contact time, or any questions you have..." />
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

                  <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg shadow-lg">
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                        <span>Submitting Your Request...</span>
                      </>
                    ) : (
                      <>
                        <FaEnvelope className="text-lg sm:text-xl" />
                        <span>Contact Dealer</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-3 sm:mt-4 text-center">
                  <p className="text-gray-400 text-xs sm:text-sm">By submitting, you agree to be contacted by the dealer regarding this vehicle</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}