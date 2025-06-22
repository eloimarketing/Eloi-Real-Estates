'use client'

import React, { useState } from 'react'
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api'

type PropertyMapProps = {
	latitude: number
	longitude: number
	propertyName?: string
}

const PropertyMap: React.FC<PropertyMapProps> = ({ latitude, longitude, propertyName = 'Property' }) => {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
	})

	const [infoOpen, setInfoOpen] = useState(false)

	const center = { lat: latitude, lng: longitude }

	if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
		return <div>Google Maps API key is missing.</div>
	}

	if (loadError) return <div>Error loading map</div>
	if (!isLoaded) return <div>Loading map...</div>

	return (
		<div style={{ width: '100%', height: '400px' }}>
			<GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={center} zoom={15}>
				<Marker position={center} onClick={() => setInfoOpen(true)} />
				{infoOpen && (
					<InfoWindow position={center} onCloseClick={() => setInfoOpen(false)}>
						<div>
							<h3>{propertyName}</h3>
							<p>Lat: {latitude.toFixed(6)}</p>
							<p>Lng: {longitude.toFixed(6)}</p>
						</div>
					</InfoWindow>
				)}
			</GoogleMap>
		</div>
	)
}

export default PropertyMap
