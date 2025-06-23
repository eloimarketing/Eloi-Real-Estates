import Image from 'next/image'
import MaxWidthWrapper from './max-width-wrapper'
import Link from 'next/link'
import { auth } from '@/auth'
import prisma from '@/lib/prisma/prisma'
import NavbarLinks from './navbar-links'

export default async function Navbar() {
	const session = await auth()
	const user = session?.user

	const cart = await prisma.cart.findMany({ where: { userId: user?.id } })

	return (
		<div className="border-b shadow-md w-full h-20">
			<MaxWidthWrapper className="flex justify-between items-center overflow-hidden">
				<Link href={'/'} className="flex items-center gap-2">
					<Image src={'/assets/logo.jpeg'} alt="logo" width={1536} height={1024} className="w-28" />
				</Link>

				<NavbarLinks user={user} cart={cart} />
			</MaxWidthWrapper>
		</div>
	)
}
