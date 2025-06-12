'use client'

import { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner' // Using sonner
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// Import your Zod schemas (adjust path if needed)
import {
	commonInfoSchema,
	apartmentFlatSchema,
	independentHouseVillaSchema,
	plotLandSchema,
	officeSpaceSchema,
	shopShowroomSchema,
	wareHouseGodownSchema,
	farmhouseAgriculturalLandSchema,
	coWorkingSpaceSchema,
	payingGuestHostelSchema,
} from '@/lib/schema/backend/property'

// Import Enums (adjust path if needed)
import {
	PropertyType,
	ListingType,
	FurnishingStatus,
	FacingDirection,
	LandUseType,
	OwnershipType,
	PlotAreaUnit,
	DeskType,
	RoomType,
} from '@/lib/enums'

const allPropertySchemas = {
	[PropertyType.Apartment_Flat]: apartmentFlatSchema,
	[PropertyType.Independent_House_Villa]: independentHouseVillaSchema,
	[PropertyType.Plot_Land]: plotLandSchema,
	[PropertyType.Office_Space]: officeSpaceSchema,
	[PropertyType.Shop_Showroom]: shopShowroomSchema,
	[PropertyType.Warehouse_Godown]: wareHouseGodownSchema,
	[PropertyType.Farmhouse_Agricultural_Land]: farmhouseAgriculturalLandSchema,
	[PropertyType.CoWorking_Space]: coWorkingSpaceSchema,
	[PropertyType.Paying_Guest_Hostel]: payingGuestHostelSchema,
}

const createCombinedSchema = (propertyType?: PropertyType) => {
	if (propertyType && allPropertySchemas[propertyType]) {
		return allPropertySchemas[propertyType].merge(commonInfoSchema)
	}
	return commonInfoSchema.extend({
		propertyType: z.nativeEnum(PropertyType, {
			required_error: 'Property type is required.',
		}),
	})
}

type FormDataUnion = z.infer<ReturnType<typeof createCombinedSchema>>

export default function CreatePropertyPage() {
	const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | undefined>()
	const [isLoading, setIsLoading] = useState(false)

	const currentSchema = createCombinedSchema(selectedPropertyType)

	const form = useForm<FormDataUnion>({
		resolver: zodResolver(currentSchema),
		defaultValues: {
			title: '',
			description: '',
			price: 0,
			images: [], // FIX: Default to empty array
			videos: [], // FIX: Default to empty array
			address: '',
			city: '',
			state: '',
			pincode: '',
			googleMapLat: 0,
			googleMapLng: 0,
			listingType: ListingType.FOR_SALE,
			vendorContactNumber: '',
			bhk: '',
			carpetArea: 0,
			balcony: false,
			parking: false,
			// Add other property-specific defaults here if needed, ensure they don't conflict
			// or rely on the dynamic schema to handle them.
		},
	})

	useEffect(() => {
		const commonValues = {
			title: form.getValues('title'),
			description: form.getValues('description'),
			price: form.getValues('price'),
			address: form.getValues('address'),
			city: form.getValues('city'),
			state: form.getValues('state'),
			pincode: form.getValues('pincode'),
			googleMapLat: form.getValues('googleMapLat'),
			googleMapLng: form.getValues('googleMapLng'),
			listingType: form.getValues('listingType'),
			vendorContactNumber: form.getValues('vendorContactNumber'),
			images: [], // FIX: Reset to empty array
			videos: [], // FIX: Reset to empty array
			propertyType: selectedPropertyType,
		}
		// Reset with specific defaults for the new type if necessary
		// For now, resetting to common values + empty type-specific fields
		form.reset(commonValues)
	}, [selectedPropertyType, form.reset, form]) // form.reset and form should be stable, but included form for completeness if its identity changes

	const onSubmit: SubmitHandler<FormDataUnion> = async data => {
		if (!selectedPropertyType) {
			toast.error('Please select a property type.') // FIX: Sonner toast
			return
		}
		setIsLoading(true)

		const formData = new FormData()

		formData.append('propertyType', selectedPropertyType)
		formData.append('title', data.title)
		formData.append('description', data.description)
		formData.append('price', String(data.price))
		formData.append('address', data.address)
		formData.append('city', data.city)
		formData.append('state', data.state)
		formData.append('pincode', data.pincode)
		formData.append('googleMapLat', String(data.googleMapLat))
		formData.append('googleMapLng', String(data.googleMapLng))
		formData.append('availabilityStatus', data.listingType)
		formData.append('vendorContactNumber', data.vendorContactNumber)

		if (data.images && data.images.length > 0) {
			// Check if array and has items
			for (let i = 0; i < data.images.length; i++) {
				formData.append('images', data.images[i])
			}
		}
		if (data.videos && data.videos.length > 0) {
			// Check if array and has items
			for (let i = 0; i < data.videos.length; i++) {
				formData.append('videos', data.videos[i])
			}
		}

		const specificData = data as any

		if (selectedPropertyType === PropertyType.Apartment_Flat) {
			formData.append('bhk', specificData.bhk)
			formData.append('carpetArea', String(specificData.carpetArea))
			formData.append('builtUpArea', String(specificData.builtUpArea))
			formData.append('floorNumber', String(specificData.floorNumber))
			formData.append('totalFloors', String(specificData.totalFloors))
			formData.append('bathrooms', String(specificData.bathrooms))
			formData.append('furnishingStatus', specificData.furnishingStatus)
			formData.append('balcony', String(specificData.balcony))
			formData.append('parking', String(specificData.parking))
			formData.append('ageOfProperty', String(specificData.ageOfProperty))
			formData.append('facingDirection', specificData.facingDirection)
			formData.append('hasLift', String(specificData.hasLift))
			formData.append('hasSecurity', String(specificData.hasSecurity))
			formData.append('hasGym', String(specificData.hasGym))
			formData.append('hasSwimmingPool', String(specificData.hasSwimmingPool))
			formData.append('hasPowerBackup', String(specificData.hasPowerBackup))
			formData.append('hasGarden', String(specificData.hasGarden))
			if (specificData.reraNumber) formData.append('reraNumber', specificData.reraNumber)
		} else if (selectedPropertyType === PropertyType.Independent_House_Villa) {
			formData.append('bedrooms', String(specificData.bedrooms))
			formData.append('plotArea', String(specificData.plotArea))
			formData.append('builtUpArea', String(specificData.builtUpArea))
			formData.append('floors', specificData.floors)
			formData.append('parking', String(specificData.parking))
			formData.append('ageOfConstruction', String(specificData.ageOfConstruction))
			formData.append('furnishingStatus', specificData.furnishingStatus)
			formData.append('facingDirection', specificData.facingDirection)
			formData.append('hasGardenLawn', String(specificData.hasGardenLawn))
			formData.append('hasWaterSource', String(specificData.hasWaterSource))
			formData.append('hasPowerBackup', String(specificData.hasPowerBackup))
			formData.append('hasSwimmingPool', String(specificData.hasSwimmingPool))
			formData.append('hasSecurity', String(specificData.hasSecurity))
		} else if (selectedPropertyType === PropertyType.Plot_Land) {
			formData.append('plotArea', String(specificData.plotArea))
			formData.append('plotAreaUnit', specificData.plotAreaUnit)
			formData.append('boundaryWall', String(specificData.boundaryWall))
			formData.append('roadWidth', String(specificData.roadWidth))
			formData.append('plotFacing', specificData.plotFacing)
			formData.append('landUseType', specificData.landUseType)
			formData.append('gatedSociety', String(specificData.gatedSociety))
			formData.append('ownershipType', specificData.ownershipType)
			if (specificData.nearbyLandmarks) formData.append('nearbyLandmarks', specificData.nearbyLandmarks)
		} else if (selectedPropertyType === PropertyType.Office_Space) {
			formData.append('carpetArea', String(specificData.carpetArea))
			formData.append('builtUpArea', String(specificData.builtUpArea))
			formData.append('furnishingType', specificData.furnishingType)
			formData.append('workstations', String(specificData.workstations))
			formData.append('cabins', String(specificData.cabins))
			formData.append('conferenceRoom', String(specificData.conferenceRoom))
			formData.append('pantry', String(specificData.pantry))
			formData.append('washrooms', String(specificData.washrooms))
			formData.append('floorNumber', String(specificData.floorNumber))
			formData.append('hasLift', String(specificData.hasLift))
			formData.append('hasPowerBackup', String(specificData.hasPowerBackup))
			formData.append('hasAirConditioning', String(specificData.hasAirConditioning))
			formData.append('parking', String(specificData.parking))
			if (specificData.occupancyStatus) formData.append('occupancyStatus', specificData.occupancyStatus)
		} else if (selectedPropertyType === PropertyType.Shop_Showroom) {
			formData.append('carpetArea', String(specificData.carpetArea))
			formData.append('frontageWidth', String(specificData.frontageWidth))
			formData.append('floorNumber', String(specificData.floorNumber))
			formData.append('hasWashroom', String(specificData.hasWashroom))
			formData.append('powerLoad', String(specificData.powerLoad))
			formData.append('parking', String(specificData.parking))
			if (specificData.suitableFor) formData.append('suitableFor', specificData.suitableFor)
		} else if (selectedPropertyType === PropertyType.Warehouse_Godown) {
			formData.append('builtUpArea', String(specificData.builtUpArea))
			formData.append('floorHeight', String(specificData.floorHeight))
			formData.append('entryRoadWidth', String(specificData.entryRoadWidth))
			formData.append('hasPowerSupply', String(specificData.hasPowerSupply))
			formData.append('hasWaterAvailability', String(specificData.hasWaterAvailability))
			formData.append('shutterHeight', String(specificData.shutterHeight))
			formData.append('hasLoadingUnloadingDock', String(specificData.hasLoadingUnloadingDock))
			formData.append('hasSecurity', String(specificData.hasSecurity))
		} else if (selectedPropertyType === PropertyType.Farmhouse_Agricultural_Land) {
			formData.append('landArea', String(specificData.landArea))
			formData.append('hasWaterSource', String(specificData.hasWaterSource))
			formData.append('hasElectricityConnection', String(specificData.hasElectricityConnection))
			formData.append('hasFencing', String(specificData.hasFencing))
			formData.append('hasRoadAccess', String(specificData.hasRoadAccess))
			if (specificData.soilType) formData.append('soilType', specificData.soilType)
			if (specificData.cropType) formData.append('cropType', specificData.cropType)
			formData.append('hasFarmhouse', String(specificData.hasFarmhouse))
			formData.append('distanceToMainRoad', String(specificData.distanceToMainRoad))
		} else if (selectedPropertyType === PropertyType.CoWorking_Space) {
			if (Array.isArray(specificData.deskTypes)) {
				specificData.deskTypes.forEach((dt: DeskType) => formData.append('deskTypes', dt))
			}
			formData.append('numberOfSeats', String(specificData.numberOfSeats))
			formData.append('hasInternetAvailability', String(specificData.hasInternetAvailability))
			formData.append('hasMeetingRoom', String(specificData.hasMeetingRoom))
			formData.append('hasPantry', String(specificData.hasPantry))
			formData.append('hasReception', String(specificData.hasReception))
			formData.append('hasCommonAreas', String(specificData.hasCommonAreas))
			formData.append('hasAirConditioning', String(specificData.hasAirConditioning))
			formData.append('hasPowerBackup', String(specificData.hasPowerBackup))
			formData.append('hasParking', String(specificData.hasParking))
		} else if (selectedPropertyType === PropertyType.Paying_Guest_Hostel) {
			formData.append('roomType', specificData.roomType)
			formData.append('furnished', String(specificData.furnished))
			formData.append('numberOfBeds', String(specificData.numberOfBeds))
			formData.append('hasAttachedWashroom', String(specificData.hasAttachedWashroom))
			formData.append('foodIncluded', String(specificData.foodIncluded))
			formData.append('hasAC', String(specificData.hasAC))
			formData.append('hasWifi', String(specificData.hasWifi))
			formData.append('hasHousekeeping', String(specificData.hasHousekeeping))
			formData.append('hasLaundry', String(specificData.hasLaundry))
			if (Array.isArray(specificData.guestRules)) {
				formData.append('guestRules', specificData.guestRules.join(','))
			} else if (specificData.guestRules) {
				formData.append('guestRules', specificData.guestRules)
			}
		}

		try {
			const response = await fetch('/api/seller/property/create', {
				// API Endpoint Updated
				method: 'POST',
				body: formData,
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.details || result.error || 'Failed to create property')
			}

			toast.success('Property created successfully.') // FIX: Sonner toast
			form.reset()
			setSelectedPropertyType(undefined)
		} catch (error: any) {
			console.error('Submission error:', error)
			toast.error(error.message || 'An unknown error occurred.') // FIX: Sonner toast
		} finally {
			setIsLoading(false)
		}
	}

	const renderInputField = (
		name: any,
		label: string,
		type: string = 'text',
		placeholder?: string,
		isNumber: boolean = false
	) => (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input
							type={type}
							placeholder={placeholder || `Enter ${label.toLowerCase()}`}
							{...field}
							value={field.value ?? (isNumber ? 0 : '')} // Use ?? for potentially undefined number/string values
							onChange={e => field.onChange(isNumber ? parseFloat(e.target.value) || 0 : e.target.value)}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)

	const renderCheckboxField = (
		name: any,
		label: string // FIX: Added 'any' type to name
	) => (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
					<FormControl>
						<Checkbox checked={field.value as boolean | undefined} onCheckedChange={field.onChange} />
					</FormControl>
					<div className="space-y-1 leading-none">
						<FormLabel>{label}</FormLabel>
					</div>
					<FormMessage />
				</FormItem>
			)}
		/>
	)

	const renderSelectField = (name: any, label: string, options: Record<string, string>) => (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<Select
						onValueChange={field.onChange}
						value={field.value as string | undefined}
						defaultValue={field.value as string | undefined}>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder={`Select ${label.toLowerCase()}`} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{Object.entries(options).map(([value, optionLabel]) => (
								<SelectItem key={value} value={value}>
									{optionLabel}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	)

	const renderPropertySpecificFields = () => {
		if (!selectedPropertyType) return null
		// ... (rest of the switch cases remain the same as your provided code)
		switch (selectedPropertyType) {
			case PropertyType.Apartment_Flat:
				return (
					<>
						{renderInputField('bhk', 'BHK (e.g., 2 BHK)')}
						{renderInputField('carpetArea', 'Carpet Area (sqft)', 'number', undefined, true)}
						{renderInputField('builtUpArea', 'Built-up Area (sqft)', 'number', undefined, true)}
						{renderInputField('floorNumber', 'Floor Number', 'number', undefined, true)}
						{renderInputField('totalFloors', 'Total Floors', 'number', undefined, true)}
						{renderInputField('bathrooms', 'Bathrooms', 'number', undefined, true)}
						{renderSelectField('furnishingStatus', 'Furnishing Status', FurnishingStatus)}
						{renderCheckboxField('balcony', 'Has Balcony?')}
						{renderCheckboxField('parking', 'Has Parking?')}
						{renderInputField('ageOfProperty', 'Age of Property (years)', 'number', undefined, true)}
						{renderSelectField('facingDirection', 'Facing Direction', FacingDirection)}
						{renderCheckboxField('hasLift', 'Has Lift?')}
						{renderCheckboxField('hasSecurity', 'Has Security?')}
						{renderCheckboxField('hasGym', 'Has Gym?')}
						{renderCheckboxField('hasSwimmingPool', 'Has Swimming Pool?')}
						{renderCheckboxField('hasPowerBackup', 'Has Power Backup?')}
						{renderCheckboxField('hasGarden', 'Has Garden?')}
						{renderInputField('reraNumber', 'RERA Number (Optional)')}
					</>
				)
			case PropertyType.Independent_House_Villa:
				return (
					<>
						{renderInputField('bedrooms', 'Bedrooms', 'number', undefined, true)}
						{renderInputField('plotArea', 'Plot Area (sqft)', 'number', undefined, true)}
						{renderInputField('builtUpArea', 'Built-up Area (sqft)', 'number', undefined, true)}
						{renderInputField('floors', 'Floors (e.g., Ground + 1)')}
						{renderCheckboxField('parking', 'Has Parking?')}
						{renderInputField('ageOfConstruction', 'Age of Construction (years)', 'number', undefined, true)}
						{renderSelectField('furnishingStatus', 'Furnishing Status', FurnishingStatus)}
						{renderSelectField('facingDirection', 'Facing Direction', FacingDirection)}
						{renderCheckboxField('hasGardenLawn', 'Has Garden/Lawn?')}
						{renderCheckboxField('hasWaterSource', 'Has Water Source?')}
						{renderCheckboxField('hasPowerBackup', 'Has Power Backup?')}
						{renderCheckboxField('hasSwimmingPool', 'Has Swimming Pool?')}
						{renderCheckboxField('hasSecurity', 'Has Security?')}
					</>
				)
			case PropertyType.Plot_Land:
				return (
					<>
						{renderInputField('plotArea', 'Plot Area', 'number', undefined, true)}
						{renderSelectField('plotAreaUnit', 'Plot Area Unit', PlotAreaUnit)}
						{renderCheckboxField('boundaryWall', 'Has Boundary Wall?')}
						{renderInputField('roadWidth', 'Road Width (ft)', 'number', undefined, true)}
						{renderSelectField('plotFacing', 'Plot Facing Direction', FacingDirection)}
						{renderSelectField('landUseType', 'Land Use Type', LandUseType)}
						{renderCheckboxField('gatedSociety', 'Is Gated Society?')}
						{renderSelectField('ownershipType', 'Ownership Type', OwnershipType)}
						{renderInputField('nearbyLandmarks', 'Nearby Landmarks (Optional)')}
					</>
				)
			case PropertyType.Office_Space:
				return (
					<>
						{renderInputField('carpetArea', 'Carpet Area (sqft)', 'number', undefined, true)}
						{renderInputField('builtUpArea', 'Built-up Area (sqft)', 'number', undefined, true)}
						{renderSelectField('furnishingType', 'Furnishing Type', FurnishingStatus)}
						{renderInputField('workstations', 'Number of Workstations', 'number', undefined, true)}
						{renderInputField('cabins', 'Number of Cabins', 'number', undefined, true)}
						{renderInputField('conferenceRoom', 'Number of Conference Rooms', 'number', undefined, true)}
						{renderCheckboxField('pantry', 'Has Pantry?')}
						{renderInputField('washrooms', 'Number of Washrooms', 'number', undefined, true)}
						{renderInputField('floorNumber', 'Floor Number', 'number', undefined, true)}
						{renderCheckboxField('hasLift', 'Has Lift?')}
						{renderCheckboxField('hasPowerBackup', 'Has Power Backup?')}
						{renderCheckboxField('hasAirConditioning', 'Has Air Conditioning?')}
						{renderCheckboxField('parking', 'Has Parking?')}
						{renderInputField('occupancyStatus', 'Occupancy Status (e.g., Vacant, Occupied)')}
					</>
				)
			case PropertyType.Shop_Showroom:
				return (
					<>
						{renderInputField('carpetArea', 'Carpet Area (sqft)', 'number', undefined, true)}
						{renderInputField('frontageWidth', 'Frontage Width (ft)', 'number', undefined, true)}
						{renderInputField('floorNumber', 'Floor Number', 'number', undefined, true)}
						{renderCheckboxField('hasWashroom', 'Has Washroom?')}
						{renderInputField('powerLoad', 'Power Load (KW)', 'number', undefined, true)}
						{renderCheckboxField('parking', 'Has Parking?')}
						{renderInputField('suitableFor', 'Suitable For (e.g., Retail, Boutique)')}
					</>
				)
			case PropertyType.Warehouse_Godown:
				return (
					<>
						{renderInputField('builtUpArea', 'Built-up Area (sqft)', 'number', undefined, true)}
						{renderInputField('floorHeight', 'Floor Height (ft) - Ceiling', 'number', undefined, true)}
						{renderInputField('entryRoadWidth', 'Entry Road Width (ft)', 'number', undefined, true)}
						{renderCheckboxField('hasPowerSupply', 'Has Power Supply?')}
						{renderCheckboxField('hasWaterAvailability', 'Has Water Availability?')}
						{renderInputField('shutterHeight', 'Shutter Height (ft)', 'number', undefined, true)}
						{renderCheckboxField('hasLoadingUnloadingDock', 'Has Loading/Unloading Dock?')}
						{renderCheckboxField('hasSecurity', 'Has Security?')}
					</>
				)
			case PropertyType.Farmhouse_Agricultural_Land:
				return (
					<>
						{renderInputField('landArea', 'Land Area (e.g., acres or sqft)', 'number', undefined, true)}
						{renderCheckboxField('hasWaterSource', 'Has Water Source?')}
						{renderCheckboxField('hasElectricityConnection', 'Has Electricity Connection?')}
						{renderCheckboxField('hasFencing', 'Has Fencing?')}
						{renderCheckboxField('hasRoadAccess', 'Has Road Access?')}
						{renderInputField('soilType', 'Soil Type (Optional)')}
						{renderInputField('cropType', 'Crop Type (if any, Optional)')}
						{renderCheckboxField('hasFarmhouse', 'Has Farmhouse?')}
						{renderInputField('distanceToMainRoad', 'Distance to Main Road (km)', 'number', undefined, true)}
					</>
				)
			case PropertyType.CoWorking_Space:
				return (
					<>
						<FormItem>
							<FormLabel>Desk Types</FormLabel>
							<FormDescription>Select all available desk types.</FormDescription>
							{Object.values(DeskType).map(desk => (
								<FormField
									key={desk}
									control={form.control}
									name="deskTypes"
									render={({ field }) => {
										const currentValues = (Array.isArray(field.value) ? field.value : []) as DeskType[]
										return (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0">
												<FormControl>
													<Checkbox
														checked={currentValues.includes(desk)}
														onCheckedChange={checked => {
															return checked
																? field.onChange([...currentValues, desk])
																: field.onChange(currentValues.filter(value => value !== desk))
														}}
													/>
												</FormControl>
												<FormLabel className="font-normal">{desk.replace('_', ' ')}</FormLabel>
											</FormItem>
										)
									}}
								/>
							))}
							<FormMessage />
						</FormItem>
						{renderInputField('numberOfSeats', 'Number of Seats', 'number', undefined, true)}
						{renderCheckboxField('hasInternetAvailability', 'Has Internet?')}
						{renderCheckboxField('hasMeetingRoom', 'Has Meeting Room?')}
						{renderCheckboxField('hasPantry', 'Has Pantry?')}
						{renderCheckboxField('hasReception', 'Has Reception?')}
						{renderCheckboxField('hasCommonAreas', 'Has Common Areas?')}
						{renderCheckboxField('hasAirConditioning', 'Has Air Conditioning?')}
						{renderCheckboxField('hasPowerBackup', 'Has Power Backup?')}
						{renderCheckboxField('hasParking', 'Has Parking?')}
					</>
				)
			case PropertyType.Paying_Guest_Hostel:
				return (
					<>
						{renderSelectField('roomType', 'Room Type', RoomType)}
						{renderCheckboxField('furnished', 'Is Furnished?')}
						{renderInputField('numberOfBeds', 'Number of Beds', 'number', undefined, true)}
						{renderCheckboxField('hasAttachedWashroom', 'Has Attached Washroom?')}
						{renderCheckboxField('foodIncluded', 'Food Included?')}
						{renderCheckboxField('hasAC', 'Has AC?')}
						{renderCheckboxField('hasWifi', 'Has WiFi?')}
						{renderCheckboxField('hasHousekeeping', 'Has Housekeeping?')}
						{renderCheckboxField('hasLaundry', 'Has Laundry Service?')}
						<FormField
							control={form.control}
							name="guestRules"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Guest Rules</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter guest rules, one per line (or comma-separated)"
											{...field}
											value={Array.isArray(field.value) ? (field.value as string[]).join('\n') : field.value || ''}
											onChange={e => field.onChange(e.target.value)}
										/>
									</FormControl>
									<FormDescription>
										Backend expects this as a single string if using formData.get(). Adjust if backend can handle array or needs
										specific format.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</>
				)
			default:
				return null
		}
	}

	return (
		<div className="container mx-auto py-4 max-w-3xl">
			<Card>
				<CardHeader>
					<CardTitle>Create New Property Listing</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="propertyType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Property Type *</FormLabel>
										<Select
											onValueChange={(value: PropertyType) => {
												setSelectedPropertyType(value)
												field.onChange(value)
											}}
											value={selectedPropertyType} // Ensure this is bound correctly
											defaultValue={field.value as PropertyType | undefined}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select property type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(PropertyType).map(type => (
													<SelectItem key={type} value={type}>
														{type.replace(/_/g, ' ')}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{selectedPropertyType && (
								<>
									<h2 className="text-xl font-semibold pt-4 border-t mt-6">Common Information</h2>
									{renderInputField('title', 'Title *')}
									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description *</FormLabel>
												<FormControl>
													<Textarea placeholder="Detailed description of the property" {...field} value={field.value || ''} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									{renderInputField('price', 'Price *', 'number', undefined, true)}
									{renderSelectField('listingType', 'Listing Type *', ListingType)}
									{renderInputField('vendorContactNumber', 'Vendor Contact Number *')}

									<h3 className="text-lg font-medium pt-2">Location</h3>
									{renderInputField('address', 'Address *')}
									{renderInputField('city', 'City *')}
									{renderInputField('state', 'State *')}
									{renderInputField('pincode', 'Pincode *')}
									{renderInputField('googleMapLat', 'Google Maps Latitude *', 'number', undefined, true)}
									{renderInputField('googleMapLng', 'Google Maps Longitude *', 'number', undefined, true)}

									<h3 className="text-lg font-medium pt-2">Media</h3>
									<FormField
										control={form.control}
										name="images"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Images (select multiple)</FormLabel>
												<FormControl>
													<Input
														type="file"
														multiple
														accept="image/*"
														// field.onChange will receive FileList, Zod expects Array<File>
														onChange={e => field.onChange(e.target.files ? Array.from(e.target.files) : [])} // FIX
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="videos"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Videos (select multiple, optional)</FormLabel>
												<FormControl>
													<Input
														type="file"
														multiple
														accept="video/*"
														onChange={e => field.onChange(e.target.files ? Array.from(e.target.files) : [])} // FIX
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}

							{selectedPropertyType && (
								<>
									<h2 className="text-xl font-semibold pt-4 border-t mt-6">
										{selectedPropertyType.replace(/_/g, ' ')} Specific Details
									</h2>
									{renderPropertySpecificFields()}
								</>
							)}

							<Button type="submit" disabled={isLoading || !selectedPropertyType}>
								{isLoading ? 'Submitting...' : 'Create Property'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
