"use client"

import { useState, useEffect } from 'react'
import { 
  FaCar, 
  FaUsers, 
  FaList, 
  FaUserShield, 
  FaChartBar,
  FaMoneyBillWave,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaTrash,
  FaStar,
  FaSearch,
  FaChevronLeft,
  FaMapMarkerAlt,
  FaChevronRight,
  FaCheck,
  FaGasPump,
  FaCalendar,
  FaCog,
  FaPlus,
  FaBars,
  FaHome,
  FaUserCircle,
  FaTimes
} from 'react-icons/fa'

// Import other components
import SubscribersManagement from '../components/subscriber/page'
import CarInquiries from '../components/CarInquiry/page'
import CarModal from '../components/carmodel/page'
import CarDetailsModal from '../components/cardetail/page'
import DeleteConfirmationModal from '../components/deletemodel/page'

// Dashboard Layout Component
function DashboardLayout({ children, activePage, onTabChange }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'cars', label: 'Cars Management', icon: FaCar },
    { id: 'subscribers', label: 'Subscribers', icon: FaUsers },
    { id: 'inquiries', label: 'Car Inquiries', icon: FaList },
    { id: 'admins', label: 'Admins', icon: FaUserShield },
  ]

  const handleTabChange = (tabId) => {
    onTabChange(tabId)
    if (isMobile) {
      setShowMobileSidebar(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile Overlay */}
      {isMobile && showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : 'relative'}
        ${isMobile && !showMobileSidebar ? '-translate-x-full' : 'translate-x-0'}
        ${isSidebarOpen ? 'w-64' : isMobile ? 'w-64' : 'w-20'} 
        bg-white shadow-xl transition-all duration-300 flex flex-col
        lg:translate-x-0
      `}>
        {/* Logo and Close Button */}
        <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between">
          {isSidebarOpen || isMobile ? (
            <h1 className="text-xl lg:text-2xl font-bold text-blue-600">MainaCars Admin</h1>
          ) : (
            <div className="flex justify-center w-full">
              <FaCar className="text-xl lg:text-2xl text-blue-600" />
            </div>
          )}
          {isMobile && (
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <FaTimes className="text-lg text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activePage === item.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="text-lg lg:text-xl flex-shrink-0" />
                    {/* Always show labels on mobile, conditionally on desktop */}
                    {(isSidebarOpen || isMobile) && (
                      <span className="font-medium text-sm lg:text-base">{item.label}</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
            <FaUserCircle className="text-xl lg:text-2xl text-gray-600" />
            {/* Always show user info on mobile, conditionally on desktop */}
            {(isSidebarOpen || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm lg:text-base">Admin User</p>
                <p className="text-xs lg:text-sm text-gray-600 truncate">admin@autodealer.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <button
                onClick={() => isMobile ? setShowMobileSidebar(true) : setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition duration-200"
              >
                <FaBars className="text-lg lg:text-xl text-gray-600" />
              </button>
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 capitalize truncate">
                {activePage === 'dashboard' ? 'Admin Dashboard' : activePage.replace(/([A-Z])/g, ' $1').trim()}
              </h2>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition duration-200">
                <FaUserCircle className="text-lg lg:text-xl text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// Mock data for dashboard stats
const dashboardStats = {
  totalCars: 45,
  totalSubscribers: 128,
  pendingInquiries: 8,
  totalAdmins: 4,
  revenue: '2,340,000',
  featuredCars: 12
}

const recentActivities = [
  { id: 1, action: 'New car added', target: 'Toyota RAV4 2021', time: '2 hours ago', type: 'car' },
  { id: 2, action: 'Inquiry approved', target: 'Honda Civic 2020', time: '5 hours ago', type: 'inquiry' },
  { id: 3, action: 'New subscriber', target: 'john.doe@example.com', time: '1 day ago', type: 'subscriber' },
  { id: 4, action: 'Car updated', target: 'Mazda CX-5 2019', time: '1 day ago', type: 'car' }
]

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

// Cars Management Component
function CarsManagement({ onAddCar, onEditCar, onDeleteCar, onViewCar }) {
  const [cars, setCars] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    setCars(mockCars)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const carsPerPage = isMobile ? 5 : 10

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
      {/* Search and Add Button */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-stretch sm:items-center">
          <div className="flex-1 w-full">
            <div className="relative">
              <FaSearch className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base lg:text-xl" />
              <input
                type="text"
                placeholder={isMobile ? "Search cars..." : "Search cars by name, location, type, year, or dealer"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-lg"
              />
            </div>
          </div>
          <button
            onClick={onAddCar}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 lg:space-x-3 bg-blue-600 text-white px-4 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl hover:bg-blue-700 transition duration-200 shadow-lg font-semibold text-sm lg:text-lg"
          >
            <FaPlus className="text-sm lg:text-base" />
            <span>{isMobile ? 'Add Car' : 'Add New Car'}</span>
          </button>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Table Header - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:grid grid-cols-12 gap-4 lg:gap-6 px-4 lg:px-6 py-3 lg:py-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 text-sm">
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
            <div key={car.id} className="p-4 lg:p-6 hover:bg-blue-50 transition duration-200 group">
              {/* Mobile Layout */}
              <div className="lg:hidden space-y-3">
                {/* Car Header */}
                <div className="flex items-start space-x-3">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg lg:rounded-xl shadow-md"
                    />
                    {car.featured && (
                      <div className="absolute -top-1 -left-1">
                        <FaStar className="text-amber-500 text-sm lg:text-lg bg-white rounded-full p-0.5 shadow-md" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base lg:text-lg truncate">{car.name}</h3>
                    <div className="flex items-center space-x-1 lg:space-x-2 mt-1">
                      <span className="text-xl lg:text-2xl font-bold text-blue-600">KSh {car.price}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 text-xs lg:text-sm mt-1">
                      <FaCalendar className="text-gray-400 text-xs" />
                      <span>{car.year}</span>
                    </div>
                  </div>
                </div>

                {/* Status and Rating Row */}
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium ${
                    car.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <FaCheck className="mr-1 text-xs" />
                    {car.status}
                  </span>
                  <div className="bg-gray-100 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-bold text-gray-700">
                    {car.rating} ★
                  </div>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-2 text-xs lg:text-sm">
                  <div className="flex items-center space-x-1 lg:space-x-2 text-gray-600">
                    <FaCar className="text-gray-400 text-xs" />
                    <span className="truncate">{car.type}</span>
                  </div>
                  <div className="flex items-center space-x-1 lg:space-x-2 text-gray-600">
                    <FaCog className="text-gray-400 text-xs" />
                    <span className="truncate">{car.transmission}</span>
                  </div>
                  <div className="flex items-center space-x-1 lg:space-x-2 text-gray-600">
                    <FaGasPump className="text-gray-400 text-xs" />
                    <span className="truncate">{car.fuel}</span>
                  </div>
                  <div className="flex items-center space-x-1 lg:space-x-2 text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400 text-xs" />
                    <span className="truncate">{car.location}</span>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex flex-wrap gap-1">
                    {car.features?.slice(0, isMobile ? 2 : 3).map((feature, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded text-xs font-medium">
                        {feature}
                      </span>
                    ))}
                    {car.features && car.features.length > (isMobile ? 2 : 3) && (
                      <span className="bg-gray-100 text-gray-600 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded text-xs font-medium">
                        +{car.features.length - (isMobile ? 2 : 3)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dealer and Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-xs lg:text-sm text-gray-700 font-medium truncate flex-1 mr-2 lg:mr-4">
                    {car.dealer}
                  </span>
                  <div className="flex items-center space-x-1 lg:space-x-2">
                    <button 
                      onClick={() => onViewCar?.(car)}
                      className="p-1.5 lg:p-2 text-green-600 hover:bg-green-100 rounded-lg transition duration-200"
                      title="View Details"
                    >
                      <FaEye className="text-base lg:text-lg" />
                    </button>
                    <button 
                      onClick={() => onEditCar?.(car)}
                      className="p-1.5 lg:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition duration-200"
                      title="Edit Car"
                    >
                      <FaEdit className="text-base lg:text-lg" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(car)}
                      className="p-1.5 lg:p-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200"
                      title="Delete Car"
                    >
                      <FaTrash className="text-base lg:text-lg" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid grid-cols-12 gap-4 lg:gap-6 items-center">
                {/* Car Details */}
                <div className="col-span-2 flex items-center space-x-3 lg:space-x-4">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg lg:rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                    {car.featured && (
                      <div className="absolute -top-1 -left-1">
                        <FaStar className="text-amber-500 text-sm lg:text-lg bg-white rounded-full p-0.5 shadow-md" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-sm lg:text-base truncate">{car.name}</h3>
                    <div className="flex items-center space-x-1 lg:space-x-2 mt-1">
                      <span className="text-xl lg:text-2xl font-bold text-blue-600">KSh {car.price}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 text-xs lg:text-sm mt-1">
                      <FaCalendar className="text-gray-400" />
                      <span>{car.year}</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-1 flex items-center justify-center">
                  <span className={`inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium ${
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
                  <div className="bg-gray-100 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-bold text-gray-700">
                    {car.rating} ★
                  </div>
                </div>

                {/* Specifications */}
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-1 lg:gap-2 text-xs lg:text-sm">
                    <div className="flex items-center space-x-1 lg:space-x-2 text-gray-600">
                      <FaCar className="text-gray-400 text-xs" />
                      <span className="truncate">{car.type}</span>
                    </div>
                    <div className="flex items-center space-x-1 lg:space-x-2 text-gray-600">
                      <FaCog className="text-gray-400 text-xs" />
                      <span className="truncate">{car.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-1 lg:space-x-2 text-gray-600">
                      <FaGasPump className="text-gray-400 text-xs" />
                      <span className="truncate">{car.fuel}</span>
                    </div>
                    <div className="flex items-center space-x-1 lg:space-x-2 text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400 text-xs" />
                      <span className="truncate">{car.location}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {car.features?.slice(0, 2).map((feature, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded text-xs font-medium">
                        {feature}
                      </span>
                    ))}
                    {car.features && car.features.length > 2 && (
                      <span className="bg-gray-100 text-gray-600 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded text-xs font-medium">
                        +{car.features.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dealer */}
                <div className="col-span-2 flex items-center">
                  <span className="text-xs lg:text-sm text-gray-700 font-medium truncate">
                    {car.dealer}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-center space-x-1 lg:space-x-2">
                  <button 
                    onClick={() => onViewCar?.(car)}
                    className="p-1.5 lg:p-2 text-green-600 hover:bg-green-100 rounded-lg transition duration-200 group/btn"
                    title="View Details"
                  >
                    <FaEye className="text-base lg:text-lg group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => onEditCar?.(car)}
                    className="p-1.5 lg:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition duration-200 group/btn"
                    title="Edit Car"
                  >
                    <FaEdit className="text-base lg:text-lg group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(car)}
                    className="p-1.5 lg:p-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200 group/btn"
                    title="Delete Car"
                  >
                    <FaTrash className="text-base lg:text-lg group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {currentCars.length === 0 && (
          <div className="text-center py-8 lg:py-16">
            <FaCar className="text-4xl lg:text-6xl text-gray-300 mx-auto mb-3 lg:mb-4" />
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-600 text-sm lg:text-base mb-4 lg:mb-6">Try adjusting your search criteria or add a new car.</p>
            <button
              onClick={onAddCar}
              className="bg-blue-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold shadow-lg flex items-center gap-2 mx-auto text-sm lg:text-base"
            >
              <FaPlus />
              Add Your First Car
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredCars.length > carsPerPage && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 lg:px-6 py-3 lg:py-4 border-t border-gray-200 bg-gray-50 gap-3">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-3 lg:px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition duration-200 text-sm lg:text-base w-full sm:w-auto justify-center ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaChevronLeft /> Previous
            </button>
            <span className="text-sm font-medium text-gray-700 text-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-3 lg:px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition duration-200 text-sm lg:text-base w-full sm:w-auto justify-center ${
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

// Enhanced Dashboard Content Component
const DashboardContent = ({ onAddCar, setActiveTab }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 hover:shadow-xl transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Total Cars</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{dashboardStats.totalCars}</p>
            </div>
            <div className="p-2 lg:p-3 bg-blue-100 rounded-lg lg:rounded-xl">
              <FaCar className="text-blue-600 text-lg lg:text-2xl" />
            </div>
          </div>
          <div className="mt-3 lg:mt-4">
            <div className="flex items-center text-xs lg:text-sm text-green-600">
              <FaChartBar className="mr-1 text-xs" />
              <span>+12% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 hover:shadow-xl transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Subscribers</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{dashboardStats.totalSubscribers}</p>
            </div>
            <div className="p-2 lg:p-3 bg-green-100 rounded-lg lg:rounded-xl">
              <FaUsers className="text-green-600 text-lg lg:text-2xl" />
            </div>
          </div>
          <div className="mt-3 lg:mt-4">
            <div className="flex items-center text-xs lg:text-sm text-green-600">
              <FaChartBar className="mr-1 text-xs" />
              <span>+8% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 hover:shadow-xl transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Pending Inquiries</p>
              <p className="text-2xl lg:text-3xl font-bold text-yellow-600">{dashboardStats.pendingInquiries}</p>
            </div>
            <div className="p-2 lg:p-3 bg-yellow-100 rounded-lg lg:rounded-xl">
              <FaClock className="text-yellow-600 text-lg lg:text-2xl" />
            </div>
          </div>
          <div className="mt-3 lg:mt-4">
            <div className="flex items-center text-xs lg:text-sm text-red-600">
              <FaEye className="mr-1 text-xs" />
              <span>Needs attention</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 hover:shadow-xl transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl lg:text-3xl font-bold text-green-600">KSh {dashboardStats.revenue}</p>
            </div>
            <div className="p-2 lg:p-3 bg-purple-100 rounded-lg lg:rounded-xl">
              <FaMoneyBillWave className="text-purple-600 text-lg lg:text-2xl" />
            </div>
          </div>
          <div className="mt-3 lg:mt-4">
            <div className="flex items-center text-xs lg:text-sm text-green-600">
              <FaChartBar className="mr-1 text-xs" />
              <span>+15% from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-blue-600 text-base lg:text-lg" />
            Quick Actions
          </h3>
          <div className="space-y-2 lg:space-y-3">
            <button
              onClick={onAddCar}
              className="w-full flex items-center justify-between p-3 lg:p-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition duration-200"
            >
              <div className="flex items-center gap-2 lg:gap-3">
                <FaCar className="text-blue-600 text-base lg:text-xl" />
                <span className="font-semibold text-gray-900 text-sm lg:text-base">Add New Car</span>
              </div>
              <span className="text-blue-600 text-lg">+</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className="w-full flex items-center justify-between p-3 lg:p-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl hover:border-yellow-500 hover:bg-yellow-50 transition duration-200"
            >
              <div className="flex items-center gap-2 lg:gap-3">
                <FaList className="text-yellow-600 text-base lg:text-xl" />
                <span className="font-semibold text-gray-900 text-sm lg:text-base">Review Inquiries</span>
              </div>
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs lg:text-sm font-bold">
                {dashboardStats.pendingInquiries}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('admins')}
              className="w-full flex items-center justify-between p-3 lg:p-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition duration-200"
            >
              <div className="flex items-center gap-2 lg:gap-3">
                <FaUserShield className="text-purple-600 text-base lg:text-xl" />
                <span className="font-semibold text-gray-900 text-sm lg:text-base">Manage Admins</span>
              </div>
              <span className="text-purple-600 text-lg">→</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
            <FaClock className="text-gray-600 text-base lg:text-lg" />
            Recent Activity
          </h3>
          <div className="space-y-3 lg:space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-2 lg:p-3 border border-gray-100 rounded-lg lg:rounded-xl hover:bg-gray-50 transition duration-200">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className={`p-1.5 lg:p-2 rounded-lg ${
                    activity.type === 'car' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'inquiry' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'car' && <FaCar className="text-xs" />}
                    {activity.type === 'inquiry' && <FaList className="text-xs" />}
                    {activity.type === 'subscriber' && <FaUsers className="text-xs" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">{activity.action}</p>
                    <p className="text-xs lg:text-sm text-gray-600 truncate">{activity.target}</p>
                  </div>
                </div>
                <span className="text-xs lg:text-sm text-gray-500 whitespace-nowrap ml-2">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">System Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 lg:mb-3">
              <FaCar className="text-blue-600 text-lg lg:text-2xl" />
            </div>
            <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.featuredCars}</p>
            <p className="text-xs lg:text-sm text-gray-600">Featured Cars</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 lg:mb-3">
              <FaUsers className="text-green-600 text-lg lg:text-2xl" />
            </div>
            <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.totalAdmins}</p>
            <p className="text-xs lg:text-sm text-gray-600">Admin Users</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-yellow-100 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 lg:mb-3">
              <FaList className="text-yellow-600 text-lg lg:text-2xl" />
            </div>
            <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.pendingInquiries}</p>
            <p className="text-xs lg:text-sm text-gray-600">Pending Actions</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-100 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 lg:mb-3">
              <FaUserShield className="text-purple-600 text-lg lg:text-2xl" />
            </div>
            <p className="text-xl lg:text-2xl font-bold text-gray-900">24/7</p>
            <p className="text-xs lg:text-sm text-gray-600">System Status</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Admins Management Component
function AdminsManagement() {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8 text-center">
      <FaUserShield className="text-4xl lg:text-6xl text-gray-300 mx-auto mb-3 lg:mb-4" />
      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">Admins Management</h3>
      <p className="text-gray-600 text-sm lg:text-base">Admin management functionality will be implemented here.</p>
    </div>
  )
}

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showCarModal, setShowCarModal] = useState(false)
  const [showCarDetails, setShowCarDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [carToDelete, setCarToDelete] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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

  const handleViewCar = (car) => {
    setSelectedCar(car)
    setShowCarDetails(true)
  }

  const handleDeleteCar = (car) => {
    setCarToDelete({ ...car, type: 'Car' })
    setShowDeleteConfirm(true)
  }

  const handleSaveCar = (carData) => {
    console.log('Saving car:', carData)
    setShowCarModal(false)
  }

  const handleDeleteConfirm = () => {
    console.log('Deleting:', carToDelete)
    setShowDeleteConfirm(false)
    setCarToDelete(null)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'cars':
        return (
          <CarsManagement
            onAddCar={handleAddCar}
            onEditCar={handleEditCar}
            onViewCar={handleViewCar}
            onDeleteCar={handleDeleteCar}
          />
        )
      case 'subscribers':
        return <SubscribersManagement />
      case 'inquiries':
        return <CarInquiries />
      case 'admins':
        return <AdminsManagement />
      case 'dashboard':
      default:
        return <DashboardContent onAddCar={handleAddCar} setActiveTab={setActiveTab} />
    }
  }

  return (
    <DashboardLayout activePage={activeTab} onTabChange={setActiveTab}>
      {/* Dynamic Header Section */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2 capitalize">
          {activeTab === 'dashboard' ? 'Admin Dashboard' : activeTab.replace(/([A-Z])/g, ' $1').trim()}
        </h1>
        <p className="text-base lg:text-xl text-gray-600">
          {activeTab === 'dashboard' 
            ? 'Overview of your car dealership management system' 
            : `Manage your ${activeTab} efficiently`}
        </p>
      </div>

      {renderContent()}

      {/* Modals */}
      <CarModal
        isOpen={showCarModal}
        onClose={() => setShowCarModal(false)}
        onSave={handleSaveCar}
        selectedCar={selectedCar}
        isEditing={isEditing}
      />

      <CarDetailsModal
        isOpen={showCarDetails}
        onClose={() => setShowCarDetails(false)}
        car={selectedCar}
        onEdit={handleEditCar}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        item={carToDelete}
      />
    </DashboardLayout>
  )
}