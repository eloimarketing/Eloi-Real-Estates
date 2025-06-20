import Image from 'next/image'
import MaxWidthWrapper from './max-width-wrapper'
import { Button, buttonVariants } from './ui/button'
import Link from 'next/link'
import { auth } from '@/auth'
import SignOutBtn from './sign-out-btn'
import { AlignJustify, HeartIcon, ShoppingCart } from 'lucide-react'
import prisma from '@/lib/prisma/prisma'
import { cn } from '@/lib/utils'

export default async function Navbar() {
	const session = await auth()
	const user = session?.user

	const cart = await prisma.cart.findMany({ where: { userId: user?.id } })

	const fields = [
		{ name: 'Home', href: '/' },
		{ name: 'Properties', href: '/user/property/all' },
		{ name: 'Services', href: '/' },
		{ name: 'Contact Us', href: '/' },
	]

	return (
		<div className="border-b shadow-md w-full h-20">
			<MaxWidthWrapper className="flex justify-between items-center overflow-hidden">
				<Link href={'/'} className="flex items-center gap-2">
					<Image src={'/logo.jpeg'} alt="logo" width={1536} height={1024} className="w-28" />
				</Link>

				<div className="mx-auto hidden sm:block">
					{fields.map((field, index) => (
						<Link key={index} href={field.href} className={buttonVariants({ variant: 'ghost' })}>
							{field.name}
						</Link>
					))}
				</div>

				<div className="flex gap-2">
					{(!user || user.role === 'SELLER') && (
						<Link href={'/seller/property/create-2'} className={cn(buttonVariants({ variant: 'default' }), 'hidden sm:block')}>
							List Your Property
						</Link>
					)}

					{user?.role === 'ADMIN' && (
						<Link href={'/admin/all-property'} className={buttonVariants({ variant: 'default' })}>
							Manage Properties
						</Link>
					)}

					{user?.role === 'BUYER' && (
						<>
							<Button size={'icon'} variant={'outline'}>
								<HeartIcon />
							</Button>
							<div className="relative">
								<Link href={'/user/cart'} className={buttonVariants({ variant: 'outline', size: 'icon' })}>
									<ShoppingCart />
								</Link>
								{cart.length > 0 && (
									<div className="absolute -top-3 -right-2 border aspect-square w-6 h-6 flex justify-center items-center rounded-full">
										{cart.length}
									</div>
								)}
							</div>
						</>
					)}

					<Button variant={'outline'} size={'icon'} className="sm:hidden">
						<AlignJustify />
					</Button>

					{!user ? (
						<Link href={'/auth/login'} className={buttonVariants({ variant: 'outline' })}>
							Log In
						</Link>
					) : (
						<SignOutBtn />
					)}
				</div>
			</MaxWidthWrapper>
		</div>
	)
}
