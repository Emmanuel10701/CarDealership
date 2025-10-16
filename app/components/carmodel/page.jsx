// components/modals/CarModal.js
"use client"

import { 
  FaCar, 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaTachometerAlt, 
  FaCog, 
  FaGasPump, 
  FaUser, 
  FaCamera, 
  FaStar,
  FaTimes
} from 'react-icons/fa'

export default function CarModal({ 
  isOpen, 
  onClose, 
  onSave, 
  selectedCar, 
  isEditing 
}) {
  if (!isOpen) return null

  const handleSubmit = (e) => {
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
    onSave(carData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-2">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Car' : 'Add New Car'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <FaTimes className="text-xl text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className=" text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaCar className="text-blue-600 text-xl" />
                    Car Model & Make
                  </label>
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
                  <label className=" text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaMoneyBillWave className="text-green-600 text-xl" />
                    Price (KSh)
                  </label>
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
                  <label className=" text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaMapMarkerAlt className="text-red-600 text-xl" />
                    Location
                  </label>
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
                  <label className=" text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaCalendar className="text-blue-600 text-xl" />
                    Year
                  </label>
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
              </div>

              <div className="space-y-6">
                <div>
                  <label className=" text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaTachometerAlt className="text-blue-600 text-xl" />
                    Mileage
                  </label>
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
                  <label className=" text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaCog className="text-blue-600 text-xl" />
                    Transmission
                  </label>
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
                  <label className=" text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaGasPump className="text-blue-600 text-xl" />
                    Fuel Type
                  </label>
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
                  <label className=" text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <FaUser className="text-blue-600 text-xl" />
                    Dealer Name
                  </label>
                  <input 
                    type="text" 
                    name="dealer"
                    defaultValue={selectedCar?.dealer}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="e.g., Trust Auto Kenya"
                    required
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className=" text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                  <FaCamera className="text-blue-600 text-xl" />
                  Image URL
                </label>
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
                <label className=" text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                  <FaStar className="text-blue-600 text-xl" />
                  Description
                </label>
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
                onClick={onClose}
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
}