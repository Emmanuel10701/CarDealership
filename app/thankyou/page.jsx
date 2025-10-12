"use client"

import { useEffect, useState } from 'react'
import { FaCheckCircle, FaCar, FaEnvelope, FaPhone, FaWhatsapp, FaShieldAlt, FaRocket  } from 'react-icons/fa'
import { useSearchParams } from 'next/navigation'

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const [referenceNumber, setReferenceNumber] = useState('')
  
  useEffect(() => {
    // Get reference number from URL parameters
    const ref = searchParams.get('ref') || `CAR${Date.now().toString().slice(-6)}`
    setReferenceNumber(ref)
  }, [searchParams])

  const steps = [
    {
      icon: FaEnvelope,
      title: "Confirmation Email",
      description: "We've sent a confirmation email with your listing details"
    },
    {
      icon: FaShieldAlt,
      title: "Under Review",
      description: "Our team is reviewing your listing for quality assurance"
    },
    {
      icon: FaCar,
      title: "Goes Live",
      description: "Your car will be visible to thousands of buyers within 24 hours"
    },
    {
      icon: FaPhone,
      title: "Receive Offers",
      description: "Get calls and messages from interested buyers"
    }
  ]

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* Success Header */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 mb-6">
            Thank You!
          </h1>
          
          <p className="text-2xl sm:text-3xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your car listing has been submitted successfully
          </p>

          {/* Reference Number */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 inline-block border border-green-200 shadow-lg">
            <div className="text-sm text-gray-500 mb-2">Reference Number</div>
            <div className="text-3xl font-black text-green-600">{referenceNumber}</div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/60 mb-16">
          <h2 className="text-4xl font-black text-gray-900 text-center mb-12">
            What Happens Next?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                  <step.icon className="text-white text-3xl" />
                </div>
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
            <FaEnvelope className="text-4xl mb-6" />
            <h3 className="text-2xl font-black mb-4">Check Your Email</h3>
            <p className="text-blue-100 text-lg mb-6">
              We've sent a confirmation email with your listing details and next steps.
            </p>
            <button 
              onClick={() => window.location.href = 'mailto:'}
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300"
            >
              Open Email
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
            <FaWhatsapp className="text-4xl mb-6" />
            <h3 className="text-2xl font-black mb-4">Need Help?</h3>
            <p className="text-green-100 text-lg mb-6">
              Our support team is here to help you with any questions.
            </p>
            <button 
              onClick={() => window.open('https://wa.me/254712345678', '_blank')}
              className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all duration-300"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/60">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-8">
            Tips for a Quick Sale
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaPhone className="text-blue-600 text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Be Responsive</h4>
                <p className="text-gray-600">Answer calls and messages promptly from interested buyers</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaCar className="text-green-600 text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Prepare Your Car</h4>
                <p className="text-gray-600">Clean your car and have all documents ready for test drives</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="text-purple-600 text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Safety First</h4>
                <p className="text-gray-600">Meet buyers in safe, public locations for test drives</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaRocket className="text-orange-600 text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Be Flexible</h4>
                <p className="text-gray-600">Consider reasonable offers and be open to negotiation</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button 
            onClick={() => window.location.href = '/cars'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 inline-flex items-center gap-3"
          >
            <FaCar />
            Browse Other Cars
          </button>
        </div>
      </div>
    </section>
  )
}