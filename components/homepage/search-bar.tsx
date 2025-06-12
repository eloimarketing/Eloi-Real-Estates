'use client'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { IndianStates, getCitiesByState } from '@/utils/constant/data'
interface PriceRange {
	min: string
	max: string
}

export default function SearchBar() {
	const [listingType, setListingType] = useState<'Rent' | 'Buy'>('Rent')
	const [selectedState, setSelectedState] = useState<string>('')
	const [selectedCity, setSelectedCity] = useState<string>('')
	const [cities, setCities] = useState<{ id: number; name: string; latitude: string; longitude: string }[]>([])
	const [priceRange, setPriceRange] = useState<PriceRange>({ min: '', max: '' })
	const [searchQuery, setSearchQuery] = useState('')
	const router = useRouter()

	useEffect(() => {
		if (selectedState) {
			const allCities = getCitiesByState({ stateName: selectedState })
			if (!allCities) return
			setCities(allCities)
		} else {
			setCities([])
		}
	}, [selectedState])

	const handleSearch = () => {
		const searchData = {
			listingType,
			state: selectedState,
			city: selectedCity,
			query: searchQuery,
			priceRange: {
				min: priceRange.min ? parseInt(priceRange.min) : null,
				max: priceRange.max ? parseInt(priceRange.max) : null,
			},
		}

		router.push(`/user/properties?data=${encodeURIComponent(JSON.stringify(searchData))}`)

		console.log('Search data:', searchData)
	}

	return (
		<div className="flex justify-center items-center flex-col w-full max-w-6xl mx-auto">
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
			<div className="border rounded-sm overflow-hidden w-full max-w-6xl">
				{/* First Row - Location and Search */}
				<div className="flex flex-col lg:flex-row items-stretch min-h-[40px] sm:min-h-[48px]">
					{/* State Selector */}
					<div className="lg:w-[180px] border-b lg:border-b-0 lg:border-r">
						<Select value={selectedState} onValueChange={value => setSelectedState(value)}>
							<SelectTrigger className="w-full h-10 sm:h-12 border-0 rounded-none focus-visible:ring-0 shadow-none text-sm">
								<SelectValue placeholder="Select State" />
							</SelectTrigger>
							<SelectContent className="rounded-none shadow-lg max-h-[300px]">
								{IndianStates.map(state => (
									<SelectItem key={state.id} value={state.name} className="rounded-none">
										{state.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* City Selector */}
					<div className="lg:w-[180px] border-b lg:border-b-0 lg:border-r">
						<Select value={selectedCity} onValueChange={value => setSelectedCity(value)} disabled={!selectedState}>
							<SelectTrigger className="w-full h-10 sm:h-12 border-0 rounded-none focus-visible:ring-0 shadow-none text-sm">
								<SelectValue placeholder={!selectedState ? 'Select State First' : 'Select City'} />
							</SelectTrigger>
							<SelectContent className="rounded-none shadow-lg max-h-[300px]">
								{cities.map(city => (
									<SelectItem key={city.id} value={city.name} className="rounded-none">
										{city.name}
									</SelectItem>
								))}
								{cities.length === 0 && selectedState && (
									<SelectItem value="no-cities" disabled className="rounded-none text-muted-foreground">
										No cities found
									</SelectItem>
								)}
							</SelectContent>
						</Select>
					</div>

					{/* Search Input */}
					<div className="flex-1 border-b lg:border-b-0 lg:border-r">
						<Input
							className="w-full h-10 sm:h-12 rounded-none border-0 shadow-none text-sm"
							placeholder="Enter area, locality, or property name"
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
					</div>

					{/* Search Button */}
					<div className="lg:w-[120px] xl:w-[150px]">
						<Button
							variant={'destructive'}
							className="w-full h-10 sm:h-12 rounded-none font-semibold text-sm sm:text-base px-2 sm:px-4"
							onClick={handleSearch}>
							<Image
								src="/assets/icons/search-icon.svg"
								width={20}
								height={20}
								alt="search"
								className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
							/>
							Search
						</Button>
					</div>
				</div>

				{/* Second Row - Price Range */}
				<div className="border-t bg-gray-50/50 p-3 sm:p-4">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
						<Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
							Price Range ({listingType === 'Rent' ? 'Monthly' : 'Total'}):
						</Label>
						<div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-600">₹</span>
								<Input
									type="number"
									placeholder="Min"
									className="w-20 sm:w-24 h-8 text-sm border-gray-300 rounded-sm"
									value={priceRange.min}
									onChange={e => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
								/>
							</div>
							<span className="text-gray-400">-</span>
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-600">₹</span>
								<Input
									type="number"
									placeholder="Max"
									className="w-20 sm:w-24 h-8 text-sm border-gray-300 rounded-sm"
									value={priceRange.max}
									onChange={e => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
								/>
							</div>
							<div className="text-xs text-gray-500 ml-2">{listingType === 'Rent' ? 'per month' : 'total price'}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
