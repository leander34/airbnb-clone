import getCurrentUser from "@/actions/getCurrentUser";
import getfavoritesListings from "@/actions/getFavoritesListings";
import EmptyState from "@/components/EmptyState";
import FavoritesClient from "./components/FavoritesClient";

export default async function Favorites() {
  const currentUser = await getCurrentUser();

  // if (!currentUser) {
  //   return <EmptyState title="Unauthorized" subtitle="Please login" />;
  // }

  const favorites = await getfavoritesListings();

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No favorites found"
        subtitle="Looks like you have no favorites listings."
      />
    );
  }
  return <FavoritesClient listings={favorites} currentUser={currentUser} />;
}
