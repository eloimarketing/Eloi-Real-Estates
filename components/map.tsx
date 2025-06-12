'use client'

import React, { useCallback, useState } from 'react'
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api'

type PropertyMapProps = {
	latitude: number
	longitude: number
	propertyName?: string
}

const containerStyle = {
	width: '100%',
	height: '400px',
}

const PropertyMap: React.FC<PropertyMapProps> = ({ latitude, longitude, propertyName = 'Property' }) => {
	console.log(
		latitude,
		longitude,
		propertyName,
		'here it is ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'
	)
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAQReifXIyF27pAqVclaTJDkboN1NCwZvI',
	})

	const [infoOpen, setInfoOpen] = useState(false) // Changed to false by default

	const center = {
		lat: latitude,
		lng: longitude,
	}

	const onLoad = useCallback(
		(map: google.maps.Map) => {
			map.setCenter({ lat: latitude, lng: longitude })
		},
		[latitude, longitude]
	)

	// Handle missing API key
	if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
		return <div>Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.</div>
	}

	if (loadError) return <div>Map cannot be loaded right now...</div>
	if (!isLoaded) return <div>Loading map...</div>

	return (
		<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15} onLoad={onLoad}>
			<Marker position={center} onClick={() => setInfoOpen(true)}>
				{infoOpen && (
					<InfoWindow onCloseClick={() => setInfoOpen(false)}>
						<div>
							<h3>{propertyName}</h3>
							<p>Lat: {latitude.toFixed(6)}</p>
							<p>Lng: {longitude.toFixed(6)}</p>
						</div>
					</InfoWindow>
				)}
			</Marker>
		</GoogleMap>
	)
}

export default PropertyMap
