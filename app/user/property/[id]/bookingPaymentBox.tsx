'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

const formSchema = z
	.object({
		selectedServices: z.array(z.string()).min(1, 'Please select at least one service'),
		visitDate: z.date().optional(),
	})
	.refine(
		data => {
			const hasBooking = data.selectedServices.includes('Book Site Visit (Free)')
			if (hasBooking && !data.visitDate) {
				return false
			}
			return true
		},
		{
			message: 'Please select a visit date when booking a site visit',
			path: ['visitDate'],
		}
	)

type FormData = z.infer<typeof formSchema>

export default function BookingPaymentForm({ propertyId }: { propertyId: string }) {
	const [selectedServices, setSelectedServices] = useState<string[]>([])
	const [cartLoading, setCartLoading] = useState(false)

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			selectedServices: [],
			visitDate: undefined,
		},
	})

	const serviceOptions = [
		{ id: 'agreement-fee', label: 'Agreement Fee', value: 'Agreement Fee' },
		{ id: 'pay-rent', label: 'Pay Rent', value: 'Pay Rent' },
		{ id: 'pay-deposit', label: 'Pay Deposite', value: 'Pay Deposite' },
		{ id: 'legal-advice', label: 'Legal Advice', value: 'Legal Advice' },
		{ id: 'pay-advance', label: 'Pay Advance', value: 'Pay Advance' },
		{ id: 'book-visit', label: 'Book Site Visit (Free)', value: 'Book Site Visit (Free)' },
	]

	const handleServiceChange = (serviceValue: string, checked: boolean) => {
		const currentServices = form.getValues('selectedServices') || []
		let newServices: string[]

		if (checked) {
			newServices = [...currentServices, serviceValue]
		} else {
			newServices = currentServices.filter(service => service !== serviceValue)
		}

		setSelectedServices(newServices)
		form.setValue('selectedServices', newServices)
		form.trigger('selectedServices')
	}

	const getButtonText = () => {
		const services = form.getValues('selectedServices') || []
		const paymentItems = services.filter(item => item !== 'Book Site Visit (Free)')
		const hasPayment = paymentItems.length > 0
		const hasBooking = services.includes('Book Site Visit (Free)')

		if (hasPayment && hasBooking) {
			return 'Pay and Book'
		} else if (hasBooking) {
			return 'Book'
		} else if (hasPayment) {
			return 'Pay'
		} else {
			return 'Select Option'
		}
	}

	const onSubmit = (data: FormData) => {
		const paymentItems = data.selectedServices.filter(item => item !== 'Book Site Visit (Free)')
		const hasBooking = data.selectedServices.includes('Book Site Visit (Free)')

		let message = ''
		if (paymentItems.length > 0) {
			message += `Processing payment for: ${paymentItems.join(', ')}`
		}
		if (hasBooking) {
			message += `${message ? '\n' : ''}Booking site visit${data.visitDate ? ` for ${format(data.visitDate, 'PPP')}` : ''}`
		}

		alert(message)
	}

	const isBookingSelected = selectedServices.includes('Book Site Visit (Free)')

	async function addToCart() {
		try {
			setCartLoading(true)
			const response = await fetch('/api/user/cart/add', {
				method: 'POST',
				body: JSON.stringify(propertyId),
			})
			if (response.ok) {
				toast.success('Property added to cart successfully')
			}
			console.log(response)
		} catch (error) {
			console.log(error)
		} finally {
			setCartLoading(false)
		}
	}

	return (
		<Card className="max-w-md mx-auto rounded-3xl p-8 font-sans">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="selectedServices"
						render={() => (
							<FormItem>
								<div className="grid grid-cols-2 gap-4">
									{serviceOptions.map(option => (
										<FormField
											key={option.id}
											control={form.control}
											name="selectedServices"
											render={({}) => {
												return (
													<FormItem key={option.id} className="flex flex-row items-center space-x-3 space-y-0">
														<FormControl>
															<div
																className="flex items-center gap-3 cursor-pointer"
																onClick={() => {
																	const isChecked = selectedServices.includes(option.value)
																	handleServiceChange(option.value, !isChecked)
																}}>
																<div
																	className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center ${
																		selectedServices.includes(option.value) ? 'bg-blue-500' : 'bg-white'
																	}`}>
																	{selectedServices.includes(option.value) && <div className="w-3 h-3 bg-white rounded-full"></div>}
																</div>
																<FormLabel className="text-lg font-medium text-black cursor-pointer">{option.label}</FormLabel>
															</div>
														</FormControl>
													</FormItem>
												)
											}}
										/>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					{isBookingSelected && (
						<FormField
							control={form.control}
							name="visitDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="text-sm font-medium text-gray-700">Select Visit Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className={`w-full pl-3 text-left font-normal border-2 border-gray-300 rounded-lg ${
														!field.value && 'text-muted-foreground'
													}`}>
													{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={date => date < new Date() || date < new Date('1900-01-01')}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					<div className="flex flex-col gap-2 justify-center">
						<Button type="submit">{getButtonText()}</Button>
						<Button type="submit" onClick={addToCart} disabled={cartLoading}>
							{cartLoading ? 'Adding to cart...' : 'Add to cart'}
						</Button>
					</div>

					{selectedServices.length > 0 && (
						<div className="mt-6 p-4 bg-gray-100 rounded-lg">
							<h3 className="font-semibold text-gray-800 mb-2">Selected Options:</h3>
							<ul className="text-sm text-gray-600">
								{selectedServices.map(item => (
									<li key={item}>• {item}</li>
								))}
							</ul>
						</div>
					)}
				</form>
			</Form>
		</Card>
	)
}
