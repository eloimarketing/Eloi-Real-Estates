import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/navbar'
import { GoogleMapsProvider } from '@/components/GoogleMapsLoader'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Eloi Real Estate',
	description: 'A modern real estate platform for buying, selling, and renting properties in the UK.',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Navbar />
				<GoogleMapsProvider>{children}</GoogleMapsProvider>
				<Toaster />
			</body>
		</html>
	)
}
