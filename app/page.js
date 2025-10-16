'use client';
import { useState } from 'react';
import Navbar from './components/navbar/page';
import Footer from './components/footer/page';
import Hero from './components/hero/page';
import AboutUs from './components/about/page';
import CarListing from './components/carlisting/page';
import ContactUs from './components/contact/page';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => setIsChatOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <AboutUs />
        <CarListing />
        <ContactUs />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-green-500 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none"
          aria-label="Open Chat"
        >
          <FaWhatsapp className="text-3xl sm:text-4xl" />
        </button>
      </div>

      {/* Chat Popup */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-[22rem] sm:w-[24rem] max-w-[90%] bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8 z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 text-xl sm:text-2xl">
                Chat with Us 💬
              </h2>
              <button
                onClick={toggleChat}
                className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            {/* Message */}
            <p className="text-gray-700 text-base sm:text-lg mb-5 leading-relaxed">
              Hi there 👋 <br /> How can we help you today?
            </p>

            {/* WhatsApp Redirect */}
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-center text-lg sm:text-xl font-semibold transition-all duration-300 block"
            >
              Continue to WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
