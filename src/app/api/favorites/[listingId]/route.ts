import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prismaClient";
import getCurrentUser from "@/actions/getCurrentUser";
interface IParams {
  listingId?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let favoritesIds = [...(currentUser.favoriteIds || [])];

  favoritesIds.push(listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds: favoritesIds,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let favoritesIds = [...(currentUser.favoriteIds || [])];

  favoritesIds = favoritesIds.filter((id) => id !== listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds: favoritesIds,
    },
  });

  return NextResponse.json(user);
}
