import prisma from "@/database/prismaClient";
import { Prisma } from "@prisma/client";
export interface IListingParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}
export default async function getListings(params: IListingParams) {
  try {
    const {
      userId,
      bathroomCount,
      category,
      endDate,
      guestCount,
      locationValue,
      roomCount,
      startDate,
    } = params;
    const where: Prisma.ListingWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (category) {
      where.category = category;
    }

    if (roomCount) {
      where.roomCount = {
        gte: +roomCount,
      };
    }
    if (guestCount) {
      where.guestCount = {
        gte: +guestCount,
      };
    }

    if (bathroomCount) {
      where.bathroomCount = {
        gte: +bathroomCount,
      };
    }
    if (locationValue) {
      where.locationValue = locationValue;
    }
    if (startDate && endDate) {
      where.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                endDate: { lte: endDate },
                startDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    if (endDate) {
    }
    const listing = await prisma.listing.findMany({
      where,
      orderBy: {
        createdAt: "asc",
      },
    });

    return listing;
  } catch (error: any) {
    throw new Error(error);
  }
}
