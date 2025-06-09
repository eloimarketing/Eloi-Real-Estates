import { auth } from '@/auth'
import prisma from '@/lib/prisma/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const session = await auth()
		const user = session?.user

		const data = await request.json()
		console.log(data)
		const updatedProperty = await prisma.property.update({ where: { id: data.propertyId }, data: { isVerified: true } })
		return NextResponse.json(updatedProperty)
	} catch (error) {
		console.log(error)
		return NextResponse.json(error, { status: 500 })
	}
}
