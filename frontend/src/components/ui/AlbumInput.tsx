import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import type { Album } from "../../types/Album";
import { Photo } from "./Photo";

type SelectedPhoto =
  | { type: "existing"; id: string; url: string }
  | {
      type: "new";
      id: string;
      file: File;
      previewUrl: string;
    };

export function AlbumInput({
  id,
  initial = null,
  name,
}: {
  id?: string;
  initial?: Album | null;
  name?: string;
}) {
  const [photos, setPhotos] = useState<SelectedPhoto[]>(
    initial
      ? initial.images.map((image) => ({
          type: "existing",
          id: crypto.randomUUID(),
          url: image,
        }))
      : [],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    const newPhotos: SelectedPhoto[] = newFiles.map((file) => ({
      type: "new",
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    const photoToDelete = photos.find((p) => p.id === id);
    if (photoToDelete && photoToDelete.type === "new") {
      URL.revokeObjectURL(photoToDelete.previewUrl);
    }
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-wrap gap-4 mx-2 md:mx-4 my-1.25 md:my-2.5">
      {photos.map((photo) => (
        <div key={photo.id} className="relative w-16 md:w-32">
          <Photo
            src={photo.type === "existing" ? photo.url : photo.previewUrl}
            alt="Album Photo"
          />
          <X
            onClick={() => {
              handleDelete(photo.id);
            }}
            className="absolute top-0 right-0 shadow-lg size-3 md:size-5 cursor-pointer"
            strokeWidth={5}
            color="red"
          />
        </div>
      ))}
      {photos.length < 25 && (
        <div className="w-16 md:w-32">
          <input
            id={id}
            name={name}
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <ImagePlus
            className="border-2 border-dashed border-neutral-200 bg-zinc-100 size-16 md:size-32 cursor-pointer"
            onClick={handleClick}
          />
        </div>
      )}
    </div>
  );
}
