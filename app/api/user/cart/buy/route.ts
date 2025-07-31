import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma'
import { auth } from '@/auth'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
	key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export async function POST(request: Request) {
	const sesion = await auth()
	const user = sesion?.user

	try {
		const productIds = await request.json()

		// Optional: Fetch user's cart entries for those properties (if needed)
		const propertyCartDetails = await prisma.cart.findMany({
			where: {
				userId: user!.id,
				propertyId: {
					in: productIds,
				},
			},
		})

		// Fetch property details in batch
		const propertyDetails = await prisma.property.findMany({
			where: {
				id: {
					in: productIds,
				},
			},
		})

		const mergedProperties = propertyDetails.map(property => {
			const cart = propertyCartDetails.find(cartItem => cartItem.propertyId === property.id)
			return {
				...property,
				cartDetails: cart || null,
			}
		})

		// Calculate total price

		console.log(propertyCartDetails, propertyDetails, mergedProperties)

		let totalPrice = 0

		mergedProperties.forEach(property => {
			let myPrice = property.price

			if (property.cartDetails?.isAgreementRequested) {
				myPrice = myPrice + myPrice * (parseInt(process.env.NEXT_PUBLIC_AGREEMENT_FEE_PERCENTAGE!) / 100)
			}
			if (property.cartDetails?.isLegalAdviceRequested) {
				myPrice = myPrice + parseInt(process.env.NEXT_PUBLIC_LEGAL_ADVICE_FEE!)
			}
			if (property.cartDetails?.isPayAdvanceRequested) {
				myPrice = myPrice + property.advanceBookingAmount
			}
			totalPrice = totalPrice + myPrice
		})

		console.log(Math.round(totalPrice), 'this is the total price')
		const order = await razorpay.orders.create({
			amount: Math.round(totalPrice * 100), // Razorpay expects amount in paisa
			currency: 'INR',
			receipt: `rcpt_${Date.now()}`,
		})

		return NextResponse.json(order)
	} catch (error) {
		console.log(error)
		return NextResponse.json(error)
	}
}
