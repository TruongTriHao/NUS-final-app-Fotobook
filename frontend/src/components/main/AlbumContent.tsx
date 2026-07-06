import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { albumService } from "../../services/albumService";
import type { Album } from "../../types/Album";
import { AlbumCard } from "./AlbumCard";
import { CardGrid } from "./CardGrid";

export function AlbumContent({ type }: { type: "feeds" | "discover" }) {
  const { user: currentUser } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await albumService.getAlbums(type, currentUser?.id ?? "");
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (albums.length === 0) {
    return <div>No albums found.</div>;
  }

  return (
    <CardGrid>
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          src={[album.images[0], album.images[1], album.images[2]]}
          userId={album.user}
          title={album.title}
          description={album.description}
          likeCount={album.likeCount}
          createdAt={album.createdAt}
        />
      ))}
    </CardGrid>
  );
}
