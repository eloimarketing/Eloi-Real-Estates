import Navbar from '@/components/navbar'
import SellerSidebar from '@/components/seller/sidebar'

export default function SubLayout() {
	return (
		<div>
			<div className="fixed top-0 left-0 w-full h-20 overflow-hidden z-50 bg-white">
				<Navbar />
			</div>
			<div className="hidden sm:block min-w-64 w-[20%] h-full border-r p-4 bg-gray-200">
				<SellerSidebar />
			</div>
		</div>
	)
}
