"use client"

import { useState, useEffect, useCallback } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { 
  FaBlog, FaEdit, FaTrash, FaPlus, FaStar, FaSearch, FaSync,
  FaEye, FaCalendar, FaUser, FaChevronLeft, FaChevronRight,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaChartBar,
  FaImage, FaTag, FaFilter, FaSort, FaUpload, FaTimes, FaEyeSlash,
  FaGlobe, FaBook, FaCog, FaSave, FaExternalLinkAlt, FaLink, FaInfoCircle,
  FaCopy, FaRocket, FaSparkles, FaShieldAlt, FaLayerGroup, FaHashtag,
  FaClock, FaTrendingUp, FaZap, FaFacebook, FaTwitter, FaLinkedin,
  FaWhatsapp, FaPalette, FaMagic, FaBolt, FaRobot, FaShield, FaCrown,FaCheck,
  FaGem, FaFire, FaCloudUpload, FaRegClock, FaRegEye, FaRegBookmark,
  FaRegComments, FaRegHeart, FaShare, FaRegCopy, FaRegEdit, FaRegTrashAlt,
  FaRegStar, FaRegCalendarAlt, FaRegUser, FaRegImages, FaRegFileAlt,
  FaRegNewspaper, FaRegChartBar, FaRegSun, FaRegMoon, FaRegBell,
  FaRegEnvelope, FaRegQuestionCircle, FaTh, FaList
} from 'react-icons/fa'
import { CircularProgress, Chip, Badge, Tooltip, Modal, Box, Typography, Button, TextField, TextareaAutosize, Switch, FormControlLabel, Slider } from '@mui/material'
import { debounce } from 'lodash'

