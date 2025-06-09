import MaxWidthWrapper from '@/components/max-width-wrapper'
import prisma from '@/lib/prisma/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ApprovePropertyBtn from './approve-btn'
import { Button } from '@/components/ui/button'

export default async function PropertyPage({ params }: { params: { id: string } }) {
	const { id } = await params

	const property = await prisma.property.findUnique({
		where: { id },
		include: {
			apartmentFlat: true,
			independentHouseVilla: true,
			location: true,
			owner: true,
		},
	})

	if (!property || (!property.apartmentFlat && !property.independentHouseVilla)) return notFound()

	const apartment = property.apartmentFlat
	const houseVilla = property.independentHouseVilla
	const isApartment = !!apartment
	const isHouseVilla = !!houseVilla

	return (
		<MaxWidthWrapper className="my-10 max-w-6xl">
			<h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Admin View - {property.title}</h1>

			{/* Main Image */}
			{property.images.length > 0 && (
				<div className="w-full max-h-[500px] overflow-hidden rounded-3xl mb-10 shadow-lg">
					<Image
						src={property.images[0]}
						alt={property.title}
						width={1200}
						height={500}
						className="w-full h-full object-cover rounded-3xl"
					/>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
				{/* General Info */}
				<div className="bg-white rounded-2xl shadow p-6 space-y-4 border border-gray-200">
					<h2 className="text-2xl font-semibold text-indigo-600">General Information</h2>
					<div className="text-gray-700 space-y-2">
						<Info label="Price" value={`₹${property.price.toLocaleString()}`} />
						<Info label="Description" value={property.description} />
						<Info label="Status" value={property.status} />
						<Info label="Property Type" value={isApartment ? 'Apartment / Flat' : 'Independent House / Villa'} />
						<Info label="Listed By" value={property.owner.firstName + ' ' + property.owner.lastName || 'N/A'} />
						<Info label="Location" value={`${property.location?.city}, ${property.location?.state}`} />
						<Info label="Verified" value={property.isVerified ? 'Yes' : 'No'} />
						<Info label="Created At" value={new Date(property.createdAt).toLocaleDateString()} />
					</div>
				</div>

				{/* Apartment Info */}
				{isApartment && (
					<div className="bg-white rounded-2xl shadow p-6 space-y-4 border border-gray-200">
						<h2 className="text-2xl font-semibold text-indigo-600">Apartment Details</h2>
						<div className="text-gray-700 space-y-2">
							<Info label="BHK" value={apartment.bhk} />
							<Info label="Carpet Area" value={`${apartment.carpetArea} sqft`} />
							<Info label="Built-Up Area" value={`${apartment.builtUpArea} sqft`} />
							<Info label="Floor" value={`${apartment.floorNumber} / ${apartment.totalFloors}`} />
							<Info label="Bathrooms" value={apartment.bathrooms.toString()} />
							<Info label="Furnishing" value={apartment.furnishingStatus} />
							<Info label="Balcony" value={apartment.balcony ? 'Yes' : 'No'} />
							<Info label="Lift" value={apartment.hasLift ? 'Yes' : 'No'} />
							<Info label="Parking" value={apartment.parking ? 'Yes' : 'No'} />
							<Info label="Facing" value={apartment.facingDirection || 'N/A'} />
							<Info label="Security" value={apartment.hasSecurity ? 'Yes' : 'No'} />
							<Info label="Gym" value={apartment.hasGym ? 'Yes' : 'No'} />
							<Info label="Swimming Pool" value={apartment.hasSwimmingPool ? 'Yes' : 'No'} />
							<Info label="Power Backup" value={apartment.hasPowerBackup ? 'Yes' : 'No'} />
							<Info label="Garden" value={apartment.hasGarden ? 'Yes' : 'No'} />
							<Info label="RERA No." value={apartment.reraNumber || 'N/A'} />
							<Info label="Age of Property" value={`${apartment.ageOfProperty} years`} />
						</div>
					</div>
				)}

				{/* Independent House/Villa Info */}
				{isHouseVilla && (
					<div className="bg-white rounded-2xl shadow p-6 space-y-4 border border-gray-200">
						<h2 className="text-2xl font-semibold text-indigo-600">House/Villa Details</h2>
						<div className="text-gray-700 space-y-2">
							<Info label="Bedrooms" value={houseVilla.bedrooms.toString()} />
							<Info label="Plot Area" value={`${houseVilla.plotArea} sqft`} />
							<Info label="Built-Up Area" value={`${houseVilla.builtUpArea} sqft`} />
							<Info label="Floors" value={houseVilla.floors} />
							<Info label="Parking" value={houseVilla.parking ? 'Yes' : 'No'} />
							<Info
								label="Age of Construction"
								value={houseVilla.ageOfConstruction ? `${houseVilla.ageOfConstruction} years` : 'N/A'}
							/>
							<Info label="Furnishing Status" value={houseVilla.furnishingStatus.replaceAll('_', ' ')} />
							<Info
								label="Facing Direction"
								value={houseVilla.facingDirection ? houseVilla.facingDirection.replaceAll('_', ' ') : 'N/A'}
							/>
							<Info label="Garden/Lawn" value={houseVilla.hasGardenLawn ? 'Yes' : 'No'} />
							<Info label="Water Source" value={houseVilla.hasWaterSource ? 'Yes' : 'No'} />
							<Info label="Power Backup" value={houseVilla.hasPowerBackup ? 'Yes' : 'No'} />
							<Info label="Swimming Pool" value={houseVilla.hasSwimmingPool ? 'Yes' : 'No'} />
							<Info label="Security" value={houseVilla.hasSecurity ? 'Yes' : 'No'} />
						</div>
					</div>
				)}
			</div>

			{/* Google Maps Section */}
			{property.googleMapLat && property.googleMapLng && (
				<div className="mt-10">
					<h3 className="text-2xl font-semibold text-indigo-600 mb-4">Property Location</h3>
					<div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
						<div className="mb-4 text-gray-700">
							<Info label="Coordinates" value={`${property.googleMapLat}, ${property.googleMapLng}`} />
						</div>
						<div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
							<iframe
								src={`https://www.google.com/maps/embed/v1/view?key=${
									process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAQReifXIyF27pAqVclaTJDkboN1NCwZvI'
								}&center=${property.googleMapLat},${property.googleMapLng}&zoom=15&maptype=roadmap`}
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title="Property Location"></iframe>
						</div>
						<div className="mt-4 flex justify-center">
							<a
								href={`https://www.google.com/maps?q=${property.googleMapLat},${property.googleMapLng}`}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
								<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								Open in Google Maps
							</a>
						</div>
					</div>
				</div>
			)}

			{/* Video Section */}
			{property.videos.length > 0 && (
				<div className="mt-10">
					<h3 className="text-2xl font-semibold text-indigo-600 mb-4">Property Video</h3>
					<div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
						<video src={property.videos[0]} className="w-full max-w-2xl mx-auto rounded-xl" autoPlay muted controls></video>
					</div>
				</div>
			)}

			{/* Approval Button */}
			{!property.isVerified ? (
				<ApprovePropertyBtn propertyId={id} />
			) : (
				<Button className="w-full mt-10" variant={'destructive'} disabled>
					Property Already Approved
				</Button>
			)}
		</MaxWidthWrapper>
	)
}

// Info row component
function Info({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between border-b border-gray-100 pb-1">
			<span className="font-medium text-gray-600">{label}:</span>
			<span className="text-gray-800">{value}</span>
		</div>
	)
}
