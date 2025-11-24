"use client"

import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { 
  FaBlog, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch, 
  FaSync,
  FaEye,
  FaCalendar,
  FaUser,
  FaThumbsUp,
  FaComment,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa'
import { CircularProgress } from '@mui/material'

// Blog Post Modal Component
function BlogPostModal({ onClose, onSave, post, loading }) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author: post?.author || '',
    tags: post?.tags?.join(', ') || '',
    featured: post?.featured || false,
    status: post?.status || 'draft'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSave({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        publishDate: post?.publishDate || new Date().toISOString().split('T')[0],
        readTime: calculateReadTime(formData.content),
        views: post?.views || 0,
        likes: post?.likes || 0,
        comments: post?.comments || 0,
        image: "/api/placeholder/400/200"
      })
    } catch (error) {
      throw error
    }
  }

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {post ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter post title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter author name..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt *
            </label>
            <textarea
              required
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the post..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Write your blog post content here..."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., EV, Technology, Cars"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured Post
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <CircularProgress size={20} className="text-white" />
                  {post ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  {post ? 'Update Post' : 'Create Post'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Blog Post Card Component
function BlogPostCard({ post, onEdit, onDelete, onPublish, actionLoading }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {!imageError ? (
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-400">
            <FaBlog className="text-4xl mb-2" />
            <span className="text-sm">No Image</span>
          </div>
        )}
        
        <div className="absolute top-3 right-3 flex gap-2">
          {post.featured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
              Featured
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-lg ${
            post.status === 'published' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {post.status}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

        {/* Meta Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FaUser className="text-xs" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCalendar className="text-xs" />
              <span>{new Date(post.publishDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{post.readTime}</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <FaEye className="text-xs" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaThumbsUp className="text-xs" />
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
              {tag}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
              +{post.tags.length - 2}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {post.status === 'draft' && (
              <button
                onClick={() => onPublish(post.id)}
                disabled={actionLoading}
                className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 transition duration-200 disabled:opacity-50"
              >
                Publish
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onEdit(post)}
              disabled={actionLoading}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition duration-200 border border-transparent hover:border-blue-200 disabled:opacity-50"
              title="Edit Post"
            >
              <FaEdit className="text-base" />
            </button>
            <button 
              onClick={() => onDelete(post)}
              disabled={actionLoading}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition duration-200 border border-transparent hover:border-red-200 disabled:opacity-50"
              title="Delete Post"
            >
              <FaTrash className="text-base" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, color, icon: Icon }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${colorClasses[color]}`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  )
}

// Main Blog Management Component
export default function BlogManagement() {
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(8)
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // API Service for Blog
  const blogApiService = {
    async getBlogPosts() {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return [
        {
          id: 1,
          title: "The Future of Electric Vehicles in 2024",
          content: "Electric vehicles are transforming the automotive industry...",
          excerpt: "Discover how electric vehicles are shaping the future of transportation.",
          author: "John Smith",
          publishDate: "2024-01-15",
          status: "published",
          featured: true,
          tags: ["EV", "Technology", "Sustainability"],
          readTime: "5 min read",
          views: 1245,
          likes: 89,
          comments: 23,
          image: "/api/placeholder/400/200"
        },
        // ... more sample posts
      ]
    },

    async createBlogPost(postData) {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })
      if (!response.ok) throw new Error('Failed to create blog post')
      return await response.json()
    },

    async updateBlogPost(id, postData) {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })
      if (!response.ok) throw new Error('Failed to update blog post')
      return await response.json()
    },

    async deleteBlogPost(id) {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete blog post')
      return await response.json()
    }
  }

  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    try {
      setLoading(true)
      setError('')
      const posts = await blogApiService.getBlogPosts()
      setBlogPosts(posts)
      toast.success('Blog posts loaded successfully!')
    } catch (err) {
      setError('Failed to load blog posts. Please try again.')
      toast.error('Failed to load blog posts!')
      console.error('Error loading blog posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (postData) => {
    try {
      setActionLoading(true)
      const result = await blogApiService.createBlogPost(postData)
      setBlogPosts(prev => [result.post, ...prev])
      setShowCreateModal(false)
      toast.success('Blog post created successfully!')
    } catch (err) {
      toast.error('Failed to create blog post!')
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdatePost = async (id, postData) => {
    try {
      setActionLoading(true)
      const result = await blogApiService.updateBlogPost(id, postData)
      setBlogPosts(prev => prev.map(post => post.id === id ? { ...post, ...postData } : post))
      setEditingPost(null)
      toast.success('Blog post updated successfully!')
    } catch (err) {
      toast.error('Failed to update blog post!')
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeletePost = async (id) => {
    try {
      setActionLoading(true)
      await blogApiService.deleteBlogPost(id)
      setBlogPosts(prev => prev.filter(post => post.id !== id))
      setDeleteConfirm(null)
      toast.success('Blog post deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete blog post!')
    } finally {
      setActionLoading(false)
    }
  }

  // Filter and sort posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.publishDate) - new Date(a.publishDate)
      case 'oldest': return new Date(a.publishDate) - new Date(b.publishDate)
      case 'popular': return b.views - a.views
      case 'likes': return b.likes - a.likes
      default: return 0
    }
  })

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <CircularProgress size={40} className="text-blue-600 mx-auto mb-4" />
          <span className="text-lg text-gray-600">Loading blog posts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
            <p className="text-gray-600">Create and manage engaging blog content for your audience</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg"
          >
            <FaPlus className="text-sm" />
            Create New Post
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Posts" value={blogPosts.length} color="blue" icon={FaBlog} />
        <StatCard title="Published" value={blogPosts.filter(p => p.status === 'published').length} color="green" icon={FaCheckCircle} />
        <StatCard title="Drafts" value={blogPosts.filter(p => p.status === 'draft').length} color="yellow" icon={FaEdit} />
        <StatCard title="Total Views" value={blogPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()} color="purple" icon={FaEye} />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search posts by title, author, or tags..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-gray-50"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="likes">Most Likes</option>
            </select>

            <button
              onClick={loadBlogPosts}
              className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-2xl hover:bg-gray-700 transition duration-200 font-semibold shadow-lg"
            >
              <FaSync className="text-sm" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {currentPosts.map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            onEdit={setEditingPost}
            onDelete={setDeleteConfirm}
            onPublish={() => {}}
            actionLoading={actionLoading}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentPosts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
          <FaBlog className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? 'No posts found' : 'No blog posts available'}
          </h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search criteria' : 'Start by creating your first blog post to engage your audience'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg flex items-center gap-2 mx-auto text-lg"
          >
            <FaPlus />
            Create Your First Post
          </button>
        </div>
      )}

      {/* Pagination */}
      {sortedPosts.length > postsPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 bg-white rounded-2xl shadow-lg gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaChevronLeft /> Previous
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <span className="text-sm text-gray-500">
              ({sortedPosts.length} total posts)
            </span>
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <BlogPostModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreatePost}
          loading={actionLoading}
        />
      )}

      {editingPost && (
        <BlogPostModal
          onClose={() => setEditingPost(null)}
          onSave={(data) => handleUpdatePost(editingPost.id, data)}
          post={editingPost}
          loading={actionLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FaExclamationTriangle className="text-red-500" />
                Confirm Deletion
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the blog post "<strong>{deleteConfirm?.title}</strong>"? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={actionLoading}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(deleteConfirm.id)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-2xl hover:bg-red-700 transition duration-200 font-semibold shadow-lg disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <CircularProgress size={20} className="text-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      Delete Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}