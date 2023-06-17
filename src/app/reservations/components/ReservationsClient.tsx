"use client";
import { SafeUser } from "@/@types";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ListingCard from "@/components/Listings/ListingCard";
import { Listing, Reservation } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

interface ReservationsClientProps {
  reservations: (Reservation & {
    listing: Listing;
  })[];
  currentUser?: SafeUser | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        await axios.delete(`/api/reservations/${id}`);
        toast.success("Reservation Cancelled");
        router.refresh();
      } catch (error: any) {
        toast.error(error?.response?.data?.error);
      } finally {
        setDeletingId("");
      }
    },
    [router]
  );
  return (
    <Container>
      <Heading title="Reservations" subtitle="Booking on your properties" />

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            actionLabel="Cancel guest reservation"
            disabled={deletingId === reservation.id}
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default ReservationsClient;
