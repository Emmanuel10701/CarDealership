"use client"

import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CircularProgress } from '@mui/material'

// Import components
import DashboardLayout from '../../components/dashboardlayout/page.jsx'
import BlogManagement from '../../components/blogmanagement/page'
import TeamManagement from '../../components/TeamManagement/page'
import SubscribersManagement from '../../components/subscriber/page'
import CarInquiries from '../../components/CarInquiry/page'
import CarModal from '../../components/carmodel/page'
import CarDetailsModal from '../../components/cardetail/page'
import DeleteConfirmationModal from '../../components/deletemodel/page'
import CarsManagement from '../../components/CarsManagement/page'
import DashboardContent from '../../components/dashboard/page'

// API Service
const apiService = {
  async getCarListings() {
    const response = await fetch('/api/cardeal')
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch car listings' }))
      throw new Error(errorData.message || 'Failed to fetch car listings')
    }
    const data = await response.json()
    return data.carListings || []
  },

  async createCarListing(formData) {
    const response = await fetch('/api/cardeal', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to create car listing' 
      }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  },

  async updateCarListing(id, formData) {
    const response = await fetch(`/api/cardeal/${id}`, {
      method: 'PUT',
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to update car listing' 
      }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  },

  async deleteCarListing(id) {
    const response = await fetch(`/api/cardeal/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to delete car listing' 
      }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  },

  async getDashboardStats() {
    const cars = await this.getCarListings()
    return {
      totalCars: cars.length,
      totalSubscribers: 128,
      pendingInquiries: 8,
      totalAdmins: 4,
      revenue: '2,340,000',
      featuredCars: cars.filter(car => car.featured).length
    }
  }
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
  const [globalLoading, setGlobalLoading] = useState(false)

  // Enhanced car saving with toast notifications
  const handleSaveCar = async (formData) => {
    setGlobalLoading(true)
    try {
      if (isEditing && selectedCar) {
        await apiService.updateCarListing(selectedCar.id, formData)
        toast.success('Car updated successfully!')
      } else {
        await apiService.createCarListing(formData)
        toast.success('Car created successfully!')
      }
      
      setShowCarModal(false)
    } catch (error) {
      console.error('Error saving car:', error)
      toast.error(`Failed to save car: ${error.message}`)
      throw error
    } finally {
      setGlobalLoading(false)
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

  const handleViewCar = (car) => {
    setSelectedCar(car)
    setShowCarDetails(true)
  }

  const handleDeleteCar = (car) => {
    setCarToDelete({ ...car, type: 'Car' })
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (carToDelete) {
      setGlobalLoading(true)
      try {
        await apiService.deleteCarListing(carToDelete.id)
        setShowDeleteConfirm(false)
        setCarToDelete(null)
        toast.success('Car deleted successfully!')
      } catch (error) {
        console.error('Error deleting car:', error)
        toast.error('Failed to delete car. Please try again.')
      } finally {
        setGlobalLoading(false)
      }
    }
  }

  // Render content based on active tab
  const renderContent = () => {
    if (globalLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <CircularProgress size={40} className="text-blue-600 mx-auto mb-4" />
            <span className="text-lg text-gray-600">Processing...</span>
          </div>
        </div>
      )
    }

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
      case 'blog':
        return <BlogManagement />
      case 'subscribers':
        return <SubscribersManagement />
      case 'inquiries':
        return <CarInquiries />
      case 'admins':
        return <TeamManagement />
      case 'dashboard':
      default:
        return <DashboardContent onAddCar={handleAddCar} setActiveTab={setActiveTab} />
    }
  }

  return (
    <>
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
        theme="light"
      />
      
      <DashboardLayout activePage={activeTab} onTabChange={setActiveTab}>
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
    </>
  )
}