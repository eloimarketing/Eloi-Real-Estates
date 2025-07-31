import MaxWidthWrapper from '@/components/max-width-wrapper'
import prisma from '@/lib/prisma/prisma'
import { auth } from '@/auth'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import RemoveFromCart from '@/components/remove-from-cart'
import CartBuyNow from './cart-buy-now'

export default async function Cart() {
	const sesion = await auth()
	const user = sesion?.user

	const cart = await prisma.cart.findMany({ where: { userId: user?.id } })
	const properties = await prisma.property.findMany({ where: { id: { in: cart.map(item => item.propertyId) } } })

	return (
		<MaxWidthWrapper className="my-10">
			<h1 className="text-3xl text-center font-semibold">Cart</h1>
			<div className="grid sm:grid-cols-2 gap-4 mt-10">
				{properties.map(property => {
					const cartItem = cart.find(item => item.propertyId === property.id)
					if (!cartItem) return null

					// Environment fee values
					const AGREEMENT_PERCENT = parseInt(process.env.NEXT_PUBLIC_AGREEMENT_FEE_PERCENTAGE!)
					const LEGAL_ADVICE_FEE = parseInt(process.env.NEXT_PUBLIC_LEGAL_ADVICE_FEE!)

					let propertyTotal = property.price

					if (cartItem.isAgreementRequested) {
						propertyTotal += property.price * (AGREEMENT_PERCENT / 100)
					}

					if (cartItem.isLegalAdviceRequested) {
						propertyTotal += LEGAL_ADVICE_FEE
					}

					if (cartItem.isPayAdvanceRequested) {
						propertyTotal += property.advanceBookingAmount
					}

					return (
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

								{cartItem.isAgreementRequested && (
									<p className="text-gray-800 text-xs">
										Agreement Fee ₹{(property.price * (AGREEMENT_PERCENT / 100)).toLocaleString()}
									</p>
								)}

								{cartItem.isLegalAdviceRequested && (
									<p className="text-gray-800 text-xs">Legal Advice Fee ₹{LEGAL_ADVICE_FEE.toLocaleString()}</p>
								)}

								{cartItem.isPayAdvanceRequested && (
									<p className="text-gray-800 text-xs">Advance Fee ₹{property.advanceBookingAmount.toLocaleString()}</p>
								)}

								<p className="text-gray-800 text-xs">Property Price ₹{property.price.toLocaleString()}</p>

								<p className="text-gray-800 text-sm font-semibold">Total Price ₹{Math.round(propertyTotal).toLocaleString()}</p>

								<div className="flex gap-2 items-end">
									<Link href={`/user/property/${property.id}`} className={cn(buttonVariants({ variant: 'default' }), 'mt-2')}>
										View Property
									</Link>
									<RemoveFromCart propertyId={property.id} />
								</div>
							</div>
						</div>
					)
				})}

				<CartBuyNow propertyIds={cart.map(item => item.propertyId)} />
			</div>
		</MaxWidthWrapper>
	)
}
