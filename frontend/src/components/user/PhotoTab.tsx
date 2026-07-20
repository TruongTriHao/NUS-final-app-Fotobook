import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { photoService } from "../../services/photoService";
import type { Photo as PhotoType } from "../../types/Photo";
import { Alert } from "../ui/Alert";
import { Loading } from "../ui/Loading";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await photoService.getPhotosByUserId(id, isCurrentUser);
        if (isMounted) {
          setPhotos(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Error fetching photos");
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

  if (error) {
    return <Alert message={error} />;
  }

  if (photos.length === 0) {
    return <div>No photos found.</div>;
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
