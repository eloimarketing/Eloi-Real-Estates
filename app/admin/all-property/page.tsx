import PropertyCard from '@/components/property-card'
import prisma from '@/lib/prisma/prisma'

export default async function AllProperties() {
	const allProperties = await prisma.property.findMany({
		include: {
			apartmentFlat: true,
			independentHouseVilla: true,
			location: true,
			owner: true,
		},
	})

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
			{allProperties.map(property => (
				<PropertyCard key={property.id} property={property} role="ADMIN" />
			))}
		</div>
	)
}
