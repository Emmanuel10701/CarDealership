"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Head from 'next/head'
import Link from 'next/link'
import { 
  FaCalendar,
  FaUser,
  FaClock,
  FaEye,
  FaArrowLeft,
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaBookmark,
  FaRegBookmark,
  FaTags,
  FaHome,
  FaCar,
  FaShield,
  FaStar,
  FaCheckCircle,
  FaUsers,
  FaSearch,
  FaHandshake,
  FaAward,
  FaHeart
} from 'react-icons/fa'
import { CircularProgress, Breadcrumbs } from '@mui/material'

// Blog API Service for individual posts
const blogApiService = {
  async getBlogPostById(id) {
    const response = await fetch(`/api/blogs?id=${id}`)
    if (!response.ok) throw new Error('Failed to fetch blog post')
    const data = await response.json()
    return data.blogPost
  },

  async getRelatedPosts(category, currentPostId, limit = 3) {
    const response = await fetch(`/api/blogs?category=${category}&exclude=${currentPostId}&limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch related posts')
    const data = await response.json()
    return data.blogPosts || []
  }
}

// SEO Component for Individual Posts
function BlogPostSEOMeta({ post }) {
  if (!post) return null

  return (
    <Head>
      <title>{post.metaTitle || post.title} | CorporateSellers</title>
      <meta name="description" content={post.metaDescription || post.excerpt} />
      <meta name="keywords" content={post.tags ? post.tags.join(', ') : 'used cars, quality vehicles, car buying, automotive, CorporateSellers'} />
      
      {/* Open Graph */}
      <meta property="og:title" content={post.metaTitle || post.title} />
      <meta property="og:description" content={post.metaDescription || post.excerpt} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`https://corporatesellers.com/blogs/${post.id}`} />
      {post.mainImage && <meta property="og:image" content={post.mainImage} />}
      <meta property="og:site_name" content="CorporateSellers" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.metaTitle || post.title} />
      <meta name="twitter:description" content={post.metaDescription || post.excerpt} />
      {post.mainImage && <meta name="twitter:image" content={post.mainImage} />}
      
      {/* Article Specific */}
      <meta property="article:published_time" content={post.publishDate || post.createdAt} />
      <meta property="article:author" content={post.authorName} />
      {post.tags && post.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
    </Head>
  )
}

// Reading Progress Bar
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrollPercent)
    }

    window.addEventListener('scroll', updateProgress)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// Related Post Card Component
