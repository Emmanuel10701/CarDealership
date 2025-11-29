"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Head from 'next/head'
import Link from 'next/link'
import { 
  FaSearch, 
  FaCalendar,
  FaUser,
  FaClock,
  FaEye,
  FaArrowRight,
  FaTags,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaStar,
  FaChartLine,
  FaCar
} from 'react-icons/fa'
import { CircularProgress, Breadcrumbs } from '@mui/material'
import { debounce } from 'lodash'

const blogApiService = {
  async getPublishedBlogPosts() {
    const response = await fetch('/api/blogs')
    if (!response.ok) throw new Error('Failed to fetch blog posts')
    const data = await response.json()
    return data.blogPosts || []
  },

  async getPopularPosts(limit = 5) {
    const response = await fetch(`/api/blogs?action=popular&limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch popular posts')
    const data = await response.json()
    return data.blogPosts || []
  },

  async getCategories() {
    const response = await fetch('/api/blogs?action=categories')
    if (!response.ok) throw new Error('Failed to fetch categories')
    const data = await response.json()
    return data.categories || []
  }
}

function BlogSEOMeta() {
  return (
    <Head>
      <title>Quality Used Cars & Automotive Insights | CorporateSellers Blog</title>
      <meta name="description" content="Discover expert guides on used car buying, selling tips, and automotive insights. CorporateSellers connects you with quality used cars and serious buyers." />
      <meta name="keywords" content="used cars, quality vehicles, car buying tips, automotive insights, CorporateSellers, dream cars" />
      <meta property="og:title" content="Quality Used Cars & Automotive Insights | CorporateSellers" />
      <meta property="og:description" content="Your trusted partner for quality used cars and automotive expertise." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://corporatesellers.com/blogs" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Quality Used Cars & Automotive Insights" />
      <meta name="twitter:description" content="CorporateSellers - Your trusted automotive partner" />
    </Head>
  )
}

function BlogCard({ post, featured = false }) {
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleReadMore = () => {
    router.push(`/blogs/${post.id}`)
  }

  return (
    <article className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer ${
      featured ? 'lg:col-span-2' : ''
    }`}>
      <div className="relative h-48 lg:h-64 overflow-hidden">
        {post.mainImage && !imageError ? (
          <img 
            src={post.mainImage} 
            alt={post.imageAltText || post.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-400">
            <FaCar className="text-4xl" />
          </div>
        )}
        
        {post.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <FaStar className="text-xs" />
              Featured
            </span>
          </div>
        )}
        
        {post.category && (
          <div className="absolute top-4 right-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {post.category}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
          <div className="flex items-center gap-1">
            <FaUser className="text-xs text-blue-600" />
            <span className="font-medium">{post.authorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCalendar className="text-xs text-blue-600" />
            <span>{formatDate(post.publishDate || post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock className="text-xs text-blue-600" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaEye className="text-xs text-blue-600" />
            <span>{post.views || 0}</span>
          </div>
        </div>

        <h2 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${
          featured ? 'text-2xl lg:text-3xl' : 'text-xl'
        }`}>
          {post.title}
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button 
            onClick={handleReadMore}
            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            <span>Continue Reading</span>
            <FaArrowRight className="transition-transform duration-300" />
          </button>
        </div>
      </div>
    </article>
  )
}

function BlogSidebar({ popularPosts, categories, onCategoryFilter, selectedCategory, searchTerm, onSearchChange }) {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    } catch (error) {
      console.error('Subscription failed:', error)
    }
  }

  return (
    <aside className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
          <FaSearch className="text-blue-600" />
          Search Articles
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search automotive insights..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
          <FaFilter className="text-blue-600" />
          Browse Categories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryFilter('all')}
            className={`flex items-center justify-between w-full text-left px-3 py-3 rounded-lg transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-blue-50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => onCategoryFilter(category)}
              className={`flex items-center justify-between w-full text-left px-3 py-3 rounded-lg transition-colors ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
          <FaChartLine className="text-green-600" />
          Popular Reads
        </h3>
        <div className="space-y-4">
          {popularPosts.map((post, index) => (
            <Link 
              key={post.id}
              href={`/blogs/${post.id}`}
              className="flex items-start gap-4 hover:no-underline p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-tight">
                  {post.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <FaEye className="text-xs" />
                  <span>{post.views} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <FaEnvelope className="text-yellow-300" />
          {isSubscribed ? 'Welcome! 🎉' : 'Auto Insights'}
        </h3>
        <p className="text-blue-100 text-sm mb-4">
          {isSubscribed 
            ? "You're subscribed to automotive excellence!"
            : "Get expert car buying tips and industry insights."
          }
        </p>
        
        {!isSubscribed && (
          <form onSubmit={handleSubscribe} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Insights
            </button>
          </form>
        )}
      </div>
    </aside>
  )
}

export default function BlogPage() {
  const searchParams = useSearchParams()
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(9)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [popularPosts, setPopularPosts] = useState([])
  const [categories, setCategories] = useState([])

  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term)
      setCurrentPage(1)
    }, 300),
    []
  )

  useEffect(() => {
    loadBlogData()
  }, [])

  const loadBlogData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [posts, popular, cats] = await Promise.all([
        blogApiService.getPublishedBlogPosts(),
        blogApiService.getPopularPosts(5),
        blogApiService.getCategories()
      ])
      
      setBlogPosts(posts)
      setPopularPosts(popular)
      setCategories(cats)
    } catch (err) {
      setError('Failed to load blog posts. Please try again.')
      console.error('Error loading blog data:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'newest': 
        return new Date(b.publishDate || b.createdAt) - new Date(a.publishDate || a.createdAt)
      case 'oldest': 
        return new Date(a.publishDate || a.createdAt) - new Date(b.publishDate || b.createdAt)
      case 'popular': 
        return (b.views || 0) - (a.views || 0)
      case 'featured': 
        return (b.featured === a.featured) ? 0 : b.featured ? -1 : 1
      default: return 0
    }
  })

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)

  const featuredPosts = sortedPosts.filter(post => post.featured).slice(0, 2)
  const regularPosts = currentPosts.filter(post => !post.featured)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} className="text-blue-600 mb-4" />
          <p className="text-lg text-gray-600">Loading automotive insights...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <BlogSEOMeta />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Breadcrumbs className="mb-6 text-blue-200 justify-center">
                <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                  Home
                </Link>
                <span className="text-white font-semibold">Automotive Insights</span>
              </Breadcrumbs>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                CorporateSellers Automotive Hub
              </h1>
              <p className="text-xl lg:text-2xl text-blue-200 mb-8 leading-relaxed">
                Your trusted source for quality used cars, expert buying guides, and automotive insights. 
                Discover how we connect serious buyers with dream cars.
              </p>
              
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Search automotive articles and guides..."
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="w-full px-6 py-4 pl-12 rounded-xl text-gray-900 text-lg focus:ring-4 focus:ring-blue-300 shadow-xl"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="text-blue-200 text-sm">Popular:</span>
                  {['Car Buying Tips', 'Quality Used Cars', 'Selling Guide', 'Maintenance'].map(topic => (
                    <button
                      key={topic}
                      onClick={() => debouncedSearch(topic)}
                      className="text-white text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <BlogSidebar
                popularPosts={popularPosts}
                categories={categories}
                onCategoryFilter={setSelectedCategory}
                selectedCategory={selectedCategory}
                searchTerm={searchTerm}
                onSearchChange={debouncedSearch}
              />
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {searchTerm ? `Search: "${searchTerm}"` : 'Latest Automotive Insights'}
                    </h2>
                    <p className="text-gray-600">
                      {sortedPosts.length} article{sortedPosts.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="featured">Featured First</option>
                  </select>
                </div>
              </div>

              {featuredPosts.length > 0 && !searchTerm && (
                <section className="mb-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    Featured Insights
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featuredPosts.map(post => (
                      <BlogCard key={post.id} post={post} featured={true} />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {searchTerm ? 'Search Results' : 'All Articles'}
                </h3>
                
                {currentPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {regularPosts.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
                    <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No articles found
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      {searchTerm 
                        ? 'Try different search terms or browse our categories.'
                        : 'Check back soon for new automotive insights!'
                      }
                    </p>
                  </div>
                )}
              </section>

              {sortedPosts.length > postsPerPage && (
                <div className="flex justify-between items-center gap-4 mt-12 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <FaChevronLeft />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${
                      currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Next
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}