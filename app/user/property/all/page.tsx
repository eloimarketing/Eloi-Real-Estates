import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma/prisma'
import Image from 'next/image'
import Link from 'next/link'

export default async function AllProperties({
	searchParams,
}: {
	searchParams?: Promise<{
		[key: string]: string | string[] | undefined
	}>
}) {
	// @ts-expect-error // TODO: Fix this
	const data = JSON.parse((await searchParams).data)

	const whereClause = {
		isVerified: true,
		listingType: data.listingType,
		...(data.state || data.city
			? {
					location: {
						...(data.state && { state: data.state }),
						...(data.city && { city: data.city }),
					},
			  }
			: {}),
		...(data.propertyType && { propertyType: data.propertyType }),
		...(data.query && {
			OR: [
				{ title: { contains: data.query, mode: 'insensitive' } },
				{ description: { contains: data.query, mode: 'insensitive' } },
				{ location: { address: { contains: data.query, mode: 'insensitive' } } },
			],
		}),
		...(data.priceRange &&
			data.priceRange?.max && {
				price: {
					gte: data.priceRange.mins || 0,
					lte: data.priceRange.max,
				},
			}),
	}

	const allProperties = await prisma.property.findMany({
		where: whereClause,
		include: {
			apartmentFlat: true,
			independentHouseVilla: true,
			location: true,
			owner: true,
		},
	})
	console.log(allProperties, allProperties.length, 'all properties', whereClause)
	if (allProperties.length === 0) {
		return (
			<div className="h-screen flex items-center justify-center w-full">
				<div className="flex flex-col gap-4 items-center justify-center mx-auto">
					<h1 className="text-3xl font-bold text-center">No Such Property Available</h1>
					<p>Kindly go back and try again</p>
					<Button asChild>
						<Link href="/">Go Back</Link>
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
			{allProperties.map(property => (
				<Link
					href={`/user/property/${property.id}`}
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
							<span className="mr-2 font-medium">Type:</span>
							{property.propertyType.replaceAll('_', ' ')}
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

						{property.independentHouseVilla && (
							<ul className="text-sm text-gray-700 space-y-1 mb-3">
								<li>
									<strong>Bedrooms:</strong> {property.independentHouseVilla.bedrooms}
								</li>
								<li>
									<strong>Plot Area:</strong> {property.independentHouseVilla.plotArea} sqft
								</li>
								<li>
									<strong>Built-Up Area:</strong> {property.independentHouseVilla.builtUpArea} sqft
								</li>
								<li>
									<strong>Floors:</strong> {property.independentHouseVilla.floors}
								</li>
								<li>
									<strong>Parking:</strong> {property.independentHouseVilla.parking ? 'Yes' : 'No'}
								</li>
								<li>
									<strong>Age of Construction:</strong> {property.independentHouseVilla.ageOfConstruction}
								</li>
								<li>
									<strong>Furnishing:</strong> {property.independentHouseVilla.furnishingStatus}
								</li>
								<li>
									<strong>Facing:</strong> {property.independentHouseVilla.facingDirection || 'N/A'}
								</li>
								<li>
									<strong>Has Garden Lawn:</strong> {property.independentHouseVilla.hasGardenLawn ? 'Yes' : 'No'}
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
