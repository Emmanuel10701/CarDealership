// components/modals/CarDetailsModal.js
"use client"

import { 
  FaTimes, 
  FaStar, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaCar, 
  FaCog, 
  FaGasPump, 
  FaTachometerAlt, 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaPhone, 
  FaUser, 
  FaEdit 
} from 'react-icons/fa'

export default function CarDetailsModal({ 
  isOpen, 
  onClose, 
  car, 
  onEdit 
}) {
  if (!isOpen || !car) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-2">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Car Details</h2>
            <button
              onClick={onClose}
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
                  src={car?.image} 
                  alt={car?.name}
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                {car?.featured && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                    <FaStar />
                    Featured
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {car?.images?.slice(0, 4).map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`${car?.name} ${index + 1}`}
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">{car?.name}</h3>
                <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                  <FaMoneyBillWave className="text-green-600" />
                  KSh {car?.price}
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
                    <span className="font-semibold">{car?.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dealer:</span>
                    <span className="font-semibold">{car?.dealer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold text-blue-600">{car?.phone}</span>
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
                    <span className="font-semibold">{car?.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCar className="text-gray-400" />
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="font-semibold">{car?.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCog className="text-gray-400" />
                    <span className="text-sm text-gray-600">Transmission:</span>
                    <span className="font-semibold">{car?.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGasPump className="text-gray-400" />
                    <span className="text-sm text-gray-600">Fuel:</span>
                    <span className="font-semibold">{car?.fuel}</span>
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
                      <span className="font-semibold">{car?.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      car?.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {car?.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-semibold">{car?.mileage}</span>
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
                  {car?.features?.map((feature, index) => (
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
                  {car?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition duration-200 font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose()
                onEdit?.(car)
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
}