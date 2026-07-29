import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { NewForm } from "../components/new/NewForm";
import { Loading } from "../components/ui/Loading";
import { NewTitle } from "../components/ui/NewTitle";
import { albumService } from "../services/albumService";
import type { Album } from "../types/Album";
import type { ApiErrorResponse } from "../types/api";

export function EditAlbumPage() {
  const navigate = useNavigate();
  const id = useParams().id as string;
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const {
          data: { content },
        } = await albumService.getAlbumById(id);
        if (isMounted) {
          setAlbum(content);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as ApiErrorResponse).message || "Failed to fetch album.",
          );
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

  if (!album) {
    void navigate("/not-found", { replace: true });
    return null;
  }

  return (
    <>
      <NewTitle>Edit Album</NewTitle>
      <NewForm type="albums" initial={album} editMode />
    </>
  );
}
