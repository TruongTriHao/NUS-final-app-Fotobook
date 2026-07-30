import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { albumService } from "../../services/albumService";
import { photoService } from "../../services/photoService";
import type { Album } from "../../types/Album";
import type { ApiErrorResponse } from "../../types/api";
import type { Photo } from "../../types/Photo";
import { getPublicIdFromCloudinarySignedUrl } from "../../utils/url";
import { AlbumInput } from "../ui/AlbumInput";
import { ConfirmModal } from "../ui/ConfirmModal";
import { DeleteButton } from "../ui/DeleteButton";
import { InputField } from "../ui/InputField";
import { PhotoInput } from "../ui/PhotoInput";
import { SaveButton } from "../ui/SaveButton";
import { TextInput } from "../ui/TextInput";
import { DropdownChoice } from "./DropdownChoice";

export type SelectedPhoto =
  | { type: "existing"; id: string; url: string }
  | {
      type: "new";
      id: string;
      file: File;
      previewUrl: string;
    };

export function NewForm({
  type,
  initial = null,
  editMode = false,
}: {
  type: "photos" | "albums";
  initial?: Photo | Album | null;
  editMode?: boolean;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [albumPhotos, setAlbumPhotos] = useState<SelectedPhoto[]>(
    type === "albums" && initial && "images" in initial
      ? initial.images.map((image) => ({
          type: "existing",
          id: crypto.randomUUID(),
          url: image,
        }))
      : [],
  );

  const handleDelete = async () => {
    if (!initial) return;
    try {
      setDeleteLoading(true);
      const { message } =
        type === "photos"
          ? await photoService.deletePhoto(initial.id)
          : await albumService.deleteAlbum(initial.id);
      void navigate(-1);
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "Failed to delete. Please try again.",
      );
    } finally {
      setDeleteLoading(false);
      setConfirmOpen(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const isPhoto = type === "photos";
      if (!isPhoto) {
        albumPhotos.forEach((photo) => {
          if (photo.type === "new") {
            formData.append("albums", photo.file);
          }
        });
        if (editMode) {
          formData.append(
            "existingImages",
            JSON.stringify(
              albumPhotos
                .filter((p) => p.type === "existing")
                .map((p) => getPublicIdFromCloudinarySignedUrl(p.url)),
            ),
          );
        }
      }
      let response;
      if (editMode && initial) {
        response = isPhoto
          ? await photoService.updatePhoto(initial.id, formData)
          : await albumService.updateAlbum(initial.id, formData);
      } else {
        response = isPhoto
          ? await photoService.createPhoto(formData)
          : await albumService.createAlbum(formData);
      }
      toast.success(response.message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "Failed to create. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={(e) => void handleSubmit(e)}>
        <div className="grid grid-cols-2">
          <div className="flex flex-col">
            <InputField
              label="Title"
              htmlFor="title"
              outerClassName="my-1.25 md:my-2.5"
              labelClassName="my-1 md:my-2"
            >
              <TextInput
                id="title"
                name="title"
                type="text"
                autoFocus
                placeholder={`${type === "photos" ? "Photo" : "Album"} Title`}
                className="px-1.25 md:px-2.5 py-1 md:py-2"
                defaultValue={initial?.title}
                required
              />
            </InputField>
            <InputField
              label="Sharing mode"
              htmlFor="mode"
              outerClassName="my-1.25 md:my-2.5"
              labelClassName="my-1 md:my-2"
            >
              <DropdownChoice id="mode" name="mode" initial={initial?.mode} />
            </InputField>
          </div>
          <InputField
            label="Description"
            htmlFor="description"
            outerClassName="my-1.25 md:my-2.5"
            labelClassName="my-1 md:my-2"
          >
            <textarea
              id="description"
              name="description"
              placeholder={`${type === "photos" ? "Photo" : "Album"} Description`}
              className="px-1.25 md:px-2.5 py-1 md:py-2 mx-2 md:mx-4 border-2 border-neutral-200 rounded-sm text-xs md:text-base"
              rows={5}
              defaultValue={initial?.description}
              required
            />
          </InputField>
        </div>
        {type === "photos" ? (
          <PhotoInput
            name="photos"
            initial={
              editMode && initial && "imageUrl" in initial
                ? initial.imageUrl
                : null
            }
            required={!initial}
          />
        ) : (
          <AlbumInput
            name="albums"
            initial={editMode ? (initial as Album) : null}
            onPhotosChange={setAlbumPhotos}
          />
        )}
        <SaveButton className="self-start" disabled={loading} />
        {editMode && (
          <DeleteButton
            disabled={deleteLoading}
            onClick={() => {
              setConfirmOpen(true);
            }}
          />
        )}
      </form>
      {confirmOpen && (
        <ConfirmModal
          isOpen={confirmOpen}
          onClose={() => {
            setConfirmOpen(false);
          }}
          onConfirm={() => void handleDelete()}
          title={`Delete ${type === "photos" ? "Photo" : "Album"}`}
          message={`Are you sure you want to delete this ${
            type === "photos" ? "photo" : "album"
          }? This action cannot be undone.`}
          confirmText="Delete"
          loading={deleteLoading}
        />
      )}
    </>
  );
}