function RelatedPostCard({ post }) {
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <article className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        {post.mainImage && !imageError ? (
          <img 
            src={post.mainImage} 
            alt={post.imageAltText || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
            <FaCar className="text-2xl" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <FaCalendar className="text-blue-600" />
          <span>{formatDate(post.publishDate || post.createdAt)}</span>
          <span>•</span>
          <FaClock className="text-blue-600" />
          <span>{post.readTime}</span>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={`/blogs/${post.id}`} className="hover:no-underline">
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
      </div>
    </article>
  )
}

// Feature Highlight Component
function FeatureHighlight({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
        <Icon className="text-lg" />
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// Main Blog Post Page Component
export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadBlogPost()
    }
  }, [params.id])

  const loadBlogPost = async () => {
    try {
      setLoading(true)
      setError('')
      
      const postData = await blogApiService.getBlogPostById(params.id)
      if (!postData) {
        setError('Blog post not found')
        return
      }
      
      setPost(postData)
      
      // Load related posts
      if (postData.category) {
        const related = await blogApiService.getRelatedPosts(postData.category, postData.id)
        setRelatedPosts(related)
      }
    } catch (err) {
      setError('Failed to load blog post. Please try again.')
      console.error('Error loading blog post:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // In a real app, you would save to localStorage or send to API
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
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  // Enhanced content for CorporateSellers
  const corporateSellersContent = {
    introduction: `
      At CorporateSellers, we understand that buying a used car is more than just a transaction—it's about finding a vehicle that becomes part of your life's journey. We're not just another car dealership; we're your trusted partner in automotive excellence, committed to transforming the way people experience used car ownership.

      Founded on the principles of transparency, quality, and customer satisfaction, CorporateSellers has emerged as a leading force in the pre-owned automotive industry. Our mission is simple yet profound: to connect discerning buyers with their dream cars while ensuring every vehicle meets our rigorous standards of excellence.
    `,

    ourCommitment: `
      Our commitment to quality is the cornerstone of everything we do. Every vehicle in our inventory undergoes a comprehensive 150-point inspection process conducted by certified automotive technicians. We don't just look for obvious issues; we delve deep into every component to ensure your safety and peace of mind.

      From engine performance and transmission smoothness to electrical systems and safety features, no stone is left unturned. We believe that when you choose a used car from CorporateSellers, you should feel as confident as you would with a brand-new vehicle.
    `,

    buyerBenefits: `
      For potential buyers, we offer an unparalleled selection of quality used vehicles across all makes and models. Whether you're looking for a fuel-efficient commuter car, a spacious family SUV, or a luxury vehicle that fits your lifestyle, our diverse inventory has something for everyone.

      What sets us apart is our dedication to complete transparency. Each vehicle comes with a detailed history report, service records, and our comprehensive inspection checklist. We want you to know exactly what you're getting, so there are no surprises down the road.
    `,

    sellerAdvantages: `
      If you're looking to sell your vehicle, CorporateSellers provides the perfect platform to connect with serious, qualified buyers. We understand that selling a car can be stressful, which is why we've streamlined the process to make it as seamless and profitable as possible for you.

      Our marketing expertise ensures your vehicle gets maximum visibility across multiple platforms. We handle the negotiations, paperwork, and logistics, so you can focus on what matters most to you. With CorporateSellers, you're not just listing a car; you're partnering with professionals who understand the true value of your vehicle.
    `,

    qualityAssurance: `
      Quality isn't just a buzzword for us—it's our promise. Every vehicle we offer comes with:
      • Comprehensive mechanical inspection
      • Detailed vehicle history report
      • Safety feature verification
      • Cosmetic condition assessment
      • Road test certification
      • 30-day limited warranty on selected vehicles

      We stand behind every car we sell because we believe in building relationships that last long after the sale is complete.
    `,

    dreamCars: `
      Your dream car is waiting, and we're here to help you find it. At CorporateSellers, we understand that a dream car isn't just about luxury or price—it's about finding the perfect vehicle that matches your personality, needs, and aspirations.

      Our team of automotive consultants takes the time to understand what you're truly looking for. We consider your driving habits, family needs, budget, and personal preferences to recommend vehicles that you'll love for years to come. From sporty coupes to practical sedans, from rugged trucks to eco-friendly hybrids, we help you discover the car that feels like it was made just for you.
    `,

    communityImpact: `
      Beyond selling cars, we're committed to making a positive impact in our community. We believe in sustainable practices and often feature eco-friendly vehicles in our inventory. Our commitment extends to:
      • Supporting local automotive education programs
      • Promoting safe driving initiatives
      • Environmental responsibility in our operations
      • Community outreach and support

      When you choose CorporateSellers, you're supporting a business that cares about more than just profits—we care about people and our planet.
    `,

    whyChooseUs: `
      Choosing CorporateSellers means choosing:
      • Uncompromising quality standards
      • Transparent pricing with no hidden fees
      • Expert guidance throughout your car-buying journey
      • Extensive inventory of carefully vetted vehicles
      • Flexible financing options for qualified buyers
      • Exceptional after-sales support and service
      • Commitment to customer satisfaction

      We measure our success by your satisfaction, and we're proud to have helped thousands of customers find their perfect vehicles.
    `
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} className="text-blue-600 mb-4" />
          <p className="text-lg text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl text-gray-400 mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or may have been moved.</p>
          <button
            onClick={() => router.push('/blogs')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <FaArrowLeft />
            Back to Blog
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <ReadingProgressBar />
      <BlogPostSEOMeta post={post} />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Breadcrumbs className="text-sm">
                <Link href="/" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                  <FaHome className="text-xs" />
                  Home
                </Link>
                <Link href="/blogs" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Blog
                </Link>
                <span className="text-gray-900 font-semibold truncate max-w-40">
                  {post.title}
                </span>
              </Breadcrumbs>

              <button
                onClick={() => router.push('/blogs')}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FaArrowLeft />
                Back to Blog
              </button>
            </div>
          </div>
        </nav>

        {/* Article Content */}
        <article className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="text-center mb-12">
              {/* Categories and Meta */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {post.category && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                )}
                {post.featured && (
                  <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                    <FaStar className="text-xs" />
                    Featured
                  </span>
                )}
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                  <FaClock className="text-xs" />
                  {post.readTime}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              {/* Excerpt */}
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Author and Date */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {post.authorName?.charAt(0) || 'A'}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{post.authorName}</div>
                    <div className="text-sm text-gray-500">Automotive Expert</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-blue-600" />
                    <span>
                      {new Date(post.publishDate || post.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEye className="text-blue-600" />
                    <span>{(post.views || 0) + 1} views</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center items-center gap-4 flex-wrap">
                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isBookmarked 
                      ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200'
                  }`}
                >
                  {isBookmarked ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark />}
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">Share:</span>
                  <div className="flex gap-2">
                    {[
                      { platform: 'facebook', icon: FaFacebook, color: 'hover:bg-blue-600 hover:text-white' },
                      { platform: 'twitter', icon: FaTwitter, color: 'hover:bg-blue-400 hover:text-white' },
                      { platform: 'linkedin', icon: FaLinkedin, color: 'hover:bg-blue-700 hover:text-white' },
                      { platform: 'whatsapp', icon: FaWhatsapp, color: 'hover:bg-green-500 hover:text-white' }
                    ].map(({ platform, icon: Icon, color }) => (
                      <button
                        key={platform}
                        onClick={() => sharePost(platform)}
                        className={`p-2 rounded-lg text-gray-600 bg-gray-100 transition-all duration-300 ${color}`}
                      >
                        <Icon className="text-sm" />
                      </button>
                    ))}
                    <button
                      onClick={copyLink}
                      className="p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                    >
                      <FaShareAlt className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.mainImage && (
              <div className="mb-12">
                <img 
                  src={post.mainImage} 
                  alt={post.imageAltText || post.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            )}

            {/* Enhanced Article Content */}
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaHeart className="text-red-500" />
                  Welcome to CorporateSellers
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                  {corporateSellersContent.introduction.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Our Commitment Section */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaShield className="text-green-500" />
                  Our Unwavering Commitment to Quality
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                  {corporateSellersContent.ourCommitment.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Feature Highlights */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Why Choose CorporateSellers?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <FeatureHighlight
                    icon={FaCar}
                    title="Quality Used Cars"
                    description="Every vehicle undergoes rigorous 150-point inspection to ensure reliability and safety for your peace of mind."
                  />
                  <FeatureHighlight
                    icon={FaUsers}
                    title="Connecting Buyers & Sellers"
                    description="We bridge the gap between serious buyers and qualified sellers, creating win-win situations for everyone involved."
                  />
                  <FeatureHighlight
                    icon={FaSearch}
                    title="Dream Car Matching"
                    description="Our expert consultants help you find the perfect vehicle that matches your lifestyle, needs, and aspirations."
                  />
                  <FeatureHighlight
                    icon={FaHandshake}
                    title="Trusted Partnership"
                    description="We build lasting relationships with our customers, providing support and guidance throughout your automotive journey."
                  />
                </div>
              </section>

              {/* Buyer Benefits */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaCheckCircle className="text-blue-500" />
                  Benefits for Car Buyers
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                  {corporateSellersContent.buyerBenefits.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Seller Advantages */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaAward className="text-purple-500" />
                  Advantages for Car Sellers
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                  {corporateSellersContent.sellerAdvantages.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Quality Assurance */}
              <section className="mb-12 bg-blue-50 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  Our Quality Assurance Promise
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                  {corporateSellersContent.qualityAssurance.split('\n').map((paragraph, index) => (
                    <p key={index} className={index === 0 ? 'font-semibold text-blue-800' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>

              {/* Dream Cars Section */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaStar className="text-yellow-500" />
                  Finding Your Dream Car
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                  {corporateSellersContent.dreamCars.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Why Choose Us */}
              <section className="mb-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  The CorporateSellers Difference
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                  {corporateSellersContent.whyChooseUs.split('\n').map((paragraph, index) => (
                    <p key={index} className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span>{paragraph.replace('• ', '')}</span>
                    </p>
                  ))}
                </div>
              </section>

              {/* Community Impact */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaUsers className="text-green-500" />
                  Beyond Business: Our Community Commitment
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                  {corporateSellersContent.communityImpact.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Call to Action */}
              <section className="text-center mb-12">
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
                  <h2 className="text-2xl font-bold mb-4">Ready to Find Your Dream Car?</h2>
                  <p className="text-blue-100 mb-6 text-lg">
                    Join thousands of satisfied customers who have found their perfect vehicle through CorporateSellers.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                      Browse Our Inventory
                    </button>
                    <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                      Contact Our Experts
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaTags className="text-blue-600" />
                  Topics Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blogs?search=${tag}`}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-300 font-medium"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-white border-t border-gray-200 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Continue Your Automotive Journey
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}