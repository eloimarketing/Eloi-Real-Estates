'use client'

import { Button } from '@/components/ui/button'
import { useCallback } from 'react'

declare global {
	interface Window {
		Razorpay: unknown
	}
}

export default function CartBuyNow({ propertyIds }: { propertyIds: string[] }) {
	const loadRazorpayScript = useCallback(() => {
		return new Promise(resolve => {
			const script = document.createElement('script')
			script.src = 'https://checkout.razorpay.com/v1/checkout.js'
			script.onload = () => resolve(true)
			script.onerror = () => resolve(false)
			document.body.appendChild(script)
		})
	}, [])

	const buyAll = useCallback(async () => {
		const razorpayLoaded = await loadRazorpayScript()
		if (!razorpayLoaded) {
			alert('Failed to load Razorpay SDK')
			return
		}

		try {
			// 👇 Call your backend API to get Razorpay Order
			const response = await fetch('/api/user/cart/buy', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(propertyIds), // Make sure backend expects an object here
			})
			const data = await response.json()

			if (!data.id) {
				alert('Failed to create Razorpay order')
				console.log(data)
				return
			}

			const options = {
				key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // Exposed public key in frontend
				amount: data.amount, // in paisa
				currency: data.currency,
				name: 'Your Company Name',
				description: 'Property Purchase',
				order_id: data.id,
				handler: async function (response) {
					// OPTIONAL: Call backend to verify payment
					alert('Payment Successful! Payment ID: ' + response.razorpay_payment_id)
				},
				prefill: {
					name: 'Nikhil Sharma',
					email: 'nikhil@example.com',
					contact: '9000000000',
				},
				theme: { color: '#0f172a' },
			}

			// @ts-expect-error // Razorpay global variable
			const rzp = new window.Razorpay(options)
			rzp.open()
		} catch (error) {
			console.error(error)
			alert('Something went wrong!')
		}
	}, [propertyIds, loadRazorpayScript])

	return (
		<Button className="w-96 mx-auto left-1/2 -translate-x-1/2 fixed bottom-8" onClick={buyAll}>
			Buy Now
		</Button>
	)
}
