"use client"

import { useEffect, useRef } from 'react'

interface MapProps {
  latitude: number
  longitude: number
  title?: string
  className?: string
  height?: string
}

export function Map({ latitude, longitude, title, className = "", height = "400px" }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || !google.maps) {
      console.warn('Google Maps API not loaded')
      return
    }

    if (!mapRef.current) return

    // Create map instance
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    })

    mapInstanceRef.current = map

    // Create marker
    const marker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: title || 'Location',
      animation: google.maps.Animation.DROP,
    })

    markerRef.current = marker

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 4px 0; font-weight: 600;">${title || 'Location'}</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">
            ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
          </p>
        </div>
      `,
    })

    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
      if (mapInstanceRef.current) {
        // Google Maps doesn't have a destroy method, just clear the div
        if (mapRef.current) {
          mapRef.current.innerHTML = ''
        }
      }
    }
  }, [latitude, longitude, title])

  // Fallback for when Google Maps API is not loaded
  if (typeof google === 'undefined' || !google.maps) {
    return (
      <div 
        className={`bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🗺️</div>
          <p>Map loading...</p>
          <p className="text-sm">Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mapRef}
      className={`rounded-lg overflow-hidden border border-gray-200 ${className}`}
      style={{ height }}
    />
  )
}

export default Map
