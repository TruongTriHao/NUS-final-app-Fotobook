import { SquarePen } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Album as AlbumType } from "../../types/Album";
import { Album } from "../ui/Album";
import { AlbumModal } from "../ui/AlbumModal";

export function AdminAlbumCard({ album }: { album: AlbumType }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="relative w-full aspect-square my-2 md:my-4">
        <Album
          src={[album.images[0], album.images[1], album.images[2]]}
          alt={album.title}
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        />
        <div className="absolute top-2 md:top-4 left-0 grid grid-cols-[1fr_auto] w-full bg-black/50 z-30">
          <div className="text-sm truncate text-white mx-1 md:mx-2">
            {album.title}
          </div>
          <Link to={`/albums/${album.id}/edit`}>
            <SquarePen color="white" />
          </Link>
        </div>
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
