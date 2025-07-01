'use client'

import { useState } from 'react'
import { Preloader, InlinePreloader, PagePreloader } from '@/components/preloader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PreloaderDemo() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [showPageLoader, setShowPageLoader] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const handleButtonClick = () => {
    setButtonLoading(true)
    setTimeout(() => setButtonLoading(false), 3000)
  }

  const handleFormSubmit = () => {
    setFormLoading(true)
    setTimeout(() => setFormLoading(false), 4000)
  }

  const showOverlayLoader = () => {
    setShowOverlay(true)
    setTimeout(() => setShowOverlay(false), 3000)
  }

  const showPageLoaderDemo = () => {
    setShowPageLoader(true)
    setTimeout(() => setShowPageLoader(false), 5000)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#444444] mb-2">
          Preloader Components Demo
        </h1>
        <p className="text-[#ababab]">
          Showcase of all available preloader components for the Orbit system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Preloader - Small */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Small Preloader</CardTitle>
            <CardDescription>Basic small-sized preloader</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Preloader size="sm" text="Loading data" />
          </CardContent>
        </Card>

        {/* Basic Preloader - Medium */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medium Preloader</CardTitle>
            <CardDescription>Standard medium-sized preloader</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Preloader size="md" text="Processing" />
          </CardContent>
        </Card>

        {/* Basic Preloader - Large */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Large Preloader</CardTitle>
            <CardDescription>Large-sized preloader for main loading</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Preloader size="lg" text="Initializing" />
          </CardContent>
        </Card>

        {/* Inline Preloaders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inline Preloaders</CardTitle>
            <CardDescription>Small spinners for buttons and inline use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm">Extra Small:</span>
              <InlinePreloader size="xs" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Small:</span>
              <InlinePreloader size="sm" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Medium:</span>
              <InlinePreloader size="md" />
            </div>
          </CardContent>
        </Card>

        {/* Button with Loading State */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Button Loading</CardTitle>
            <CardDescription>Button with integrated loading state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleButtonClick}
              disabled={buttonLoading}
              className="w-full btn-primary"
            >
              {buttonLoading ? (
                <div className="flex items-center space-x-2">
                  <InlinePreloader size="xs" className="border-white border-t-transparent" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Click to Load'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Form Loading State */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Form Loading</CardTitle>
            <CardDescription>Form with loading overlay</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Enter your name"
                className="w-full p-2 border rounded"
                disabled={formLoading}
              />
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full p-2 border rounded"
                disabled={formLoading}
              />
              <Button 
                onClick={handleFormSubmit}
                disabled={formLoading}
                className="w-full btn-primary"
              >
                Submit Form
              </Button>
            </div>
            {formLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded">
                <Preloader size="sm" text="Submitting form" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Full-Screen Preloaders</CardTitle>
          <CardDescription>Test overlay and page preloaders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={showOverlayLoader}
              variant="outline"
              className="w-full"
            >
              Show Overlay Preloader (3s)
            </Button>
            <Button 
              onClick={showPageLoaderDemo}
              variant="outline"
              className="w-full"
            >
              Show Page Preloader (5s)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Examples</CardTitle>
          <CardDescription>Code examples for implementing preloaders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Basic Usage:</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`import { Preloader } from '@/components/preloader'

// Basic preloader
<Preloader size="md" text="Loading..." />

// With overlay
<Preloader size="lg" text="Processing" overlay={true} />`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Button Loading:</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`import { InlinePreloader } from '@/components/preloader'

<Button disabled={loading}>
  {loading ? (
    <>
      <InlinePreloader size="xs" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overlay Preloader */}
      <Preloader 
        isLoading={showOverlay}
        size="lg"
        text="Loading with overlay"
        overlay={true}
      />

      {/* Page Preloader */}
      <PagePreloader isLoading={showPageLoader} />
    </div>
  )
}
