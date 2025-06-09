'use client'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function SearchBar() {
	const [listingType, setListingType] = useState<'Rent' | 'Buy'>('Rent')

	return (
		<div className="flex justify-center items-center flex-col w-full max-w-4xl mx-auto px-4 sm:px-0">
			{/* Tab Headers */}
			<div className="w-full max-w-xs sm:max-w-sm border-t border-x rounded-t-sm flex items-center h-10 sm:h-12">
				<div
					className="flex flex-col items-center justify-between w-full font-semibold hover:cursor-pointer h-full"
					onClick={() => setListingType('Rent')}>
					<div className={cn('p-2 w-full text-center text-sm sm:text-base', listingType !== 'Rent' && 'text-muted-foreground')}>
						Rent
					</div>
					{listingType === 'Rent' && <div className="h-1 sm:h-1.5 mt-auto w-[98.5%] mx-auto bg-destructive/80" />}
				</div>
				<div
					className="flex flex-col items-center justify-between w-full font-semibold hover:cursor-pointer h-full"
					onClick={() => setListingType('Buy')}>
					<div className={cn('p-2 w-full text-center text-sm sm:text-base', listingType !== 'Buy' && 'text-muted-foreground')}>
						Buy
					</div>
					{listingType === 'Buy' && <div className="h-1 sm:h-1.5 mt-auto w-[98.5%] mx-auto bg-destructive/80" />}
				</div>
			</div>

			{/* Search Form */}
			<div className="border h-10 sm:h-12 flex flex-col sm:flex-row items-stretch rounded-sm overflow-hidden w-full max-w-4xl">
				{/* State Selector */}
				<Select>
					<SelectTrigger className="w-full sm:w-[150px] border-l-0 border-y-0 sm:border-b-0 border-b rounded-none focus-visible:border-none focus-visible:outline-0 focus-visible:ring-0 h-10 sm:h-full shadow-none text-sm">
						<SelectValue placeholder="Select State" />
					</SelectTrigger>
					<SelectContent className="rounded-none shadow-none">
						<SelectItem className="rounded-none" value="andhra-pradesh">
							Andhra Pradesh
						</SelectItem>
						<SelectItem className="rounded-none" value="arunachal-pradesh">
							Arunachal Pradesh
						</SelectItem>
						<SelectItem className="rounded-none" value="assam">
							Assam
						</SelectItem>
						<SelectItem className="rounded-none" value="bihar">
							Bihar
						</SelectItem>
						<SelectItem className="rounded-none" value="chhattisgarh">
							Chhattisgarh
						</SelectItem>
						<SelectItem className="rounded-none" value="goa">
							Goa
						</SelectItem>
						<SelectItem className="rounded-none" value="gujarat">
							Gujarat
						</SelectItem>
						<SelectItem className="rounded-none" value="haryana">
							Haryana
						</SelectItem>
						<SelectItem className="rounded-none" value="himachal-pradesh">
							Himachal Pradesh
						</SelectItem>
						<SelectItem className="rounded-none" value="jharkhand">
							Jharkhand
						</SelectItem>
						<SelectItem className="rounded-none" value="karnataka">
							Karnataka
						</SelectItem>
						<SelectItem className="rounded-none" value="kerala">
							Kerala
						</SelectItem>
						<SelectItem className="rounded-none" value="madhya-pradesh">
							Madhya Pradesh
						</SelectItem>
						<SelectItem className="rounded-none" value="maharashtra">
							Maharashtra
						</SelectItem>
						<SelectItem className="rounded-none" value="manipur">
							Manipur
						</SelectItem>
						<SelectItem className="rounded-none" value="meghalaya">
							Meghalaya
						</SelectItem>
						<SelectItem className="rounded-none" value="mizoram">
							Mizoram
						</SelectItem>
						<SelectItem className="rounded-none" value="nagaland">
							Nagaland
						</SelectItem>
						<SelectItem className="rounded-none" value="odisha">
							Odisha
						</SelectItem>
						<SelectItem className="rounded-none" value="punjab">
							Punjab
						</SelectItem>
						<SelectItem className="rounded-none" value="rajasthan">
							Rajasthan
						</SelectItem>
						<SelectItem className="rounded-none" value="sikkim">
							Sikkim
						</SelectItem>
						<SelectItem className="rounded-none" value="tamil-nadu">
							Tamil Nadu
						</SelectItem>
						<SelectItem className="rounded-none" value="telangana">
							Telangana
						</SelectItem>
						<SelectItem className="rounded-none" value="tripura">
							Tripura
						</SelectItem>
						<SelectItem className="rounded-none" value="uttar-pradesh">
							Uttar Pradesh
						</SelectItem>
						<SelectItem className="rounded-none" value="uttarakhand">
							Uttarakhand
						</SelectItem>
						<SelectItem className="rounded-none" value="west-bengal">
							West Bengal
						</SelectItem>
					</SelectContent>
				</Select>

				{/* Search Input */}
				<Input
					className="flex-1 min-w-0 h-10 sm:h-full rounded-none border-r-0 border-y-0 sm:border-b-0 border-b shadow-none text-sm"
					placeholder="Enter the place you want to search"
				/>

				{/* Search Button */}
				<Button
					variant={'destructive'}
					className="w-full sm:w-[120px] lg:w-[150px] h-10 sm:h-full rounded-none font-semibold text-sm sm:text-base lg:text-lg px-2 sm:px-4">
					<Image
						src="/assets/icons/search-icon.svg"
						width={20}
						height={20}
						alt="search"
						className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-1 sm:mr-2"
					/>
					Search
				</Button>
			</div>
		</div>
	)
}
