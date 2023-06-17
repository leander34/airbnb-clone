"use client";
import { SafeUser } from "@/@types";
import useFavorite from "@/hooks/useFavorites";
import classnames from "classnames";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
}
const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser,
}) => {
  const { hasFavorited, toogleFavorite } = useFavorite({
    listingId,
    currentUser,
  });
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        toogleFavorite(e);
      }}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      {hasFavorited ? (
        <AiFillHeart
          size={24}
          className={classnames(
            "fill-rose-500",
            {
              "fill-neutral-500/70": hasFavorited,
            },
            {
              "": !hasFavorited,
            }
          )}
        />
      ) : (
        <AiOutlineHeart
          size={28}
          className="fill-white absolute -top[2px] -right-[2px]"
        />
      )}
    </div>
  );
};

export default HeartButton;
