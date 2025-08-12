import { NextResponse } from 'next/server'
// import { PrismaClient } from '@prisma/client'
// import fs from 'fs'
// import path from 'path'
// import csv from 'csv-parser'

// const prisma = new PrismaClient()

// // Your dummy property template
// const dummyTemplate = {
// 	title: 'Commercial Property',
// 	description: 'This is a commercial property listing.',
// 	price: 499998,
// 	images: [
// 		'https://res.cloudinary.com/niikkhilsharma/image/upload/v1753722499/yohxmt2vnc0ayonveyj8.jpg',
// 		'https://res.cloudinary.com/niikkhilsharma/image/upload/v1753722497/jyln24smdllqthd9oa2o.jpg',
// 	],
// 	videos: ['https://res.cloudinary.com/niikkhilsharma/video/upload/v1753722502/vvs8bttmluuyzvkats1e.mp4'],
// 	propertyType: 'Apartment_Flat', // Updated to match schema
// 	listingType: 'FOR_SALE',
// 	status: 'ACTIVE',
// 	propertyRent: 10000,
// 	securityDeposit: 10000,
// 	advanceBookingAmount: 10000,
// 	isAvailable: true,
// 	isVerified: false,
// 	ownerId: 'cmdnczd110001zv0wj2s5zz89', // Use your existing seller ID
// }

// // Helper function to extract city from address
// function extractLocationData(address) {
// 	let city = 'Chennai'
// 	let state = 'Tamil Nadu'
// 	let pincode = '600001'

// 	const addressLower = address.toLowerCase()

// 	if (addressLower.includes('coimbatore')) {
// 		city = 'Coimbatore'
// 		pincode = '641001'
// 	} else if (addressLower.includes('bangalore') || addressLower.includes('bengaluru')) {
// 		city = 'Bangalore'
// 		state = 'Karnataka'
// 		pincode = '560001'
// 	} else if (addressLower.includes('hyderabad')) {
// 		city = 'Hyderabad'
// 		state = 'Telangana'
// 		pincode = '500001'
// 	} else if (addressLower.includes('mumbai')) {
// 		city = 'Mumbai'
// 		state = 'Maharashtra'
// 		pincode = '400001'
// 	} else if (addressLower.includes('delhi')) {
// 		city = 'New Delhi'
// 		state = 'Delhi'
// 		pincode = '110001'
// 	} else if (addressLower.includes('pune')) {
// 		city = 'Pune'
// 		state = 'Maharashtra'
// 		pincode = '411001'
// 	} else if (addressLower.includes('jaipur')) {
// 		city = 'Jaipur'
// 		state = 'Rajasthan'
// 		pincode = '302001'
// 	} else if (addressLower.includes('chandigarh')) {
// 		city = 'Chandigarh'
// 		state = 'Punjab'
// 		pincode = '160001'
// 	} else if (addressLower.includes('trivandrum') || addressLower.includes('thiruvananthapuram')) {
// 		city = 'Trivandrum'
// 		state = 'Kerala'
// 		pincode = '695001'
// 	} else if (addressLower.includes('tirunelveli')) {
// 		city = 'Tirunelveli'
// 		state = 'Tamil Nadu'
// 		pincode = '627001'
// 	} else if (addressLower.includes('vellore')) {
// 		city = 'Vellore'
// 		state = 'Tamil Nadu'
// 		pincode = '632001'
// 	}

// 	return { city, state, pincode }
// }

// // Helper function to get property type specific data
// function getPropertyTypeData(propertyType) {
// 	switch (propertyType) {
// 		case 'APARTMENT_FLAT':
// 			return {
// 				apartmentFlat: {
// 					create: {
// 						bhk: Math.floor(Math.random() * 4) + 1, // 1-4 BHK
// 						carpetArea: 150 + Math.floor(Math.random() * 150), // 150-300 sq ft
// 						builtUpArea: 200 + Math.floor(Math.random() * 200), // 200-400 sq ft
// 						floorNumber: Math.floor(Math.random() * 20) + 1,
// 						totalFloors: Math.floor(Math.random() * 25) + 5,
// 						bathrooms: Math.floor(Math.random() * 3) + 1, // 1-3 bathrooms
// 						furnishingStatus: ['FULLY_FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED'][Math.floor(Math.random() * 3)],
// 						balcony: Math.random() > 0.3,
// 						parking: Math.random() > 0.2,
// 						ageOfProperty: Math.floor(Math.random() * 20) + 1,
// 						facingDirection: ['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST'][
// 							Math.floor(Math.random() * 8)
// 						],
// 						hasLift: Math.random() > 0.4,
// 						hasSecurity: Math.random() > 0.2,
// 						hasGym: Math.random() > 0.7,
// 						hasSwimmingPool: Math.random() > 0.8,
// 						hasPowerBackup: Math.random() > 0.3,
// 						hasGarden: Math.random() > 0.6,
// 						reraNumber: Math.random() > 0.5 ? `RERA${Math.floor(Math.random() * 10000)}` : null,
// 					},
// 				},
// 			}

// 		default:
// 			return {}
// 	}
// }

