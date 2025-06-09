import Image from 'next/image'
import MaxWidthWrapper from './max-width-wrapper'
import { buttonVariants } from './ui/button'
import Link from 'next/link'
import { auth } from '@/auth'
import SignOutBtn from './sign-out-btn'

export default async function Navbar() {
	const session = await auth()
	const user = session?.user

	return (
		<div className="border-b shadow-md w-full h-20">
			<MaxWidthWrapper className="flex justify-between items-center">
				<Link href={'/'} className="flex items-center gap-2">
					<Image src={'/logo.jpeg'} alt="logo" width={1536} height={1024} className="w-28" />
				</Link>
				<div className="flex gap-2">
					{(!user || user.role === 'SELLER') && (
						<Link href={'/seller/property/create'} className={buttonVariants({ variant: 'default' })}>
							List Your Property
						</Link>
					)}

					{user?.role === 'ADMIN' && (
						<Link href={'/admin/all-property'} className={buttonVariants({ variant: 'default' })}>
							Manage Properties
						</Link>
					)}

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
