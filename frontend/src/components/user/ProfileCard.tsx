import type { ProfileData } from "../../types/User";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileButton } from "./ProfileButton";
import { ProfileInfo } from "./ProfileInfo";

export function ProfileCard({ profile }: { profile: ProfileData }) {
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
        isFollowee={profile.isFollowee}
        className="my-1 md:my-2"
      />
    </div>
  );
}
