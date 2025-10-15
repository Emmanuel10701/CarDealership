'use client';
import React from 'react';
// We assume Link functionality is available for routing in the environment.
// For this single-file component, we'll use a standard <a> tag.
const Link = ({ href, children, className }) => <a href={href} className={className}>{children}</a>;

// --- Inline SVG Icons (Retained for structure) ---

// Abstract Beacon/Portal Icon - Now a subtle search indicator
const BeaconIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Pulsing ring/target */}
        <circle cx="12" cy="12" r="10" strokeDasharray="5 3" className="opacity-75"/>
        {/* Core light */}
        <circle cx="12" cy="12" r="4" fill="currentColor"/>
    </svg>
);

// Home Icon (Modernized)
const HomeIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

// Arrow Left Icon (Modernized)
const ArrowLeftIcon = ({ className = 'w-6 h-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

// Component for the animated 404 text and icon
const Animated404 = () => (
    <div className="relative mb-16 select-none font-sans">
        {/* Large, stylized 404 number with a muted, subtle appearance */}
        <div className="text-[14rem] sm:text-[18rem] font-extrabold text-indigo-200 tracking-widest text-shadow-subtle transition-all duration-500 ease-in-out opacity-70">
            404
        </div>

        {/* Floating Icon: The searching beacon, centered */}
        <div className="absolute inset-0 flex items-center justify-center top-[-1rem]">
            <BeaconIcon className="w-20 h-20 text-indigo-500 animate-pulse-slow drop-shadow-lg" />
        </div>
    </div>
);

// Style definitions for keyframes and custom classes
const styles = `
.text-shadow-subtle {
    /* Subtle text shadow for depth on light background */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}
.button-shadow-hover:hover {
    /* Subtle elevation on hover */
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    transform: scale(1.03);
}
.animate-pulse-slow {
    /* Slower, more atmospheric pulse for the beacon */
    animation: pulse-opac 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse-opac {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
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
            {/* Inject custom styles for animation and shadows */}
            <style>{styles}</style>
            
            {/* Switched to light background and dark text */}
            <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center justify-center p-4 sm:p-8 font-inter">
                
                {/* Visual Anchor */}
                <Animated404 />

                {/* Content Section - Max-width container */}
                <div className="max-w-lg w-full text-center">
                    
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-600 mb-4 tracking-tight">
                        Page Not Found
                    </h1>

                    <p className="text-xl text-gray-600 mb-4">
                        We couldn't locate the file you requested.
                    </p>
                    <p className="text-gray-500 mb-12 text-lg">
                        This usually means the link is broken or the page has been moved.
                    </p>

                    {/* Action Buttons: Clean, rounded, high-contrast */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Link
                            href="/"
                            className="flex items-center justify-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg transition duration-300 hover:bg-indigo-700 button-shadow-hover"
                        >
                            <HomeIcon className="w-5 h-5" />
                            <span>Go to Homepage</span>
                        </Link>

                        <button
                            onClick={handleGoBack}
                            className="flex items-center justify-center space-x-3 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg transition duration-300 hover:bg-gray-100 hover:border-indigo-400"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            <span>Go Back</span>
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-400">
                        Error Code 404 — Document not found in repository.
                    </p>
                </div>
            </div>
        </>
    )
}
