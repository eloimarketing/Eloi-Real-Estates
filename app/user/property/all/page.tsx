import MaxWidthWrapper from '@/components/max-width-wrapper'
import PropertyCard from '@/components/property-card'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma/prisma'
import Link from 'next/link'
import { auth } from '@/auth'

export default async function AllProperties({
	searchParams,
}: {
	searchParams?: Promise<{
		[key: string]: string | string[] | undefined
	}>
}) {
	const session = await auth()
	const user = session?.user

	const params = await searchParams

	const data = params && params.data && Object.keys(params.data).length > 0 && JSON.parse(params.data!.toString())

	const whereClause = {
		isVerified: true,
		...(data?.listingType && { listingType: data.listingType }),
		...(data?.state || data?.city
			? {
					location: {
						...(data.state && { state: data.state }),
						...(data.city && { city: data.city }),
					},
			  }
			: {}),
		...(data?.propertyType && { propertyType: data.propertyType }),
		...(data?.query && {
			OR: [
				{ title: { contains: data.query, mode: 'insensitive' } },
				{ description: { contains: data.query, mode: 'insensitive' } },
				{ location: { address: { contains: data.query, mode: 'insensitive' } } },
			],
		}),
		...(data?.priceRange &&
			data?.priceRange?.max && {
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
	console.log('all properties', whereClause)
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
		<MaxWidthWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
			{allProperties.map((property, indx) => (
				<PropertyCard key={indx} property={property} role={user?.role || 'BUYER'} />
			))}
		</MaxWidthWrapper>
	)
}
