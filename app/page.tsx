import MaxWidthWrapper from '@/components/max-width-wrapper'
import PropertyCard from '@/components/property-card'
import { Badge } from '@/components/ui/badge'
import { Handshake } from 'lucide-react'
import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { PropertyType } from '@prisma/client'
import GoogleMapWithPins from '@/components/google-maps-with-pins'
import prisma from '@/lib/prisma/prisma'
import SearchBar from '@/components/homepage/search-bar'
import Link from 'next/link'

export default async function Home() {
	const allProperties = await prisma.property.findMany({ where: { isVerified: true }, include: { location: true } })
	const propertyList = allProperties.map(property => ({
		lat: property.googleMapLat!,
		lng: property.googleMapLng!,
		title: property.title!,
	}))

	const propertiesByCity = {}

	allProperties.forEach(property => {
		const city = property.location.city.trim().toLowerCase()
		if (!propertiesByCity[city]) propertiesByCity[city] = []
		propertiesByCity[city].push(property)
	})

	return (
		<div className="bg-secondary">
			<div className="min-h-[calc(100dvh-5rem)]">
				<MaxWidthWrapper className="py-4">
					<SearchBar />
				</MaxWidthWrapper>

				<MaxWidthWrapper className="px-4 sm:px-6 md:px-0 flex">
					{propertyList.length > 0 && <GoogleMapWithPins properties={propertyList} />}
				</MaxWidthWrapper>

				{/* CTA Banner */}
				<div className="text-white text-xs sm:text-sm text-center my-6 sm:my-10 bg-[#384d6c] w-full p-3 sm:p-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
					<div className="flex items-center gap-2">
						<Handshake width={20} height={20} className="flex-shrink-0" />
						<span className="text-center sm:text-left">
							Connecting property owners and buyers seamlessly — from listing to living.
						</span>
					</div>
					<Badge variant={'secondary'} className="text-xs rounded-sm py-1 mt-2 sm:mt-0">
						Find Property
					</Badge>
				</div>

				<MaxWidthWrapper className="flex flex-col">
					{Object.keys(propertiesByCity).map((city, index) => (
						<div className="my-6 sm:my-10" key={index}>
							<h1 className="text-xl sm:text-2xl font-bold mb-4">Properties in {city}</h1>
							<Carousel className="">
								<CarouselContent>
									{propertiesByCity[city].map((property, indx) => (
										<CarouselItem key={indx} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
											<PropertyCard key={indx} property={property} />
										</CarouselItem>
									))}
								</CarouselContent>
								<CarouselPrevious className="ml-14 sm:ml-2" />
								<CarouselNext className="mr-14 sm:mr-2" />
							</Carousel>
						</div>
					))}

					{/* Feature Icons */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full py-6 sm:py-10">
						{/* Avoid Brokers */}
						<div className="max-w-64 mx-auto text-[#464646] text-center flex flex-col justify-center items-center">
							<Image src={'/assets/icons/no-broker.png'} width={81} height={74} alt="hero" className="w-16 h-16 sm:w-20 sm:h-20" />
							<h3 className="text-base sm:text-lg font-medium mt-2">Avoid Brokers</h3>
							<p className="line-clamp-2 text-xs font-medium mt-1 px-2">
								We directly connect you to verified owners to save brokerage
							</p>
						</div>

						{/* Free Listing */}
						<div className="max-w-64 mx-auto text-[#464646] text-center flex flex-col justify-center items-center">
							<Image
								src={'/assets/icons/free-listing.png'}
								width={47}
								height={72}
								alt="hero"
								className="w-12 h-16 sm:w-14 sm:h-20"
							/>
							<h3 className="text-base sm:text-lg font-medium mt-2">Free Listing</h3>
							<p className="line-clamp-2 text-xs font-medium mt-1 px-2">Easy listing process. Also using WhatsApp</p>
						</div>

						{/* Shortlist Without Visit */}
						<div className="max-w-64 mx-auto text-[#464646] text-center flex flex-col justify-center items-center">
							<Image src={'/assets/icons/house.png'} width={47} height={72} alt="hero" className="w-16 h-16 sm:w-20 sm:h-20" />
							<h3 className="text-base sm:text-lg font-medium mt-2">Shortlist without Visit</h3>
							<p className="line-clamp-2 text-xs font-medium mt-1 px-2">Extensive Information makes it easy</p>
						</div>

						{/* Rental Agreement */}
						<div className="max-w-64 mx-auto text-[#464646] text-center flex flex-col justify-center items-center">
							<Image src={'/assets/icons/agreement.png'} width={47} height={72} alt="hero" className="w-12 h-16 sm:w-14 sm:h-20" />
							<h3 className="text-base sm:text-lg font-medium mt-2">Rental Agreement</h3>
							<p className="line-clamp-2 text-xs mt-1 font-medium px-2">Assistance in creating Rental agreement &amp; Paper work</p>
						</div>
					</div>
				</MaxWidthWrapper>

				{/* Property Types Navigation */}
				<div className="w-full bg-muted flex border-y gap-2 sm:gap-4 lg:gap-8 overflow-x-auto scrollbar-hide">
					{Object.keys(PropertyType).map((property, indx) => (
						<div
							key={indx}
							className="text-[#464646] hover:bg-secondary font-semibold px-3 sm:px-4 py-6 sm:py-8 hover:cursor-pointer whitespace-nowrap text-sm sm:text-base flex-shrink-0">
							{property}
						</div>
					))}
				</div>

				<div className="w-full text-center text-sm py-2 z-50">
					By using this site, you agree to our{' '}
					<Link href="/terms" className="underline text-blue-600">
						Terms and Conditions
					</Link>
				</div>
			</div>
		</div>
	)
}
