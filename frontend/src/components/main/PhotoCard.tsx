import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { photoService } from "../../services/photoService";
import { userService } from "../../services/userService";
import type { ApiErrorResponse } from "../../types/api";
import type { PhotoWithOwner } from "../../types/Photo";
import { Photo } from "../ui/Photo";
import { PhotoModal } from "../ui/PhotoModal";
import { UserInfo } from "../ui/UserInfo";
import { ProfileButton } from "../user/ProfileButton";
import { CardFooter } from "./CardFooter";
import { CardText } from "./CardText";

export function PhotoCard({
  photo,
  type,
  onFollowChange,
}: {
  photo: PhotoWithOwner;
  type: "feed" | "discover";
  onFollowChange?: (userId: string, isFollowee: boolean) => void;
}) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(photo.likeCount);
  const [isLiked, setIsLiked] = useState(photo.isLiked);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isFollowee = photo.owner.isFollowee;

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
        ? await userService.unfollowUser(photo.ownerId)
        : await userService.followUser(photo.ownerId);
      onFollowChange?.(photo.ownerId, follow);
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
      toast.error("You must be logged in to like a photo.");
      return;
    }
    try {
      setLoading(true);
      const {
        data: { like },
        message,
      } = isLiked
        ? await photoService.unlikePhoto(photo.id)
        : await photoService.likePhoto(photo.id);
      setLikeCount((prevCount) => prevCount + (like ? 1 : -1));
      setIsLiked(like);
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "An error occurred while liking the photo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex m-2.5 bg-stone-50 rounded-sm shadow-lg h-34.25 md:h-68.5 overflow-hidden">
        <Photo
          src={photo.imageUrl}
          alt={photo.title}
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        />
        <div className="flex flex-col m-2 w-full">
          {type === "discover" && (
            <ProfileButton
              isCurrentUser={user?.id === photo.ownerId}
              isFollowee={isFollowee}
              onClick={() => void handleFollowClick()}
              disabled={followLoading}
              className="px-px md:px-0.5 py-0 md:py-0 self-end text-xs hidden md:block"
            />
          )}
          <UserInfo
            user={photo.owner}
            avatarClassName="text-white text-xs md:text-sm bg-indigo-800"
            nameClassName="text-indigo-800 text-xs md:text-sm"
            to={`/profile/${photo.ownerId}`}
          />
          <CardText title={photo.title} description={photo.description} />
          <CardFooter
            likeCount={likeCount}
            createdAt={photo.createdAt}
            liked={isLiked}
            disabled={loading}
            onClick={() => void handleLikeClick()}
          />
        </div>
      </div>
      <PhotoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        photo={photo}
      />
    </>
  );
}
