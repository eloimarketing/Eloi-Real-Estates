import prisma from '@/lib/prisma/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
	try {
		const session = await auth()
		const user = session?.user
		const { propertyId, isAgreementRequested, isLegalAdviceRequested, isPayAdvanceRequested, isVisitRequested, visitDate } =
			await request.json()

		console.log(propertyId, isAgreementRequested, isLegalAdviceRequested, isPayAdvanceRequested, isVisitRequested, visitDate)

		const cart = await prisma.cart.create({
			data: {
				userId: user!.id!,
				propertyId: propertyId,
				isAgreementRequested,
				isLegalAdviceRequested,
				isPayAdvanceRequested,
				isVisitRequested,
				...(isVisitRequested && { visitDate }),
			},
		})

		return NextResponse.json({ cart, message: 'Property added to cart successfully' }, { status: 200 })
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error: error }, { status: 500 })
	}
}
