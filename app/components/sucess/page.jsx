"use client"

import { FaCheckCircle, FaCar, FaEnvelope, FaCreditCard, FaHeadset, FaExclamationTriangle, FaFire, FaRocket, FaStar } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function SuccessStep({ submissionResult, resetForm }) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)

  useEffect(() => {
    setShowCelebration(true)
    setShowFireworks(true)
    const celebrationTimer = setTimeout(() => setShowCelebration(false), 5000)
    const fireworksTimer = setTimeout(() => setShowFireworks(false), 8000)
    return () => {
      clearTimeout(celebrationTimer)
      clearTimeout(fireworksTimer)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8
      }
    }
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const confettiVariants = {
    initial: { y: -100, opacity: 1, rotate: 0 },
    animate: {
      y: 1000,
      opacity: 0,
      rotate: 360,
      transition: {
        duration: 3,
        ease: "easeOut"
      }
    }
  }

  const fireworkVariants = {
    initial: { scale: 0, opacity: 1 },
    explode: {
      scale: 4,
      opacity: 0,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    }
  }

  const starVariants = {
    initial: { scale: 0, rotate: 0 },
    pop: {
      scale: [0, 1.2, 1],
      rotate: 360,
      transition: {
        duration: 0.8,
        ease: "backOut"
      }
    }
  }

  const ConfettiParticle = ({ color, delay, x, emoji }) => (
    <motion.div
      className={`absolute top-0 text-2xl ${emoji ? '' : 'w-3 h-3 rounded-full'}`}
      style={{ left: `${x}%` }}
      variants={confettiVariants}
      initial="initial"
      animate="animate"
      transition={{ delay, duration: 2 + Math.random() * 2 }}
    >
      {emoji ? emoji : <div className={`w-full h-full rounded-full ${color}`} />}
    </motion.div>
  )

  const Firework = ({ x, y, delay }) => (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      variants={fireworkVariants}
      initial="initial"
      animate="explode"
      transition={{ delay }}
    >
      <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg" />
    </motion.div>
  )

  const FloatingStar = ({ x, y, delay, size }) => (
    <motion.div
      className="absolute text-yellow-400"
      style={{ left: `${x}%`, top: `${y}%`, fontSize: `${size}px` }}
      variants={starVariants}
      initial="initial"
      animate="pop"
      transition={{ delay }}
    >
      <FaStar />
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-8 px-4 overflow-hidden relative">
      {/* Enhanced Celebration Confetti */}
      <AnimatePresence>
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Traditional Confetti */}
            {[...Array(80)].map((_, i) => (
              <ConfettiParticle
                key={`confetti-${i}`}
                color={i % 4 === 0 ? 'bg-yellow-400' : i % 4 === 1 ? 'bg-pink-400' : i % 4 === 2 ? 'bg-blue-400' : 'bg-green-400'}
                delay={i * 0.03}
                x={Math.random() * 100}
              />
            ))}
            
            {/* Emoji Confetti */}
            {[...Array(30)].map((_, i) => (
              <ConfettiParticle
                key={`emoji-${i}`}
                emoji={i % 3 === 0 ? '🎉' : i % 3 === 1 ? '🎊' : '🚗'}
                delay={i * 0.1}
                x={Math.random() * 100}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Fireworks Display */}
      <AnimatePresence>
        {showFireworks && (
          <div className="absolute inset-0 pointer-events-none z-5">
            {[...Array(15)].map((_, i) => (
              <Firework
                key={`firework-${i}`}
                x={20 + Math.random() * 60}
                y={10 + Math.random() * 40}
                delay={i * 0.5}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Floating Stars */}
      <AnimatePresence>
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none z-15">
            {[...Array(20)].map((_, i) => (
              <FloatingStar
                key={`star-${i}`}
                x={Math.random() * 100}
                y={Math.random() * 100}
                delay={i * 0.2}
                size={12 + Math.random() * 20}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto relative z-20"
      >
        {/* ✅ DATABASE MAINTENANCE NOTICE */}
        {submissionResult.databaseSaved === false && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaExclamationTriangle className="text-yellow-600 text-2xl" />
              </motion.div>
              <div className="flex-1">
                <h4 className="text-yellow-800 font-bold text-lg mb-2">Database Maintenance Notice</h4>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  Your listing has been received and confirmation emails sent. 
                  The database is currently under maintenance. Your listing will be 
                  fully processed once the database is back online.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            variants={iconVariants}
            className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl relative"
          >
            <motion.div
              variants={pulseVariants}
              animate="pulse"
              className="absolute inset-0 rounded-full bg-emerald-400 opacity-30"
            />
            <FaCheckCircle className="text-white text-5xl relative z-10" />
            
            {/* Mini celebration around check icon */}
            <AnimatePresence>
              {showCelebration && (
                <>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-2 -right-2 text-yellow-400 text-2xl"
                  >
                    <FaStar />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute -bottom-2 -left-2 text-pink-400 text-2xl"
                  >
                    <FaRocket />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"
          >
            {submissionResult.databaseSaved === false ? 'Success!' : 'Congratulations!'}
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            {submissionResult.databaseSaved === false 
              ? 'Your vehicle listing has been received successfully!' 
              : 'Your elite vehicle listing has been published successfully'
            }
          </motion.p>

          {/* Reference Number */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 inline-block border border-emerald-200 shadow-lg mb-8"
          >
            <div className="text-sm text-gray-500 mb-2 font-semibold">Premium Listing ID</div>
            <div className="text-3xl font-black text-emerald-600 font-mono">{submissionResult.reference}</div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto"
          >
            {[
              { 
                number: submissionResult.databaseSaved === false ? "500+" : "1,000+", 
                label: "Premium Buyers", 
                color: "blue",
                icon: FaFire
              },
              { 
                number: "24h", 
                label: "Featured Listing", 
                color: "purple",
                icon: FaStar
              },
              { 
                number: submissionResult.databaseSaved === false ? "90%" : "95%", 
                label: "Success Rate", 
                color: "emerald",
                icon: FaCheckCircle
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { type: "spring", stiffness: 400 }
                }}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-${stat.color}-200 shadow-lg relative overflow-hidden`}
              >
                {/* Animated background effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 opacity-5`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <stat.icon className={`text-${stat.color}-500 text-2xl mx-auto mb-3`} />
                <div className={`text-2xl font-black text-${stat.color}-600 mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/60 mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-black text-gray-900 text-center mb-12"
          >
            What Happens Next?
          </motion.h2>
          
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: FaEnvelope,
                title: "Confirmation Email",
                description: "We've sent a confirmation email with your listing details"
              },
              {
                icon: FaCreditCard,
                title: "Premium Verification",
                description: submissionResult.databaseSaved === false 
                  ? "Your listing will be verified once database maintenance is complete"
                  : "Our team is verifying your elite listing for quality assurance"
              },
              {
                icon: FaCar,
                title: "Goes Live",
                description: submissionResult.databaseSaved === false 
                  ? "Your vehicle will be featured after database maintenance"
                  : "Your vehicle will be featured to thousands of premium buyers"
              },
              {
                icon: FaHeadset,
                title: "Dedicated Support",
                description: "Your account manager will contact you for premium support"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { type: "spring", stiffness: 400 }
                }}
                className="text-center group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl"
                >
                  <step.icon className="text-white text-2xl" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold"
                >
                  {index + 1}
                </motion.div>
                <h3 className="text-lg font-black text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="text-center space-y-4 md:space-y-0 md:space-x-6"
        >
          <motion.button 
            onClick={resetForm}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold text-base shadow-xl transition-all duration-300 inline-flex items-center gap-3"
          >
            <FaCar />
            List Another Vehicle
          </motion.button>
          <motion.button 
            onClick={() => window.location.href = '/cars'}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-600 text-white px-8 py-3 rounded-2xl font-bold text-base shadow-xl transition-all duration-300 inline-flex items-center gap-3"
          >
            Browse Inventory
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}