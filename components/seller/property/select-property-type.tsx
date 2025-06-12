'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PropertyType } from '@/lib/enums'
import { SetStateAction } from 'react'

const FormSchema = z.object({
	propertyType: z.string({
		required_error: 'Please select an property to create.',
	}),
})

export default function SelectPropertyType({
	setPropertyType,
	propertyType,
}: {
	setPropertyType: React.Dispatch<SetStateAction<PropertyType | undefined>>
	propertyType: PropertyType | undefined
}) {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			propertyType: propertyType,
		},
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		setPropertyType(data.propertyType as PropertyType)
		toast('Propert type changed successfully')
	}

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Create new property Listing</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
							<FormField
								control={form.control}
								name="propertyType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Property Type *</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a property to create" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.keys(PropertyType).map(type => (
													<SelectItem key={type} value={type}>
														{type.replaceAll('_', ' ')}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">Create Property</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
