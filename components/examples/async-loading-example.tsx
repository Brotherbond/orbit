"use client"

import { useState } from 'react'
import { useAsyncLoading } from '@/hooks/use-loading'
import { Button } from '@/components/ui/button'

export function AsyncLoadingExample() {
  const [data, setData] = useState<string | null>(null)
  const { withLoading } = useAsyncLoading()

  const handleFetchData = async () => {
    await withLoading(
      async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setData('Data loaded successfully!')
      },
      'Fetching data...'
    )
  }

  const handleSlowOperation = async () => {
    await withLoading(
      async () => {
        // Simulate slow operation
        await new Promise(resolve => setTimeout(resolve, 3000))
        setData('Slow operation completed!')
      },
      'Processing...'
    )
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Async Loading Example</h3>
      <div className="space-x-2">
        <Button onClick={handleFetchData}>
          Fetch Data
        </Button>
        <Button onClick={handleSlowOperation} variant="outline">
          Slow Operation
        </Button>
      </div>
      {data && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">{data}</p>
        </div>
      )}
    </div>
  )
}
