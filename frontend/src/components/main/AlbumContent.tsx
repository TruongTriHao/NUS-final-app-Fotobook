import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { albumService } from "../../services/albumService";
import type { AlbumWithUser } from "../../types/Album";
import { Alert } from "../ui/Alert";
import { Loading } from "../ui/Loading";
import { AlbumCard } from "./AlbumCard";
import { CardGrid } from "./CardGrid";

export function AlbumContent({ type }: { type: "feeds" | "discover" }) {
  const { user: currentUser } = useAuth();
  const [albums, setAlbums] = useState<AlbumWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await albumService.getAlbumsForMain(
          type,
          currentUser?.id ?? "",
        );
        if (isMounted) {
          setAlbums(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Error fetching albums");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchAlbums();

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

  if (albums.length === 0) {
    return <div>No albums found.</div>;
  }

  return (
    <CardGrid>
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </CardGrid>
  );
}
