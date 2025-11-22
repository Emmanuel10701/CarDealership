'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Hero from './components/hero/page';
import ChatBot from './components/chatbot/page';
import { FaArrowRight, FaStar, FaMapMarkerAlt, FaGasPump, FaCog, FaUsers, FaAward } from 'react-icons/fa';
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
  },
  {
    id: 5,
    name: "Subaru Outback 2023",
    price: "3,800,000",
    location: "Nairobi",
    year: "2023",
    type: "Estate",
    mileage: "10,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop",
    rating: 4.7,
    features: ["AWD", "EyeSight", "Apple CarPlay"]
  },
  {
    id: 6,
    name: "Mazda CX-5 2022",
    price: "3,500,000",
    location: "Nyeri",
    year: "2022",
    type: "SUV",
    mileage: "25,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&h=400&fit=crop",
    rating: 4.6,
    features: ["SkyActiv", "Bose Sound", "Heated Seats"]
  },
  {
    id: 7,
    name: "Honda CR-V 2023",
    price: "3,600,000",
    location: "Nairobi",
    year: "2023",
    type: "SUV",
    mileage: "8,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=400&fit=crop",
    rating: 4.8,
    features: ["Honda Sensing", "Sunroof", "Leather"]
  },
  {
    id: 8,
    name: "Audi Q7 2022",
    price: "9,200,000",
    location: "Nairobi",
    year: "2022",
    type: "Luxury SUV",
    mileage: "20,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    image: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&h=400&fit=crop",
    rating: 4.9,
    features: ["Virtual Cockpit", "Quattro", "Air Suspension"]
  }
];

