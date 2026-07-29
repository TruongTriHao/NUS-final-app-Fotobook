import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { ProfileData } from "../../types/User";
import { AlbumTab } from "./AlbumTab";
import { FolloweesTab } from "./FolloweesTab";
import { FollowersTab } from "./FollowersTab";
import { PhotoTab } from "./PhotoTab";
import { ProfileTabButtons } from "./ProfileTabButton";

export function ProfileTabs({ profile }: { profile: ProfileData }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "photos" | "albums" | "followings" | "followers"
  >("photos");
  const [numFollowees, setNumFollowees] = useState(profile.numFollowees);

  const handleFollow = (change: number) => {
    if (user?.id === profile.id) {
      setNumFollowees((prev) => prev + change);
    }
  };

  return (
    <>
      <div className="flex justify-evenly m-2 md:m-4">
        <ProfileTabButtons
          amount={profile.numPhotos}
          label="PHOTOS"
          active={activeTab === "photos"}
          onClick={() => {
            setActiveTab("photos");
          }}
        />
        <ProfileTabButtons
          amount={profile.numAlbums}
          label="ALBUMS"
          active={activeTab === "albums"}
          onClick={() => {
            setActiveTab("albums");
          }}
        />
        <ProfileTabButtons
          amount={numFollowees}
          label="FOLLOWINGS"
          active={activeTab === "followings"}
          onClick={() => {
            setActiveTab("followings");
          }}
        />
        <ProfileTabButtons
          amount={profile.numFollowers}
          label="FOLLOWERS"
          active={activeTab === "followers"}
          onClick={() => {
            setActiveTab("followers");
          }}
        />
      </div>
      {activeTab === "photos" && (
        <>
          <PhotoTab id={profile.id} isCurrentUser={profile.isCurrentUser} />
        </>
      )}
      {activeTab === "albums" && (
        <>
          <AlbumTab id={profile.id} isCurrentUser={profile.isCurrentUser} />
        </>
      )}
      {activeTab === "followings" && (
        <>
          <FolloweesTab id={profile.id} onFollowChange={handleFollow} />
        </>
      )}
      {activeTab === "followers" && (
        <>
          <FollowersTab id={profile.id} onFollowChange={handleFollow} />
        </>
      )}
    </>
  );
}
