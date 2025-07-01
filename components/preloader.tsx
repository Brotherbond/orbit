'use client'

import { useEffect, useState } from 'react'

interface PreloaderProps {
  isLoading?: boolean
  text?: string
  size?: 'sm' | 'md' | 'lg'
  overlay?: boolean
  className?: string
}

export function Preloader({ 
  isLoading = true, 
  text = 'Loading...', 
  size = 'md',
  overlay = false,
  className = ''
}: PreloaderProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isLoading])

  if (!isLoading) return null

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  const dotSizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const content = (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {/* Spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin border-t-[#ff6600]`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} bg-[#ff6600] rounded-full animate-pulse`}></div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center">
        <p className={`font-medium text-[#444444] ${textSizeClasses[size]}`}>
          {text}{dots}
        </p>
        <div className="flex justify-center space-x-1 mt-2">
          <div className={`${dotSizeClasses[size]} bg-[#ff6600] rounded-full animate-bounce`}></div>
          <div className={`${dotSizeClasses[size]} bg-[#ff6600] rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
          <div className={`${dotSizeClasses[size]} bg-[#ff6600] rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}

// Inline preloader for buttons and small components
export function InlinePreloader({ size = 'sm', className = '' }: { size?: 'xs' | 'sm' | 'md', className?: string }) {
  const sizeClasses = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-5 h-5 border-2',
    md: 'w-6 h-6 border-2'
  }

  return (
    <div className={`${sizeClasses[size]} border-gray-300 border-t-[#ff6600] rounded-full animate-spin ${className}`}></div>
  )
}

// Page preloader with progress simulation
export function PagePreloader({ isLoading = true }: { isLoading?: boolean }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 10
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isLoading])

  useEffect(() => {
    if (!isLoading) {
      setProgress(100)
      setTimeout(() => setProgress(0), 500)
    }
  }, [isLoading])

  if (!isLoading && progress === 0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-6 max-w-md w-full px-8">
        {/* Logo Area */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-spin border-t-[#ff6600]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-[#ff6600] rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Brand Text */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#444444] mb-2">
            Orbit
          </h1>
          <p className="text-[#ababab] text-sm">
            Business Management System
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#ff6600] to-[#ff6b00] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-[#ababab] mt-2">
            <span>Loading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
