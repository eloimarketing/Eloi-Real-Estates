import Navbar from '@/components/navbar'
import SellerSidebar from '@/components/seller/sidebar'

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="h-[100dvh] flex pt-20">
			<div className="fixed top-0 left-0 w-full h-20 overflow-hidden z-50 bg-white">
				<Navbar />
			</div>
			<div className="min-w-64 w-[20%] h-full border-r p-4 bg-gray-200">
				<SellerSidebar />
			</div>
			<div className="overflow-y-scroll w-full">{children}</div>
		</div>
	)
}
