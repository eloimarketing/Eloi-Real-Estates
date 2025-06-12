'use client'

import MaxWidthWrapper from '@/components/max-width-wrapper'
import { useState } from 'react'

import SelectPropertyType from './select-property-type'
import { PropertyType } from '@/lib/enums'
import ApartmentFlatForm from '../forms/apartment-flat'
import IndependentHouseVillaForm from '../forms/independent-house-villa'

export default function CreateProperty() {
	const [propertyType, setPropertyType] = useState<PropertyType>()

	return (
		<MaxWidthWrapper className="my-6 px-0">
			<h1 className="text-2xl ms:text-4xl font-semibold text-center">Create Property</h1>

			<div className="my-6">
				<SelectPropertyType setPropertyType={setPropertyType} propertyType={propertyType} />
			</div>

			<div className="my-6">
				{propertyType === 'Apartment_Flat' && <ApartmentFlatForm />}
				{propertyType === 'Independent_House_Villa' && <IndependentHouseVillaForm />}
			</div>
		</MaxWidthWrapper>
	)
}
