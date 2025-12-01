'use client'
import React, { useEffect, useRef } from 'react'

export default function VideoModal({ isOpen, onClose, videoId = '' }) {
  const backdropRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose()
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-7xl h-auto max-h-none bg-gradient-to-br from-white/5 to-black/70 border border-white/8 rounded-4xl shadow-2xl overflow-hidden transform transition-all duration-300">
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-4 -right-4 z-30 bg-white/10 text-white rounded-full p-3 hover:bg-white/20 backdrop-blur-sm border border-white/10"
        >
          ✕
        </button>

        <div className="w-full flex flex-col">
          <div className="px-6 py-3 flex items-center justify-between border-b border-white/6 bg-gradient-to-b from-white/3 to-transparent">
            <div className="text-sm text-white/80 font-medium">Watch Demo</div>
            <div className="text-xs text-white/50">Autoplay enabled</div>
          </div>

          <div className="bg-black h-[400%]">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="Video"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