export default function Home() {
  const router = useRouter();
  const [visibleCars, setVisibleCars] = useState(4);

  const handleViewAllCars = () => {
    router.push('/carlisting');
  };

  const handleCarClick = (carId) => {
    router.push(`/carlisting?car=${carId}`);
  };

  const handleLoadMore = () => {
    setVisibleCars(prev => Math.min(prev + 4, featuredCars.length));
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Modern Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-gradient-to-r from-purple-600/10 to-pink-500/10 rounded-full blur-[100px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
        
        {/* Grain Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Hero />
        
        {/* Featured Cars Section */}
        <section id="featured-cars" className="py-16 lg:py-24 bg-slate-50/80 backdrop-blur-sm">
          <div className="max-w-8xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-24">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-2xl border border-blue-200/50 mb-6">
                <span className="text-2xl">🚗</span>
                <span className="text-blue-700 font-bold text-sm uppercase tracking-wider">Premium Selection</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-slate-800 mb-6">
                Featured <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Vehicles</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Discover our handpicked selection of premium quality vehicles with comprehensive 200-point inspections
              </p>
            </div>

            {/* Featured Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
              {featuredCars.slice(0, visibleCars).map((car) => (
                <div
                  key={car.id}
                  className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-white/20 hover:shadow-2xl hover:border-blue-200/50"
                  onClick={() => handleCarClick(car.id)}
                >
                  {/* Car Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg backdrop-blur-sm">
                        {car.year}
                      </span>
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg backdrop-blur-sm">
                        {car.location}
                      </span>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm">
                      <FaStar className="text-xs" />
                      {car.rating}
                    </div>

                    {/* Type Badge */}
                    <div className="absolute bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm">
                      {car.type}
                    </div>
                  </div>
                  
                  {/* Car Details */}
                  <div className="p-7">
                    {/* Car Name and Type */}
                    <div className="mb-5">
                      <h3 className="text-2xl font-black text-slate-800 mb-3 line-clamp-1">
                        {car.name}
                      </h3>
                      <div className="w-16 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4"></div>
                    </div>
                    
                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">KSh {car.price}</span>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-5 text-sm text-slate-600 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <IoMdSpeedometer className="text-blue-600 text-base" />
                        </div>
                        <span className="font-semibold text-base">{car.mileage}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                          <FaCog className="text-purple-600 text-base" />
                        </div>
                        <span className="font-semibold text-base">{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <FaGasPump className="text-green-600 text-base" />
                        </div>
                        <span className="font-semibold text-base">{car.fuel}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                          <FaMapMarkerAlt className="text-red-600 text-base" />
                        </div>
                        <span className="font-semibold text-base truncate">{car.location}</span>
                      </div>
                    </div>

                    {/* Features Preview */}
                    <div className="flex flex-wrap gap-3 mb-7">
                      {car.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-blue-50 to-purple-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-200/50"
                        >
                          {feature}
                        </span>
                      ))}
                      {car.features.length > 3 && (
                        <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold">
                          +{car.features.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* View Details Button */}
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl transition-all duration-300 font-bold text-base flex items-center justify-center gap-3 shadow-xl hover:from-blue-500 hover:to-purple-500">
                      View Details
                      <FaArrowRight className="transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More / View All Buttons */}
            <div className="text-center space-y-8">
              {visibleCars < featuredCars.length ? (
                <button
                  onClick={handleLoadMore}
                  className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-12 py-5 rounded-2xl transition-all duration-300 font-bold text-lg flex items-center gap-4 mx-auto shadow-2xl backdrop-blur-sm hover:from-slate-600 hover:to-slate-700 cursor-pointer"
                >
                  <span className="text-2xl">🚗</span>
                  Load More Vehicles
                  <FaArrowRight className="" />
                </button>
              ) : (
                <button
                  onClick={handleViewAllCars}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-2xl transition-all duration-300 font-bold text-lg flex items-center gap-4 mx-auto shadow-2xl backdrop-blur-sm hover:from-blue-500 hover:to-purple-500 cursor-pointer"
                >
                  <span className="text-2xl">🚗</span>
                  View All {featuredCars.length}+ Vehicles
                  <FaArrowRight className="" />
                </button>
              )}
              
              {/* Additional Info */}
              <div className="text-center">
                <p className="text-slate-600 text-xl mb-4">
                  Browse through our complete collection of premium vehicles
                </p>
                <div className="flex justify-center gap-8 text-base text-slate-500">
                  <span className="flex items-center gap-3">
                    <FaStar className="text-amber-500 text-lg" />
                    200+ 5-Star Reviews
                  </span>
                  <span className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-blue-500 text-lg" />
                    6 Cities Covered
                  </span>
                  <span className="flex items-center gap-3">
                    <FaCog className="text-green-500 text-lg" />
                    200-Point Inspection
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Quality Section - Compact Design */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-blue-50/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
            {/* Compact Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2 rounded-xl border border-blue-200/50 shadow-lg mb-5">
                <FaAward className="text-blue-600 text-base" />
                <span className="text-blue-700 font-bold text-xs uppercase tracking-wider">Why Choose Us</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-5">
                The <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CorporateSellers</span> Advantage
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Experience automotive excellence with our commitment to quality, transparency, and customer satisfaction
              </p>
            </div>

            {/* Compact Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 bg-blue-50 backdrop-blur-md rounded-2xl border border-blue-200 shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md">
                  <FaCog className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3 text-center">200-Point Inspection</h3>
                <p className="text-slate-600 leading-relaxed text-base text-center">
                  Every vehicle undergoes rigorous inspection ensuring top quality and reliability
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-4"></div>
              </div>

              {/* Feature 2 */}
              <div className="p-6 bg-purple-50 backdrop-blur-md rounded-2xl border border-purple-200 shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md">
                  <FaAward className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3 text-center">Premium Quality</h3>
                <p className="text-slate-600 leading-relaxed text-base text-center">
                  Handpicked selection with comprehensive service history and documentation
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-4"></div>
              </div>

              {/* Feature 3 */}
              <div className="p-6 bg-green-50 backdrop-blur-md rounded-2xl border border-green-200 shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md">
                  <FaUsers className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3 text-center">Expert Service</h3>
                <p className="text-slate-600 leading-relaxed text-base text-center">
                  Professional team with 8+ years experience providing personalized solutions
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4"></div>
              </div>
            </div>

            {/* Compact Stats Section */}
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { number: "500+", label: "Happy Customers" },
                { number: "200+", label: "5-Star Reviews" },
                { number: "8+", label: "Years Experience" },
                { number: "6", label: "Cities Served" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-semibold text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ChatBot Component */}
        <ChatBot />
      </div>
    </div>
  );
}