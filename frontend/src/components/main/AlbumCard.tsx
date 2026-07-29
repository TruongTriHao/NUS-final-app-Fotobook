import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { albumService } from "../../services/albumService";
import { userService } from "../../services/userService";
import type { AlbumWithOwner } from "../../types/Album";
import type { ApiErrorResponse } from "../../types/api";
import { Album } from "../ui/Album";
import { AlbumModal } from "../ui/AlbumModal";
import { UserInfo } from "../ui/UserInfo";
import { ProfileButton } from "../user/ProfileButton";
import { CardFooter } from "./CardFooter";
import { CardText } from "./CardText";

export function AlbumCard({
  album,
  type,
  onFollowChange,
}: {
  album: AlbumWithOwner;
  type: "feed" | "discover";
  onFollowChange?: (userId: string, isFollowee: boolean) => void;
}) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(album.likeCount);
  const [isLiked, setIsLiked] = useState(album.isLiked);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isFollowee = album.owner.isFollowee;

  const handleFollowClick = async () => {
    if (!user) {
      toast.error("You must be logged in to follow users.");
      return;
    }
    try {
      setFollowLoading(true);
      const {
        data: { follow },
        message,
      } = isFollowee
        ? await userService.unfollowUser(album.ownerId)
        : await userService.followUser(album.ownerId);
      onFollowChange?.(album.ownerId, follow);
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "An error occurred while following the user.",
      );
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLikeClick = async () => {
    if (!user) {
      toast.error("You must be logged in to like an album.");
      return;
    }
    try {
      setLoading(true);
      const {
        data: { like },
        message,
      } = isLiked
        ? await albumService.unlikeAlbum(album.id)
        : await albumService.likeAlbum(album.id);
      setLikeCount((prevCount) => prevCount + (like ? 1 : -1));
      setIsLiked(like);
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "An error occurred while liking the album.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex m-2.5 bg-stone-50 rounded-sm shadow-lg h-34.25 md:h-68.5 overflow-hidden">
        <Album
          src={[
            album.images[0],
            album.images[1] ?? null,
            album.images[2] ?? null,
          ]}
          className="w-25 md:w-60 cursor-pointer"
          imageClassName="translate-x-3 translate-y-3"
          alt={album.title}
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
        <div className="flex flex-col mx-5 my-2 w-full">
          {type === "discover" && (
            <ProfileButton
              isCurrentUser={user?.id === album.ownerId}
              isFollowee={isFollowee}
              onClick={() => void handleFollowClick()}
              disabled={followLoading}
              className="px-px md:px-0.5 py-0 md:py-0 self-end text-xs hidden md:block"
            />
          )}
          <UserInfo
            user={album.owner}
            avatarClassName="text-white text-xs md:text-sm bg-indigo-800"
            nameClassName="text-indigo-800 text-xs md:text-sm"
            to={`/profile/${album.ownerId}`}
          />
          <CardText title={album.title} description={album.description} />
          <CardFooter
            likeCount={likeCount}
            createdAt={album.createdAt}
            liked={isLiked}
            disabled={loading}
            onClick={() => void handleLikeClick()}
          />
        </div>
      </div>
      <AlbumModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        album={album}
      />
    </>
  );
}
