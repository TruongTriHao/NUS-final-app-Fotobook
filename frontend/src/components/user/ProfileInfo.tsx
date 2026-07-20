import { ProfileInfoText } from "./ProfileInfoText";

export function ProfileInfo({
  numPhotos,
  numAlbums,
}: {
  numPhotos: number;
  numAlbums: number;
}) {
  return (
    <div className="flex gap-3.25 md:gap-7.5 my-1.5 md:my-3">
      <ProfileInfoText amount={numPhotos} text="PHOTOS" />
      <ProfileInfoText amount={numAlbums} text="ALBUMS" />
    </div>
  );
}
