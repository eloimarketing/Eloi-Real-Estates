import MaxWidthWrapper from '@/components/max-width-wrapper'
import prisma from '@/lib/prisma/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function PropertyPage({ params }: { params: { id: string } }) {
	const { id } = params

	const property = await prisma.property.findUnique({
		where: { id },
		include: {
			apartmentFlat: true,
			location: true,
			owner: true,
		},
	})

	if (!property || !property.apartmentFlat) return notFound()

	const apartment = property.apartmentFlat

	return (
		<MaxWidthWrapper className="my-10 max-w-6xl">
			<h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Seller View - {property.title}</h1>

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
						<Info label="Property Type" value="Apartment / Flat" />
						<Info label="Listed By" value={property.owner.firstName + ' ' + property.owner.lastName || 'N/A'} />
						<Info label="Location" value={`${property.location?.city}, ${property.location?.state}`} />
						<Info label="Verified" value={property.isVerified ? 'Yes' : 'No'} />
						<Info label="Created At" value={new Date(property.createdAt).toLocaleDateString()} />
					</div>
				</div>

				{/* Apartment Info */}
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
			</div>
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
