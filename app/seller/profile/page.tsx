import { auth } from '@/auth'
import { ProfileEditForm } from '@/components/auth/profile-edit-form'
import prisma from '@/lib/prisma/prisma'

export default async function ProfilePage() {
	const sesssion = await auth()
	const user = sesssion?.user

	const userDetails = await prisma.user.findUnique({ where: { id: user?.id } })

	return (
		<div className="p-4">
			<h1 className="text-3xl font-semibold text-center">Profile Page</h1>
			<div>
				<ProfileEditForm user={userDetails!} />
			</div>
		</div>
	)
}
