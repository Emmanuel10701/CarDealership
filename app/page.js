'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './components/navbar/page';
import Footer from './components/footer/page';
import Hero from './components/hero/page';
import AboutUs from './components/about/page';
import ContactUs from './components/contact/page';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaCar, FaArrowRight, FaStar, FaMapMarkerAlt, FaGasPump, FaCog } from 'react-icons/fa';
import { IoMdSpeedometer } from 'react-icons/io';

// Sample featured cars data
const featuredCars = [
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
    features: ["Sunroof", "Leather Seats", "Backup Camera"]
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
    features: ["Panoramic Roof", "Premium Sound", "Heated Seats"]
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
    features: ["MBUX System", "LED Lights", "Keyless Go"]
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
    features: ["4x4", "Tow Package", "Alloy Wheels"]
  }
];

export default function Home() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => setIsChatOpen((prev) => !prev);

  const handleViewAllCars = () => {
    router.push('/carlisting');
  };

  const handleCarClick = (carId) => {
    router.push(`/carlisting?car=${carId}`);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <AboutUs />
        
        {/* Featured Cars Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Vehicles
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover our handpicked selection of premium quality vehicles
              </p>
            </motion.div>

            {/* Featured Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {featuredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => handleCarClick(car.id)}
                >
                  {/* Car Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {car.year}
                      </span>
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {car.location}
                      </span>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaStar className="text-xs" />
                      {car.rating}
                    </div>
                  </div>
                  
                  {/* Car Details */}
                  <div className="p-6">
                    {/* Car Name and Type */}
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                        {car.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{car.type}</p>
                    </div>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-blue-600">KSh {car.price}</span>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
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

                    {/* Features Preview */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {car.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                      {car.features.length > 2 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{car.features.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* View Details Button */}
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group/btn">
                      View Details
                      <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <button
                onClick={handleViewAllCars}
                className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-bold text-lg flex items-center gap-3 mx-auto group"
              >
                <FaCar className="text-xl group-hover:scale-110 transition-transform duration-300" />
                View All Vehicles
                <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              
              {/* Additional Info */}
              <p className="text-gray-500 mt-4">
                Browse through our complete collection of {featuredCars.length * 10}+ quality vehicles
              </p>
            </motion.div>
          </div>
        </section>

        <ContactUs />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-green-500 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none"
          aria-label="Open Chat"
        >
          <FaWhatsapp className="text-3xl sm:text-4xl" />
        </button>
      </div>

      {/* Chat Popup */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-[22rem] sm:w-[24rem] max-w-[90%] bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8 z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 text-xl sm:text-2xl">
                Chat with Us 💬
              </h2>
              <button
                onClick={toggleChat}
                className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            {/* Message */}
            <p className="text-gray-700 text-base sm:text-lg mb-5 leading-relaxed">
              Hi there 👋 <br /> How can we help you today?
            </p>

            {/* WhatsApp Redirect */}
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-center text-lg sm:text-xl font-semibold transition-all duration-300 block"
            >
              Continue to WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}