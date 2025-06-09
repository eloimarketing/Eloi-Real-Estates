'use client'

import { useEffect } from 'react'

type Property = {
	lat: number
	lng: number
	title: string
}

interface GoogleMapWithPinsProps {
	properties: Property[]
}

const GoogleMapWithPins: React.FC<GoogleMapWithPinsProps> = ({ properties }) => {
	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQReifXIyF27pAqVclaTJDkboN1NCwZvI&callback=initMap'
		script.async = true
		script.defer = true
		document.body.appendChild(script)
		;(window as any).initMap = function () {
			const center = { lat: 23.2599, lng: 77.4126 }

			const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
				zoom: 5,
				center,
			})

			properties.forEach(property => {
				new google.maps.Marker({
					position: { lat: property.lat, lng: property.lng },
					map,
					title: property.title,
				})
			})
		}

		return () => {
			delete (window as any).initMap
		}
	}, [properties])

	return <div id="map" style={{ height: '500px', width: '100%' }} />
}

export default GoogleMapWithPins
