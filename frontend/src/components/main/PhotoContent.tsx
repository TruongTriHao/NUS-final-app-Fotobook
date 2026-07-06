import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { photoService } from "../../services/photoService";
import type { Photo } from "../../types/Photo";
import { CardGrid } from "./CardGrid";
import { PhotoCard } from "./PhotoCard";

export function PhotoContent({ type }: { type: "feeds" | "discover" }) {
  const { user: currentUser } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await photoService.getPhotos(type, currentUser?.id ?? "");
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (photos.length === 0) {
    return <div>No photos found.</div>;
  }

  return (
    <CardGrid>
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          src={photo.imageUrl}
          userId={photo.user}
          title={photo.title}
          description={photo.description}
          likeCount={photo.likeCount}
          createdAt={photo.createdAt}
        />
      ))}
    </CardGrid>
  );
}
