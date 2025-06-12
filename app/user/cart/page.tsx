import MaxWidthWrapper from '@/components/max-width-wrapper'
import prisma from '@/lib/prisma/prisma'
import { auth } from '@/auth'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function Cart() {
	const sesion = await auth()
	const user = sesion?.user

	const cart = await prisma.cart.findMany({ where: { userId: user?.id } })
	const properties = await prisma.property.findMany({ where: { id: { in: cart.map(item => item.propertyId) } } })

	return (
		<MaxWidthWrapper className="my-10">
			<h1 className="text-3xl text-center font-semibold">Cart</h1>
			<div className="grid sm:grid-cols-2 gap-4 mt-10">
				{properties.map(property => (
					<div key={property.id} className="w-full flex gap-4 border rounded-md p-2">
						<Image
							src={property.images[0]}
							alt={property.title}
							width={400}
							height={250}
							className="w-32 rounded-md object-fill aspect-square"
						/>
						<div>
							<h2 className="text-xl font-semibold">{property.title}</h2>
							<p className="text-gray-500 leading-5 my-1">{property.description}</p>
							<p className="text-gray-800 font-bold">₹{property.price.toLocaleString()}</p>

							<Link href={`/user/property/${property.id}`} className={cn(buttonVariants({ variant: 'default' }), 'mt-2')}>
								View Property
							</Link>
						</div>
					</div>
				))}
			</div>
		</MaxWidthWrapper>
	)
}
