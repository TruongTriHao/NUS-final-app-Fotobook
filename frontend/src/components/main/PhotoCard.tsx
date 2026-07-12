import { useState } from "react";
import type { PhotoWithUser } from "../../types/Photo";
import { Photo } from "../ui/Photo";
import { PhotoModal } from "../ui/PhotoModal";
import { UserInfo } from "../ui/UserInfo";
import { CardFooter } from "./CardFooter";
import { CardText } from "./CardText";

export function PhotoCard({ photo }: { photo: PhotoWithUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="flex flex-col justify-between m-2">
          <UserInfo
            user={photo.owner}
            avatarClassName="text-white text-xs md:text-sm bg-indigo-800"
            nameClassName="text-indigo-800 text-xs md:text-sm"
            to={`/profile/${photo.ownerId}`}
          />
          <CardText title={photo.title} description={photo.description} />
          <CardFooter likeCount={photo.likeCount} createdAt={photo.createdAt} />
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
