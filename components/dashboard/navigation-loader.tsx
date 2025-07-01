'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { InlinePreloader } from '@/components/preloader'

interface NavigationLoaderContextType {
  isNavigating: boolean
  startNavigation: () => void
  stopNavigation: () => void
}

const NavigationLoaderContext = createContext<NavigationLoaderContextType | undefined>(undefined)

export function NavigationLoaderProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()

  const startNavigation = () => {
    setIsNavigating(true)
  }

  const stopNavigation = () => {
    setIsNavigating(false)
  }

  // Stop navigation loading when pathname changes
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  // Auto-stop navigation loading after a timeout as fallback
  useEffect(() => {
    if (isNavigating) {
      const timeout = setTimeout(() => {
        setIsNavigating(false)
      }, 5000) // 5 second fallback

      return () => clearTimeout(timeout)
    }
  }, [isNavigating])

  return (
    <NavigationLoaderContext.Provider value={{ isNavigating, startNavigation, stopNavigation }}>
      {children}
      {/* Global Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
          <div className="h-full bg-gradient-to-r from-[#ff6600] to-[#ff6b00] progress-shimmer"></div>
        </div>
      )}
    </NavigationLoaderContext.Provider>
  )
}

export function useNavigationLoader() {
  const context = useContext(NavigationLoaderContext)
  if (context === undefined) {
    throw new Error('useNavigationLoader must be used within a NavigationLoaderProvider')
  }
  return context
}

// Enhanced Link component that shows loading state
import Link from 'next/link'
import { ReactNode } from 'react'

interface NavigationLinkProps {
  href: string
  children: ReactNode
  className?: string
  showLoader?: boolean
}

export function NavigationLink({ href, children, className = '', showLoader = true }: NavigationLinkProps) {
  const { startNavigation } = useNavigationLoader()

  const handleClick = () => {
    if (showLoader) {
      startNavigation()
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}

// Page transition loading component
export function PageTransitionLoader() {
  const { isNavigating } = useNavigationLoader()

  if (!isNavigating) return null

  return (
    <div className="fixed inset-0 z-40 bg-white/60 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin border-t-[#ff6600]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 bg-[#ff6600] rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-sm font-medium text-[#444444]">Loading page...</p>
      </div>
    </div>
  )
}
