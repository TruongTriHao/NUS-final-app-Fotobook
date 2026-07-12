import { useEffect } from "react";
import type { Photo as PhotoType } from "../../types/Photo";
import { Photo } from "./Photo";
import { Title } from "./Title";

export function PhotoModal({
  isOpen,
  onClose,
  photo,
}: {
  isOpen: boolean;
  onClose: () => void;
  photo: PhotoType;
}) {
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
            {photo.title}
          </Title>
          <Photo
            src={photo.imageUrl}
            alt={photo.title}
            className="aspect-auto rounded-none m-auto"
          />
          <div className="text-xs md:text-base mt-1.75 md:mt-3.5">
            {photo.description}
          </div>
        </div>
      </div>
    </div>
  );
}
