import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import type { ApiErrorResponse } from "../../types/api";
import type { ProfileData } from "../../types/User";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileButton } from "./ProfileButton";
import { ProfileInfo } from "./ProfileInfo";

export function ProfileCard({
  profile,
  onFollowChange,
}: {
  profile: ProfileData;
  onFollowChange?: (change: number) => void;
}) {
  const { user } = useAuth();
  const [isFollowee, setIsFollowee] = useState(profile.isFollowee);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (!user) {
      toast.error("You must be logged in to follow users.");
      return;
    }
    try {
      setLoading(true);
      const {
        data: { follow },
        message,
      } = isFollowee
        ? await userService.unfollowUser(profile.id)
        : await userService.followUser(profile.id);
      setIsFollowee(follow);
      if (onFollowChange) {
        onFollowChange(follow ? 1 : -1);
      }
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "An error occurred while following the user.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-stone-50 rounded-sm shadow-lg my-3.25 md:my-6.5 w-30 md:w-50">
      <ProfileAvatar
        user={profile}
        className="my-1.5 md:my-3"
        to={`/profile/${profile.id}`}
      />
      <div className="font-bold text-xs md:text-base">
        {profile.firstName} {profile.lastName}
      </div>
      <ProfileInfo
        numPhotos={profile.numPhotos}
        numAlbums={profile.numAlbums}
      />
      <ProfileButton
        isCurrentUser={profile.isCurrentUser}
        isFollowee={isFollowee}
        disabled={loading}
        onClick={() => void handleFollow()}
        className="my-1 md:my-2"
      />
    </div>
  );
}
