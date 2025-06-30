'use client'

import { useEffect, useRef } from 'react'

type Property = {
	lat: number
	lng: number
	title: string
}

// Global flag to track API loading state
let isGoogleMapsApiLoaded = false
let isGoogleMapsApiLoading = false
const loadingCallbacks: (() => void)[] = []

const loadGoogleMapsApi = (callback: () => void) => {
	// If already loaded, execute callback immediately
	if (isGoogleMapsApiLoaded) {
		callback()
		return
	}

	// Add callback to queue
	loadingCallbacks.push(callback)

	// If already loading, don't create another script
	if (isGoogleMapsApiLoading) {
		return
	}

	isGoogleMapsApiLoading = true

	// Create script tag only once
	const script = document.createElement('script')
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQReifXIyF27pAqVclaTJDkboN1NCwZvI'
	script.async = true
	script.defer = true

	script.onload = () => {
		isGoogleMapsApiLoaded = true
		isGoogleMapsApiLoading = false

		// Execute all queued callbacks
		loadingCallbacks.forEach(cb => cb())
		loadingCallbacks.length = 0 // Clear the array
	}

	script.onerror = () => {
		isGoogleMapsApiLoading = false
		console.error('Failed to load Google Maps API')
	}

	document.head.appendChild(script)
}

const GoogleMapWithPins = ({ properties }: { properties: Property[] }) => {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<google.maps.Map | null>(null)
	const markersRef = useRef<google.maps.Marker[]>([])

	useEffect(() => {
		const initMap = () => {
			if (!mapRef.current) return

			// Clear existing markers
			markersRef.current.forEach(marker => marker.setMap(null))
			markersRef.current = []

			const center = { lat: 23.2599, lng: 77.4126 }

			// Create map if it doesn't exist
			if (!mapInstanceRef.current) {
				mapInstanceRef.current = new google.maps.Map(mapRef.current, {
					zoom: 5,
					center,
				})
			}

			// Add markers for each property
			properties.forEach(property => {
				const marker = new google.maps.Marker({
					position: { lat: property.lat, lng: property.lng },
					map: mapInstanceRef.current,
					title: property.title,
				})
				markersRef.current.push(marker)
			})

			// Auto-fit bounds if there are properties
			if (properties.length > 0) {
				const bounds = new google.maps.LatLngBounds()
				properties.forEach(property => {
					bounds.extend({ lat: property.lat, lng: property.lng })
				})
				mapInstanceRef.current?.fitBounds(bounds)
			}
		}

		// Check if Google Maps API is already loaded
		if (typeof google !== 'undefined' && google.maps) {
			initMap()
		} else {
			// Load Google Maps API with proper handling
			loadGoogleMapsApi(initMap)
		}

		// Cleanup function
		return () => {
			markersRef.current.forEach(marker => marker.setMap(null))
			markersRef.current = []
		}
	}, [properties])

	return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
}

export default GoogleMapWithPins
