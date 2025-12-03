"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaCalendar, FaUser, FaClock, FaArrowLeft, FaArrowRight, 
  FaShareAlt, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp,
  FaBookmark, FaRegBookmark, FaTags, FaHome, FaCar, FaCheckCircle,
  FaStar, FaEnvelope, FaSearch, FaHeart, FaPhone, FaMapMarkerAlt,
  FaShieldAlt, FaUsers, FaAward, FaHandshake, FaExternalLinkAlt, FaTimes
} from 'react-icons/fa'
import { CircularProgress, Breadcrumbs } from '@mui/material'

// Add base URL from environment at the top
const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://corporatecarselite.com'

const blogApiService = {
  async getBlogPostById(id) {
    const response = await fetch(`/api/blogs/${id}`)
    if (!response.ok) throw new Error('Failed to fetch blog post')
    const data = await response.json()
    return data.blogPost || data
  },

  async getRelatedPosts(category, currentPostId, limit = 3) {
    const response = await fetch(
      `/api/blogs?category=${category}&exclude=${currentPostId}&limit=${limit}`
    )
    if (!response.ok) throw new Error('Failed to fetch related posts')
    const data = await response.json()
    return data.blogPosts || []
  }
}

function formatDescriptionSmartly(text) {
  if (!text || typeof text !== 'string') return text

  // Remove markdown symbols and clean the text
  const cleanedText = text
    .replace(/\*\*/g, '')        // Remove bold
    .replace(/#/g, '')           // Remove headings
    .replace(/\*/g, '')          // Remove bullets/italics
    .replace(/\\r\\n/g, '\n')    // Replace escaped newlines
    .replace(/\\n/g, '\n')       // Replace escaped newlines
    .replace(/\s+/g, ' ')        // Normalize whitespace
    .trim()

  // Split into sentences
  const sentences = cleanedText.match(/[^.!?]+[.!?]+/g) || [cleanedText]
  
  if (sentences.length <= 1) return cleanedText
  
  // Group sentences into paragraphs (2-3 sentences per paragraph)
  const paragraphs = []
  let currentPara = []
  
  sentences.forEach((sentence, index) => {
    currentPara.push(sentence.trim())
    
    // Create paragraph after 2-3 sentences
    const sentenceCount = currentPara.length
    const shouldCreateParagraph = sentenceCount >= 2 && 
                                 (sentenceCount >= 3 || Math.random() > 0.5)
    
    if (shouldCreateParagraph && index < sentences.length - 1) {
      paragraphs.push(currentPara.join(' '))
      currentPara = []
    }
  })
  
  // Add remaining sentences
  if (currentPara.length > 0) {
    paragraphs.push(currentPara.join(' '))
  }
  
  // If we ended up with just 1 paragraph, split it in half
  if (paragraphs.length === 1) {
    const words = paragraphs[0].split(' ')
    if (words.length > 40) {
      const midPoint = Math.floor(words.length / 2)
      const firstHalf = words.slice(0, midPoint).join(' ')
      const secondHalf = words.slice(midPoint).join(' ')
      return `${firstHalf}\n\n${secondHalf}`
    }
  }
  
  return paragraphs.join('\n\n')
}


function FeatureModal({ feature, isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl transition-all duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100 overflow-hidden border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`bg-linear-to-r ${feature.color} p-8 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-all duration-200 p-2 rounded-xl hover:bg-white/20 backdrop-blur-sm"
          >
            <FaTimes className="text-2xl" />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <feature.icon className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{feature.title}</h2>
              <p className="text-white/80 text-lg mt-2">{feature.description}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Why This Matters</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {feature.title === "150-Point Inspection" && 
                "Our comprehensive 150-point inspection covers all critical systems including engine, transmission, suspension, brakes, electrical systems, and interior conditions. Every vehicle is tested for safety, reliability, and performance standards."}
              {feature.title === "Verified History Reports" && 
                "Complete transparency about your vehicle's past. We provide detailed history reports including ownership records, accident history, service records, and mileage verification to ensure you know exactly what you're buying."}
              {feature.title === "Trusted Network" && 
                "We carefully vet all dealers and individual sellers in our network. Our partners are committed to honest practices and quality vehicles, giving you confidence in every transaction."}
              {feature.title === "24/7 Expert Support" && 
                "Our team of certified automotive experts is available round-the-clock to answer your questions, provide advice, and support you throughout your car buying journey."}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Key Benefits</h3>
            <ul className="space-y-3">
              {feature.title === "150-Point Inspection" && [
                "Identifies potential issues before purchase",
                "Reduces risk of costly repairs",
                "Ensures vehicle safety and reliability",
                "Professional certified technicians"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
              {feature.title === "Verified History Reports" && [
                "Complete ownership and accident history",
                "Mileage verification and consistency checks",
                "Service and maintenance records",
                "Title and registration verification"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
              {feature.title === "Trusted Network" && [
                "Verified dealers and sellers",
                "Quality assurance standards",
                "Transparent pricing",
                "Customer protection policies"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
              {feature.title === "24/7 Expert Support" && [
                "Immediate response to inquiries",
                "Expert advice on vehicle selection",
                "Post-purchase support",
                "Warranty and dispute resolution"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <Link
              href="/carlisting"
              className="group inline-flex items-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <span>Explore Our Vehicles</span>
              <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
      setProgress(scrollPercent)
      setIsVisible(scrollTop > 100)
    }

    window.addEventListener('scroll', updateProgress)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className={`fixed top-0 left-0 w-full h-1.5 z-50 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-20" />
      <div 
        className="h-full bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 transition-all duration-150 ease-out shadow-lg"
        style={{ width: `${progress}%` }}
      />
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-white/30 to-transparent transform -translate-y-1/2" />
    </div>
  )
}

function BlogPostSEOMeta({ post }) {
  if (!post) return null

  // Use the environment variable
  const postUrl = `${baseUrl}/pages/blogs/${post.id}/${post.slug || post.id}`
  const imageUrl = post.mainImage ? (post.mainImage.startsWith('http') ? post.mainImage : `${baseUrl}${post.mainImage.startsWith('/') ? '' : '/'}${post.mainImage}`) : `${baseUrl}/car1.png`
  const defaultImage = `${baseUrl}/car1.png`

  return (
    <Head>
      <title>{`${post.metaTitle || post.title} | CorporateSellers - Premium Used Cars`}</title>
      <meta name="description" content={post.metaDescription || post.excerpt} />
      <meta name="keywords" content={`${post.tags?.join(', ')}, used cars, automotive, car buying, vehicle inspection, ${post.category}`} />
      
      <meta property="og:title" content={post.metaTitle || post.title} />
      <meta property="og:description" content={post.metaDescription || post.excerpt} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={postUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="CorporateSellers" />
      <meta property="og:locale" content="en_US" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.metaTitle || post.title} />
      <meta name="twitter:description" content={post.metaDescription || post.excerpt} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@CorporateSellers" />
      
      <meta property="article:published_time" content={post.publishDate || post.createdAt} />
      <meta property="article:modified_time" content={post.updatedAt || post.publishDate} />
      <meta property="article:author" content={post.authorName} />
      <meta property="article:section" content={post.category} />
      {post.tags?.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.metaDescription || post.excerpt,
            "image": imageUrl,
            "datePublished": post.publishDate || post.createdAt,
            "dateModified": post.updatedAt || post.publishDate,
            "author": {
              "@type": "Person",
              "name": post.authorName,
              "jobTitle": "Automotive Expert"
            },
            "publisher": {
              "@type": "Organization",
              "name": "CorporateSellers",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}lll.png`
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": postUrl
            }
          })
        }}
      />
    </Head>
  )
}

function ModernHeader({ post, onBookmark, isBookmarked, onShare }) {
  return (
    <header className="relative overflow-hidden bg-linear-to-br from-gray-900 via-blue-900 to-purple-900 text-white pt-20 pb-16">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-8">
          <Breadcrumbs 
            separator={<span className="text-white/50 mx-2">›</span>}
            className="text-white/80 text-sm"
          >
            <Link href="/" className="text-white transition-colors duration-300 flex items-center gap-2">
              <FaHome className="text-base" />
              <span>Home</span>
            </Link>
            <Link href="/pages/blogs" className="text-white transition-colors duration-300">
              Automotive Insights
            </Link>
            <span className="text-white font-semibold truncate max-w-xs md:max-w-md">
              {post.title}
            </span>
          </Breadcrumbs>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30">
            <FaTags className="text-xs" />
            {post.category}
          </span>
          {post.featured && (
            <span className="inline-flex items-center gap-2 bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2 rounded-full text-sm font-medium">
              <FaStar className="text-xs" />
              Featured
            </span>
          )}
          <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/30">
            <FaClock className="text-xs" />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
          {post.title}
        </h1>

        <div className="max-w-4xl w-full lg:w-11/12 mb-8">
          {post.excerpt && formatDescriptionSmartly(post.excerpt).split('\n\n').map((para, i) => (
            para.trim() && (
              <p key={i} className="text-lg text-white/80 mb-6 leading-relaxed">
                {para.trim()}
              </p>
            )
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-8 border-t border-white/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-linear-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-2xl">
                {post.authorName?.charAt(0) || 'C'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                <FaCheckCircle className="text-xs text-white" />
              </div>
            </div>
            <div>
              <div className="font-bold text-white text-lg">{post.authorName}</div>
              <div className="text-white/70 text-sm">Certified Automotive Expert</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
              <FaCalendar className="text-white/70" />
              <span className="font-medium">
                {new Date(post.publishDate || post.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-8 pt-8 border-t border-white/20">
          <button
            onClick={onBookmark}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
              isBookmarked 
                ? 'bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-lg' 
                : 'bg-white/10 backdrop-blur-sm text-white border border-white/30'
            }`}
          >
            {isBookmarked ? (
              <FaBookmark className="text-lg" />
            ) : (
              <FaRegBookmark className="text-lg" />
            )}
            <span>{isBookmarked ? 'Saved' : 'Save Article'}</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-white/70 font-medium">Share:</span>
            <div className="flex gap-2">
              {[
                { platform: 'facebook', icon: FaFacebook },
                { platform: 'twitter', icon: FaTwitter },
                { platform: 'linkedin', icon: FaLinkedin },
                { platform: 'whatsapp', icon: FaWhatsapp }
              ].map(({ platform, icon: Icon }) => (
                <button
                  key={platform}
                  onClick={() => onShare(platform)}
                  className="w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/30 cursor-pointer"
                >
                  <Icon className="text-lg" />
                </button>
              ))}
              <button
                onClick={() => onShare('copy')}
                className="w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/30 cursor-pointer"
              >
                <FaShareAlt className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function FeaturedImage({ imageUrl, altText, title }) {
  const [loaded, setLoaded] = useState(false)
  
  // Process image URL - prepend base URL if it's a relative path
  const processedImageUrl = imageUrl 
    ? (imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`)
    : `${baseUrl}/car1.png`
  
  return (
    <section className="container mx-auto px-4 -mt-8 relative z-20">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
        {processedImageUrl ? (
          <>
            <div className={`absolute inset-0 bg-linear-to-br from-blue-900/20 to-purple-900/20 transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`} />
            <img 
              src={processedImageUrl} 
              alt={altText || title}
              className={`w-full h-80 md:h-[500px] object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setLoaded(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-80 md:h-[500px] bg-linear-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center">
            <div className="text-center">
              <FaCar className="text-6xl text-white/30 mx-auto mb-4" />
              <p className="text-white/50 text-lg">Featured Image</p>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 via-transparent to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 max-w-md">
            <p className="text-white text-sm font-medium">📸 Featured visual for: {title}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            setActiveId(entry.target.id)
          }
        })
      },
      { 
        rootMargin: '-20% 0% -65% 0%',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
        <div 
          className="p-6 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Quick Navigation</h3>
                <p className="text-gray-600 text-sm">Jump to specific sections</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg 
                className={`w-6 h-6 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className={`overflow-hidden transition-all duration-500 ${expanded ? 'max-h-96' : 'max-h-0'}`}>
          <nav className="px-6 pb-6 space-y-2">
            {headings.map((heading, index) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeId === heading.id
                    ? 'bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  })
                }}
              >
                <div className={`w-2 h-2 rounded-full transition-colors ${
                  activeId === heading.id ? 'bg-blue-600' : 'bg-gray-300 group-hover:bg-gray-400'
                }`} />
                <div className="flex-1">
                  <div className="font-medium">{heading.text}</div>
                  <div className="text-xs text-gray-500 mt-1">Section {index + 1}</div>
                </div>
                <FaExternalLinkAlt className={`text-sm transition-transform duration-300 ${
                  activeId === heading.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`} />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}

function ArticleContent({ content, title }) {
  const contentRef = useRef(null)
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      const text = contentRef.current.textContent || ''
      setWordCount(text.split(/\s+/).length)
    }
  }, [content])

  // Function to process markdown content with proper HTML
  const processMarkdownContent = (markdownText) => {
    if (!markdownText) return '<p>No content available.</p>'
    
    let html = markdownText
    
    // Replace markdown headers with proper HTML headers
    html = html.replace(/^### (.*$)/gim, '</p><h3 class="text-xl font-bold text-gray-900 mt-8 mb-3">$1</h3><p class="mb-6 text-gray-700 leading-relaxed text-lg">')
    html = html.replace(/^## (.*$)/gim, '</p><h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 pt-6 border-t border-gray-200">$1</h2><p class="mb-6 text-gray-700 leading-relaxed text-lg">')
    html = html.replace(/^# (.*$)/gim, '</p><h1 class="text-3xl font-bold text-gray-900 mt-12 mb-6">$1</h1><p class="mb-6 text-gray-700 leading-relaxed text-lg">')
    
    // Replace bold markdown
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900">$1</strong>')
    
    // Replace italic markdown
    html = html.replace(/\*(.*?)\*/gim, '<em class="italic text-gray-800">$1</em>')
    
    // Process bullet lists - match lines starting with *
    html = html.replace(/^\* (.*$)/gim, '</p><li class="text-gray-700 leading-relaxed mb-2 pl-4 relative before:content-["•"] before:absolute before:left-0 before:text-blue-500 before:font-bold">$1</li><p class="mb-6 text-gray-700 leading-relaxed text-lg">')
    
    // Wrap consecutive list items in ul
    html = html.replace(/(<li.*?>.*?<\/li>\s*)+/g, '<ul class="list-none pl-6 mb-6 space-y-2">$&</ul>')
    
    // Handle code blocks
    html = html.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
    
    // Split into paragraphs based on double newlines
    const paragraphs = html.split(/\r\n\r\n|\n\n/)
    
    if (paragraphs.length > 1) {
      html = paragraphs.map(para => {
        const trimmed = para.trim()
        if (!trimmed) return ''
        
        // Don't wrap HTML elements that are already properly formatted
        if (trimmed.startsWith('<h') || 
            trimmed.startsWith('<ul') || 
            trimmed.startsWith('<li') ||
            trimmed.startsWith('</ul') ||
            trimmed.startsWith('</h')) {
          return trimmed
        }
        
        // Check if it's already a paragraph
        if (trimmed.startsWith('<p') || trimmed.includes('</p>')) {
          return trimmed
        }
        
        // Wrap in paragraph tag
        return `<p class="mb-6 text-gray-700 leading-relaxed text-lg">${trimmed}</p>`
      }).join('')
    } else {
      // Fallback: split by single line breaks
      const lines = html.split(/\r\n|\n/)
      const grouped = []
      let currentGroup = []
      
      lines.forEach(line => {
        const trimmed = line.trim()
        if (!trimmed && currentGroup.length > 0) {
          grouped.push(currentGroup.join(' '))
          currentGroup = []
        } else if (trimmed) {
          currentGroup.push(trimmed)
        }
      })
      
      if (currentGroup.length > 0) {
        grouped.push(currentGroup.join(' '))
      }
      
      html = grouped.map(group => {
        if (group.startsWith('<h') || group.startsWith('<ul') || group.includes('<li>')) {
          return group
        }
        return `<p class="mb-6 text-gray-700 leading-relaxed text-lg">${group}</p>`
      }).join('')
    }
    
    // Clean up empty paragraph tags and fix nesting
    html = html
      .replace(/<p[^>]*>\s*<\/p>/g, '')
      .replace(/<\/p>\s*<p/g, '</p><p')
      .replace(/<\/ul>\s*<ul/g, '</ul><ul')
    
    return html
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-6 bg-linear-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{wordCount}</div>
              <div className="text-gray-600 text-sm">Words</div>
            </div>
            <div className="h-8 w-px bg-gray-300" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.ceil(wordCount / 200)}
              </div>
              <div className="text-gray-600 text-sm">Min Read</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          <div 
            ref={contentRef}
            className="prose prose-lg max-w-none markdown-content"
            dangerouslySetInnerHTML={{ 
              __html: processMarkdownContent(content)
            }}
          />
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-start gap-4 p-6 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <FaCheckCircle className="text-2xl text-green-600 mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Article Complete</h4>
                <p className="text-gray-700">
                  You've finished reading this comprehensive guide. Continue exploring more automotive insights below.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AuthorBio({ authorName, role = "Senior Automotive Analyst" }) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-linear-to-r from-gray-900 to-blue-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="relative">
                <div className="w-24 h-24 bg-linear-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl">
                  {authorName?.charAt(0) || 'C'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaAward className="text-sm text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-white">{authorName}</h3>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full font-medium">
                    Verified Expert
                  </span>
                </div>
                <p className="text-white/80 text-lg mb-4">{role}</p>
                <p className="text-white/70 mb-6 leading-relaxed">
                  With over a decade of experience in the automotive industry, {authorName} specializes in vehicle inspections, 
                  market analysis, and consumer education. Their insights have helped thousands of buyers make informed decisions.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-white/70">
                    <FaCheckCircle className="text-green-400" />
                    <span>150+ Articles</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <FaUsers className="text-blue-400" />
                    <span>10K+ Readers</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <FaAward className="text-amber-400" />
                    <span>Industry Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CorporateFeatures({ onFeatureClick }) {
  const features = [
    {
      title: "150-Point Inspection",
      description: "Every vehicle undergoes rigorous inspection for your peace of mind.",
      icon: FaCheckCircle,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Verified History Reports",
      description: "Complete vehicle history with transparent ownership records.",
      icon: FaShieldAlt,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Trusted Network",
      description: "Network of reputable dealers and certified individual sellers.",
      icon: FaHandshake,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "24/7 Expert Support",
      description: "Round-the-clock customer service and automotive expertise.",
      icon: FaPhone,
      color: "from-orange-500 to-red-500"
    }
  ]

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Why Choose CorporateSellers?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're committed to providing the best automotive buying experience in Kenya
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <button
            key={index}
            onClick={() => onFeatureClick(feature)}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-left cursor-pointer"
          >
            <div className={`w-16 h-16 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
              <feature.icon className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Learn more</span>
                <FaArrowRight className="ml-2 text-blue-500" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function CallToAction() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="relative z-10 p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Explore our extensive collection of premium used vehicles with verified history and complete peace of mind.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/carlisting"
              className="group inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 text-lg font-bold shadow-2xl"
            >
              <FaCar className="group-hover:scale-110 transition-transform duration-300" />
              <span>Browse Car Listings</span>
            </Link>
            <Link
              href="/pages/contact"
              className="group inline-flex items-center gap-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 text-lg font-bold"
            >
              <FaEnvelope className="group-hover:scale-110 transition-transform duration-300" />
              <span>Contact Expert</span>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { icon: FaShieldAlt, text: 'Secure Transactions' },
              { icon: FaCheckCircle, text: 'Verified Vehicles' },
              { icon: FaUsers, text: '24/7 Support' },
              { icon: FaAward, text: 'Best Prices Guaranteed' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <item.icon className="text-2xl text-green-300" />
                <span className="text-white font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ArticleTags({ tags }) {
  if (!tags || tags.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-linear-to-r from-gray-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
              <FaTags className="text-xl" />
            </div>
            <div>
              Explore Related Topics
              <p className="text-gray-600 text-sm font-normal mt-1">Click to discover more articles</p>
            </div>
          </h3>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, index) => (
              <Link
                key={index}
                href={`/pages/blogs?tag=${tag}`}
                className="group inline-flex items-center gap-2 bg-white text-gray-700 px-5 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:shadow-lg font-medium"
              >
                <span># {tag}</span>
                <FaExternalLinkAlt className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function RelatedPosts({ posts, currentPostId }) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="bg-linear-to-b from-gray-50 to-blue-50 border-t border-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Continue Your Automotive Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover more insights and expert advice from our automotive specialists
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => {
            // Process image URL for related posts
            const postImageUrl = post.mainImage 
              ? (post.mainImage.startsWith('http') ? post.mainImage : `${baseUrl}${post.mainImage.startsWith('/') ? '' : '/'}${post.mainImage}`)
              : `${baseUrl}/car1.png`
            
            return (
              <Link
                key={post.id}
                href={`/pages/blogs/${post.id}/${post.slug || post.id}`}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden block cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={postImageUrl} 
                    alt={post.imageAltText || post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                  {post.category && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <FaCalendar className="text-blue-500" />
                      <span>
                        {new Date(post.publishDate || post.createdAt).toLocaleDateString('short')}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <FaClock className="text-green-500" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-3 text-lg line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {post.authorName?.charAt(0) || 'C'}
                      </div>
                      <span className="text-gray-700 font-medium text-sm">{post.authorName}</span>
                    </div>
                    <FaArrowRight className="text-blue-500" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/pages/blogs"
            className="group inline-flex items-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg font-semibold"
          >
            <span>Explore More Articles</span>
            <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function ModernBlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [headings, setHeadings] = useState([])
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [featureModalOpen, setFeatureModalOpen] = useState(false)

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const postId = params.id
        if (!postId) throw new Error('No blog post ID provided')

        const response = await fetch(`/api/blogs/${postId}`)
        if (!response.ok) {
          if (response.status === 404) throw new Error('Blog post not found')
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        const postData = result.blogPost || result
        
        if (postData) {
          const transformedPost = {
            id: postData.id,
            title: postData.title || 'Untitled Article',
            excerpt: postData.excerpt || 'Discover valuable automotive insights and expert advice.',
            content: postData.content || '',
            authorName: postData.authorName || 'CorporateSellers Team',
            mainImage: postData.mainImage || null,
            imageAltText: postData.imageAltText || postData.title,
            category: postData.category || 'Automotive',
            tags: postData.tags || [],
            readTime: postData.readTime || '5 min read',
            publishDate: postData.publishDate || postData.createdAt,
            featured: postData.featured || false,
            metaTitle: postData.metaTitle || postData.title,
            metaDescription: postData.metaDescription || postData.excerpt,
            slug: postData.slug || postData.id,
            updatedAt: postData.updatedAt || postData.publishDate
          }
          
          setPost(transformedPost)
          
          if (postData.content) {
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = postData.content
            const headingElements = tempDiv.querySelectorAll('h2, h3')
            const extractedHeadings = Array.from(headingElements)
              .filter(h => h.textContent.trim())
              .map((h, index) => ({
                id: `section-${index + 1}`,
                text: h.textContent
              }))
            setHeadings(extractedHeadings)
          }
          
          if (postData.category) {
            const related = await blogApiService.getRelatedPosts(
              postData.category, 
              postData.id, 
              3
            )
            setRelatedPosts(related)
          }
        } else {
          throw new Error('Invalid blog post data format')
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
        setError(`Failed to load blog post: ${error.message}`)
        setTimeout(() => router.push('/pages/blogs'), 3000)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPost()
  }, [params.id, router])

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    const bookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '[]')
    if (isBookmarked) {
      localStorage.setItem('blogBookmarks', 
        JSON.stringify(bookmarks.filter(b => b !== post.id))
      )
    } else {
      localStorage.setItem('blogBookmarks', 
        JSON.stringify([...bookmarks, post.id])
      )
    }
  }

  const sharePost = (platform) => {
    if (!post) return

    const url = window.location.href
    const title = post.title
    const text = post.excerpt

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' - ' + text + ' ' + url)}`
    }
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} className="text-blue-600 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Loading Content</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Preparing your automotive insights and expert analysis...
          </p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-7xl text-gray-300 mb-6">🚗</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8 text-lg">
            {error || 'The article you\'re looking for doesn\'t exist or may have been moved.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/pages/blogs')}
              className="inline-flex items-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <FaArrowLeft />
              Back to Blog
            </button>
            <Link
              href="/carlisting"
              className="inline-flex items-center gap-3 bg-linear-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <FaCar />
              Browse Cars
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <ReadingProgressBar />
      <BlogPostSEOMeta post={post} />
      
      <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
        <ModernHeader 
          post={post}
          onBookmark={handleBookmark}
          isBookmarked={isBookmarked}
          onShare={sharePost}
        />

        <FeaturedImage 
          imageUrl={post.mainImage}
          altText={post.imageAltText}
          title={post.title}
        />

        {headings.length > 0 && <TableOfContents headings={headings} />}

        <ArticleContent content={post.content} title={post.title} />

        <AuthorBio authorName={post.authorName} />

        <CorporateFeatures 
          onFeatureClick={(feature) => {
            setSelectedFeature(feature)
            setFeatureModalOpen(true)
          }}
        />

        <CallToAction />

        <ArticleTags tags={post.tags} />

        <RelatedPosts posts={relatedPosts} currentPostId={post.id} />

        <footer className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Want More Automotive Insights?
              </h3>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter for the latest car buying tips and market updates
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/pages/blogs"
                  className="inline-flex items-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl text-lg font-semibold cursor-pointer"
                >
                  <FaArrowRight />
                  Explore More Articles
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-3 rounded-xl text-lg font-semibold border border-gray-300 cursor-pointer"
                >
                  <FaEnvelope />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <FeatureModal 
        feature={selectedFeature} 
        isOpen={featureModalOpen}
        onClose={() => setFeatureModalOpen(false)}
      />
    </>
  )
}