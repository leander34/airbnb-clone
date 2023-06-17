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

interface PropertiesClientProps {
  listings: Listing[];
  currentUser?: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    async (id: string) => {
      setDeletingId(id);

      try {
        await axios.delete(`/api/listings/${id}`);
        toast.success("Listing deleted");
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
      <Heading title="Properties" subtitle="List of you properties" />

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {listings?.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onCancel}
            disabled={deletingId === listing.id}
            actionLabel="Delete properties"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default PropertiesClient;
