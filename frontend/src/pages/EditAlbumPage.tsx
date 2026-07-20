import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NewForm } from "../components/new/NewForm";
import { AlbumInput } from "../components/ui/AlbumInput";
import { Alert } from "../components/ui/Alert";
import { Loading } from "../components/ui/Loading";
import { NewTitle } from "../components/ui/NewTitle";
import { albumService } from "../services/albumService";
import type { Album } from "../types/Album";

export function EditAlbumPage() {
  const id = useParams().id as string;
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await albumService.getAlbumById(id);
        if (isMounted) {
          setAlbum(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Error fetching album");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchAlbum();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert message={error} />;
  }

  if (!album) {
    return <Alert message="Album not found." />;
  }

  return (
    <>
      <NewTitle>Edit Album</NewTitle>
      <NewForm type="album" initial={album} editMode>
        <AlbumInput initial={album} name="album" />
      </NewForm>
    </>
  );
}
