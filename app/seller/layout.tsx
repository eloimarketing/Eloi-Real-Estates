import SubLayout from './sub-layout'

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="h-[100dvh] flex pt-20 absolute top-0">
			<SubLayout />
			<div className="overflow-y-scroll w-full">{children}</div>
		</div>
	)
}
