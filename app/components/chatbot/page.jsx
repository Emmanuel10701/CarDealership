'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiHome, FiFileText, FiDollarSign, FiBook, FiRefreshCw, 
  FiUsers, FiActivity, FiHelpCircle, FiX, FiTrash2, FiMessageCircle, FiSearch, FiCalendar, FiCreditCard, FiStar
} from 'react-icons/fi';
import Image from 'next/image';

// Import Material Design icons directly to avoid barrel optimization issues
import { MdMessage } from 'react-icons/md';
import { MdDirectionsCar } from 'react-icons/md';
import { MdSecurity } from 'react-icons/md';
import { MdCorporateFare } from 'react-icons/md';
import { MdCarRental } from 'react-icons/md';
import { MdAssessment } from 'react-icons/md';
import { MdSupportAgent } from 'react-icons/md';
import { MdBusinessCenter } from 'react-icons/md';

const iconMap = {
  'home': FiHome, 'file': FiFileText, 'dollar': FiDollarSign, 'book': FiBook,
  'refresh': FiRefreshCw, 'users': FiUsers, 'activity': FiActivity, 
  'help': FiHelpCircle, 'close': FiX, 'trash': FiTrash2, 'message': FiMessageCircle,
  'car': FiStar, 'search': FiSearch, 'calendar': FiCalendar, 'credit-card': FiCreditCard,
  'star': FiStar, 'colored-message': MdMessage, 'directions-car': MdDirectionsCar,
  'security': MdSecurity, 'corporate': MdCorporateFare, 'car-rental': MdCarRental,
  'assessment': MdAssessment, 'support': MdSupportAgent, 'business': MdBusinessCenter
};

const SafeIcon = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || FiHelpCircle;
  return <IconComponent {...props} />;
};

