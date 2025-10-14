"use client"

import { useState, useEffect } from 'react'
import DashboardLayout from '../components/sidebar/page'
import CarSellInquiries from '../components/cars/page'
import { 
  FaCar, 
  FaUsers, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaStar,
  FaSearch,
  FaChevronLeft,
  FaMapMarkerAlt,
  FaChevronRight,
  FaCheck,
  FaCog,
  FaGasPump,
  FaList,
  FaTimes,
  FaCalendar,
  FaTachometerAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaPhone,
  FaEye,
  FaEnvelope,
  FaUser,
  FaCamera,
  FaRocket,
  FaCheckCircle,
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
  },
  {
    id: 3,
    name: "Mazda CX-5 2019",
    price: "2,100,000",
    location: "Nyeri",
    year: "2019",
    type: "SUV",
    mileage: "75,000 km",
    transmission: "Automatic",
    fuel: "Diesel",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&h=350&fit=crop"
    ],
    description: "Powerful Mazda CX-5 with diesel engine. Great for both city and off-road driving. Well maintained with service history.",
    dealer: "Central Car Dealers",
    phone: "+254 734 567 890",
    rating: 4.7,
    features: ["4WD", "Roof Rails", "Parking Sensors", "LED Lights", "Leather Seats", "Sunroof"]
  },
  {
    id: 4,
    name: "Toyota Hilux 2022",
    price: "3,500,000",
    location: "Thika",
    year: "2022",
    type: "Pickup",
    mileage: "25,000 km",
    transmission: "Manual",
    fuel: "Diesel",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=500&h=350&fit=crop"
    ],
    description: "Brand new Toyota Hilux with warranty. Perfect for business and personal use. Double cab with excellent towing capacity.",
    dealer: "Thika Auto Hub",
    phone: "+254 745 678 901",
    rating: 4.9,
    features: ["4x4", "Tow Package", "Alloy Wheels", "Double Cab", "Touchscreen", "Reverse Camera"]
  },
  {
    id: 5,
    name: "Subaru Outback 2020",
    price: "2,800,000",
    location: "Nairobi",
    year: "2020",
    type: "SUV",
    mileage: "50,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    status: "active",
    featured: false,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=350&fit=crop"
    ],
    description: "Reliable Subaru Outback with all-wheel drive. Excellent condition with full service history. Perfect for family adventures.",
    dealer: "Premium Auto Kenya",
    phone: "+254 756 789 012",
    rating: 4.5,
    features: ["AWD", "EyeSight", "Apple CarPlay", "Heated Seats", "Roof Rails", "Alloy Wheels"]
  }
]

