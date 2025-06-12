import ApartmentFlatViewPage from '@/components/pages/property-view/apartment-flat'
import IndependentHouseVillaViewPage from '@/components/pages/property-view/independent-house-villa'
import prisma from '@/lib/prisma/prisma'
import { notFound } from 'next/navigation'
import BookingPaymentForm from './bookingPaymentBox'

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

	if (!property) return notFound()

	switch (property.propertyType) {
		case 'Apartment_Flat':
			return (
				<div className="bg-blue-200">
					<ApartmentFlatViewPage property={property!} />
					<div className="my-10">
						<BookingPaymentForm propertyId={property.id} />
					</div>
				</div>
			)

		case 'Independent_House_Villa':
			return (
				<div className="bg-blue-200">
					<IndependentHouseVillaViewPage property={property} />
					<div className="my-10">
						<BookingPaymentForm propertyId={property.id} />
					</div>
				</div>
			)
			break

		default:
			return notFound()
	}
}
