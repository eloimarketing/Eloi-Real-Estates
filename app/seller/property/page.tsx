import prisma from '@/lib/prisma/prisma'
import { auth } from '@/auth'
import PropertyCard from '@/components/property-card'

export default async function AllProperties() {
	const session = await auth()
	const user = session?.user

	const allProperties = await prisma.property.findMany({
		where: { ownerId: user?.id },
		include: {
			apartmentFlat: true,
			independentHouseVilla: true,
			plotLand: true,
			officeSpace: true,
			shopShowroom: true,
			industrialProperty: true,
			farmhouseAgricultural: true,
			coWorkingSpace: true,
			warehouseGodown: true,
			payingGuestHostel: true,
			independentCommercialProperty: true,

			location: true,
			owner: true,
		},
	})

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
			{allProperties.map((property, indx) => (
				<PropertyCard key={indx} property={property} role={user?.role || 'SELLER'} />
			))}
		</div>
	)
}
