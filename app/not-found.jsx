"use client"
import Link from 'next/link'
import { FaCar, FaHome, FaArrowLeft } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-300 opacity-50">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaCar className="text-6xl text-red-500 animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-200">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaCar className="text-3xl text-red-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>

          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you're looking for seems to have taken a wrong turn.
          </p>
          <p className="text-gray-500 mb-8">
            Don't worry, even the best drivers sometimes get lost. Let's get you back on track!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaHome />
              <span>Go Home</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition duration-300"
            >
              <FaArrowLeft />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}