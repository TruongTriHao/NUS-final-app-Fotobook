import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { photoService } from "../../services/photoService";
import type { ApiErrorResponse } from "../../types/api";
import type { Photo as PhotoType } from "../../types/Photo";
import { Loading } from "../ui/Loading";
import { NotFoundMessage } from "../ui/NotFoundMessage";
import { AddButton } from "./AddButton";
import { PhotoTabCard } from "./PhotoTabCard";
import { ProfileGrid } from "./ProfileGrid";

export function PhotoTab({
  id,
  isCurrentUser,
}: {
  id: string;
  isCurrentUser: boolean;
}) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const {
          data: { photos },
          message,
        } = await photoService.getPhotosByUserId(id);
        if (isMounted) {
          setPhotos(photos);
          toast.success(message);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as ApiErrorResponse).message || "Failed to fetch photos.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchPhotos();

    return () => {
      isMounted = false;
    };
  }, [id, isCurrentUser]);

  if (loading) {
    return <Loading />;
  }

  if (photos.length === 0) {
    return (
      <>
        {isCurrentUser && (
          <AddButton
            text="Add Photo"
            onClick={() => void navigate("/photos/new")}
          />
        )}
        <NotFoundMessage itemType="photos" />
      </>
    );
  }

  return (
    <>
      {isCurrentUser && (
        <AddButton
          text="Add Photo"
          onClick={() => void navigate("/photos/new")}
        />
      )}
      <ProfileGrid>
        {photos.map((photo) => (
          <PhotoTabCard
            key={photo.id}
            photo={photo}
            isCurrentUser={isCurrentUser}
          />
        ))}
      </ProfileGrid>
    </>
  );
}
