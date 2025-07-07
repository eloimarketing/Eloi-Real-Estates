'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function ApprovePropertyBtn({ propertyId, className = '' }: { propertyId: string; className?: string }) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [alreadyApproved, setAlreadyApproved] = useState(false)

	useEffect(() => {
		if (!propertyId) {
			toast.error('Property ID is required')
		}
		// Check if the property is already approved
		axios.get(`/api/admin/property/approve/${propertyId}`).then(res => {
			if (res.status === 200) {
				setAlreadyApproved(true)
			} else {
				setAlreadyApproved(false)
			}
		})
	}, [propertyId])

	async function approveProperty() {
		setLoading(true)
		try {
			const res = await axios.post('/api/admin/property/approve', { propertyId })

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
		<Button className={cn(className)} onClick={approveProperty} disabled={alreadyApproved || loading}>
			{alreadyApproved ? 'Property Already Approved' : loading ? <Loader className="animate-spin" /> : 'Approve Property'}
		</Button>
	)
}
