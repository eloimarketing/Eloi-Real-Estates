// lib/enums.ts
export enum PropertyType {
	Apartment_Flat = 'Apartment_Flat',
	Independent_House_Villa = 'Independent_House_Villa',
	Plot_Land = 'Plot_Land',
	Office_Space = 'Office_Space',
	Shop_Showroom = 'Shop_Showroom',
	Warehouse_Godown = 'Warehouse_Godown',
	Farmhouse_Agricultural_Land = 'Farmhouse_Agricultural_Land',
	CoWorking_Space = 'CoWorking_Space',
	Paying_Guest_Hostel = 'Paying_Guest_Hostel',
}

export enum ListingType {
	FOR_SALE = 'FOR_SALE',
	FOR_RENT = 'FOR_RENT',
}

export enum FurnishingStatus {
	UNFURNISHED = 'UNFURNISHED',
	SEMI_FURNISHED = 'SEMI_FURNISHED',
	FULLY_FURNISHED = 'FULLY_FURNISHED',
	// BARE_SHELL = 'BARE_SHELL', // Note: Your Zod schema for ApartmentFlat has BARE_SHELL, Prisma doesn't. Align these.
}

export enum FacingDirection {
	NORTH = 'NORTH',
	SOUTH = 'SOUTH',
	EAST = 'EAST',
	WEST = 'WEST',
	NORTH_EAST = 'NORTH_EAST',
	NORTH_WEST = 'NORTH_WEST',
	SOUTH_EAST = 'SOUTH_EAST',
	SOUTH_WEST = 'SOUTH_WEST',
}

export enum LandUseType {
	RESIDENTIAL = 'RESIDENTIAL',
	COMMERCIAL = 'COMMERCIAL',
	AGRICULTURAL = 'AGRICULTURAL',
}

export enum OwnershipType {
	FREEHOLD = 'FREEHOLD',
	LEASEHOLD = 'LEASEHOLD',
}

export enum PlotAreaUnit {
	SQ_FT = 'sq_ft',
	ACRES = 'acres',
}

export enum DeskType {
	HOT_DESK = 'HOT_DESK',
	PRIVATE_CABIN = 'PRIVATE_CABIN',
	DEDICATED_DESK = 'DEDICATED_DESK',
}

export enum RoomType {
	PRIVATE = 'PRIVATE',
	SHARED = 'SHARED',
	DORMITORY = 'DORMITORY',
}
