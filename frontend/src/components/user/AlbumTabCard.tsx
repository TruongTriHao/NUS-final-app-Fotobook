import { Lock } from "lucide-react";
import { useState } from "react";
import type { Album as AlbumType } from "../../types/Album";
import { Album } from "../ui/Album";
import { AlbumModal } from "../ui/AlbumModal";
import { EditButton } from "../ui/EditButton";
import { ProfileInfoText } from "./ProfileInfoText";
import { ProfileTitle } from "./ProfileTitle";

export function AlbumTabCard({
  album,
  isCurrentUser,
}: {
  album: AlbumType;
  isCurrentUser: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col m-2 md:m-4 w-25 md:w-40">
        <div className="relative h-25 md:h-40">
          <Album
            src={[album.images[0], album.images[1], album.images[2]]}
            alt={album.title}
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="cursor-pointer"
          />
          <ProfileInfoText
            amount={album.images.length}
            text="PHOTOS"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-black/40 rounded-full aspect-square md:p-2 cursor-pointer z-30"
            onClick={() => {
              setIsModalOpen(true);
            }}
          />
          {album.mode === "private" && (
            <Lock className="absolute bg-white/80 rounded-full p-1 right-1 top-1 z-30" />
          )}
          {isCurrentUser && (
            <EditButton
              className="bottom-1 right-1 z-30"
              to={`/albums/${album.id}/edit`}
            />
          )}
        </div>
        <ProfileTitle title={album.title} className="m-1.5 md:m-3" />
      </div>
      <AlbumModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        album={album}
        key={album.id}
      />
    </>
  );
}
