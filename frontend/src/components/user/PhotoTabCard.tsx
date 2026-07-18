import { Lock } from "lucide-react";
import { useState } from "react";
import type { Photo as PhotoType } from "../../types/Photo";
import { EditButton } from "../ui/EditButton";
import { Photo } from "../ui/Photo";
import { PhotoModal } from "../ui/PhotoModal";
import { ProfileTitle } from "./ProfileTitle";

export function PhotoTabCard({
  photo,
  isCurrentUser,
}: {
  photo: PhotoType;
  isCurrentUser: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col m-2 md:m-4 w-25 md:w-40">
        <div className="relative h-25 md:h-40">
          <Photo
            src={photo.imageUrl}
            alt={photo.title}
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="cursor-pointer"
          />
          {photo.mode === "private" && (
            <Lock className="absolute bg-white/80 rounded-full p-1 right-0 top-0" />
          )}
          {isCurrentUser && (
            <EditButton
              to={`/photos/${photo.id}/edit`}
              className="absolute bottom-0 right-0"
            />
          )}
        </div>
        <ProfileTitle title={photo.title} />
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
