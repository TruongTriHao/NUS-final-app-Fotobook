import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { albumService } from "../services/albumService";
import { photoService } from "../services/photoService";
import type { Album } from "../types/Album";
import type { Photo } from "../types/Photo";

export function OwnerProtectedLayout({
  type,
  children,
}: {
  type: "album" | "photo";
  children?: React.ReactNode;
}) {
  const { user } = useAuth();
  const id = useParams().id as string;
  const [content, setContent] = useState<Photo | Album | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchContent = async () => {
      try {
        setError(null);
        const data =
          type === "photo"
            ? await photoService.getPhotoById(id)
            : await albumService.getAlbumById(id);
        if (isMounted) {
          setContent(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Error fetching content");
        }
      }
    };

    void fetchContent();

    return () => {
      isMounted = false;
    };
  }, [id, type]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!content || (content.user !== user?.id && user?.role !== "admin")) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
}