// Modern Loading Spinner Component - Made TWICE as large
function ModernLoadingSpinner({ message = "Loading...", size = "medium" }) {
  const sizes = {
    small: { outer: 60, inner: 24 },    // Doubled from 30, 12
    medium: { outer: 100, inner: 40 },  // Doubled from 50, 20
    large: { outer: 120, inner: 48 }    // Doubled from 60, 24
  }

  const { outer, inner } = sizes[size]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="relative">
            <CircularProgress 
              size={outer} 
              thickness={4}
              className="text-blue-600"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20`}
                   style={{ width: inner, height: inner }}></div>
            </div>
          </div>
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        </div>
        <div className="mt-8 space-y-2">
          <span className="block text-xl font-semibold text-gray-700 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            {message}
          </span>
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
                   style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Modern View Modal Component
function ModernViewModal({ post, onClose, onEdit }) {
  if (!post) return null

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  }

  const imageUrl = getImageUrl(post.mainImage)

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '1000px',
        maxHeight: '95vh', bgcolor: 'background.paper',
        borderRadius: 3, boxShadow: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <FaEye className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">View Blog Post</h2>
                <p className="text-blue-100 opacity-90 mt-1">
                  Complete overview of your blog post
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => onEdit(post)} className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-2xl hover:bg-yellow-600 transition duration-200 font-bold shadow-lg cursor-pointer">
                <FaEdit className="text-sm" /> Edit Post
              </button>
              <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200 cursor-pointer">
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(95vh-200px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
                <p className="text-lg text-gray-600 italic mb-6">{post.excerpt}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaChartBar className="text-blue-600" />
                  Post Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 
                      post.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Author:</span>
                    <span className="text-gray-900 font-bold">{post.authorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-gray-900 font-bold">{post.category || 'Uncategorized'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published:</span>
                    <span className="text-gray-900 font-bold">
                      {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Not published'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Read Time:</span>
                    <span className="text-gray-900 font-bold">{post.readTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Views:</span>
                    <span className="text-gray-900 font-bold">{post.views}</span>
                  </div>
                  {post.featured && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Featured:</span>
                      <span className="text-yellow-600 font-bold flex items-center gap-1">
                        <FaStar className="text-sm" />Yes
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {imageUrl && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Featured Image</h3>
                <img 
                  src={imageUrl} 
                  alt={post.imageAltText || post.title} 
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  onError={(e) => e.target.style.display = 'none'} 
                />
                {post.imageAltText && (
                  <p className="text-sm text-gray-600 mt-2">Alt: {post.imageAltText}</p>
                )}
              </div>
            )}

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Content</h3>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {post.content}
                  </div>
                </div>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaHashtag className="text-blue-600" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-xl text-sm font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {post.metaTitle && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaGlobe className="text-orange-600" />
                    Meta Title
                  </h3>
                  <p className="text-gray-700 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                    {post.metaTitle}
                  </p>
                </div>
              )}
              {post.metaDescription && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaBook className="text-teal-600" />
                    Meta Description
                  </h3>
                  <p className="text-gray-700 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200">
                    {post.metaDescription}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <button 
              onClick={onClose} 
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition duration-200 font-bold shadow-lg cursor-pointer"
            >
              Close
            </button>
            <button 
              onClick={() => onEdit(post)} 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition duration-200 font-bold shadow-lg cursor-pointer"
            >
              <FaEdit /> Edit Post
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

// Modern API Service
const blogApiService = {
  async getBlogPosts() {
    const response = await fetch('/api/blogs')
    if (!response.ok) throw new Error('Failed to fetch blog posts')
    const data = await response.json()
    return data.blogPosts || []
  },

  async getBlogPost(id) {
    const response = await fetch(`/api/blogs/${id}`)
    if (!response.ok) throw new Error('Failed to fetch blog post')
    const data = await response.json()
    return data.blogPost
  },

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

  async bulkDeletePosts(ids) {
    const results = await Promise.allSettled(ids.map(id => this.deleteBlogPost(id)))
    const failedDeletes = results.filter(result => result.status === 'rejected')
    if (failedDeletes.length > 0) throw new Error(`Failed to delete ${failedDeletes.length} posts`)
    return { success: true, deletedCount: ids.length }
  },

  async bulkUpdatePosts(ids, updates) {
    const results = await Promise.allSettled(
      ids.map(id => {
        const formData = new FormData()
        Object.keys(updates).forEach(key => formData.append(key, updates[key].toString()))
        return this.updateBlogPost(id, formData)
      })
    )
    const failedUpdates = results.filter(result => result.status === 'rejected')
    if (failedUpdates.length > 0) throw new Error(`Failed to update ${failedUpdates.length} posts`)
    return { success: true, updatedCount: ids.length }
  }
}

// Enhanced Modern Image Upload Component with your exact implementation
function ModernImageUpload({ image, onImageChange, onRemove, label = "Featured Image", required = false }) {
  const [preview, setPreview] = useState(image)
  const [dragOver, setDragOver] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (image && typeof image === 'string') {
      const formattedImage = image.startsWith('/') ? image : `/${image}`
      setPreview(formattedImage)
      setImageLoaded(false)
    } else {
      setPreview(image)
      setImageLoaded(false)
    }
  }, [image])

  const simulateUpload = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 20
      })
    }, 100)
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10)
    
    if (files.length === 0) return

    // Use your exact image upload logic
    setIsSubmitting(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 20
      })
    }, 100)

    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      name: file.name,
      type: file.type,
      size: file.size,
      id: Math.random().toString(36).substr(2, 9)
    }))

    setTimeout(() => {
      // For single image, take the first one
      if (files.length > 0) {
        const file = files[0]
        simulateUpload()
        onImageChange(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreview(e.target.result)
          setImageLoaded(true)
          setUploadProgress(100)
        }
        reader.readAsDataURL(file)
      }
      setUploadProgress(100)
      setIsSubmitting(false)
      
      setTimeout(() => setUploadProgress(0), 1000)
    }, 1000)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).slice(0, 1) // Only take first file for single image
    if (files.length > 0) handleFileChange({ target: { files } })
  }

  const handleRemove = () => {
    setPreview('')
    setImageLoaded(false)
    setUploadProgress(0)
    onRemove()
  }

  const handleImageLoad = () => setImageLoaded(true)
  const handleImageError = () => {
    setImageLoaded(false)
    toast.error('Failed to load image. Please try another one.')
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl border border-blue-200">
        <FaImage className="text-blue-600 text-lg" />
        <span className="font-bold text-gray-900">{label}</span>
        {required && <span className="text-red-500 ml-1">*</span>}
        <span className="text-xs text-gray-600 font-normal ml-auto bg-white px-2 py-1 rounded-lg border">Recommended: 1200×630px</span>
      </label>
      
      {preview ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-2xl border-2 border-gray-300 shadow-lg transition-all duration-300">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
          
          {imageLoaded && (
            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                type="button"
                onClick={() => document.getElementById('image-upload').click()}
                className="bg-blue-500 text-white p-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer hover:bg-blue-600"
                title="Change Image"
              >
                <FaRegEdit className="text-sm" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-500 text-white p-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer hover:bg-red-600"
                title="Remove Image"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer group ${
            dragOver 
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-inner' 
              : 'border-gray-300 hover:border-blue-400 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => document.getElementById('image-upload').click()}
        >
          <div className="relative">
            <FaUpload className={`mx-auto text-3xl mb-3 transition-all duration-300 ${
              dragOver ? 'text-blue-500 scale-110' : 'text-gray-400 group-hover:text-blue-500'
            }`} />
          </div>
          <p className="text-gray-700 mb-2 font-semibold transition-colors duration-300 group-hover:text-gray-800">
            {dragOver ? '🎉 Drop image here!' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-sm text-gray-600 mb-3 transition-colors duration-300 group-hover:text-gray-700">
            Supports: JPG, PNG, GIF, WebP, SVG • Max 5MB
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold transition-colors duration-300 group-hover:text-blue-700 text-sm">
            <FaUpload />
            Choose Image
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
        </div>
      )}
      
      {preview && imageLoaded && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <span className="flex items-center gap-2 text-green-600 font-semibold">
            <FaCheckCircle /> Image ready
          </span>
          <button type="button" onClick={handleRemove} className="text-red-500 hover:text-red-700 font-semibold cursor-pointer flex items-center gap-1 text-sm">
            <FaTimes /> Remove
          </button>
        </div>
      )}
    </div>
  )
}

// Step-based Modern Blog Post Modal
function ModernBlogModal({ onClose, onSave, post, loading }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    authorName: post?.authorName || '',
    tags: Array.isArray(post?.tags) ? post.tags.join(', ') : post?.tags || '',
    featured: post?.featured || false,
    status: post?.status || 'DRAFT',
    category: post?.category || '',
    imageAltText: post?.imageAltText || '',
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
    readTime: post?.readTime || '5 min read',
    allowComments: post?.allowComments ?? true,
    seoFocus: post?.seoFocus || 'BALANCED',
    contentQuality: post?.contentQuality || 85,
  })

  const [mainImageFile, setMainImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(post?.mainImage || '')
  const [charCount, setCharCount] = useState({
    title: post?.title?.length || 0,
    excerpt: post?.excerpt?.length || 0,
    metaTitle: post?.metaTitle?.length || 0,
    metaDescription: post?.metaDescription?.length || 0,
  })

  const steps = [
    { id: 'content', label: 'Content', icon: FaRegFileAlt, description: 'Basic post information' },
    { id: 'media', label: 'Media', icon: FaImage, description: 'Images and visuals' },
    { id: 'seo', label: 'SEO', icon: FaSearch, description: 'Search optimization' },
    { id: 'settings', label: 'Settings', icon: FaCog, description: 'Publication settings' }
  ]

  const SEO_OPTIONS = [
    { value: 'BALANCED', label: 'Balanced', icon: FaRegChartBar, color: 'text-blue-500' },
    { value: 'SEO_FOCUSED', label: 'SEO Focused', icon: FaSearch, color: 'text-green-500' },
    { value: 'READER_FOCUSED', label: 'Reader Focused', icon: FaRegUser, color: 'text-purple-500' },
    { value: 'SOCIAL_SHARE', label: 'Social Media', icon: FaShare, color: 'text-pink-500' },
  ]

  const STATUS_OPTIONS = [
    { value: 'DRAFT', label: 'Draft', icon: FaRegEdit, color: 'text-yellow-600' },
    { value: 'PUBLISHED', label: 'Published', icon: FaGlobe, color: 'text-green-600' },
    { value: 'ARCHIVED', label: 'Archived', icon: FaRegBookmark, color: 'text-gray-600' },
  ]

  useEffect(() => {
    if (post?.mainImage && typeof post.mainImage === 'string') {
      const formattedImage = post.mainImage.startsWith('/') ? post.mainImage : `/${post.mainImage}`
      setImagePreview(formattedImage)
    }
  }, [post])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Only submit when we're on the last step
    if (currentStep < steps.length - 1) {
      nextStep()
      return
    }

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key].toString())
        }
      })
      if (mainImageFile) formDataToSend.append('mainImageFile', mainImageFile)
      await onSave(formDataToSend, post?.id)
    } catch (error) {
      throw error
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleImageChange = (file) => setMainImageFile(file)
  const handleImageRemove = () => {
    setMainImageFile(null)
    setImagePreview('')
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (['title', 'excerpt', 'metaTitle', 'metaDescription'].includes(field)) {
      setCharCount(prev => ({ ...prev, [field]: value.length }))
    }
  }

  const getCharCountColor = (count, max) => {
    if (count > max) return 'text-red-500'
    if (count > max * 0.9) return 'text-yellow-500'
    return 'text-green-500'
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Content
        return formData.title.trim() && formData.excerpt.trim() && formData.authorName.trim()
      case 1: // Media
        return true // Image is optional
      case 2: // SEO
        return true // All SEO fields are optional
      case 3: // Settings
        return true // All settings are optional
      default:
        return true
    }
  }

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%', // Reduced by 10%
        maxWidth: '1000px', // Reduced from 1200px
        maxHeight: '95vh', bgcolor: 'background.paper',
        borderRadius: 3, boxShadow: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                {post ? <FaEdit className="text-xl" /> : <FaPlus className="text-xl" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{post ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
                <p className="text-blue-100 opacity-90 mt-1">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep].description}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200 cursor-pointer">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-blue-500 border-blue-500 text-white shadow-lg' 
                    : index < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  {index < currentStep ? <FaCheck className="text-xs" /> : step.icon ? <step.icon className="text-xs" /> : index + 1}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900">{step.label}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-h-[calc(95vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Step 1: Content */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl border border-blue-200">
                        <FaRegNewspaper className="text-blue-600 text-lg" /> 
                        Post Title <span className="text-red-500">*</span>
                      </label>
                      <TextField 
                        fullWidth 
                        value={formData.title} 
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Enter a compelling title that grabs attention..." 
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#f9fafb'
                          }
                        }}
                        helperText={
                          <span className={getCharCountColor(charCount.title, 60)}>
                            {charCount.title}/60 characters
                          </span>
                        } 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                        <FaRegUser className="text-green-600 text-lg" /> 
                        Author Name <span className="text-red-500">*</span>
                      </label>
                      <TextField 
                        fullWidth 
                        value={formData.authorName} 
                        onChange={(e) => handleChange('authorName', e.target.value)}
                        placeholder="Enter author name..." 
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#f9fafb'
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
                        <FaTag className="text-purple-600 text-lg" /> 
                        Category
                      </label>
                      <TextField 
                        fullWidth 
                        value={formData.category} 
                        onChange={(e) => handleChange('category', e.target.value)}
                        placeholder="e.g., Technology, Business, Lifestyle..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#f9fafb'
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-xl border border-orange-200">
                        <FaRegFileAlt className="text-orange-600 text-lg" /> 
                        Excerpt <span className="text-red-500">*</span>
                      </label>
                      <TextareaAutosize 
                        minRows={4} 
                        value={formData.excerpt} 
                        onChange={(e) => handleChange('excerpt', e.target.value)}
                        placeholder="Write a brief summary that makes readers want to click..."
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-50 font-medium"
                        required 
                      />
                      <div className={`text-sm font-semibold mt-2 ${getCharCountColor(charCount.excerpt, 160)}`}>
                        {charCount.excerpt}/160 characters
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-xl border border-red-200">
                        <FaRegClock className="text-red-600 text-lg" /> 
                        Read Time
                      </label>
                      <TextField 
                        fullWidth 
                        value={formData.readTime} 
                        onChange={(e) => handleChange('readTime', e.target.value)}
                        placeholder="e.g., 5 min read"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#f9fafb'
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-xl border border-indigo-200">
                    <FaRegEdit className="text-indigo-600 text-lg" /> 
                    Content <span className="text-red-500">*</span>
                  </label>
                  <TextareaAutosize 
                    minRows={10} 
                    value={formData.content} 
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Write your amazing content here... You can use Markdown formatting."
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-50 font-medium text-sm"
                    required 
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-2 font-medium">
                    <span>Supports Markdown formatting</span> 
                    <span>{formData.content.length} characters</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Media */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <ModernImageUpload 
                  image={imagePreview} 
                  onImageChange={handleImageChange} 
                  onRemove={handleImageRemove} 
                  label="Featured Image" 
                />
                
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-xl border border-teal-200">
                    <FaRegImages className="text-teal-600 text-lg" /> 
                    Image Alt Text
                  </label>
                  <TextField 
                    fullWidth 
                    value={formData.imageAltText} 
                    onChange={(e) => handleChange('imageAltText', e.target.value)}
                    placeholder="Describe your image for accessibility and SEO..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#f9fafb'
                      }
                    }}
                    helperText="Important for SEO and visually impaired users"
                  />
                </div>
              </div>
            )}

            {/* Step 3: SEO */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaRocket className="text-blue-600" />
                    SEO Optimization
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">Meta Title</label>
                      <TextField 
                        fullWidth 
                        value={formData.metaTitle} 
                        onChange={(e) => handleChange('metaTitle', e.target.value)}
                        placeholder="Optimized title for search engines..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#f9fafb'
                          }
                        }}
                        helperText={
                          <span className={getCharCountColor(charCount.metaTitle, 60)}>
                            {charCount.metaTitle}/60 characters • {
                              charCount.metaTitle >= 50 && charCount.metaTitle <= 60 ? '✅ Perfect' : '⚠️ Adjust length'
                            }
                          </span>
                        } 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">Meta Description</label>
                      <TextareaAutosize 
                        minRows={3} 
                        value={formData.metaDescription} 
                        onChange={(e) => handleChange('metaDescription', e.target.value)}
                        placeholder="Compelling description that appears in search results..."
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-50 font-medium"
                      />
                      <div className={`text-sm font-semibold mt-2 ${getCharCountColor(charCount.metaDescription, 160)}`}>
                        {charCount.metaDescription}/160 characters • {
                          charCount.metaDescription >= 120 && charCount.metaDescription <= 160 ? '✅ Perfect' : '⚠️ Adjust length'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaMagic className="text-purple-600" />
                      SEO Focus
                    </h4>
                    <div className="space-y-3">
                      {SEO_OPTIONS.map((option) => (
                        <div 
                          key={option.value} 
                          onClick={() => handleChange('seoFocus', option.value)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.seoFocus === option.value 
                              ? 'border-blue-500 bg-blue-50 shadow-md' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <option.icon className={`text-lg ${option.color}`} />
                            <div>
                              <div className="font-bold text-gray-900">{option.label}</div>
                              <div className="text-sm text-gray-600 font-medium">
                                {option.value === 'BALANCED' && 'Good mix of SEO and readability'}
                                {option.value === 'SEO_FOCUSED' && 'Maximum search engine visibility'}
                                {option.value === 'READER_FOCUSED' && 'Best reading experience'}
                                {option.value === 'SOCIAL_SHARE' && 'Optimized for social media'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaChartBar className="text-green-600" />
                      Content Quality
                    </h4>
                    <div className="space-y-4">
                      <Slider 
                        value={formData.contentQuality} 
                        onChange={(e, newValue) => handleChange('contentQuality', newValue)}
                        aria-labelledby="content-quality-slider" 
                        valueLabelDisplay="auto" 
                        step={5} 
                        marks 
                        min={50} 
                        max={100} 
                        className="text-blue-500" 
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-2 font-medium">
                        <span>Basic</span>
                        <span>Excellent</span>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">{formData.contentQuality}%</div>
                        <div className="text-sm text-gray-600 font-medium">Content Quality Score</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Settings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaCog className="text-gray-600" />
                      Publication Settings
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">Status</label>
                        <div className="space-y-2">
                          {STATUS_OPTIONS.map((option) => (
                            <div 
                              key={option.value} 
                              onClick={() => handleChange('status', option.value)}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                formData.status === option.value 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <option.icon className={`text-lg ${option.color}`} />
                                <span className="font-bold text-gray-900">{option.label}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <FormControlLabel 
                          control={
                            <Switch 
                              checked={formData.featured} 
                              onChange={(e) => handleChange('featured', e.target.checked)} 
                              color="primary" 
                            />
                          } 
                          label={
                            <div className="flex items-center gap-2 font-bold text-gray-900">
                              <FaStar className="text-yellow-500" />
                              <span>Featured Post</span>
                            </div>
                          } 
                        />
                        <FormControlLabel 
                          control={
                            <Switch 
                              checked={formData.allowComments} 
                              onChange={(e) => handleChange('allowComments', e.target.checked)} 
                              color="primary" 
                            />
                          } 
                          label={
                            <div className="flex items-center gap-2 font-bold text-gray-900">
                              <FaRegComments className="text-blue-500" />
                              <span>Allow Comments</span>
                            </div>
                          } 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaShieldAlt className="text-green-600" />
                      Additional Settings
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border border-yellow-200">
                          <FaHashtag className="text-yellow-600" />
                          Tags (comma separated)
                        </label>
                        <TextField 
                          fullWidth 
                          value={formData.tags} 
                          onChange={(e) => handleChange('tags', e.target.value)}
                          placeholder="e.g., technology, web development, tips"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#f9fafb'
                            }
                          }}
                          helperText="Separate tags with commas for better discovery"
                        />
                      </div>
                      
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                        <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                          <FaExclamationTriangle className="text-yellow-600" />
                          Pro Tips
                        </h4>
                        <ul className="text-sm text-yellow-700 space-y-2 font-medium">
                          <li className="flex items-center gap-2">• Use descriptive, keyword-rich titles</li>
                          <li className="flex items-center gap-2">• Add relevant tags for better discovery</li>
                          <li className="flex items-center gap-2">• Optimize images for faster loading</li>
                          <li className="flex items-center gap-2">• Write compelling meta descriptions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    formData.status === 'DRAFT' ? 'bg-yellow-500' : 
                    formData.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="capitalize font-semibold">{formData.status.toLowerCase()}</span>
                </div>
                {formData.featured && (
                  <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                    <FaStar className="text-xs" /> Featured
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-bold disabled:opacity-50 cursor-pointer"
                  >
                    ← Previous
                  </button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-200 font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    Continue →
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={loading || !isStepValid()}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition duration-200 font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={16} className="text-white" />
                        {post ? 'Updating...' : 'Publishing...'}
                      </>
                    ) : (
                      <>
                        <FaRocket />
                        {post ? 'Update Post' : 'Publish Post'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  )
}

// Enhanced Modern Delete Confirmation Modal - Fixed dimensions, no hover
function ModernDeleteModal({ post, onClose, onConfirm, loading }) {
  const [confirmText, setConfirmText] = useState('')

  const handleConfirm = () => {
    if (confirmText === post.title) {
      onConfirm(post.id)
    } else {
      toast.error('Please type the post title exactly to confirm deletion')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
        {/* Header - Fixed height */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
              <FaExclamationTriangle className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Confirm Deletion</h2>
              <p className="text-red-100 opacity-90 mt-1 text-sm">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Content - Fixed dimensions */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3 border border-red-200">
              <FaTrash className="text-red-600 text-lg" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Delete "{post.title}"?</h3>
            <p className="text-gray-600 text-sm">This will permanently delete the blog post and all associated data.</p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">
              Type <span className="font-mono text-red-600 bg-red-50 px-2 py-1 rounded">"{post.title}"</span> to confirm:
            </label>
            <input 
              type="text" 
              value={confirmText} 
              onChange={(e) => setConfirmText(e.target.value)} 
              placeholder={`Type "${post.title}" here`}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-sm"
            />
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-3 border border-red-200">
            <h4 className="font-bold text-gray-900 mb-2 text-sm flex items-center gap-2">
              <FaExclamationTriangle className="text-red-600 text-sm" />
              What will be deleted:
            </h4>
            <div className="space-y-1 text-xs text-gray-700">
              {['Blog post content', 'Featured image', 'SEO metadata', 'View statistics'].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - Fixed height */}
        <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl transition-all duration-300 font-bold disabled:opacity-50 cursor-pointer text-sm"
          >
            <FaTimesCircle /> Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={loading || confirmText !== post.title}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-3 rounded-xl transition-all duration-300 font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {loading ? (
              <>
                <CircularProgress size={14} className="text-white" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash /> Delete Forever
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Modern Blog Post Card Component with Grid/List view support
function ModernBlogPostCard({ post, onEdit, onDelete, onStatusChange, onView, selected, onSelect, actionLoading, onGenerateLink, layout = 'grid' }) {
  const [imageError, setImageError] = useState(false)

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  }

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

  const imageUrl = getImageUrl(post.mainImage)

  if (layout === 'list') {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}>
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-48 flex-shrink-0">
            <div className="relative h-40 md:h-full overflow-hidden rounded-l-2xl">
              {imageUrl && !imageError ? (
                <img 
                  src={imageUrl} 
                  alt={post.imageAltText || post.title} 
                  onClick={() => onView(post)}
                  className="w-full h-full object-cover cursor-pointer" 
                  onError={() => setImageError(true)} 
                />
              ) : (
                <div 
                  onClick={() => onView(post)} 
                  className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 cursor-pointer"
                >
                  <FaBlog className="text-2xl" />
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <input 
                  type="checkbox" 
                  checked={selected} 
                  onChange={(e) => onSelect(post.id, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                />
                <h3 
                  onClick={() => onView(post)} 
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800 text-lg cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex-1"
                >
                  {post.title}
                </h3>
              </div>
              <div className="flex gap-2">
                {post.featured && (
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <FaStar className="text-xs" />
                  </span>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(post.status)}`}>
                  {getStatusIcon(post.status)}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-medium">{post.excerpt}</p>

            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center gap-4 text-gray-600 font-medium">
                <span className="flex items-center gap-1">
                  <FaUser className="text-xs" />
                  {post.authorName}
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendar className="text-xs" />
                  {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Not published'}
                </span>
                <span className="text-orange-600 font-bold">{post.readTime}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 font-bold">
                <FaEye className="text-xs" />
                {post.views}
              </div>
            </div>

            {post.category && (
              <div className="flex items-center justify-between mb-3">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
                  {post.category}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {post.status === 'DRAFT' && (
                  <button 
                    onClick={() => onStatusChange(post.id, 'PUBLISHED')} 
                    disabled={actionLoading}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition duration-200 disabled:opacity-50 shadow-md cursor-pointer text-xs font-bold"
                  >
                    Publish
                  </button>
                )}
                {post.status === 'PUBLISHED' && (
                  <button 
                    onClick={() => onStatusChange(post.id, 'DRAFT')} 
                    disabled={actionLoading}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-2 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition duration-200 disabled:opacity-50 shadow-md cursor-pointer text-xs font-bold"
                  >
                    Unpublish
                  </button>
                )}
                <button 
                  onClick={() => onView(post)} 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition duration-200 shadow-md cursor-pointer text-xs font-bold"
                >
                  View
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onGenerateLink(post)} 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-xl hover:from-purple-600 hover:to-purple-700 transition duration-200 shadow-md cursor-pointer text-xs font-bold"
                >
                  Link
                </button>
                <button 
                  onClick={() => onEdit(post)} 
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-2 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition duration-200 disabled:opacity-50 shadow-md cursor-pointer text-xs font-bold"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(post)} 
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition duration-200 disabled:opacity-50 shadow-md cursor-pointer text-xs font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid Layout (default)
  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="p-3 border-b border-gray-100 flex items-center">
        <input 
          type="checkbox" 
          checked={selected} 
          onChange={(e) => onSelect(post.id, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
        />
        <span className="ml-2 text-sm text-gray-500">Select</span>
      </div>

      <div className="relative h-40 overflow-hidden">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={post.imageAltText || post.title} 
            onClick={() => onView(post)}
            className="w-full h-full object-cover cursor-pointer" 
            onError={() => setImageError(true)} 
          />
        ) : (
          <div 
            onClick={() => onView(post)} 
            className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400 cursor-pointer"
          >
            <FaBlog className="text-2xl mb-2" />
            <span className="text-sm">No Image</span>
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-1">
          {post.featured && (
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <FaStar className="text-xs" />
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(post.status)}`}>
            {getStatusIcon(post.status)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 
          onClick={() => onView(post)} 
          className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800 text-base mb-2 line-clamp-2 cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 font-medium">{post.excerpt}</p>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-purple-600 font-bold">
              <FaUser className="text-xs" />
              <span className="truncate max-w-[80px]">{post.authorName}</span>
            </div>
            <div className="flex items-center gap-1 text-green-600 font-bold">
              <FaCalendar className="text-xs" />
              <span className="text-xs">{post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Not published'}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-orange-600 font-bold">{post.readTime}</span>
            <div className="flex items-center gap-1 text-blue-600 font-bold">
              <FaEye className="text-xs" />
              <span>{post.views}</span>
            </div>
          </div>
        </div>

        {post.category && (
          <div className="flex items-center justify-between mb-3">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md">
              {post.category}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {post.status === 'DRAFT' && (
              <button 
                onClick={() => onStatusChange(post.id, 'PUBLISHED')} 
                disabled={actionLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-xl hover:from-green-600 hover:to-green-700 transition duration-200 disabled:opacity-50 shadow-md cursor-pointer text-xs font-bold"
              >
                Publish
              </button>
            )}
            {post.status === 'PUBLISHED' && (
              <button 
                onClick={() => onStatusChange(post.id, 'DRAFT')} 
                disabled={actionLoading}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-2 py-1 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition duration-200 disabled:opacity-50 shadow-md cursor-pointer text-xs font-bold"
              >
                Unpublish
              </button>
            )}
            <button 
              onClick={() => onView(post)} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-xl hover:from-blue-600 hover:to-blue-700 transition duration-200 shadow-md cursor-pointer text-xs font-bold"
            >
              View
            </button>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onGenerateLink(post)} 
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-1 rounded-xl hover:from-purple-600 hover:to-purple-700 transition duration-200 shadow-md cursor-pointer text-xs font-bold"
            >
              Link
            </button>
            <button 
              onClick={() => onEdit(post)} 
              disabled={actionLoading}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-2 py-1 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition duration-200 disabled:opacity-50 shadow-md cursor-pointer text-xs font-bold"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(post)} 
              disabled={actionLoading}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-xl hover:from-red-600 hover:to-red-700 transition duration-200 disabled:opacity-50 shadow-md cursor-pointer text-xs font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Blog Management Component with Grid/List Toggle
export default function ModernBlogManagement() {
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
  const [linkGenerationPost, setLinkGenerationPost] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedPosts, setSelectedPosts] = useState(new Set())
  const [stats, setStats] = useState(null)
  const [layout, setLayout] = useState('grid') // 'grid' or 'list'

  const debouncedSearch = useCallback(debounce((term) => { setSearchTerm(term); setCurrentPage(1) }, 300), [])

  useEffect(() => { loadBlogPosts() }, [])

  const loadBlogPosts = async () => {
    try {
      setLoading(true); setError('')
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

  // ADD THE MISSING handleStatusChange FUNCTION HERE
  const handleStatusChange = async (id, status) => {
    try {
      setActionLoading(true)
      const formData = new FormData()
      formData.append('status', status)
      
      const result = await blogApiService.updateBlogPost(id, formData)
      
      setBlogPosts(prev => prev.map(post => 
        post.id === id 
          ? { 
              ...post, 
              status, 
              publishDate: status === 'PUBLISHED' ? new Date().toISOString() : post.publishDate 
            } 
          : post
      ))
      
      toast.success(`Post ${status.toLowerCase()} successfully!`)
    } catch (err) {
      console.error('Error updating post status:', err)
      toast.error(err.message || 'Failed to update post status!')
    } finally {
      setActionLoading(false)
    }
  }

  // Add other missing functions
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

  const handleDeletePost = async (id) => {
    try {
      setActionLoading(true)
      await blogApiService.deleteBlogPost(id)
      setBlogPosts(prev => prev.filter(post => post.id !== id))
      setDeleteConfirm(null)
      setSelectedPosts(prev => { const newSet = new Set(prev); newSet.delete(id); return newSet })
      toast.success('Blog post deleted successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to delete blog post!')
    } finally {
      setActionLoading(false)
    }
  }

  const handlePostSelect = (postId, selected) => {
    setSelectedPosts(prev => { 
      const newSet = new Set(prev); 
      selected ? newSet.add(postId) : newSet.delete(postId); 
      return newSet 
    })
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

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)

  if (loading && blogPosts.length === 0) return <ModernLoadingSpinner message="Loading blog posts..." size="medium" />

  return (
    <div className="space-y-6 p-4 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
            <p className="text-gray-600 text-sm lg:text-base">Create and manage engaging blog content for your audience</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={loadBlogPosts} className="flex items-center gap-2 bg-gray-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl hover:bg-gray-700 transition duration-200 font-bold shadow-lg cursor-pointer text-sm">
              <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-bold shadow-lg cursor-pointer text-sm">
              <FaPlus className="text-xs" /> Create New Post
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Total Posts</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <FaBook className="text-lg" />
              </div>
            </div>
          </div>
          {/* Add other stat cards similarly */}
        </div>
      )}

      {/* Layout Toggle and Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input 
                type="text" 
                placeholder="Search posts by title, author, tags, or category..." 
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 lg:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
            {/* Layout Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded-lg transition duration-200 cursor-pointer ${
                  layout === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaTh className="text-sm" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-2 rounded-lg transition duration-200 cursor-pointer ${
                  layout === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaList className="text-sm" />
              </button>
            </div>

            <select 
              value={filterStatus} 
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }}
              className="px-3 lg:px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 cursor-pointer text-sm"
            >
              <option value="all">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <select 
              value={sortBy} 
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1) }}
              className="px-3 lg:px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 cursor-pointer text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid/List */}
      <div className={
        layout === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
          : "space-y-4 lg:space-y-6"
      }>
        {currentPosts.map((post) => (
          <ModernBlogPostCard 
            key={post.id} 
            post={post} 
            onEdit={setEditingPost} 
            onDelete={setDeleteConfirm} 
            onStatusChange={handleStatusChange}
            onView={setViewingPost} 
            selected={selectedPosts.has(post.id)} 
            onSelect={handlePostSelect} 
            actionLoading={actionLoading} 
            onGenerateLink={setLinkGenerationPost}
            layout={layout}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentPosts.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
          <FaBlog className="text-4xl lg:text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? 'No posts found' : 'No blog posts available'}
          </h3>
          <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search criteria' : 'Start by creating your first blog post to engage your audience'}
          </p>
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-bold shadow-lg flex items-center gap-2 mx-auto text-sm lg:text-base cursor-pointer"
          >
            <FaPlus /> Create Your First Post
          </button>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <ModernBlogModal onClose={() => setShowCreateModal(false)} onSave={handleCreatePost} loading={actionLoading} />
      )}
      {editingPost && (
        <ModernBlogModal onClose={() => setEditingPost(null)} onSave={(data) => handleUpdatePost(editingPost.id, data)} post={editingPost} loading={actionLoading} />
      )}
      {deleteConfirm && (
        <ModernDeleteModal post={deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDeletePost} loading={actionLoading} />
      )}
      {viewingPost && (
        <ModernViewModal post={viewingPost} onClose={() => setViewingPost(null)} onEdit={setEditingPost} />
      )}
      {/* Add other modals as needed */}
    </div>
  )
}