// Format message content to handle markdown-like syntax
const formatMessage = (content) => {
  return content
    .split('\n')
    .map((line, index) => {
      // Handle headers (lines starting with **)
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-bold text-sm text-white mb-1 mt-2 first:mt-0">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      // Handle section headers (lines ending with :)
      else if (line.endsWith(':') && !line.startsWith('•') && !line.startsWith('*')) {
        return (
          <div key={index} className="font-semibold text-blue-300 mt-2 mb-1 text-xs">
            {line}
          </div>
        );
      }
      // Handle bullet points
      else if (line.startsWith('•')) {
        return (
          <div key={index} className="flex items-start ml-1 mb-0.5">
            <span className="text-purple-300 mr-1 mt-0.5 text-xs">•</span>
            <span className="text-gray-100 text-xs">{line.substring(1).trim()}</span>
          </div>
        );
      }
      // Handle numbered lists
      else if (/^\d+\./.test(line)) {
        return (
          <div key={index} className="flex items-start ml-1 mb-0.5">
            <span className="text-green-300 mr-1 mt-0.5 font-semibold text-xs">
              {line.match(/^\d+/)[0]}.
            </span>
            <span className="text-gray-100 text-xs">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      // Handle italic text (lines starting with *)
      else if (line.startsWith('*') && line.endsWith('*')) {
        return (
          <div key={index} className="text-gray-300 italic text-xs mt-1">
            {line.replace(/\*/g, '')}
          </div>
        );
      }
      // Handle regular lines
      else if (line.trim()) {
        return (
          <div key={index} className="text-gray-100 mb-1 text-xs">
            {line}
          </div>
        );
      }
      // Handle empty lines
      else {
        return <div key={index} className="h-2" />;
      }
    });
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const router = useRouter();

  const categories = {
    premiumCars: {
      name: "Premium Cars",
      icon: 'directions-car',
      content: `🚗 PREMIUM VEHICLE COLLECTION

Featured Categories:
• Luxury Sedans: Mercedes S-Class, BMW 7 Series, Audi A8
• SUVs: Range Rover, Porsche Cayenne, Lexus LX
• Executive Cars: Mercedes E-Class, BMW 5 Series, Audi A6
• Sports Cars: Porsche 911, BMW M Series, Mercedes-AMG

Certification Standards:
• 200-Point Comprehensive Inspection
• Full Service History Verification
• No Accident History Guarantee
• 12-Month Warranty Included

Price Range:
• Executive: KES 2M - 5M
• Luxury: KES 5M - 15M
• Ultra-Luxury: KES 15M+

All vehicles come with complete documentation and service records!`,
      links: [
        { label: 'View All Cars', path: '/carlistings' },
        { label: 'Luxury Sedans', path: '/carlistings?category=sedan' },
        { label: 'Premium SUVs', path: '/carlistings?category=suv' }
      ]
    },
    financing: {
      name: "Financing",
      icon: 'credit-card',
      content: `💰 FINANCING SOLUTIONS

Loan Options:
• Bank Financing: 70-80% vehicle financing
• In-house Financing: Flexible payment plans
• Corporate Leasing: Fleet management solutions
• Insurance Financing: Comprehensive coverage

Requirements:
• KRA Pin Certificate
• National ID/Passport
• 3 Months Bank Statements
• Proof of Income

Interest Rates:
• New Cars: 12-14% p.a.
• Pre-owned: 14-16% p.a.
• Corporate: 11-13% p.a.

Special Offers:
• 0% Down Payment Options
• First 3 Months No Payments
• Trade-in Accepted

Get pre-approved in 24 hours!`,
      links: [
        { label: 'Apply Now', path: '/financing' },
        { label: 'Calculate Payment', path: '/calculator' },
        { label: 'Requirements', path: '/financing#requirements' }
      ]
    },
    inspection: {
      name: "200-Point Check",
      icon: 'assessment',
      content: `🔍 200-POINT CERTIFICATION

Comprehensive Inspection Areas:

Mechanical Systems:
• Engine Performance & Diagnostics
• Transmission & Drivetrain
• Braking System Analysis
• Suspension & Steering

Exterior & Interior:
• Paint Quality & Bodywork
• Interior Condition & Electronics
• Tire & Wheel Assessment
• Glass & Mirror Inspection

Safety & Documentation:
• Accident History Verification
• Service Records Validation
• Ownership Documentation
• Compliance & Registration

Certification Benefits:
• 12-Month Warranty
• Roadside Assistance
• Service Package Included
• Buy-Back Guarantee

Drive with complete confidence!`,
      links: [
        { label: 'Inspection Process', path: '/certification' },
        { label: 'Warranty Details', path: '/warranty' },
        { label: 'Our Standards', path: '/standards' }
      ]
    },
    testDrive: {
      name: "Test Drive",
      icon: 'car-rental',
      content: `🎯 SCHEDULE TEST DRIVE

Available Time Slots:
• Weekdays: 8:00 AM - 7:00 PM
• Saturdays: 9:00 AM - 5:00 PM
• Sundays: 11:00 AM - 4:00 PM

Process:
1. Select preferred vehicle
2. Choose date & time
3. Provide driver's license
4. 30-60 minute drive
5. Expert consultation

Requirements:
• Valid Driver's License
• Prior appointment
• Insurance coverage provided

Locations:
• Main Showroom: Westlands
• Branch: Karen
• Delivery Available: Nairobi & Surrounding

Experience luxury driving firsthand!`,
      links: [
        { label: 'Book Test Drive', path: '/test-drive' },
        { label: 'View Showrooms', path: '/locations' },
        { label: 'Available Cars', path: '/carlistings' }
      ]
    },
    sellCar: {
      name: "Sell Your Car",
      icon: 'business',
      content: `💎 SELL YOUR CAR TO US

Why Choose CorporateSellers?
• Highest Market Valuation
• Instant Payment
• Free Vehicle Collection
• No Commission Fees

Valuation Process:
1. Online initial assessment
2. Physical inspection
3. Market analysis
4. Final offer presentation

We Accept:
• Luxury & Premium Brands
• 2015 Models & Newer
• Well-maintained Vehicles
• Full Service History

Payment Options:
• Bank Transfer (Instant)
• Manager's Cheque
• Mobile Money

Get top value for your premium vehicle!`,
      links: [
        { label: 'Get Valuation', path: '/sell-your-car' },
        { label: 'Sell My Car', path: '/valuation' },
        { label: 'Process Details', path: '/selling-process' }
      ]
    }
  };

  useEffect(() => {
    const chatData = localStorage.getItem('corporatesellers_chat');
    if (chatData) {
      const { messages: savedMessages, timestamp } = JSON.parse(chatData);
      const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000);
      
      if (timestamp > fourHoursAgo) {
        setMessages(savedMessages);
      } else {
        localStorage.removeItem('corporatesellers_chat');
        setMessages([getWelcomeMessage()]);
      }
    } else {
      setMessages([getWelcomeMessage()]);
    }
  }, []);

  const getWelcomeMessage = () => ({
    id: 1,
    role: 'assistant',
    content: `🏆 WELCOME TO CORPORATESELLERS!

**Premium Auto Marketplace**

Hello! I'm your CorporateSellers assistant, here to help you find your perfect premium vehicle.

Why Choose Us?
• 200-Point Certified Vehicles
• Best Price Guarantee
• 12-Month Comprehensive Warranty
• Financing Options Available

Browse our categories below to get started! 🚗`,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    if (messages.length > 0) {
      const chatData = {
        messages: messages,
        timestamp: Date.now()
      };
      localStorage.setItem('corporatesellers_chat', JSON.stringify(chatData));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typedMessage]);

  const typeMessage = (message, onComplete) => {
    setIsTyping(true);
    setTypedMessage('');
    let index = 0;
    
    const typingInterval = setInterval(() => {
      if (index < message.length) {
        setTypedMessage(prev => prev + message[index]);
        index++;
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        onComplete();
        setTimeout(() => setShowCategories(true), 500);
      }
    }, 20);
  };

  const handleCategoryClick = (categoryKey) => {
    const category = categories[categoryKey];
    
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: `Selected: ${category.name}`,
      timestamp: new Date().toISOString()
    };

    const assistantMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '',
      links: category.links,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);
    setShowCategories(false);

    typeMessage(category.content, () => {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: category.content, links: category.links }
          : msg
      ));
      setIsLoading(false);
    });
  };

  const clearChat = () => {
    localStorage.removeItem('corporatesellers_chat');
    setMessages([getWelcomeMessage()]);
    setShowCategories(true);
  };

  const handleLinkClick = (path) => {
    router.push(path);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          <div className="relative">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <Image 
                src="/lll.png"
                alt="Corporate Sellers Logo"
                width={24}
                height={24}
                className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
                priority
              />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse border border-white"></div>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 rounded-xl sm:rounded-2xl shadow-xl w-[90vw] h-[70vh] sm:w-[380px] sm:h-[500px] md:w-[400px] md:h-[550px] flex flex-col overflow-hidden border border-white/10 backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                  <Image 
                    src="/lll.png"
                    alt="Corporate Sellers Logo"
                    width={32}
                    height={32}
                    className="w-5 h-5 sm:w-7 sm:h-7 object-contain"
                    priority
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">CorporateSellers</h3>
                  <p className="text-blue-100 text-xs">Premium Auto Marketplace</p>
                </div>
              </div>
              <div className="flex space-x-1 sm:space-x-2">
                <button
                  onClick={clearChat}
                  className="text-white/80 hover:text-white transition p-1.5 sm:p-2 hover:bg-white/10 rounded-full"
                  title="Clear chat"
                >
                  <SafeIcon name="trash" className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition p-1.5 sm:p-2 hover:bg-white/10 rounded-full"
                >
                  <SafeIcon name="close" className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-slate-800/50 backdrop-blur-sm"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              .flex-1::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 backdrop-blur-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-700/70 text-white rounded-bl-none shadow-sm border border-white/10'
                  }`}
                >
                  {message.role === 'assistant' && isTyping && message.id === messages[messages.length - 1]?.id ? (
                    <div className="text-xs leading-relaxed font-medium text-white">
                      {formatMessage(typedMessage)}
                    </div>
                  ) : (
                    <div className="text-xs leading-relaxed font-medium text-white">
                      {formatMessage(message.content)}
                    </div>
                  )}
                  
                  {message.links && message.role === 'assistant' && !isTyping && (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/20">
                      <p className="text-xs text-gray-300 mb-1 sm:mb-2 font-semibold">Quick Actions:</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {message.links.map((link, index) => (
                          <button
                            key={index}
                            onClick={() => handleLinkClick(link.path)}
                            className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-2 py-1 sm:px-3 sm:py-2 rounded transition-all duration-200 font-medium shadow-sm hover:shadow"
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className={`text-xs mt-1 sm:mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'} font-medium`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700/70 text-white rounded-lg sm:rounded-xl rounded-bl-none px-3 py-2 sm:px-4 sm:py-3 shadow-sm border border-white/10 backdrop-blur-sm">
                  <div className="flex space-x-2 sm:space-x-3 items-center">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-300 font-semibold">Typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Categories */}
          {showCategories && (
            <div className="border-t border-white/10 bg-slate-700/80 p-3 sm:p-4 backdrop-blur-sm">
              <div>
                <p className="text-xs text-gray-300 font-semibold mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <SafeIcon name="help" className="w-3 h-3" />
                  How can we help?
                </p>
                
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {Object.entries(categories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => handleCategoryClick(key)}
                      className="flex items-center space-x-1.5 sm:space-x-2 px-2 py-2 sm:px-3 sm:py-2 rounded text-xs font-semibold transition-all backdrop-blur-sm text-gray-300 hover:bg-slate-600/80 hover:text-white border border-white/10 hover:border-blue-400 hover:shadow-sm"
                    >
                      <SafeIcon name={category.icon} className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                      <span className="text-xs">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}