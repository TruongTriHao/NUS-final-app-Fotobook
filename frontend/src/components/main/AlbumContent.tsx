import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { albumService } from "../../services/albumService";
import type { AlbumWithOwner } from "../../types/Album";
import type { ApiErrorResponse } from "../../types/api";
import { Loading } from "../ui/Loading";
import { NotFoundMessage } from "../ui/NotFoundMessage";
import { AlbumCard } from "./AlbumCard";
import { CardGrid } from "./CardGrid";

export function AlbumContent({ type }: { type: "feed" | "discover" }) {
  const [albums, setAlbums] = useState<AlbumWithOwner[]>([]);
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

  const fetchAlbums = useCallback(
    async (cursorToUse: string | null) => {
      if (loadingRef.current || (cursorToUse !== null && !hasMoreRef.current))
        return;
      try {
        setLoading(true);
        loadingRef.current = true;
        const {
          data: { albums, nextCursor },
        } = await albumService.getAlbumsForMain(
          type,
          cursorToUse,
          LIMIT,
          search,
        );
        setAlbums((prevAlbums) =>
          cursorToUse ? [...prevAlbums, ...albums] : albums,
        );
        setCursor(nextCursor);
        setHasMore(nextCursor !== null);
      } catch (error) {
        toast.error(
          (error as ApiErrorResponse).message || "Failed to fetch albums.",
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
        setAlbums([]);
        setCursor(null);
        setHasMore(true);
        hasMoreRef.current = true;
        void fetchAlbums(null);
      }
    };
    void triggerInitialFetch();
    return () => {
      isMounted = false;
    };
  }, [fetchAlbums]);

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
          void fetchAlbums(cursor);
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
  }, [cursor, fetchAlbums]);

  const handleFollowChange = useCallback(
    (userId: string, isFollowee: boolean) => {
      setAlbums((prevAlbums) =>
        prevAlbums.map((album) =>
          album.ownerId === userId
            ? { ...album, owner: { ...album.owner, isFollowee } }
            : album,
        ),
      );
    },
    [],
  );

  if (!loading && albums.length === 0) {
    return <NotFoundMessage itemType="albums" />;
  }

  return (
    <>
      <CardGrid>
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
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
