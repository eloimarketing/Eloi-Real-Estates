import { redirect } from 'next/navigation'
import SubLayout from './sub-layout'
import { auth } from '@/auth'

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await auth()
	const user = session?.user

	if (!user || user.role !== 'ADMIN') {
		redirect('/')
	}

	return (
		<div className="h-[100dvh] flex pt-20 absolute top-0 w-full">
			<SubLayout />
			<div className="overflow-y-scroll w-full">{children}</div>
		</div>
	)
}
