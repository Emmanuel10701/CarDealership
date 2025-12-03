'use client';
import React from 'react';

// We assume Link functionality is available for routing in the environment.
// For this single-file component, we'll use a standard <a> tag.
const Link = ({ href, children, className }) => <a href={href} className={className}>{children}</a>;

// --- Modern Car-Themed Icons ---

// Car Search Icon
const CarSearchIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3v-6h18v6h-2"/>
        <path d="M7 17V11h10v6"/>
        <circle cx="8" cy="17" r="1"/>
        <circle cx="16" cy="17" r="1"/>
        <path d="m21 21-4.3-4.3"/>
        <circle cx="17" cy="10" r="3"/>
    </svg>
);

// Broken Road Icon
const BrokenRoadIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h4l3-9 4 18 3-9h4"/>
        <path d="M8 12h8"/>
        <path d="M12 3v18"/>
    </svg>
);

// Garage/Home Icon
const GarageIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8"/>
        <path d="M12 12v10"/>
        <path d="M3 10l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <circle cx="12" cy="10" r="1"/>
    </svg>
);

// Reverse/Back Icon
const ReverseIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 14 4 9l5-5"/>
        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>
    </svg>
);

// Speedometer Error Icon
const SpeedometerIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4"/>
        <path d="m16.2 7.8 2.9-2.9"/>
        <path d="M18 12h4"/>
        <path d="m16.2 16.2 2.9 2.9"/>
        <path d="M12 18v4"/>
        <path d="m4.9 19.1 2.9-2.9"/>
        <path d="M2 12h4"/>
        <path d="m4.9 4.9 2.9 2.9"/>
        <circle cx="12" cy="12" r="2"/>
        <path d="m8 8 8 8"/>
    </svg>
);

// Component for the animated 404 with car theme
const CarThemed404 = () => (
    <div className="relative mb-16 select-none font-sans">
        {/* Large, stylized 404 number with automotive styling */}
        <div className="text-[12rem] sm:text-[16rem] font-black text-gray-800 tracking-tighter transition-all duration-500 ease-in-out relative">
            404
            {/* Road line effect */}
            <div className="absolute bottom-8 left-0 right-0 h-1 bg-linear-to-r from-transparent via-yellow-400 to-transparent transform -skew-x-12"></div>
        </div>

        {/* Floating Car Icon */}
        <div className="absolute inset-0 flex items-center justify-center top-[-2rem]">
            <div className="relative">
                <CarSearchIcon className="w-24 h-24 text-red-500 animate-bounce-slow drop-shadow-xl" />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full opacity-60"></div>
            </div>
        </div>

        {/* Road elements */}
        <div className="absolute -bottom-4 left-0 right-0 flex justify-between px-8 opacity-40">
            <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
        </div>
    </div>
);

// Style definitions for keyframes and custom classes
const styles = `
@keyframes bounce-slow {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
}
.animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
}
@keyframes road-move {
    0% { transform: translateX(-100px) skewX(-12deg); }
    100% { transform: translateX(100px) skewX(-12deg); }
}
.animate-road-move {
    animation: road-move 3s linear infinite;
}
.button-shadow-hover:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}
.car-gradient {
    background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
}
.road-texture {
    background: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 20px,
        rgba(255,255,255,0.1) 20px,
        rgba(255,255,255,0.1) 40px
    );
}
`;

export default function NotFound() {
    // History function
    const handleGoBack = () => {
        try {
            window.history.back();
        } catch (e) {
            console.error("Could not go back:", e);
        }
    };

    return (
        <>
            {/* Inject custom styles for animation and effects */}
            <style>{styles}</style>
            
            {/* Automotive-themed background */}
            <div className="min-h-screen car-gradient text-white flex flex-col items-center justify-center p-4 sm:p-8 font-inter relative overflow-hidden">
                
                {/* Animated road lines in background */}
                <div className="absolute inset-0 road-texture opacity-20 animate-road-move"></div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}></div>

                {/* Visual Anchor */}
                <CarThemed404 />

                {/* Content Section - Max-width container */}
                <div className="max-w-2xl w-full text-center relative z-10">
                    
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <BrokenRoadIcon className="w-8 h-8 text-yellow-400" />
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                            Road Block Ahead
                        </h1>
                        <SpeedometerIcon className="w-8 h-8 text-red-400" />
                    </div>

                    <p className="text-xl text-gray-300 mb-4 font-light">
                        We've hit a dead end on this route.
                    </p>
                    <p className="text-lg text-gray-400 mb-12 max-w-md mx-auto leading-relaxed">
                        The page you're looking for seems to have taken a wrong turn. 
                        Let's get you back on track.
                    </p>

                    {/* Action Buttons: Automotive styling */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <Link
                            href="/"
                            className="flex items-center justify-center space-x-3 bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 button-shadow-hover border border-blue-500 min-w-[200px]"
                        >
                            <GarageIcon className="w-5 h-5" />
                            <span>Return to Garage</span>
                        </Link>

                        <button
                            onClick={handleGoBack}
                            className="flex items-center justify-center space-x-3 bg-gray-700/50 backdrop-blur-sm text-gray-200 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 button-shadow-hover border border-gray-600 hover:bg-gray-600/50 min-w-[200px]"
                        >
                            <ReverseIcon className="w-5 h-5" />
                            <span>Reverse Route</span>
                        </button>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        <Link href="/carlisting" className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:bg-gray-700/50">
                            <div className="text-blue-400 font-semibold mb-1">Browse Inventory</div>
                            <div className="text-sm text-gray-400">Explore our car collection</div>
                        </Link>
                        <Link href="/pages/contact" className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-600 hover:border-green-500 transition-all duration-300 hover:bg-gray-700/50">
                            <div className="text-green-400 font-semibold mb-1">Get Assistance</div>
                            <div className="text-sm text-gray-400">Contact our support team</div>
                        </Link>
                        <Link href="/pages/aboutus" className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-all duration-300 hover:bg-gray-700/50">
                            <div className="text-purple-400 font-semibold mb-1">About Us</div>
                            <div className="text-sm text-gray-400">Learn about our dealership</div>
                        </Link>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-16 text-center relative z-10">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <SpeedometerIcon className="w-4 h-4" />
                        <span>Error 404 — Destination not found in navigation system</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        Corporate Cars Elite • Premium Automotive Solutions
                    </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-gray-600 opacity-30"></div>
                <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-gray-600 opacity-30"></div>
                <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-gray-600 opacity-30"></div>
                <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-gray-600 opacity-30"></div>
            </div>
        </>
    )
}