const mockSubscribers = [
  {
    id: 1,
    email: 'john.doe@example.com',
    name: 'John Doe',
    location: 'Nairobi',
    subscribedAt: '2024-01-15',
    status: 'active'
  },
  {
    id: 2,
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    location: 'Nakuru',
    subscribedAt: '2024-01-12',
    status: 'active'
  },
  {
    id: 3,
    email: 'mike.wilson@example.com',
    name: 'Mike Wilson',
    location: 'Nyeri',
    subscribedAt: '2024-01-08',
    status: 'active'
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('cars')
  const [cars, setCars] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCarModal, setShowCarModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [carToDelete, setCarToDelete] = useState(null)
  const [selectedCar, setSelectedCar] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCarDetails, setShowCarDetails] = useState(false)
  const [selectedCarDetails, setSelectedCarDetails] = useState(null)
  const carsPerPage = 10

  // Initialize sample data
  useEffect(() => {
    setCars(mockCars)
    setSubscribers(mockSubscribers)
  }, [])

  // Filter cars based on the search term
  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.year.toString().includes(searchTerm) ||
    car.dealer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter subscribers based on the search term
  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.subscribedAt.includes(searchTerm)
  )

  // Pagination logic
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

  const handleAddCar = () => {
    setSelectedCar(null)
    setIsEditing(false)
    setShowCarModal(true)
  }

  const handleEditCar = (car) => {
    setSelectedCar(car)
    setIsEditing(true)
    setShowCarModal(true)
  }

  const handleDeleteClick = (car) => {
    setCarToDelete(car)
    setShowDeleteConfirm(true)
  }

  // Handle view car function
  const handleViewCar = (car) => {
    setSelectedCarDetails(car)
    setShowCarDetails(true)
  }

  const handleDeleteConfirm = () => {
    if (carToDelete) {
      setCars(cars.filter(car => car.id !== carToDelete.id))
      setShowDeleteConfirm(false)
      setCarToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setCarToDelete(null)
  }

  const handleSaveCar = (carData) => {
    if (isEditing && selectedCar) {
      setCars(cars.map(car => 
        car.id === selectedCar.id ? { ...car, ...carData } : car
      ))
    } else {
      const newCar = {
        id: Date.now(),
        ...carData,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        rating: 4.5,
        features: []
      }
      setCars([...cars, newCar])
    }
    setShowCarModal(false)
  }

  // Subscriber CRUD Operations
  const handleDeleteSubscriber = (subscriberId) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      setSubscribers(subscribers.filter(sub => sub.id !== subscriberId))
    }
  }

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FaTrash className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Car</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>"{carToDelete?.name}"</strong>? This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleDeleteCancel}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-200 font-medium"
            >
              Delete Car
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Car Modal Component
  const CarModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-2">
        <div className="p-4 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            {isEditing ? 'Edit Car' : 'Add New Car'}
          </h2>
          
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            const carData = {
              name: formData.get('name'),
              price: formData.get('price'),
              location: formData.get('location'),
              year: formData.get('year'),
              type: formData.get('type'),
              mileage: formData.get('mileage'),
              transmission: formData.get('transmission'),
              fuel: formData.get('fuel'),
              image: formData.get('image'),
              description: formData.get('description'),
              dealer: formData.get('dealer'),
              phone: formData.get('phone'),
              featured: formData.get('featured') === 'on'
            }
            handleSaveCar(carData)
          }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                    <FaCar className="text-blue-600 text-lg sm:text-xl" />
                    Car Model & Make
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    defaultValue={selectedCar?.name}
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                    placeholder="e.g., Toyota RAV4 2021"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                    <FaMoneyBillWave className="text-green-600 text-lg sm:text-xl" />
                    Price (KSh)
                  </label>
                  <input 
                    type="text" 
                    name="price"
                    defaultValue={selectedCar?.price}
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                    placeholder="e.g., 2,300,000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                    <FaMapMarkerAlt className="text-red-600 text-lg sm:text-xl" />
                    Location
                  </label>
                  <select 
                    name="location"
                    defaultValue={selectedCar?.location}
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                    required
                  >
                    <option value="">Select Location</option>
                    <option value="Nairobi">Nairobi</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Nyeri">Nyeri</option>
                    <option value="Muranga">Muranga</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Thika">Thika</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                    <FaCalendar className="text-blue-600 text-lg sm:text-xl" />
                    Year
                  </label>
                  <input 
                    type="number" 
                    name="year"
                    defaultValue={selectedCar?.year}
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                    placeholder="e.g., 2021"
                    min="1990"
                    max="2024"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                    <FaTachometerAlt className="text-blue-600 text-lg sm:text-xl" />
                    Mileage
                  </label>
                  <input 
                    type="text" 
                    name="mileage"
                    defaultValue={selectedCar?.mileage}
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                    placeholder="e.g., 45,000 km"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                    <FaCog className="text-blue-600 text-lg sm:text-xl" />
                    Transmission
                  </label>
                  <select 
                    name="transmission"
                    defaultValue={selectedCar?.transmission}
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                    required
                  >
                    <option value="">Select Transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                    <FaGasPump className="text-blue-600 text-lg sm:text-xl" />
                    Fuel Type
                  </label>
                  <select 
                    name="fuel"
                    defaultValue={selectedCar?.fuel}
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                    required
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                    <FaUser className="text-blue-600 text-lg sm:text-xl" />
                    Dealer Name
                  </label>
                  <input 
                    type="text" 
                    name="dealer"
                    defaultValue={selectedCar?.dealer}
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                    placeholder="e.g., Trust Auto Kenya"
                    required
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                  <FaCamera className="text-blue-600 text-lg sm:text-xl" />
                  Image URL
                </label>
                <input 
                  type="url" 
                  name="image"
                  defaultValue={selectedCar?.image}
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                  placeholder="https://example.com/car-image.jpg"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                  <FaStar className="text-blue-600 text-lg sm:text-xl" />
                  Description
                </label>
                <textarea 
                  name="description"
                  rows="4"
                  defaultValue={selectedCar?.description}
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                  placeholder="Enter car description..."
                  required
                ></textarea>
              </div>

              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    id="featured" 
                    name="featured"
                    defaultChecked={selectedCar?.featured}
                    className="rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5 sm:h-6 sm:w-6" 
                  />
                  <label htmlFor="featured" className="text-base sm:text-lg font-semibold text-gray-800">Featured Listing</label>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowCarModal(false)}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-semibold text-base sm:text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl sm:rounded-2xl hover:bg-blue-700 transition duration-200 font-semibold text-base sm:text-lg"
              >
                {isEditing ? 'Update Car' : 'Add Car'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  // Car Details Modal Component
  const CarDetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-2">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Car Details</h2>
            <button
              onClick={() => setShowCarDetails(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <FaTimes className="text-xl text-gray-500" />
            </button>
          </div>

          {/* Car Images */}
          <div className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="relative">
                <img 
                  src={selectedCarDetails?.image} 
                  alt={selectedCarDetails?.name}
                  className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg"
                />
                {selectedCarDetails?.featured && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                    <FaStar />
                    Featured
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {selectedCarDetails?.images?.slice(0, 4).map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`${selectedCarDetails?.name} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl shadow-md"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Car Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedCarDetails?.name}</h3>
                <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                  <FaMoneyBillWave className="text-green-600" />
                  KSh {selectedCarDetails?.price}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  Location & Dealer
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold">{selectedCarDetails?.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dealer:</span>
                    <span className="font-semibold">{selectedCarDetails?.dealer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold text-blue-600">{selectedCarDetails?.phone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaTachometerAlt className="text-blue-500" />
                  Specifications
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-gray-400" />
                    <span className="text-sm text-gray-600">Year:</span>
                    <span className="font-semibold">{selectedCarDetails?.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCar className="text-gray-400" />
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="font-semibold">{selectedCarDetails?.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCog className="text-gray-400" />
                    <span className="text-sm text-gray-600">Transmission:</span>
                    <span className="font-semibold">{selectedCarDetails?.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGasPump className="text-gray-400" />
                    <span className="text-sm text-gray-600">Fuel:</span>
                    <span className="font-semibold">{selectedCarDetails?.fuel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaStar className="text-amber-500" />
                  Rating & Status
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      <FaStar className="text-amber-500" />
                      <span className="font-semibold">{selectedCarDetails?.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedCarDetails?.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedCarDetails?.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-semibold">{selectedCarDetails?.mileage}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCarDetails?.features?.map((feature, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaCar className="text-gray-500" />
                  Description
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedCarDetails?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowCarDetails(false)}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition duration-200 font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowCarDetails(false)
                handleEditCar(selectedCarDetails)
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 font-semibold flex items-center gap-2"
            >
              <FaEdit />
              Edit Car
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Render CarSellInquiries when that tab is active
  if (activeTab === 'inquiries') {
    return (
      <DashboardLayout activePage="Sell Inquiries">
        <CarSellInquiries />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activePage="Dashboard">
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 bg-blue-600 text-white rounded-lg"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600">Manage your cars, subscribers, and sell inquiries</p>
      </div>

      {/* Tabs - Mobile Responsive */}
      <div className={`flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-gray-100 p-2 rounded-2xl mb-6 sm:mb-8 ${showMobileMenu ? 'block' : 'hidden sm:flex'}`}>
        <button
          onClick={() => {
            setActiveTab('cars')
            setShowMobileMenu(false)
          }}
          className={`flex items-center justify-center sm:justify-start space-x-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-2xl transition duration-200 text-base sm:text-lg font-semibold ${
            activeTab === 'cars' 
              ? 'bg-white text-blue-600 shadow-lg' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FaCar className="text-lg sm:text-xl" />
          <span>Cars ({cars.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('subscribers')
            setShowMobileMenu(false)
          }}
          className={`flex items-center justify-center sm:justify-start space-x-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-2xl transition duration-200 text-base sm:text-lg font-semibold ${
            activeTab === 'subscribers' 
              ? 'bg-white text-blue-600 shadow-lg' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FaUsers className="text-lg sm:text-xl" />
          <span>Subscribers ({subscribers.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('inquiries')
            setShowMobileMenu(false)
          }}
          className={`flex items-center justify-center sm:justify-start space-x-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-2xl transition duration-200 text-base sm:text-lg font-semibold ${
            activeTab === 'inquiries' 
              ? 'bg-white text-blue-600 shadow-lg' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FaList className="text-lg sm:text-xl" />
          <span>Sell Inquiries</span>
        </button>
      </div>

      {/* Search Bar - Mobile Responsive */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-center">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'cars' ? 'cars by name, location, type, year, or dealer' : 'subscribers by name, email, location, or date'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
              />
            </div>
          </div>
          {activeTab === 'cars' && (
            <button
              onClick={handleAddCar}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-blue-700 transition duration-200 shadow-lg font-semibold text-base sm:text-lg"
            >
              <FaPlus />
              <span>Add New Car</span>
            </button>
          )}
        </div>
      </div>

      {/* Cars Tab Content - Mobile Responsive */}
      {activeTab === 'cars' && (
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
              <div key={car.id} className="p-4 sm:p-6 hover:bg-blue-50 transition duration-200 group">
                {/* Mobile Layout */}
                <div className="lg:hidden space-y-4">
                  {/* Car Header */}
                  <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={car.image} 
                        alt={car.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-md"
                      />
                      {car.featured && (
                        <div className="absolute -top-1 -left-1">
                          <FaStar className="text-amber-500 text-sm sm:text-lg bg-white rounded-full p-0.5 shadow-md" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{car.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg sm:text-2xl font-bold text-blue-600">KSh {car.price}</span>
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
                        onClick={() => handleViewCar(car)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition duration-200"
                        title="View Details"
                      >
                        <FaEye className="text-lg" />
                      </button>
                      <button 
                        onClick={() => handleEditCar(car)}
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
                      onClick={() => handleViewCar(car)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition duration-200 group/btn"
                      title="View Details"
                    >
                      <FaEye className="text-lg group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button 
                      onClick={() => handleEditCar(car)}
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
            <div className="text-center py-12 sm:py-16">
              <FaCar className="text-4xl sm:text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">Try adjusting your search criteria or add a new car.</p>
              <button
                onClick={handleAddCar}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold shadow-lg flex items-center gap-2 mx-auto text-sm sm:text-base"
              >
                <FaPlus />
                Add Your First Car
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredCars.length > carsPerPage && (
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 space-y-3 sm:space-y-0">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 sm:px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition duration-200 flex items-center gap-2 text-sm sm:text-base ${
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
                className={`px-4 sm:px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition duration-200 flex items-center gap-2 text-sm sm:text-base ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Next <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Subscribers Tab Content - Mobile Responsive */}
      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-base sm:text-lg font-bold text-gray-800 uppercase tracking-wider">
                    Subscriber
                  </th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-base sm:text-lg font-bold text-gray-800 uppercase tracking-wider hidden sm:table-cell">
                    Location
                  </th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-base sm:text-lg font-bold text-gray-800 uppercase tracking-wider hidden lg:table-cell">
                    Subscribed
                  </th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-base sm:text-lg font-bold text-gray-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-base sm:text-lg font-bold text-gray-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                      <div>
                        <div className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <FaUser className="text-blue-600" />
                          {subscriber.name}
                        </div>
                        <div className="text-base sm:text-lg text-gray-600 flex items-center gap-2">
                          <FaEnvelope className="text-gray-400" />
                          {subscriber.email}
                        </div>
                        <div className="sm:hidden text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <FaMapMarkerAlt className="text-gray-400" />
                          {subscriber.location}
                        </div>
                        <div className="lg:hidden text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <FaCalendar className="text-gray-400" />
                          {subscriber.subscribedAt}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-base sm:text-lg text-gray-900 flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{subscriber.location}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap text-base sm:text-lg text-gray-600 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        {subscriber.subscribedAt}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm sm:text-base font-semibold ${
                        subscriber.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subscriber.status === 'active' ? <FaCheck className="mr-1 sm:mr-2" /> : <FaTimes className="mr-1 sm:mr-2" />}
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap text-base sm:text-lg font-medium">
                      <button 
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        className="text-red-600 hover:text-red-900 p-2 sm:p-3 hover:bg-red-50 rounded-xl transition duration-200"
                        title="Delete Subscriber"
                      >
                        <FaTrash className="text-lg sm:text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubscribers.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <FaUsers className="text-4xl sm:text-6xl lg:text-8xl text-gray-300 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No subscribers found</h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showCarModal && <CarModal />}
      {showDeleteConfirm && <DeleteConfirmationModal />}
      {showCarDetails && <CarDetailsModal />}
    </DashboardLayout>
  )
}