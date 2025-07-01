"use client"

import { create } from 'zustand'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface LoadingState {
  isLoading: boolean
  loadingMessage?: string
  setLoading: (loading: boolean, message?: string) => void
  clearLoading: () => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingMessage: undefined,
  setLoading: (loading: boolean, message?: string) => 
    set({ isLoading: loading, loadingMessage: message }),
  clearLoading: () => set({ isLoading: false, loadingMessage: undefined }),
}))

export function useRouteLoading() {
  const pathname = usePathname()
  const { setLoading, clearLoading } = useLoadingStore()

  useEffect(() => {
    // Show loading when route changes
    setLoading(true, 'Loading page...')
    
    // Clear loading after a short delay to allow page to render
    const timer = setTimeout(() => {
      clearLoading()
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname, setLoading, clearLoading])

  return { pathname }
}

export function useAsyncLoading() {
  const { setLoading, clearLoading } = useLoadingStore()

  const withLoading = async <T,>(
    asyncFn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      setLoading(true, message)
      const result = await asyncFn()
      return result
    } finally {
      clearLoading()
    }
  }

  return { withLoading, setLoading, clearLoading }
}
