'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SellerSidebar() {
	const pathname = usePathname()

	const links = [
		{ name: 'Dashboard', path: '/seller' },
		{ name: 'Add Property', path: '/seller/property/create-2' },
		{ name: 'All Properties', path: '/seller/property' },
		{ name: 'Orders', path: '' },
		{ name: 'Payments', path: '' },
		{ name: 'Profile', path: '/seller/profile' },
	]

	return (
		<div>
			<div className="flex flex-col gap-2">
				{links.map((link, indx) => (
					<Link
						href={link.path}
						key={indx}
						className={cn(
							'w-full p-2 rounded-md hover:bg-primary/90 hover:text-white font-medium hover:cursor-pointer border border-black',
							link.path === pathname && 'bg-primary text-white border-none'
						)}>
						{link.name}
					</Link>
				))}
			</div>
		</div>
	)
}
