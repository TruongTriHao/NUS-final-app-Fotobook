import { SquarePen } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Photo as PhotoType } from "../../types/Photo";
import { Photo } from "../ui/Photo";
import { PhotoModal } from "../ui/PhotoModal";

export function AdminPhotoCard({ photo }: { photo: PhotoType }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="relative">
        <Photo
          src={photo.imageUrl}
          alt={photo.title}
          className="my-2 md:my-4 cursor-pointer"
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
        <div className="absolute top-2 md:top-4 left-0 grid grid-cols-[1fr_auto] w-full bg-black/50">
          <div className="text-sm truncate text-white mx-1 md:mx-2">
            {photo.title}
          </div>
          <Link to={`/photos/${photo.id}/edit`}>
            <SquarePen color="white" />
          </Link>
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
