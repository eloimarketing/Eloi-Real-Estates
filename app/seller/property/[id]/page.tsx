import ApartmentFlatViewPage from '@/components/pages/property-view/apartment-flat'
import IndependentCommercialViewPage from '@/components/pages/property-view/independent-commercial-property'
import IndependentHouseVillaViewPage from '@/components/pages/property-view/independent-house-villa'
import prisma from '@/lib/prisma/prisma'
import { notFound } from 'next/navigation'

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const property = await prisma.property.findUnique({
		where: { id },
		include: {
			apartmentFlat: true,
			independentHouseVilla: true,
			independentCommercialProperty: true,
			location: true,
			owner: true,
		},
	})
	console.log(property)

	if (!property) return notFound()

	switch (property.propertyType) {
		case 'Apartment_Flat':
			return <ApartmentFlatViewPage property={property} />

		case 'Independent_Commercial_Property':
			return <IndependentCommercialViewPage property={property} />

		case 'Independent_House_Villa':
			return <IndependentHouseVillaViewPage property={property} />
			break

		default:
			return notFound()
	}
}
