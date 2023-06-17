import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prismaClient";
import getCurrentUser from "@/actions/getCurrentUser";
export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          endDate,
          startDate,
          totalPrice,
          userId: currentUser.id,
        },
      },
    },
  });

  return NextResponse.json(listingAndReservation);
}
