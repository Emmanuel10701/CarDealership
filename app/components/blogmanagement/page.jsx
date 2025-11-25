"use client"

import { useState, useEffect, useCallback } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { 
  FaBlog, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaStar, 
  FaSearch, 
  FaSync,
  FaEye,
  FaCalendar,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaTag,
  FaFilter,
  FaSort,
  FaUpload,
  FaTimes,
  FaEyeSlash,
  FaGlobe,
  FaChartBar,
  FaBook,
  FaPalette,
  FaCog,
  FaSave,
  FaArrowLeft,
  FaExternalLinkAlt
} from 'react-icons/fa'
import { CircularProgress, Chip, Badge, Tooltip } from '@mui/material'
import { debounce } from 'lodash'

// API Service with corrected endpoints
const blogApiService = {
  // Get all blog posts
  async getBlogPosts() {
    const response = await fetch('/api/blogs')
    if (!response.ok) throw new Error('Failed to fetch blog posts')
    const data = await response.json()
    return data.blogPosts || []
  },

  // Get single blog post
  async getBlogPost(id) {
    const response = await fetch(`/api/blogs/${id}`)
    if (!response.ok) throw new Error('Failed to fetch blog post')
    const data = await response.json()
    return data.blogPost
  },

  // Create blog post with FormData for file upload
  async createBlogPost(formData) {
    const response = await fetch('/api/blogs', {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create blog post')
    }
    return await response.json()
  },

  // Update blog post - now includes status updates
  async updateBlogPost(id, formData) {
    const response = await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      body: formData,
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update blog post')
    }
    return await response.json()
  },

  // Delete blog post
  async deleteBlogPost(id) {
    const response = await fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete blog post')
    }
    return await response.json()
  },

  // Bulk operations - CORRECTED: Using individual API calls for bulk operations
  async bulkDeletePosts(ids) {
    // Since we don't have a bulk API, we'll use Promise.all with individual deletes
    const results = await Promise.allSettled(
      ids.map(id => this.deleteBlogPost(id))
    )
    
    const failedDeletes = results.filter((result, index) => 
      result.status === 'rejected'
    )
    
    if (failedDeletes.length > 0) {
      throw new Error(`Failed to delete ${failedDeletes.length} posts`)
    }
    
    return { success: true, deletedCount: ids.length }
  },

  async bulkUpdatePosts(ids, updates) {
    // Since we don't have a bulk API, we'll use Promise.all with individual updates
    const results = await Promise.allSettled(
      ids.map(id => {
        const formData = new FormData()
        Object.keys(updates).forEach(key => {
          formData.append(key, updates[key].toString())
        })
        return this.updateBlogPost(id, formData)
      })
    )
    
    const failedUpdates = results.filter((result, index) => 
      result.status === 'rejected'
    )
    
    if (failedUpdates.length > 0) {
      throw new Error(`Failed to update ${failedUpdates.length} posts`)
    }
    
    return { success: true, updatedCount: ids.length }
  }
}

// Image Upload Component
function ImageUpload({ image, onImageChange, onRemove }) {
  const [preview, setPreview] = useState(image)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    setPreview(image)
  }, [image])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }
      onImageChange(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange({ target: { files: [file] } })
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Featured Image
      </label>
      
      {preview ? (
        <div className="relative group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-2xl border-2 border-gray-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-2xl flex items-center justify-center">
            <button
              type="button"
              onClick={onRemove}
              className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all duration-200 transform scale-90 group-hover:scale-100"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
        >
          <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            Drag & drop an image here, or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Recommended: 1200x630px, max 5MB
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition duration-200 cursor-pointer font-semibold"
          >
            <FaUpload />
            Choose Image
          </label>
        </div>
      )}
    </div>
  )
}

