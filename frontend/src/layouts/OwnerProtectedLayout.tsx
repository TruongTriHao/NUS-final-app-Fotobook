import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loading } from "../components/ui/Loading";
import { useAuth } from "../hooks/useAuth";
import { albumService } from "../services/albumService";
import { photoService } from "../services/photoService";
import type { Album } from "../types/Album";
import type { Photo } from "../types/Photo";
import type { ApiErrorResponse } from "../types/api";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchContent = async () => {
      try {
        setLoading(true);
        const {
          data: { content },
        } =
          type === "photo"
            ? await photoService.getPhotoById(id)
            : await albumService.getAlbumById(id);
        if (isMounted) {
          setContent(content);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as ApiErrorResponse).message || "Failed to fetch content.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchContent();

    return () => {
      isMounted = false;
    };
  }, [id, type]);

  if (loading) {
    return <Loading />;
  }

  if (!content || (content.ownerId !== user?.id && user?.role !== "admin")) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
}
