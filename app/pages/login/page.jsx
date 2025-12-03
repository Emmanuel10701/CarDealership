"use client"

import { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUserShield, FaShieldAlt } from 'react-icons/fa'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        console.log('🔍 Checking for existing authentication...');
        
        // Check ALL possible localStorage keys for user data and tokens
        const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
        const possibleTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
        
        let userData = null;
        let token = null;
        
        // Find user data in any possible key
        for (const key of possibleUserKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            console.log(`✅ Found user data in key: ${key}`);
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
        
        if (userData && token) {
          // Check if token is still valid
          try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (tokenPayload.exp > currentTime) {
              console.log('✅ Valid token found, redirecting to dashboard...');
              toast.info('Already logged in, redirecting...');
              setTimeout(() => {
                router.push('/pages/MainDashboard');
              }, 1000);
            } else {
              console.log('❌ Token expired, clearing auth data...');
              // Clear expired auth data
              possibleUserKeys.forEach(key => localStorage.removeItem(key));
              possibleTokenKeys.forEach(key => localStorage.removeItem(key));
            }
          } catch (tokenError) {
            console.log('⚠️ Token validation error, clearing auth data:', tokenError);
            // Clear invalid auth data
            possibleUserKeys.forEach(key => localStorage.removeItem(key));
            possibleTokenKeys.forEach(key => localStorage.removeItem(key));
          }
        }
      } catch (error) {
        console.error('Error checking existing auth:', error);
      }
    }

    checkExistingAuth();
  }, [router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true)

    try {
      console.log('🚀 Attempting login...');
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          password 
        }),
      })

      const data = await response.json()

      // Check if response is not OK first
      if (!response.ok) {
        let errorMessage = data.error || 'Login failed';
        
        if (response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (response.status === 404) {
          errorMessage = 'User account not found';
        } else if (response.status === 403) {
          errorMessage = 'Account is not active';
        }
        
        toast.error(errorMessage);
        return; // Return early instead of throwing error
      }

      // Then check if success is true
      if (data.success) {
        console.log('✅ Login successful, storing auth data...');
        
        // Store token and user data in multiple localStorage keys for compatibility
        const authData = {
          token: data.token,
          user: data.user,
          expiresAt: data.expiresAt || new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString() // 12 hours default
        };

        // Store in multiple keys for compatibility with different components
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('jwt_token', data.token);
        
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        // Store expiration
        localStorage.setItem('auth_expires_at', authData.expiresAt);
        
        console.log('📦 Auth data stored successfully:', {
          user: data.user.name,
          role: data.user.role,
          tokenLength: data.token.length
        });

        toast.success(`Welcome back, ${data.user.name}! Redirecting to dashboard...`);
        
        // Redirect to car management dashboard
        setTimeout(() => {
          router.push('/pages/MainDashboard');
        }, 1500);
      } else {
        // If response is OK but success is false
        toast.error(data.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    router.push('/pages/forgotpassword')
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f8fafc', // Fallback color
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
      
      <div className="w-full max-w-lg mx-auto relative z-10">
        {/* Modern Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-300/50 shadow-2xl p-10 space-y-8">
          {/* Header */}
          <div className="text-center">
<div className="flex flex-col items-center space-y-2 p-4">
  <img
    src="/lll.png"
    alt="CorporateSellers Logo"
    className="h-14 w-14 object-contain"
  />

  <h1 className="text-3xl font-bold text-gray-900">
    <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
      CorporateSellers
    </span>
  </h1>

  <h2 className="text-lg font-semibold text-gray-700 tracking-wide">
    Admin
  </h2>
</div>
            <p className="text-gray-600 text-base">
              Secure access to your management dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-base font-bold text-gray-800 mb-3">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 text-base border-2 border-gray-300 rounded-xl placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-base font-bold text-gray-800 mb-3">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 text-base border-2 border-gray-300 rounded-xl placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600 transition-colors text-lg" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600 transition-colors text-lg" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-3 block text-base font-medium text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <button
                onClick={handleForgotPassword}
                className="text-base cursor-pointer font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 font-bold text-base shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <CircularProgress size={20} style={{ color: 'white' }} />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="text-center pt-6 border-t border-gray-300/50">
            <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
              <FaShieldAlt className="text-green-500 shrink-0 text-lg" />
              <span className="font-medium">Secure admin access only. Unauthorized access is prohibited.</span>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 bg-white/80 backdrop-blur-sm rounded-lg py-3">
          <p className="text-gray-700 text-sm font-medium">
            © {new Date().getFullYear()} CorporateSellers. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}