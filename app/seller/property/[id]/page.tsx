import PropertyViewPage from '@/components/common/property'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import prisma from '@/lib/prisma/prisma'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
	const session = await auth()
	const user = session?.user

	const { id } = await params

	const property = await prisma.property.findUnique({
		where: { id, ownerId: user?.id },
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
			<PropertyViewPage property={property} />
		</MaxWidthWrapper>
	)
}
