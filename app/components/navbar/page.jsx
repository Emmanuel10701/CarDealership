"use client"

import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-blue-600">Maina Cars</h1>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <a href="#home" className="text-gray-900 hover:text-blue-600 px-4 py-3 rounded-md text-lg font-semibold transition duration-300">
                Home
              </a>
              <a href="#about" className="text-gray-900 hover:text-blue-600 px-4 py-3 rounded-md text-lg font-semibold transition duration-300">
                About Us
              </a>
              <a href="#cars" className="text-gray-900 hover:text-blue-600 px-4 py-3 rounded-md text-lg font-semibold transition duration-300">
                Browse Cars
              </a>
              <a href="#contact" className="text-gray-900 hover:text-blue-600 px-4 py-3 rounded-md text-lg font-semibold transition duration-300">
                Contact
              </a>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-semibold shadow-lg hover:shadow-xl">
                Sell Your Car
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-gray-900 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 transition duration-300"
            >
              <svg className="h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 pt-3 pb-4 space-y-2">
              <a 
                href="#home" 
                className="text-gray-900 hover:text-blue-600 block px-4 py-4 rounded-md text-xl font-semibold border-b border-gray-100 transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
              <a 
                href="#about" 
                className="text-gray-900 hover:text-blue-600 block px-4 py-4 rounded-md text-xl font-semibold border-b border-gray-100 transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </a>
              <a 
                href="#cars" 
                className="text-gray-900 hover:text-blue-600 block px-4 py-4 rounded-md text-xl font-semibold border-b border-gray-100 transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                Browse Cars
              </a>
              <a 
                href="#contact" 
                className="text-gray-900 hover:text-blue-600 block px-4 py-4 rounded-md text-xl font-semibold border-b border-gray-100 transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>
              <button className="w-full bg-blue-600 text-white px-4 py-4 rounded-lg hover:bg-blue-700 transition duration-300 text-xl font-semibold mt-3 shadow-lg">
                Sell Your Car
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}