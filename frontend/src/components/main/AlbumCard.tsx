import { useState } from "react";
import type { AlbumWithUser } from "../../types/Album";
import { Album } from "../ui/Album";
import { AlbumModal } from "../ui/AlbumModal";
import { UserInfo } from "../ui/UserInfo";
import { CardFooter } from "./CardFooter";
import { CardText } from "./CardText";

export function AlbumCard({ album }: { album: AlbumWithUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex m-2.5 bg-stone-50 rounded-sm shadow-lg h-34.25 md:h-68.5 overflow-hidden">
        <Album
          src={[
            album.images[0],
            album.images[1] ?? null,
            album.images[2] ?? null,
          ]}
          className="w-25 md:w-60 cursor-pointer"
          imageClassName="translate-x-3 translate-y-3"
          alt={album.title}
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
        <div className="flex flex-col justify-between mx-5 my-2">
          <UserInfo
            user={album.owner}
            avatarClassName="text-white text-xs md:text-sm bg-indigo-800"
            nameClassName="text-indigo-800 text-xs md:text-sm"
            to={`/profile/${album.ownerId}`}
          />
          <CardText title={album.title} description={album.description} />
          <CardFooter likeCount={album.likeCount} createdAt={album.createdAt} />
        </div>
      </div>
      <AlbumModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        album={album}
      />
    </>
  );
}
