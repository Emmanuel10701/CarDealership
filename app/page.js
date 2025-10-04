import Navbar from './components/navbar/page'
import Footer from './components/footer/page'
import Hero from './components/hero/page'
import AboutUs from './components/about/page'
import CarListing from './components/carlisting/page'
import ContactUs from './components/contact/page'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <Hero />
        <AboutUs />
        <CarListing />
        <ContactUs />
      </main>
      
      <Footer />
      
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/254700000000"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          <span className="text-2xl">💬</span>
        </a>
      </div>
    </div>
  );
}