import getCurrentUser from "./getCurrentUser";
import prisma from "@/database/prismaClient";

export default async function getfavoritesListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const favotires = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])],
        },
      },
    });

    return favotires;
  } catch (error: any) {
    throw new Error(error);
  }
}
