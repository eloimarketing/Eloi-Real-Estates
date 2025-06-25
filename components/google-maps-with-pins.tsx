'use client'

import { useEffect, useRef } from 'react'

type Property = {
	lat: number
	lng: number
	title: string
}

const GoogleMapWithPins = ({ properties }: { properties: Property[] }) => {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<google.maps.Map | null>(null)
	const markersRef = useRef<google.maps.Marker[]>([])

	useEffect(() => {
		// Clear existing markers
		markersRef.current.forEach(marker => marker.setMap(null))
		markersRef.current = []

		const initMap = () => {
			if (!mapRef.current) return

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
			// Load Google Maps API
			const script = document.createElement('script')
			script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQReifXIyF27pAqVclaTJDkboN1NCwZvI&callback=initGoogleMap'
			script.async = true
			script.defer = true

			// Use a unique callback name to avoid conflicts

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			;(window as any).initGoogleMap = initMap

			document.body.appendChild(script)
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
