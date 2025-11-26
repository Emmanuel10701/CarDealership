"use client"
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaCar, 
  FaEnvelope, 
  FaCreditCard, 
  FaHeadset,
  FaStar,
  FaUsers,
  FaChartLine
} from 'react-icons/fa';

// Mock data and functions to make the component runnable
const mockSubmissionResult = {
  reference: "ELITE-92048",
};

const mockResetForm = () => {
  console.log("Form reset initiated.");
  // In a real application, this would navigate the user or reset form state.
};

const App = () => {
  const submissionResult = mockSubmissionResult;
  const resetForm = mockResetForm;

  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Start the celebration shortly after mount
    setShowCelebration(true);
    // Celebration lasts for 20 seconds (20,000ms) - fulfilling the user's request for 10-20 seconds show time.
    const timer = setTimeout(() => setShowCelebration(false), 20000);
    return () => clearTimeout(timer);
  }, []);

  // --- Framer Motion Variants ---

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

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
  };

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
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // --- Celebration Components ---

  /**
   * Component that simulates a large, long-lasting firework explosion from a high position.
   * Particles spread out, fade slowly, and fall away.
   */
  const FireworkExplosion = ({ delay, x, color }) => {
    const [show, setShow] = useState(false);
    const particleCount = 80; // Increased particle count
    const duration = 4; // Particle animation duration increased for a "long effect"

    useEffect(() => {
      let startTimer, endTimer;

      // Wait for the random delay, then show the explosion
      startTimer = setTimeout(() => setShow(true), delay * 1000);
      
      // Hide it after the animation is complete to clean up DOM
      endTimer = setTimeout(() => setShow(false), (delay * 1000) + (duration * 1000) + 200); 

      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }, [delay]);

    if (!show) return null;

    return (
      <div
        className="absolute pointer-events-none"
        style={{ left: `${x}%`, top: `10%`, transform: 'translateX(-50%)' }} // Fixed high-up position
      >
        <AnimatePresence>
          {[...Array(particleCount)].map((_, i) => { 
            const angle = (i * 2 * Math.PI) / particleCount;
            const distance = 80 + Math.random() * 120; // Increased spread distance
            const particleSize = 2 + Math.random() * 2; // Size 2px-4px, more visible

            return (
              <motion.div
                key={i}
                // Removed blur-sm for sharper, more visible particles
                className={`absolute rounded-full ${color}`} 
                style={{ width: `${particleSize}px`, height: `${particleSize}px` }} // Dynamic size
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  // Adjusted opacity: quick flash, sustained visibility (1), then fade (0) over 4s
                  opacity: [0.8, 1, 1, 0], 
                  scale: [1, 1, 0.5], 
                  x: Math.cos(angle) * distance,
                  // Spread vertically and increased gravity pull
                  y: Math.sin(angle) * distance + (Math.random() * 150), 
                }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                transition={{
                  duration: duration,
                  delay: (i / particleCount) * 0.4, // Stagger particle launch slightly for burst effect
                  ease: "easeOut"
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-8 px-4 overflow-hidden relative font-sans">
      
      {/* Firework Celebration Effects (Top-down) */}
      <AnimatePresence>
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            
            {/* 120 firework launches for an intense, continuous 20-second show */}
            {[...Array(120)].map((_, i) => ( 
              <FireworkExplosion
                // Using Date.now() in the key ensures the component re-renders and restarts the animation
                key={`explosion-${i}-${Math.floor(Date.now() / 3000)}`} 
                color={i % 4 === 0 ? 'bg-yellow-400' : 
                      i % 4 === 1 ? 'bg-pink-400' : 
                      i % 4 === 2 ? 'bg-blue-400' : 'bg-purple-400'}
                // Staggered, fast, and randomized launch delays (0.15s stagger + 0.5s random)
                delay={i * 0.15 + Math.random() * 0.5} 
                x={Math.random() * 90 + 5} // Spreads across 90% of screen
              />
            ))}
            
            {/* Background Pulse Effect - Subtle color shift */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 via-pink-200/20 to-blue-200/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          </div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          {/* Success Icon */}
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
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600"
          >
            Congratulations!
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Your elite vehicle listing has been published successfully
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
              { number: "1,000+", label: "Premium Buyers", color: "blue", icon: FaUsers },
              { number: "24h", label: "Featured Listing", color: "purple", icon: FaStar },
              { number: "95%", label: "Success Rate", color: "emerald", icon: FaChartLine }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { type: "spring", stiffness: 400 }
                }}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-${stat.color}-200 shadow-lg`}
              >
                <div className={`text-2xl font-black text-${stat.color}-600 mb-2 flex items-center justify-center gap-2`}>
                  <stat.icon className={`text-${stat.color}-500`} />
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
                description: "Our team is verifying your elite listing for quality assurance"
              },
              {
                icon: FaCar,
                title: "Goes Live",
                description: "Your vehicle will be featured to thousands of premium buyers"
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
            className=" cursor-pointer border border-transparent hover:border-black hover:border-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold text-base shadow-xl transition-all duration-300 inline-flex items-center gap-3"
          >
            <FaCar className="w-5 h-5"/>
            List Another Vehicle
          </motion.button>
          <motion.button 
            onClick={() => window.location.href = '/carlisting'}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-600 text-white  cursor-pointer border border-transparent hover:border-black hover:border-2 px-8 py-3 rounded-2xl font-bold text-base shadow-xl transition-all duration-300 inline-flex items-center gap-3"
          >
            Browse Inventory
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;