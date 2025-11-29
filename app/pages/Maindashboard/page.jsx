"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner'; 
import { CircularProgress } from '@mui/material';

// Import components
import DashboardLayout from '../../components/dashboardlayout/page.jsx';
import BlogManagement from '../../components/blogmanagement/page';
import TeamManagement from '../../components/TeamManagement/page';
import SubscribersManagement from '../../components/subscriber/page';
import CarInquiries from '../../components/CarInquiry/page';
import CarModal from '../../components/carmodel/page';
import CarDetailsModal from '../../components/cardetail/page';
import CarsManagement from '../../components/CarsManagement/page';
import DashboardContent from '../../components/dashboard/page';
import ReviewsManagement from '../../components/review/page.jsx'; // Add this import

// Add this CSS to hide scrollbars globally for this component
const styles = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// API Service with JWT Authentication
const apiService = {
  // Get authentication token from localStorage
  getAuthToken() {
    const possibleTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
    for (const key of possibleTokenKeys) {
      const token = localStorage.getItem(key);
      if (token) {
        return token;
      }
    }
    return null;
  },

  // Check if token is valid
  isTokenValid(token) {
    if (!token) return false;
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return tokenPayload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  async getCarListings() {
    const token = this.getAuthToken();
    const response = await fetch('/api/cardeal', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch car listings' }));
      throw new Error(errorData.message || 'Failed to fetch car listings');
    }
    const data = await response.json();
    return data.carListings || [];
  },

  async createCarListing(formData) {
    const token = this.getAuthToken();
    const response = await fetch('/api/cardeal', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to create car listing' 
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  async updateCarListing(id, formData) {
    const token = this.getAuthToken();
    const response = await fetch(`/api/cardeal/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to update car listing' 
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  async deleteCarListing(id) { 
    const token = this.getAuthToken();
    const response = await fetch(`/api/cardeal/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to delete car listing' 
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  async getDashboardStats() {
    const cars = await this.getCarListings();
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCarModal, setShowCarModal] = useState(false);
  const [showCarDetails, setShowCarDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carToDelete, setCarToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      try {
        console.log('🔍 Checking localStorage for user data...');
        
        // Check ALL possible localStorage keys for user data
        const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
        const possibleTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
        
        let userData = null;
        let token = null;
        
        // Find user data in any possible key
        for (const key of possibleUserKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            console.log(`✅ Found user data in key: ${key}`, data);
            userData = data;
            break;
          }
        }
        
        // Find token in any possible key
        for (const key of possibleTokenKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            console.log(`✅ Found token in key: ${key}`);
            token = data;
            break;
          }
        }
        
        if (!userData || !apiService.isTokenValid(token)) {
          console.log('❌ No valid authentication found');
          setAuthError(true);
          // Clear all auth data
          possibleUserKeys.forEach(key => localStorage.removeItem(key));
          possibleTokenKeys.forEach(key => localStorage.removeItem(key));
          router.push('/pages/login');
          return;
        }

        // Parse user data
        const user = JSON.parse(userData);
        console.log('📋 Parsed user data:', user);
        
        // Check if user has valid role
        const userRole = user.role;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'TEACHER', 'PRINCIPAL', 'MANAGER', 'USER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          console.log('❌ User does not have valid role:', userRole);
          setAuthError(true);
          router.push('/pages/login');
          return;
        }

        console.log('✅ User authenticated successfully:', user.name);
        setUser(user);
        
      } catch (error) {
        console.error('❌ Error checking authentication:', error);
        setAuthError(true);
        // Clear all auth data on error
        localStorage.clear();
        router.push('/pages/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    // Clear ALL possible auth data
    const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
    const possibleTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
    
    possibleUserKeys.forEach(key => localStorage.removeItem(key));
    possibleTokenKeys.forEach(key => localStorage.removeItem(key));
    
    router.push('/pages/login');
  };

  // Enhanced car saving with toast notifications
  const handleSaveCar = async (formData) => {
    setGlobalLoading(true);
    try {
      // Check authentication before API call
      if (!apiService.getAuthToken()) {
        toast.error('Authentication required. Please log in again.');
        handleLogout();
        return;
      }

      if (isEditing && selectedCar) {
        await apiService.updateCarListing(selectedCar.id, formData);
        toast.success('Car updated successfully!');
      } else {
        await apiService.createCarListing(formData);
        toast.success('Car created successfully!');
      }
      
      setShowCarModal(false);
    } catch (error) {
      console.error('Error saving car:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        toast.error('Authentication failed. Please log in again.');
        handleLogout();
      } else {
        toast.error(`Failed to save car: ${error.message}`);
      }
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleAddCar = () => {
    setSelectedCar(null);
    setIsEditing(false);
    setShowCarModal(true);
  };

  const handleEditCar = (car) => {
    setSelectedCar(car);
    setIsEditing(true);
    setShowCarModal(true);
  };

  const handleViewCar = (car) => {
    setSelectedCar(car);
    setShowCarDetails(true);
  };

  const handleDeleteCar = (car) => {
    setCarToDelete({ ...car, type: 'Car' });
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (carToDelete) {
      setGlobalLoading(true);
      try {
        // Check authentication before API call
        if (!apiService.getAuthToken()) {
          toast.error('Authentication required. Please log in again.');
          handleLogout();
          return;
        }

        await apiService.deleteCarListing(carToDelete.id); 
        setShowDeleteConfirm(false);
        setCarToDelete(null);
        toast.success(`${carToDelete.type} deleted successfully!`);
      } catch (error) {
        console.error('Error deleting car:', error);
        if (error.message.includes('401') || error.message.includes('403')) {
          toast.error('Authentication failed. Please log in again.');
          handleLogout();
        } else {
          toast.error('Failed to delete car. Please try again.');
        }
      } finally {
        setGlobalLoading(false);
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-50 items-center justify-center">
        <div className="text-center">
          <CircularProgress size={40} className="text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show authentication error
  if (authError) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-50 items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access the admin dashboard</p>
          <button
            onClick={() => router.push('/pages/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If no user but loading is false, it means we're redirecting
  if (!user) {
    return null;
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
      );
    }

    switch (activeTab) {
      case 'cars':
        return (
          <CarsManagement
            onAddCar={handleAddCar}
            onEditCar={handleEditCar}
            onViewCar={handleViewCar}
            onDeleteCar={handleDeleteCar}
            user={user}
          />
        );
      case 'reviews':
        return <ReviewsManagement user={user} />;
      case 'blog':
        return <BlogManagement user={user} />;
      case 'subscribers':
        return <SubscribersManagement user={user} />;
      case 'inquiries':
        return <CarInquiries user={user} />;
      case 'admins':
        return <TeamManagement user={user} />;
      case 'dashboard':
      default:
        return <DashboardContent onAddCar={handleAddCar} setActiveTab={setActiveTab} user={user} />;
    }
  };

  return (
    <>
      {/* Add style tag to hide scrollbars */}
      <style jsx global>{styles}</style>
      
      <Toaster 
        position="top-right" 
        richColors
      />
      
      <DashboardLayout 
        activePage={activeTab} 
        onTabChange={setActiveTab} 
        className="no-scrollbar"
        user={user}
        onLogout={handleLogout}
      >
        <div className="no-scrollbar">
          {renderContent()}
        </div>

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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && carToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this {carToDelete.type.toLowerCase()}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={globalLoading}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-200 disabled:opacity-50"
                >
                  {globalLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}