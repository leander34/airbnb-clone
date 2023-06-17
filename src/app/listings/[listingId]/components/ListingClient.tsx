"use client";
import { SafeUser } from "@/@types";
import Container from "@/components/Container";
import ListingHead from "@/components/Listings/ListingHead";
import ListingInfo from "@/components/Listings/ListingInfo";
import ListingReservation from "@/components/Listings/ListingReservation";
import { categories } from "@/components/Navbar/Cateogories";
import { useLoginModal } from "@/store/useLoginModal";
import { Listing, Reservation, User } from "@prisma/client";
import axios from "axios";
import {
  differenceInCalendarDays,
  differenceInDays,
  eachDayOfInterval,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Range } from "react-date-range";

const inititalDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};
interface ListingClientProps {
  reservations?: (Reservation & {
    listing: Listing;
  })[];
  listing: Listing & {
    user: User;
  };
  currentUser?: SafeUser | null;
}
const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(inititalDateRange);
  const onCreateReservation = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      setIsLoading(true);
      await axios.post("/api/reservations", {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing.id,
      });

      toast.success("Listing reserved!");

      setDateRange(inititalDateRange);
      setIsLoading(false);
      router.push("/trips");
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  }, [totalPrice, dateRange, currentUser, listing.id, loginModal, router]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      console.log(dayCount);

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange.startDate, dateRange.endDate, listing.price]);
  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);
  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />

          <div className="grid grid-col-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              descripton={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />

            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
