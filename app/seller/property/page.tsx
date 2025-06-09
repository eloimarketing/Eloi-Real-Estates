// components/AllProperties.tsx
import prisma from '@/lib/prisma/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/auth'

export default async function AllProperties() {
	const session = await auth()
	const user = session?.user

	const allProperties = await prisma.property.findMany({
		where: { ownerId: user?.id },
		include: {
			apartmentFlat: true,
			location: true,
			owner: true,
		},
	})

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
			{allProperties.map(property => (
				<Link
					href={`/seller/property/${property.id}`}
					key={property.id}
					className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200">
					{property.images.length > 0 && (
						<Image src={property.images[0]} alt={property.title} width={400} height={250} className="w-full h-60 object-cover" />
					)}
					<div className="p-4">
						<h2 className="text-xl font-semibold mb-1">{property.title}</h2>
						<p className="text-gray-500 mb-2">{property.description}</p>
						<p className="text-gray-800 font-bold mb-2">₹{property.price.toLocaleString()}</p>

						<div className="text-sm text-gray-600 mb-2">
							<span className="mr-2 font-medium">Type:</span>Apartment / Flat
						</div>

						{property.apartmentFlat && (
							<ul className="text-sm text-gray-700 space-y-1 mb-3">
								<li>
									<strong>BHK:</strong> {property.apartmentFlat.bhk}
								</li>
								<li>
									<strong>Carpet Area:</strong> {property.apartmentFlat.carpetArea} sqft
								</li>
								<li>
									<strong>Built-Up Area:</strong> {property.apartmentFlat.builtUpArea} sqft
								</li>
								<li>
									<strong>Bathrooms:</strong> {property.apartmentFlat.bathrooms}
								</li>
								<li>
									<strong>Furnishing:</strong> {property.apartmentFlat.furnishingStatus}
								</li>
								<li>
									<strong>Floor:</strong> {property.apartmentFlat.floorNumber} / {property.apartmentFlat.totalFloors}
								</li>
								<li>
									<strong>Lift:</strong> {property.apartmentFlat.hasLift ? 'Yes' : 'No'}
								</li>
								<li>
									<strong>Parking:</strong> {property.apartmentFlat.parking ? 'Yes' : 'No'}
								</li>
							</ul>
						)}

						<div className="flex justify-between text-xs text-gray-500">
							<span>{new Date(property.createdAt).toLocaleDateString()}</span>
							<span>{property.isVerified ? 'Verified' : 'Unverified'}</span>
						</div>
					</div>
				</Link>
			))}
		</div>
	)
}
