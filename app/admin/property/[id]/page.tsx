import MaxWidthWrapper from '@/components/max-width-wrapper'
import prisma from '@/lib/prisma/prisma'
import { notFound } from 'next/navigation'
import PropertyViewPage from '../../../../components/common/property'

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const property = await prisma.property.findUnique({
		where: { id },
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

	if (!property) return notFound()

	return (
		<MaxWidthWrapper className="px-0">
			<PropertyViewPage property={property} isAdmin={true} />
		</MaxWidthWrapper>
	)
}
