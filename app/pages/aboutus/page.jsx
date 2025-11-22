'use client'

import { FaCar, FaUsers, FaAward, FaMapMarkerAlt, FaShieldAlt, FaHeart, FaChartLine, FaHandshake, FaStar, FaCheck, FaRocket, FaGlobe, FaTrophy, FaSmile } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function About() {
  const stats = [
    { number: "2,500+", label: "Happy Customers", icon: FaUsers, color: "from-blue-500 to-cyan-500" },
    { number: "6", label: "Cities Covered", icon: FaMapMarkerAlt, color: "from-green-500 to-emerald-500" },
    { number: "98.7%", label: "Satisfaction Rate", icon: FaHeart, color: "from-pink-500 to-rose-500" },
    { number: "8+", label: "Years Experience", icon: FaAward, color: "from-purple-500 to-pink-500" }
  ]

  const values = [
    {
      icon: FaShieldAlt,
      title: "Quality First",
      description: "Every vehicle undergoes our exclusive 200-point inspection process to ensure absolute reliability and performance.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaHandshake,
      title: "Transparent Deals",
      description: "No hidden fees, complete pricing transparency, and comprehensive vehicle history reports for every car.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FaChartLine,
      title: "Best Value",
      description: "Competitive pricing with flexible financing options tailored to fit every budget and lifestyle.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaUsers,
      title: "Customer Focused",
      description: "24/7 premium support and comprehensive after-sales service ensuring your complete satisfaction.",
      color: "from-orange-500 to-red-500"
    }
  ]

  const team = [
    {
      name: "John Kamau",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "20+ years in automotive industry",
      expertise: ["Business Strategy", "Customer Relations", "Market Analysis"]
    },
    {
      name: "Sarah Wanjiku",
      role: "Head of Sales",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Expert in customer experience",
      expertise: ["Sales Management", "Client Relations", "Team Leadership"]
    },
    {
      name: "David Ochieng",
      role: "Chief Inspector",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Certified automotive engineer",
      expertise: ["Vehicle Diagnostics", "Quality Control", "Technical Training"]
    }
  ]

  const milestones = [
    { year: "2016", event: "Humble Beginnings", description: "Started with a single showroom in Nairobi", icon: FaRocket },
    { year: "2018", event: "First Expansion", description: "Opened branches in Nakuru and Nyeri", icon: FaGlobe },
    { year: "2020", event: "Digital Revolution", description: "Launched online platform serving 6 cities", icon: FaTrophy },
    { year: "2024", event: "Market Leader", description: "Became Central Kenya's most trusted dealer", icon: FaStar }
  ]

  const achievements = [
    { number: "500+", label: "5-Star Reviews", icon: FaStar },
    { number: "99%", label: "Inspection Pass Rate", icon: FaCheck },
    { number: "24/7", label: "Customer Support", icon: FaHeart },
    { number: "1Y", label: "Comprehensive Warranty", icon: FaShieldAlt }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Car Background Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        </div>

        {/* Animated Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500 rounded-full opacity-40 animate-pulse delay-700"></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-cyan-500 rounded-full opacity-50 animate-pulse delay-300"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-2xl text-base font-semibold border border-white/20 shadow-2xl mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <FaCar className="text-white text-sm" />
              </div>
              <span>Trusted Since 2016 • Central Kenya's Premier Dealer</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
              Driving 
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mt-2">Excellence Forward</span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-5xl mx-auto leading-relaxed font-light mb-12">
              For over 8 years, we've been revolutionizing car buying in Central Kenya with 
              uncompromising quality, transparent deals, and exceptional customer experiences.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center"
                >
                  <div className={`text-2xl lg:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                    {stat.number}
                  </div>
                  <div className="text-white/80 font-semibold text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            <div>
              <motion.h2 
                className="text-3xl lg:text-4xl xl:text-5xl font-black text-slate-800 mb-6 leading-tight"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Journey</span> of Excellence
              </motion.h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-base lg:text-lg">
                <p>
                  Founded in 2016 with a vision to transform the used car market in Central Kenya, 
                  we started as a small family-owned dealership with a simple promise: 
                  <span className="font-semibold text-slate-800"> quality, transparency, and trust.</span>
                </p>
                <p>
                  What began as a single showroom in Nairobi has evolved into Central Kenya's 
                  most trusted pre-owned vehicle marketplace, serving thousands of satisfied 
                  customers across 6 major cities.
                </p>
                <p>
                  Our success is built on a foundation of rigorous 200-point vehicle inspections, 
                  honest pricing, and a customer-first approach that puts your needs at the 
                  center of everything we do.
                </p>
              </div>

              {/* Achievements */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <achievement.icon className="text-white text-base" />
                    </div>
                    <div>
                      <div className="font-black text-slate-800 text-lg lg:text-xl">{achievement.number}</div>
                      <div className="text-slate-600 text-xs font-semibold">{achievement.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our modern dealership"
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-2xl">
                <div className="text-2xl lg:text-3xl font-black">8+ Years</div>
                <div className="text-sm font-semibold">of Trust & Excellence</div>
              </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-slate-800 text-center mb-12 leading-tight">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Milestones</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg text-center"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <milestone.icon className="text-white text-lg" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {milestone.year}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 text-lg">{milestone.event}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{milestone.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-slate-800 mb-4 leading-tight">
              Our Core <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              The principles that guide every decision we make and every car we sell
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <value.icon className="text-white text-xl" />
                </div>
                <h3 className="text-xl lg:text-2xl font-black text-slate-800 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm lg:text-base">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-slate-800 mb-4 leading-tight">
              Meet Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dream Team</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              The passionate experts dedicated to finding you the perfect vehicle
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg text-center"
              >
                <div className="relative mb-6">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-2xl mx-auto object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaCheck className="text-white text-xs" />
                  </div>
                </div>
                
                <h3 className="text-xl lg:text-2xl font-black text-slate-800 mb-1">{member.name}</h3>
                <div className="text-blue-600 font-bold mb-3 text-lg">{member.role}</div>
                <p className="text-slate-600 text-sm lg:text-base mb-4">{member.description}</p>
                
                <div className="border-t border-slate-200 pt-4">
                  <div className="text-xs font-semibold text-slate-500 mb-2">Expertise</div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-6 leading-tight">
              Ready to Find Your Perfect Car?
            </h2>
            <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their automotive needs. 
              Experience the difference today.
            </p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl flex items-center gap-3 mx-auto"
            >
              <FaCar className="text-lg" />
              Browse Our Collection
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}