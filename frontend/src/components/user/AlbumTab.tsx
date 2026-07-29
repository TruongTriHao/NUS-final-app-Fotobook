import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { albumService } from "../../services/albumService";
import type { Album as AlbumType } from "../../types/Album";
import type { ApiErrorResponse } from "../../types/api";
import { Loading } from "../ui/Loading";
import { NotFoundMessage } from "../ui/NotFoundMessage";
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

  useEffect(() => {
    let isMounted = true;
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const {
          data: { albums },
          message,
        } = await albumService.getAlbumsByUserId(id);
        if (isMounted) {
          setAlbums(albums);
          toast.success(message);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as ApiErrorResponse).message || "Failed to fetch albums.",
          );
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

  if (albums.length === 0) {
    return (
      <>
        {isCurrentUser && (
          <AddButton
            text="Add Album"
            onClick={() => void navigate("/albums/new")}
          />
        )}
        <NotFoundMessage itemType="albums" />
      </>
    );
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
