import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { albumService } from "../../services/albumService";
import type { Album as AlbumType } from "../../types/Album";
import { Alert } from "../ui/Alert";
import { Loading } from "../ui/Loading";
import { AddButton } from "./AddButton";
import { AlbumTabCard } from "./AlbumTabCard";
import { ProfileGrid } from "./ProfileGrid";

export function AlbumTab({
  id,
  isCurrentUser,
}: {
  id: string;
  isCurrentUser: boolean;
}) {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await albumService.getAlbumsByUserId(id, isCurrentUser);
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
  }, [id, isCurrentUser]);

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
    <>
      {isCurrentUser && (
        <AddButton
          text="Add Album"
          onClick={() => void navigate("/albums/new")}
        />
      )}
      <ProfileGrid>
        {albums.map((album) => (
          <AlbumTabCard
            key={album.id}
            album={album}
            isCurrentUser={isCurrentUser}
          />
        ))}
      </ProfileGrid>
    </>
  );
}
