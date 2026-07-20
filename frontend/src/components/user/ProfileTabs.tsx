import { useState } from "react";
import type { ProfileData } from "../../types/User";
import { AlbumTab } from "./AlbumTab";
import { FolloweesTab } from "./FolloweesTab";
import { FollowersTab } from "./FollowersTab";
import { PhotoTab } from "./PhotoTab";
import { ProfileTabButtons } from "./ProfileTabButton";

export function ProfileTabs({ profile }: { profile: ProfileData }) {
  const [activeTab, setActiveTab] = useState<
    "photos" | "albums" | "followings" | "followers"
  >("photos");

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
          amount={profile.numFollowees}
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
          <FolloweesTab id={profile.id} />
        </>
      )}
      {activeTab === "followers" && (
        <>
          <FollowersTab id={profile.id} />
        </>
      )}
    </>
  );
}
