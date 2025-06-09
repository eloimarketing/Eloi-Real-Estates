import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { buttonVariants } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export default function PropertyCard({ property }: { property: any }) {
	return (
		<div className="rounded-md overflow-hidden border shadow-sm">
			<div className="h-58 overflow-hidden">
				<Image
					src={property.image}
					alt="property"
					width={1080}
					height={1080}
					className="object-cover rounded-t-md w-full h-58 hover:scale-125 transition-all duration-200"
				/>
			</div>
			<div className="py-4 px-2">
				<div className="flex items-center gap-2 justify-between">
					<div className="flex gap-2 items-center w-52">
						<h3 className="font-semibold text-sm line-clamp-2">{property.title}</h3>
					</div>
					<Tooltip>
						<TooltipTrigger className={cn('hover:cursor-pointer', buttonVariants({ variant: 'outline' }))}>
							<ShoppingCart />
						</TooltipTrigger>
						<TooltipContent>
							<p>Add to Cart</p>
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="mt-4 flex justify-between items-center gap-2">
					<div className="font-bold text-sm flex justify-center items-center flex-col">
						₹ {property.price}
						<span className="font-medium"> Rent / Month</span>
					</div>
					<div className="font-bold text-sm flex justify-center items-center flex-col text-center">
						{property.propertyType === 'Apartment_Flat' && (
							<>
								Apartment <br /> & Flat
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