// Blog Post Modal Component
function BlogPostModal({ onClose, onSave, post, loading }) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    authorName: post?.authorName || '',
    tags: post?.tags?.join(', ') || '',
    featured: post?.featured || false,
    status: post?.status || 'DRAFT',
    category: post?.category || '',
    imageAltText: post?.imageAltText || '',
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
  })
  const [mainImageFile, setMainImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(post?.mainImage || '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      
      // Append all form fields including status
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key].toString())
        }
      })

      // Append image file if exists
      if (mainImageFile) {
        formDataToSend.append('mainImageFile', mainImageFile)
      }

      await onSave(formDataToSend, post?.id)
    } catch (error) {
      throw error
    }
  }

  const handleImageChange = (file) => {
    setMainImageFile(file)
  }

  const handleImageRemove = () => {
    setMainImageFile(null)
    setImagePreview('')
  }

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {post ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition duration-200"
            >
              <FaTimes className="text-lg text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
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
                  Excerpt *
                </label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
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
                  rows={12}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical font-mono text-sm"
                  placeholder="Write your blog post content here..."
                />
                <div className="mt-2 text-sm text-gray-500">
                  Read time: {calculateReadTime(formData.content)} • 
                  Words: {formData.content.split(/\s+/).filter(word => word.length > 0).length}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Image Upload */}
              <ImageUpload
                image={imagePreview}
                onImageChange={handleImageChange}
                onRemove={handleImageRemove}
              />

              {/* Publishing Settings */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FaCog />
                  Publishing Settings
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

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
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Technology, Business..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter author name..."
                  />
                </div>
              </div>

              {/* SEO Settings */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FaGlobe />
                  SEO Settings
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Meta title for SEO..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Meta description for SEO..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.imageAltText}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageAltText: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Alt text for accessibility..."
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <FaTag />
                  Tags
                </h3>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., javascript, react, nextjs"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separate tags with commas
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-semibold disabled:opacity-50"
            >
              <FaTimesCircle />
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
                  <FaSave />
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

// Blog Post Card Component with modern styling and different font colors
function BlogPostCard({ post, onEdit, onDelete, onStatusChange, onView, selected, onSelect, actionLoading }) {
  const [imageError, setImageError] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800 border-green-200'
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PUBLISHED': return <FaGlobe className="text-xs" />
      case 'DRAFT': return <FaEyeSlash className="text-xs" />
      case 'ARCHIVED': return <FaTimesCircle className="text-xs" />
      default: return <FaEyeSlash className="text-xs" />
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 group hover:shadow-xl ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Selection Checkbox */}
      <div className="p-4 border-b border-gray-100 flex items-center">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(post.id, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-500">Select</span>
      </div>

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {post.mainImage && !imageError ? (
          <img 
            src={post.mainImage} 
            alt={post.imageAltText || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400">
            <FaBlog className="text-4xl mb-2" />
            <span className="text-sm">No Image</span>
          </div>
        )}
        
        <div className="absolute top-3 right-3 flex gap-2">
          {post.featured && (
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
              <FaStar className="text-xs" />
              Featured
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg border flex items-center gap-1 ${getStatusColor(post.status)}`}>
            {getStatusIcon(post.status)}
            {post.status.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Content Section with different font colors */}
      <div className="p-5">
        {/* Title with gradient text color */}
        <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800 text-lg mb-2 line-clamp-2 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300 cursor-pointer"
            onClick={() => onView(post)}>
          {post.title}
        </h3>
        
        {/* Excerpt with muted color */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-medium">{post.excerpt}</p>

        {/* Meta Information with varied colors */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-purple-600 font-medium">
              <FaUser className="text-xs" />
              <span>{post.authorName}</span>
            </div>
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <FaCalendar className="text-xs" />
              <span>{post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Not published'}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-orange-600 font-semibold">{post.readTime}</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-blue-600 font-medium">
                <FaEye className="text-xs" />
                <span>{post.views}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category and Tags with colorful styling */}
        <div className="flex items-center justify-between mb-4">
          {post.category && (
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md">
              {post.category}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags && post.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-sm">
              {tag}
            </span>
          ))}
          {post.tags && post.tags.length > 3 && (
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium">
              +{post.tags.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {post.status === 'DRAFT' && (
              <Tooltip title="Publish Post">
                <button
                  onClick={() => onStatusChange(post.id, 'PUBLISHED')}
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-xl hover:from-green-600 hover:to-green-700 transition duration-200 disabled:opacity-50 shadow-md"
                >
                  <FaGlobe className="text-xs" />
                </button>
              </Tooltip>
            )}
            {post.status === 'PUBLISHED' && (
              <Tooltip title="Unpublish Post">
                <button
                  onClick={() => onStatusChange(post.id, 'DRAFT')}
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-2 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition duration-200 disabled:opacity-50 shadow-md"
                >
                  <FaEyeSlash className="text-xs" />
                </button>
              </Tooltip>
            )}
            {post.status === 'ARCHIVED' && (
              <Tooltip title="Publish Post">
                <button
                  onClick={() => onStatusChange(post.id, 'PUBLISHED')}
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-xl hover:from-green-600 hover:to-green-700 transition duration-200 disabled:opacity-50 shadow-md"
                >
                  <FaGlobe className="text-xs" />
                </button>
              </Tooltip>
            )}
            <Tooltip title="View Post">
              <button 
                onClick={() => onView(post)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition duration-200 border border-transparent hover:border-green-200 shadow-sm"
              >
                <FaExternalLinkAlt className="text-xs" />
              </button>
            </Tooltip>
          </div>
          
          <div className="flex items-center gap-1">
            <Tooltip title="Edit Post">
              <button 
                onClick={() => onEdit(post)}
                disabled={actionLoading}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition duration-200 border border-transparent hover:border-blue-200 shadow-sm disabled:opacity-50"
              >
                <FaEdit className="text-sm" />
              </button>
            </Tooltip>
            <Tooltip title="Delete Post">
              <button 
                onClick={() => onDelete(post)}
                disabled={actionLoading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition duration-200 border border-transparent hover:border-red-200 shadow-sm disabled:opacity-50"
              >
                <FaTrash className="text-sm" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, color, icon: Icon, trend, subtitle }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform duration-200 ${colorClasses[color]}`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  )
}

// Bulk Actions Bar
function BulkActionsBar({ selectedCount, onBulkDelete, onBulkStatusChange, loading }) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge badgeContent={selectedCount} color="primary">
            <FaFilter className="text-blue-600 text-xl" />
          </Badge>
          <span className="text-blue-800 font-semibold text-lg">
            {selectedCount} post{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {!showActions ? (
            <button
              onClick={() => setShowActions(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg"
            >
              Bulk Actions
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onBulkStatusChange(e.target.value)
                    e.target.value = ''
                  }
                }}
                disabled={loading}
                className="px-4 py-3 border-2 border-blue-300 rounded-2xl bg-white text-blue-800 font-semibold focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Change Status...</option>
                <option value="PUBLISHED">Publish</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archive</option>
              </select>
              
              <button
                onClick={onBulkDelete}
                disabled={loading}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-2xl hover:from-red-700 hover:to-red-800 transition duration-200 font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                <FaTrash className="text-sm" />
                Delete Selected
              </button>
              
              <button
                onClick={() => setShowActions(false)}
                className="px-6 py-3 border-2 border-blue-300 text-blue-800 rounded-2xl hover:bg-blue-50 transition duration-200 font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced Post Detail View Modal
function PostDetailView({ post, onClose }) {
  if (!post) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Post Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition duration-200"
            >
              <FaTimes className="text-lg text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
              <p className="text-lg text-gray-600 italic mb-6">{post.excerpt}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Post Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                    post.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Author:</span>
                  <span className="text-gray-900 font-medium">{post.authorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900 font-medium">{post.category || 'Uncategorized'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Published:</span>
                  <span className="text-gray-900 font-medium">
                    {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Not published'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Read Time:</span>
                  <span className="text-gray-900 font-medium">{post.readTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="text-gray-900 font-medium">{post.views}</span>
                </div>
                {post.featured && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Featured:</span>
                    <span className="text-yellow-600 font-medium">Yes</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.mainImage && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Featured Image</h3>
              <img 
                src={post.mainImage} 
                alt={post.imageAltText || post.title}
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
              {post.imageAltText && (
                <p className="text-sm text-gray-600 mt-2">Alt: {post.imageAltText}</p>
              )}
            </div>
          )}

          {/* Content */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Content</h3>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {post.content}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-xl text-sm font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SEO Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {post.metaTitle && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Meta Title</h3>
                <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{post.metaTitle}</p>
              </div>
            )}
            {post.metaDescription && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Meta Description</h3>
                <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{post.metaDescription}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg"
          >
            Close
          </button>
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
  const [postsPerPage] = useState(12)
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [viewingPost, setViewingPost] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedPosts, setSelectedPosts] = useState(new Set())
  const [stats, setStats] = useState(null)

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term)
      setCurrentPage(1)
    }, 300),
    []
  )

  // Load blog posts and stats
  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    try {
      setLoading(true)
      setError('')
      const posts = await blogApiService.getBlogPosts()
      setBlogPosts(posts)
    } catch (err) {
      setError('Failed to load blog posts. Please try again.')
      toast.error('Failed to load blog posts!')
      console.error('Error loading blog posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const calculatedStats = {
      total: blogPosts.length,
      published: blogPosts.filter(p => p.status === 'PUBLISHED').length,
      draft: blogPosts.filter(p => p.status === 'DRAFT').length,
      archived: blogPosts.filter(p => p.status === 'ARCHIVED').length,
      featured: blogPosts.filter(p => p.featured).length,
      totalViews: blogPosts.reduce((sum, post) => sum + (post.views || 0), 0),
    }
    setStats(calculatedStats)
  }, [blogPosts])

  const handleCreatePost = async (formData) => {
    try {
      setActionLoading(true)
      const result = await blogApiService.createBlogPost(formData)
      setBlogPosts(prev => [result.post, ...prev])
      setShowCreateModal(false)
      toast.success('Blog post created successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to create blog post!')
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdatePost = async (id, formData) => {
    try {
      setActionLoading(true)
      const result = await blogApiService.updateBlogPost(id, formData)
      setBlogPosts(prev => prev.map(post => post.id === id ? result.post : post))
      setEditingPost(null)
      toast.success('Blog post updated successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to update blog post!')
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  // Updated status change handler using the update endpoint
  const handleStatusChange = async (id, status) => {
    try {
      setActionLoading(true)
      const formData = new FormData()
      formData.append('status', status)
      
      const result = await blogApiService.updateBlogPost(id, formData)
      setBlogPosts(prev => prev.map(post => 
        post.id === id ? { ...post, status, publishDate: status === 'PUBLISHED' ? new Date() : post.publishDate } : post
      ))
      toast.success(`Post ${status.toLowerCase()} successfully!`)
    } catch (err) {
      toast.error('Failed to update post status!')
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
      setSelectedPosts(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      toast.success('Blog post deleted successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to delete blog post!')
    } finally {
      setActionLoading(false)
    }
  }

  // CORRECTED: Bulk delete using individual API calls
  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return
    
    try {
      setActionLoading(true)
      const selectedIds = Array.from(selectedPosts)
      await blogApiService.bulkDeletePosts(selectedIds)
      setBlogPosts(prev => prev.filter(post => !selectedPosts.has(post.id)))
      setSelectedPosts(new Set())
      toast.success(`Deleted ${selectedIds.length} posts successfully!`)
    } catch (err) {
      toast.error(err.message || 'Failed to delete some posts!')
    } finally {
      setActionLoading(false)
    }
  }

  // CORRECTED: Bulk status change using individual API calls
  const handleBulkStatusChange = async (status) => {
    if (selectedPosts.size === 0) return
    
    try {
      setActionLoading(true)
      const selectedIds = Array.from(selectedPosts)
      await blogApiService.bulkUpdatePosts(selectedIds, { status })
      setBlogPosts(prev => prev.map(post => 
        selectedPosts.has(post.id) 
          ? { ...post, status, publishDate: status === 'PUBLISHED' ? new Date() : post.publishDate }
          : post
      ))
      setSelectedPosts(new Set())
      toast.success(`Updated ${selectedIds.length} posts to ${status.toLowerCase()}!`)
    } catch (err) {
      toast.error(err.message || 'Failed to update some posts!')
    } finally {
      setActionLoading(false)
    }
  }

  const handlePostSelect = (postId, selected) => {
    setSelectedPosts(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(postId)
      } else {
        newSet.delete(postId)
      }
      return newSet
    })
  }

  const handleSelectAll = (selected) => {
    if (selected) {
      setSelectedPosts(new Set(currentPosts.map(post => post.id)))
    } else {
      setSelectedPosts(new Set())
    }
  }

  // Filter and sort posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
                         post.category?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt)
      case 'popular': return (b.views || 0) - (a.views || 0)
      case 'title': return a.title.localeCompare(b.title)
      default: return 0
    }
  })

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)

  if (loading && blogPosts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <CircularProgress size={40} className="text-blue-600 mx-auto mb-4" />
          <span className="text-lg text-gray-600">Loading blog posts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
            <p className="text-gray-600">Create and manage engaging blog content for your audience</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadBlogPosts}
              className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-2xl hover:bg-gray-700 transition duration-200 font-semibold shadow-lg"
            >
              <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-lg"
            >
              <FaPlus className="text-sm" />
              Create New Post
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <StatCard title="Total Posts" value={stats.total} color="blue" icon={FaBook} />
          <StatCard title="Published" value={stats.published} color="green" icon={FaGlobe} />
          <StatCard title="Drafts" value={stats.draft} color="yellow" icon={FaEdit} />
          <StatCard title="Featured" value={stats.featured} color="purple" icon={FaStar} />
          <StatCard title="Total Views" value={stats.totalViews.toLocaleString()} color="indigo" icon={FaEye} />
        </div>
      )}

      {/* Bulk Actions */}
      {selectedPosts.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedPosts.size}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
          loading={actionLoading}
        />
      )}

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search posts by title, author, tags, or category..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-gray-50"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            >
              <option value="all">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Selection Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedPosts.size > 0 && selectedPosts.size === currentPosts.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              Select all {currentPosts.length} posts on this page
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {currentPosts.length} of {sortedPosts.length} posts
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {currentPosts.map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            onEdit={setEditingPost}
            onDelete={setDeleteConfirm}
            onStatusChange={handleStatusChange}
            onView={setViewingPost}
            selected={selectedPosts.has(post.id)}
            onSelect={handlePostSelect}
            actionLoading={actionLoading}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentPosts.length === 0 && !loading && (
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

      {/* Enhanced Post Detail View Modal */}
      {viewingPost && (
        <PostDetailView
          post={viewingPost}
          onClose={() => setViewingPost(null)}
        />
      )}
    </div>
  )
}