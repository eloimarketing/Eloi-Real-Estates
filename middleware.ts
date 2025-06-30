import NextAuth from 'next-auth'
import authConfig from './auth.config'

import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(request) {
	const authRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password']

	const allowedPaths = [
		'/',
		'/api/razorpay/webhook',
		'/forgot-password',
		'/about-us',
		'/contact',
		'/toc',
		'/privacy-policy',
		'/refund-policy',
		'/api/cities',
		'/user/property/all',
		'/terms-and-conditions',
		'/business-policy',
		...authRoutes,
	]

	// Check if the request path is in the allowed list
	if (allowedPaths.includes(request.nextUrl.pathname)) {
		return NextResponse.next()
	}

	// Redirect to login if not authenticated and not on the login page
	if (!request.auth) {
		const requestedUrl = request.nextUrl.pathname
		const urls = requestedUrl.split('/')
		if (urls[1] === 'seller') {
			const newUrl = new URL('/auth/login', request.nextUrl.origin)
			// return Response.redirect(newUrl, { headers })
			return NextResponse.redirect(newUrl)
		}

		const newUrl = new URL('/api', request.nextUrl.origin)
		// return Response.redirect(newUrl)
		return NextResponse.redirect(newUrl)
	}

	return NextResponse.next()
})

export const config = {
	matcher: [
		'/((?!api/auth|auth|assets|_next/static|user/property/*|_next/image|favicon.ico|api/cloudinary/image-upload|^/$).+)',
	],
}
