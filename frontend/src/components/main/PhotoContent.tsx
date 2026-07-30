import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { photoService } from "../../services/photoService";
import type { ApiErrorResponse } from "../../types/api";
import type { PhotoWithOwner } from "../../types/Photo";
import { Loading } from "../ui/Loading";
import { NotFoundMessage } from "../ui/NotFoundMessage";
import { CardGrid } from "./CardGrid";
import { PhotoCard } from "./PhotoCard";

export function PhotoContent({ type }: { type: "feed" | "discover" }) {
  const [photos, setPhotos] = useState<PhotoWithOwner[]>([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const LIMIT = 20;

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const fetchPhotos = useCallback(
    async (cursorToUse: string | null) => {
      if (loadingRef.current || (cursorToUse !== null && !hasMoreRef.current))
        return;

      try {
        setLoading(true);
        loadingRef.current = true;
        const {
          data: { photos, nextCursor },
        } = await photoService.getPhotosForMain(
          type,
          cursorToUse,
          LIMIT,
          search,
        );
        setPhotos((prevPhotos) =>
          cursorToUse ? [...prevPhotos, ...photos] : photos,
        );
        setCursor(nextCursor);
        setHasMore(nextCursor !== null);
      } catch (error) {
        toast.error(
          (error as ApiErrorResponse).message || "Failed to fetch photos.",
        );
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [search, type],
  );

  useEffect(() => {
    let isMounted = true;
    const triggerInitialFetch = async () => {
      await Promise.resolve();
      if (isMounted) {
        setPhotos([]);
        setCursor(null);
        setHasMore(true);
        hasMoreRef.current = true;
        void fetchPhotos(null);
      }
    };
    void triggerInitialFetch();
    return () => {
      isMounted = false;
    };
  }, [fetchPhotos]);

  useEffect(() => {
    const target = loaderRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !loadingRef.current
        ) {
          void fetchPhotos(cursor);
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [cursor, fetchPhotos]);

  const handleFollowChange = useCallback(
    (userId: string, isFollowee: boolean) => {
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.ownerId === userId
            ? { ...photo, owner: { ...photo.owner, isFollowee } }
            : photo,
        ),
      );
    },
    [],
  );

  if (!loading && photos.length === 0) {
    return <NotFoundMessage itemType="photos" />;
  }

  return (
    <>
      <CardGrid>
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            type={type}
            onFollowChange={handleFollowChange}
          />
        ))}
      </CardGrid>
      {loading && <Loading />}
      {hasMore && !loading && <div ref={loaderRef} className="h-10" />}
    </>
  );
}
