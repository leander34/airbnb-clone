import getCurrentUser from "@/actions/getCurrentUser";
import getListingById from "@/actions/getListingbyId";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import ListingClient from "./components/ListingClient";
import getReservations from "@/actions/getReservations";
interface IParams {
  listingId?: string;
}
export default async function ListingPage({ params }: { params: IParams }) {
  const listing = await getListingById(params);
  const currentUser = await getCurrentUser();
  const reservations = await getReservations(params);

  if (!listing) {
    return <EmptyState />;
  }
  return (
    <ListingClient
      listing={listing}
      reservations={reservations}
      currentUser={currentUser}
    />
  );
}
