import { NextResponse, NextRequest } from "next/server";
import prisma from "@/database/prismaClient";
import getCurrentUser from "@/actions/getCurrentUser";
import * as z from "zod";

const SchemaRentForm = z.object({
  category: z.string().nonempty(),
  location: z.object({
    flag: z.string().nonempty(),
    label: z.string().nonempty(),
    latlng: z.number().array(),
    region: z.string().nonempty(),
    value: z.string().nonempty(),
  }),
  guestCount: z.number().positive(),
  roomCount: z.number().positive(),
  bathroomCount: z.number().positive(),
  imageSrc: z.string().nonempty(),
  price: z.number().positive(),
  title: z.string().nonempty(),
  description: z.string().nonempty(),
});
export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    bathroomCount,
    category,
    description,
    guestCount,
    imageSrc,
    location,
    price,
    roomCount,
    title,
  } = SchemaRentForm.parse(body);

  const listing = await prisma.listing.create({
    data: {
      bathroomCount,
      category,
      description,
      guestCount,
      imageSrc,
      locationValue: location.value,
      price,
      roomCount,
      title,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}
