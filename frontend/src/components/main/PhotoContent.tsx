import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { photoService } from "../../services/photoService";
import type { PhotoWithUser } from "../../types/Photo";
import { Alert } from "../ui/Alert";
import { Loading } from "../ui/Loading";
import { CardGrid } from "./CardGrid";
import { PhotoCard } from "./PhotoCard";

export function PhotoContent({ type }: { type: "feeds" | "discover" }) {
  const { user: currentUser } = useAuth();
  const [photos, setPhotos] = useState<PhotoWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await photoService.getPhotosForMain(
          type,
          currentUser?.id ?? "",
        );
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
  }, [currentUser?.id, type]);

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
    <CardGrid>
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </CardGrid>
  );
}
