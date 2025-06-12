import prisma from '@/lib/prisma/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
	try {
		const session = await auth()
		const user = session?.user
		const popertyId = await request.json()
		console.log(popertyId, 'asdf asdf')

		if (!user) {
			return new Response('Unauthorized', {
				status: 401,
				statusText: 'Unauthorized',
			})
		}

		const cart = await prisma.cart.create({
			data: {
				userId: user.id!,
				propertyId: popertyId,
			},
		})

		return NextResponse.json({ cart, message: 'Property added to cart successfully' }, { status: 200 })
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error: error }, { status: 500 })
	}
}
