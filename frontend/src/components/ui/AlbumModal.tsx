import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Album } from "../../types/Album";
import { Photo } from "./Photo";
import { Title } from "./Title";

export function AlbumModal({
  isOpen,
  onClose,
  album,
}: {
  isOpen: boolean;
  onClose: () => void;
  album: Album;
}) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-4/5 md:w-1/2 max-h-1/2 md:max-h-4/5 overflow-auto bg-white rounded-lg shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="mx-1.5 md:mx-3 my-1 md:my-2">
          <Title className="text-black text-base md:text-md mb-3 md:mb-6">
            {album.title}
          </Title>
          <div className="relative">
            <Photo
              src={album.images[currentPhotoIndex]}
              alt={album.title}
              className="aspect-auto rounded-none m-auto"
            />
            <ChevronLeft
              className="absolute top-1/2 left-1 md:left-2 cursor-pointer size-6 md:size-12 bg-white/70 rounded-full shadow-lg"
              strokeWidth={5}
              onClick={() => {
                setCurrentPhotoIndex((prev) =>
                  prev === 0 ? album.images.length - 1 : prev - 1,
                );
              }}
            />
            <ChevronRight
              className="absolute top-1/2 right-1 md:right-2 cursor-pointer size-6 md:size-12 bg-white/70 rounded-full shadow-lg"
              strokeWidth={5}
              onClick={() => {
                setCurrentPhotoIndex((prev) =>
                  prev === album.images.length - 1 ? 0 : prev + 1,
                );
              }}
            />
          </div>
          <div className="text-center text-xs md:text-base text-neutral-400 m-1.75 md:m-3.5">
            Photo {currentPhotoIndex + 1} of {album.images.length}
          </div>
          <div className="text-xs md:text-base">{album.description}</div>
        </div>
      </div>
    </div>
  );
}
