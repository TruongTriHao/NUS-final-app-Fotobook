import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Photo } from "./Photo";

export function PhotoInput({
  initial = null,
  id,
  name,
}: {
  initial?: string | null;
  id?: string;
  name?: string;
}) {
  const [photo, setPhoto] = useState<string | null>(initial);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
    } else {
      setPhoto(null);
    }
  };
  const handleDelete = () => {
    if (photo) {
      URL.revokeObjectURL(photo);
    }
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-2 md:mx-4 my-1.25 md:my-2.5 w-16 md:w-32">
      <input
        id={id}
        name={name}
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      {photo ? (
        <div className="relative">
          <Photo src={photo} alt="Preview" />
          <X
            onClick={handleDelete}
            className="absolute top-0 right-0 shadow-lg size-3 md:size-5 cursor-pointer"
            strokeWidth={5}
            color="red"
          />
        </div>
      ) : (
        <ImagePlus
          className="border-2 border-dashed border-neutral-200 bg-zinc-100 size-16 md:size-32 cursor-pointer"
          onClick={handleClick}
        />
      )}
    </div>
  );
}
