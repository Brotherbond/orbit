"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
  useRef
} from "react"
import { apiClient } from "@/lib/api-client"
import { Distributor } from "@/types/distributor"


interface DistributorContextType {
  distributor: Distributor | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateDistributor: (updates: Partial<Distributor>) => void
  clearError: () => void
}

const DistributorContext = createContext<DistributorContextType | undefined>(undefined)

// Simple in-memory cache for distributor data
const distributorCache = new Map<string, { data: Distributor; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function DistributorProvider({
  children,
  distributorId
}: {
  children: ReactNode
  distributorId: string
}) {
  const [distributor, setDistributor] = useState<Distributor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchDistributor = useCallback(async (force = false) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Check cache first (unless forced refresh)
    if (!force) {
      const cached = distributorCache.get(distributorId)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setDistributor(cached.data)
        setIsLoading(false)
        setError(null)
        return
      }
    }

    setIsLoading(true)
    setError(null)

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const { data } = await apiClient.get<{ item: Distributor }>(
        `/distributors/${distributorId}`,
        { signal: abortControllerRef.current.signal }
      )
      const { data: perfData } = await apiClient.get<{ item: any }>(
        `/distributors/${distributorId}/performance`,
        { signal: abortControllerRef.current.signal }
      )

      const distributorData = data.item || null
      if (distributorData && perfData?.item) {
        distributorData.performance = perfData.item
      }
      setDistributor(distributorData)

      // Cache the result
      if (distributorData) {
        distributorCache.set(distributorId, {
          data: distributorData,
          timestamp: Date.now()
        })
      }
    } catch (err: any) {
      // Don't set error if request was aborted
      if (err.name !== 'AbortError') {
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch distributor data"
        setError(errorMessage)
        setDistributor(null)
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [distributorId])

  const updateDistributor = useCallback((updates: Partial<Distributor>) => {
    setDistributor(prev => {
      if (!prev) return null
      const updated = { ...prev, ...updates }

      // Update cache
      distributorCache.set(distributorId, {
        data: updated,
        timestamp: Date.now()
      })

      return updated
    })
  }, [distributorId])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const refetch = useCallback(() => fetchDistributor(true), [fetchDistributor])

  useEffect(() => {
    if (distributorId) {
      fetchDistributor()
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [distributorId, fetchDistributor])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<DistributorContextType>(() => ({
    distributor,
    isLoading,
    error,
    refetch,
    updateDistributor,
    clearError,
  }), [distributor, isLoading, error, refetch, updateDistributor, clearError])

  return (
    <DistributorContext.Provider value={contextValue}>
      {children}
    </DistributorContext.Provider>
  )
}

export function useDistributor() {
  const context = useContext(DistributorContext)
  if (context === undefined) {
    throw new Error("useDistributor must be used within a DistributorProvider")
  }
  return context
}

// Custom hooks for specific distributor data
export function useDistributorUser() {
  const { distributor } = useDistributor()
  return useMemo(() => distributor?.user || null, [distributor?.user])
}

export function useDistributorInfo() {
  const { distributor } = useDistributor()
  return useMemo(() => ({
    id: distributor?.id,
    uuid: distributor?.uuid,
    business_name: distributor?.business_name,
    address: distributor?.address,
    business_type: distributor?.business_type,
  }), [distributor])
}

export function useDistributorPerformance() {
  const { distributor } = useDistributor()
  return useMemo(() => distributor?.performance || null, [distributor?.performance])
}
