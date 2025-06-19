'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { useState } from 'react'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ApprovePropertyBtn({ propertyId }: { propertyId: string }) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	async function approveProperty() {
		setLoading(true)
		try {
			const res = await axios.post('/api/admin/property/approve', { propertyId })
			// const data = res.data

			if (res.status === 200) {
				toast.success('Property approved successfully!')
				router.refresh()
			} else {
				toast.error('Failed to approve property')
			}
		} catch (error) {
			console.log(error)
			toast.error('Failed to approve property')
		}
		setLoading(false)
	}
	return (
		<Button className="mt-10 w-full" onClick={approveProperty} disabled={loading}>
			Approve Property {loading && <Loader className="animate-spin ml-1" />}
		</Button>
	)
}