// function processCSVData() {
// 	return new Promise((resolve, reject) => {
// 		const csvData = []
// 		const csvPath = path.join(process.cwd(), 'public', 'all-companies-list.csv')

// 		if (!fs.existsSync(csvPath)) {
// 			reject(new Error('CSV file not found. Please place all-companies-list.csv in the public folder.'))
// 			return
// 		}

// 		fs
// 			.createReadStream(csvPath)
// 			.pipe(csv())
// 			.on('data', row => {
// 				csvData.push(row)
// 			})
// 			.on('end', () => {
// 				resolve(csvData)
// 			})
// 			.on('error', reject)
// 	})
// }

// export async function GET() {
// 	try {
// 		console.log('Starting CSV processing and database seeding...')

// 		// First, verify that the owner exists
// 		const ownerExists = await prisma.user.findUnique({
// 			where: { id: dummyTemplate.ownerId },
// 		})

// 		if (!ownerExists) {
// 			await prisma.$disconnect()
// 			return NextResponse.json(
// 				{
// 					success: false,
// 					error: `Owner with ID ${dummyTemplate.ownerId} does not exist. Please create the owner first or update the ownerId in the template.`,
// 				},
// 				{ status: 400 }
// 			)
// 		}

// 		// Process CSV data
// 		const csvData = await processCSVData()
// 		console.log(`Processing ${csvData.length} rows from CSV`)

// 		const createdProperties = []
// 		const errors = []

// 		// Process each row and create properties
// 		for (let i = 0; i < csvData.length; i++) {
// 			try {
// 				const row = csvData[i]
// 				const locationData = extractLocationData(row.Address)
// 				const propertyType = 'Apartment_Flat'

// 				console.log(`Processing ${i + 1}/${csvData.length}: ${row['Company Name']}`)

// 				// Create the property with location and property type specific data
// 				const property = await prisma.property.create({
// 					data: {
// 						title: row['Company Name'] || dummyTemplate.title,
// 						description: `Commercial property at ${row['Company Name']}. Located in a prime business area with excellent connectivity and infrastructure.`,
// 						price: dummyTemplate.price + Math.floor(Math.random() * 500000),
// 						images: dummyTemplate.images,
// 						videos: dummyTemplate.videos,
// 						propertyType: propertyType, // Now using correct enum values
// 						listingType: 'FOR_SALE',
// 						status: 'ACTIVE',
// 						googleMapLat: parseFloat(row.Latitude) || null,
// 						googleMapLng: parseFloat(row.Longitude) || null,
// 						propertyRent: dummyTemplate.propertyRent + Math.floor(Math.random() * 10000),
// 						securityDeposit: dummyTemplate.securityDeposit + Math.floor(Math.random() * 20000),
// 						advanceBookingAmount: dummyTemplate.advanceBookingAmount + Math.floor(Math.random() * 15000),
// 						// isAvailable: true,
// 						isVerified: Math.random() > 0.3, // 70% chance of being verified

// 						// Connect to existing owner
// 						owner: {
// 							connect: { id: dummyTemplate.ownerId },
// 						},

// 						// Create location
// 						location: {
// 							create: {
// 								address: row.Address,
// 								city: locationData.city,
// 								state: locationData.state,
// 								pincode: locationData.pincode,
// 							},
// 						},

// 						// Create property type specific data
// 						...getPropertyTypeData(propertyType),
// 					},
// 					include: {
// 						location: true,
// 						apartmentFlat: true,
// 						owner: {
// 							select: {
// 								id: true,
// 								firstName: true,
// 								lastName: true,
// 								email: true,
// 								role: true,
// 							},
// 						},
// 					},
// 				})

// 				createdProperties.push(property)
// 			} catch (error) {
// 				console.error(`Error processing row ${i + 1}:`, error.message)
// 				errors.push({
// 					row: i + 1,
// 					companyName: csvData[i]['Company Name'],
// 					error: error.message,
// 				})

// 				// Continue processing other rows even if one fails
// 				continue
// 			}
// 		}

// 		await prisma.$disconnect()

// 		console.log(`Successfully created ${createdProperties.length} properties`)
// 		if (errors.length > 0) {
// 			console.log(`${errors.length} rows had errors`)
// 		}

// 		return NextResponse.json({
// 			success: true,
// 			message: `Successfully created ${createdProperties.length} properties`,
// 			data: {
// 				totalProcessed: csvData.length,
// 				successfullyCreated: createdProperties.length,
// 				errors: errors.length,
// 				errorDetails: errors.slice(0, 10), // Show first 10 errors
// 				sampleProperties: createdProperties.slice(0, 3).map(p => ({
// 					id: p.id,
// 					title: p.title,
// 					price: p.price,
// 					propertyType: p.propertyType,
// 					location: p.location,
// 				})),
// 			},
// 		})
// 	} catch (error) {
// 		await prisma.$disconnect()
// 		console.error('Error in seeding process:', error)

// 		return NextResponse.json(
// 			{
// 				success: false,
// 				error: error.message,
// 				details: 'Check server logs for more information',
// 			},
// 			{ status: 500 }
// 		)
// 	}
// }

export async function GET() {
	return NextResponse.json({ name: 'These are the changes' })
}
