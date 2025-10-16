// components/cars/CarsManagement.js
"use client"

import { useState, useEffect } from 'react'
import { 
  FaCar, 
  FaEdit, 
  FaTrash, 
  FaStar,
  FaSearch,
  FaChevronLeft,
  FaMapMarkerAlt,
  FaChevronRight,
  FaCheck,
  FaGasPump,
  FaTachometerAlt,
  FaMoneyBillWave,
  FaCalendar,
  FaCog,
  FaPlus,
  FaEye,
  FaBars,
  FaArrowLeft
} from 'react-icons/fa'

const mockCars = [
  {
    id: 1,
    name: "Toyota RAV4 2021",
    price: "2,300,000",
    location: "Nairobi",
    year: "2021",
    type: "SUV",
    mileage: "45,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=350&fit=crop",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&h=350&fit=crop"
    ],
    description: "Well maintained Toyota RAV4 with full service history. Perfect family SUV with low mileage. One owner, accident-free with comprehensive service records.",
    dealer: "Trust Auto Kenya",
    phone: "+254 712 345 678",
    rating: 4.8,
    features: ["Leather Seats", "Sunroof", "Backup Camera", "Bluetooth", "Climate Control", "Alloy Wheels"]
  },
  {
    id: 2,
    name: "Honda Civic 2020",
    price: "1,800,000",
    location: "Nakuru",
    year: "2020",
    type: "Sedan",
    mileage: "60,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    status: "active",
    featured: false,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=350&fit=crop"
    ],
    description: "Sleek Honda Civic with excellent fuel economy. One owner, accident-free. Perfect for city driving with low maintenance costs.",
    dealer: "Nakuru Motors",
    phone: "+254 723 456 789",
    rating: 4.6,
    features: ["Push Start", "Touchscreen", "Climate Control", "Keyless Entry", "Rear Camera", "LED Lights"]
  }
]

export default function CarsManagement({ 
  onAddCar, 
  onEditCar, 
  onDeleteCar, 
  onViewCar 
}) {
  const [cars, setCars] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const carsPerPage = 10

  useEffect(() => {
    setCars(mockCars)
  }, [])

  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.year.toString().includes(searchTerm) ||
    car.dealer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastCar = currentPage * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar)
  const totalPages = Math.ceil(filteredCars.length / carsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleDeleteClick = (car) => {
    if (confirm(`Are you sure you want to delete ${car.name}?`)) {
      setCars(cars.filter(c => c.id !== car.id))
      onDeleteCar?.(car)
    }
  }

  return (
    <div>
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 bg-blue-600 text-white rounded-lg"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Search and Add Button */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search cars by name, location, type, year, or dealer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
          <button
            onClick={onAddCar}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition duration-200 shadow-lg font-semibold text-lg"
          >
            <FaPlus />
            <span>Add New Car</span>
          </button>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Table Header - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:grid grid-cols-12 gap-6 px-6 py-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
          <div className="col-span-2">Car Details</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Rating</div>
          <div className="col-span-2 text-center">Specifications</div>
          <div className="col-span-2">Features</div>
          <div className="col-span-2">Dealer</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {/* Cars List */}
        <div className="divide-y divide-gray-100">
          {currentCars.map((car) => (
            <div key={car.id} className="p-6 hover:bg-blue-50 transition duration-200 group">
              {/* Mobile Layout */}
              <div className="lg:hidden space-y-4">
                {/* Car Header */}
                <div className="flex items-start space-x-4">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-20 h-20 object-cover rounded-xl shadow-md"
                    />
                    {car.featured && (
                      <div className="absolute -top-1 -left-1">
                        <FaStar className="text-amber-500 text-lg bg-white rounded-full p-0.5 shadow-md" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg truncate">{car.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-2xl font-bold text-blue-600">KSh {car.price}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 text-sm mt-1">
                      <FaCalendar className="text-gray-400" />
                      <span>{car.year}</span>
                    </div>
                  </div>
                </div>

                {/* Status and Rating Row */}
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    car.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <FaCheck className="mr-1 text-xs" />
                    {car.status}
                  </span>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-700">
                    {car.rating} ★
                  </div>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaCar className="text-gray-400 text-sm" />
                    <span>{car.type}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaCog className="text-gray-400 text-sm" />
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaGasPump className="text-gray-400 text-sm" />
                    <span>{car.fuel}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400 text-sm" />
                    <span className="truncate">{car.location}</span>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex flex-wrap gap-1">
                    {car.features?.slice(0, 3).map((feature, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {feature}
                      </span>
                    ))}
                    {car.features && car.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                        +{car.features.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dealer and Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-700 font-medium truncate flex-1 mr-4">
                    {car.dealer}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onViewCar?.(car)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition duration-200"
                      title="View Details"
                    >
                      <FaEye className="text-lg" />
                    </button>
                    <button 
                      onClick={() => onEditCar?.(car)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition duration-200"
                      title="Edit Car"
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(car)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200"
                      title="Delete Car"
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
                {/* Car Details */}
                <div className="col-span-2 flex items-center space-x-4">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-20 h-20 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                    {car.featured && (
                      <div className="absolute -top-1 -left-1">
                        <FaStar className="text-amber-500 text-lg bg-white rounded-full p-0.5 shadow-md" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 truncate">{car.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-2xl font-bold text-blue-600">KSh {car.price}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 text-sm mt-1">
                      <FaCalendar className="text-gray-400" />
                      <span>{car.year}</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-1 flex items-center justify-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    car.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <FaCheck className="mr-1 text-xs" />
                    {car.status}
                  </span>
                </div>

                {/* Rating */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-700">
                    {car.rating} ★
                  </div>
                </div>

                {/* Specifications */}
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaCar className="text-gray-400 text-sm" />
                      <span>{car.type}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaCog className="text-gray-400 text-sm" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaGasPump className="text-gray-400 text-sm" />
                      <span>{car.fuel}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400 text-sm" />
                      <span className="truncate">{car.location}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {car.features?.slice(0, 2).map((feature, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {feature}
                      </span>
                    ))}
                    {car.features && car.features.length > 2 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                        +{car.features.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dealer */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-700 font-medium truncate">
                    {car.dealer}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-center space-x-2">
                  <button 
                    onClick={() => onViewCar?.(car)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition duration-200 group/btn"
                    title="View Details"
                  >
                    <FaEye className="text-lg group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => onEditCar?.(car)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition duration-200 group/btn"
                    title="Edit Car"
                  >
                    <FaEdit className="text-lg group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(car)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200 group/btn"
                    title="Delete Car"
                  >
                    <FaTrash className="text-lg group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {currentCars.length === 0 && (
          <div className="text-center py-16">
            <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or add a new car.</p>
            <button
              onClick={onAddCar}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold shadow-lg flex items-center gap-2 mx-auto"
            >
              <FaPlus />
              Add Your First Car
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredCars.length > carsPerPage && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaChevronLeft /> Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Next <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}