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
  FaTimes
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
  },
  {
    id: 6,
    name: "Mercedes C-Class 2021",
    price: "4,200,000",
    location: "Nairobi",
    year: "2021",
    type: "Luxury",
    mileage: "30,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&h=350&fit=crop"
    ],
    description: "Luxury Mercedes C-Class with all premium features. Imported from UK. Full service history and excellent condition.",
    dealer: "Elite Motors",
    phone: "+254 767 890 123",
    rating: 4.8,
    features: ["Leather", "Panoramic Roof", "Premium Sound", "Navigation", "Heated Seats", "LED Lights"]
  },
  {
    id: 7,
    name: "Nissan X-Trail 2018",
    price: "1,900,000",
    location: "Kiambu",
    year: "2018",
    type: "SUV",
    mileage: "80,000 km",
    transmission: "CVT",
    fuel: "Petrol",
    status: "active",
    featured: false,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=350&fit=crop"
    ],
    description: "Spacious Nissan X-Trail perfect for large families. Well maintained with comprehensive service records. 7-seater configuration.",
    dealer: "Kiambu Auto Center",
    phone: "+254 778 901 234",
    rating: 4.4,
    features: ["7 Seater", "360 Camera", "Bose Sound", "Climate Control", "Roof Rails", "Alloy Wheels"]
  },
  {
    id: 8,
    name: "Toyota Premio 2019",
    price: "1,600,000",
    location: "Muranga",
    year: "2019",
    type: "Sedan",
    mileage: "65,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    status: "active",
    featured: false,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&h=350&fit=crop"
    ],
    description: "Popular Toyota Premio known for reliability and comfort. Fuel efficient and low maintenance costs. Perfect for daily commuting.",
    dealer: "Muranga Motors",
    phone: "+254 789 012 345",
    rating: 4.7,
    features: ["Fuel Efficient", "Comfortable", "Reliable", "Low Maintenance", "AC", "Power Windows"]
  },
  {
    id: 9,
    name: "Mitsubishi Pajero 2017",
    price: "2,400,000",
    location: "Nakuru",
    year: "2017",
    type: "SUV",
    mileage: "95,000 km",
    transmission: "Automatic",
    fuel: "Diesel",
    status: "active",
    featured: false,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&h=350&fit=crop"
    ],
    description: "Rugged Mitsubishi Pajero ready for any adventure. Well maintained with off-road capabilities. 7-seater with ample space.",
    dealer: "Rift Valley Autos",
    phone: "+254 790 123 456",
    rating: 4.3,
    features: ["4WD", "Off-road", "7 Seater", "Roof Rails", "Alloy Wheels", "Tow Package"]
  },
  {
    id: 10,
    name: "BMW X5 2020",
    price: "5,800,000",
    location: "Nairobi",
    year: "2020",
    type: "Luxury",
    mileage: "35,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=350&fit=crop"
    ],
    description: "Luxury BMW X5 with all premium features. German engineering at its best. Full service history and excellent condition.",
    dealer: "Bavarian Motors",
    phone: "+254 701 234 567",
    rating: 4.9,
    features: ["M Sport", "Heads-up Display", "Premium Package", "Park Assist", "Panoramic Roof", "Leather Seats"]
  },
  {
    id: 11,
    name: "Toyota Corolla 2021",
    price: "1,750,000",
    location: "Nyeri",
    year: "2021",
    type: "Sedan",
    mileage: "40,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    status: "active",
    featured: false,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=350&fit=crop"
    ],
    description: "Reliable Toyota Corolla with excellent fuel efficiency. Low mileage and well maintained. Perfect for daily commuting.",
    dealer: "Central Car Dealers",
    phone: "+254 702 345 678",
    rating: 4.6,
    features: ["Fuel Efficient", "Touchscreen", "Climate Control", "Safety Sense", "Keyless Entry", "Rear Camera"]
  },
  {
    id: 12,
    name: "Land Rover Discovery 2018",
    price: "4,500,000",
    location: "Nairobi",
    year: "2018",
    type: "SUV",
    mileage: "70,000 km",
    transmission: "Automatic",
    fuel: "Diesel",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=350&fit=crop"
    ],
    description: "Luxury Land Rover Discovery with premium features. Excellent off-road capabilities with luxurious interior. 7-seater configuration.",
    dealer: "Premium Auto Kenya",
    phone: "+254 703 456 789",
    rating: 4.7,
    features: ["4WD", "7 Seater", "Panoramic Roof", "Leather Seats", "Premium Sound", "Terrain Response"]
  },
  {
    id: 13,
    name: "Volkswagen Golf 2020",
    price: "1,950,000",
    location: "Thika",
    year: "2020",
    type: "Hatchback",
    mileage: "45,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    status: "active",
    featured: false,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=350&fit=crop"
    ],
    description: "Sporty Volkswagen Golf with excellent handling and fuel efficiency. Well maintained with full service history.",
    dealer: "Thika Auto Hub",
    phone: "+254 704 567 890",
    rating: 4.5,
    features: ["Sport Package", "Touchscreen", "Climate Control", "Alloy Wheels", "LED Lights", "Parking Sensors"]
  },
  {
    id: 14,
    name: "Isuzu D-Max 2021",
    price: "2,900,000",
    location: "Kiambu",
    year: "2021",
    type: "Pickup",
    mileage: "35,000 km",
    transmission: "Manual",
    fuel: "Diesel",
    status: "active",
    featured: false,
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=500&h=350&fit=crop"
    ],
    description: "Rugged Isuzu D-Max perfect for both work and personal use. Excellent towing capacity and fuel efficiency.",
    dealer: "Kiambu Auto Center",
    phone: "+254 705 678 901",
    rating: 4.6,
    features: ["4x4", "Double Cab", "Tow Package", "Alloy Wheels", "Touchscreen", "Reverse Camera"]
  },
  {
    id: 15,
    name: "Lexus RX 2019",
    price: "4,800,000",
    location: "Nairobi",
    year: "2019",
    type: "Luxury",
    mileage: "55,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&h=350&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&h=350&fit=crop"
    ],
    description: "Luxury Lexus RX with premium features and excellent reliability. Smooth ride with all the modern amenities.",
    dealer: "Elite Motors",
    phone: "+254 706 789 012",
    rating: 4.8,
    features: ["Premium Package", "Mark Levinson Sound", "Panoramic Roof", "Heated Seats", "Navigation", "Safety System+"]
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
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FaTrash className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Car</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>"{carToDelete?.name}"</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
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
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Car Name</label>
                  <input 
                    type="text" 
                    name="name"
                    defaultValue={selectedCar?.name}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="e.g., Toyota RAV4 2021"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Price (KSh)</label>
                  <input 
                    type="text" 
                    name="price"
                    defaultValue={selectedCar?.price}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="e.g., 2,300,000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Location</label>
                  <select 
                    name="location"
                    defaultValue={selectedCar?.location}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
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
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Year</label>
                  <input 
                    type="number" 
                    name="year"
                    defaultValue={selectedCar?.year}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="e.g., 2021"
                    min="1990"
                    max="2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Car Type</label>
                  <select 
                    name="type"
                    defaultValue={selectedCar?.type}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Van">Van</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Mileage</label>
                  <input 
                    type="text" 
                    name="mileage"
                    defaultValue={selectedCar?.mileage}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="e.g., 45,000 km"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Transmission</label>
                  <select 
                    name="transmission"
                    defaultValue={selectedCar?.transmission}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    required
                  >
                    <option value="">Select Transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Fuel Type</label>
                  <select 
                    name="fuel"
                    defaultValue={selectedCar?.fuel}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
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
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Dealer Name</label>
                  <input 
                    type="text" 
                    name="dealer"
                    defaultValue={selectedCar?.dealer}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="e.g., Trust Auto Kenya"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    defaultValue={selectedCar?.phone}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="e.g., +254 712 345 678"
                    required
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-lg font-semibold text-gray-800 mb-3">Image URL</label>
                <input 
                  type="url" 
                  name="image"
                  defaultValue={selectedCar?.image}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="https://example.com/car-image.jpg"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-lg font-semibold text-gray-800 mb-3">Description</label>
                <textarea 
                  name="description"
                  rows="4"
                  defaultValue={selectedCar?.description}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
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
                    className="rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500 h-6 w-6" 
                  />
                  <label htmlFor="featured" className="text-lg font-semibold text-gray-800">Featured Listing</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowCarModal(false)}
                className="px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition duration-200 font-semibold text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition duration-200 font-semibold text-lg"
              >
                {isEditing ? 'Update Car' : 'Add Car'}
              </button>
            </div>
          </form>
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
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-xl text-gray-600">Manage your cars, subscribers, and sell inquiries</p>
      </div>

      {/* Tabs - Updated with Inquiries Tab */}
      <div className="flex space-x-2 bg-gray-100 p-2 rounded-2xl mb-8">
        <button
          onClick={() => setActiveTab('cars')}
          className={`flex items-center space-x-3 px-8 py-4 rounded-2xl transition duration-200 text-lg font-semibold ${
            activeTab === 'cars' 
              ? 'bg-white text-blue-600 shadow-lg' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FaCar className="text-xl" />
          <span>Cars ({cars.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`flex items-center space-x-3 px-8 py-4 rounded-2xl transition duration-200 text-lg font-semibold ${
            activeTab === 'subscribers' 
              ? 'bg-white text-blue-600 shadow-lg' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FaUsers className="text-xl" />
          <span>Subscribers ({subscribers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center space-x-3 px-8 py-4 rounded-2xl transition duration-200 text-lg font-semibold ${
            activeTab === 'inquiries' 
              ? 'bg-white text-blue-600 shadow-lg' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FaList className="text-xl" />
          <span>Sell Inquiries</span>
        </button>
      </div>

      {/* Search Bar - Modernized and Compact */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
                type="text"
                placeholder={`Search ${activeTab === 'cars' ? 'cars by name, location, type, year, or dealer' : 'subscribers by name, email, location, or date'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
            </div>
          </div>
          {activeTab === 'cars' && (
            <button
              onClick={handleAddCar}
              className="flex items-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition duration-200 shadow-lg font-semibold text-lg"
            >
              <FaPlus />
              <span>Add New Car</span>
            </button>
          )}
        </div>
      </div>

      {/* Cars Tab Content */}
      {activeTab === 'cars' && (
        <div>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
            {currentCars.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition duration-300">
                <div className="relative">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-60 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {car.featured && (
                      <span className="bg-amber-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                        <FaStar className="inline mr-1" />
                        Featured
                      </span>
                    )}
                    <span className={`px-3 py-2 rounded-full text-sm font-bold shadow-lg ${
                      car.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}>
                      {car.status}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full text-sm font-bold">
                    {car.rating} ★
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{car.name}</h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-blue-600">KSh {car.price}</span>
                    <span className="text-lg text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">{car.year}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400 text-lg" />
                      <span className="font-medium">{car.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaCar className="text-gray-400 text-lg" />
                      <span className="font-medium">{car.type}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaCog className="text-gray-400 text-lg" />
                      <span className="font-medium">{car.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaGasPump className="text-gray-400 text-lg" />
                      <span className="font-medium">{car.fuel}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{car.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      <span className="font-semibold">{car.dealer}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleEditCar(car)}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition duration-200"
                        title="Edit Car"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(car)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition duration-200"
                        title="Delete Car"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {currentCars.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
                <FaCar className="text-8xl text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No cars found</h3>
                <p className="text-gray-600 text-lg mb-6">Try adjusting your search criteria or add a new car.</p>
                <button
                  onClick={handleAddCar}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition duration-200 font-semibold text-lg shadow-lg"
                >
                  Add Your First Car
                </button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredCars.length > carsPerPage && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaChevronLeft /> Previous
              </button>
              <span className="text-lg font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Next <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Subscribers Tab Content */}
      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">
                    Subscriber
                  </th>
                  <th className="px-8 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-8 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="px-8 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{subscriber.name}</div>
                        <div className="text-lg text-gray-600">{subscriber.email}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-lg text-gray-900 flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{subscriber.location}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-lg text-gray-600">
                      {subscriber.subscribedAt}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${
                        subscriber.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subscriber.status === 'active' ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />}
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-lg font-medium">
                      <button 
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        className="text-red-600 hover:text-red-900 p-3 hover:bg-red-50 rounded-xl transition duration-200"
                        title="Delete Subscriber"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubscribers.length === 0 && (
            <div className="text-center py-16">
              <FaUsers className="text-8xl text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No subscribers found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showCarModal && <CarModal />}
      {showDeleteConfirm && <DeleteConfirmationModal />}
    </DashboardLayout>
  )
}