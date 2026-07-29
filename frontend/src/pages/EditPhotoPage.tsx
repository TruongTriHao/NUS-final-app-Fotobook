import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { NewForm } from "../components/new/NewForm";
import { Loading } from "../components/ui/Loading";
import { NewTitle } from "../components/ui/NewTitle";
import { photoService } from "../services/photoService";
import type { Photo } from "../types/Photo";
import type { ApiErrorResponse } from "../types/api";

export function EditPhotoPage() {
  const navigate = useNavigate();
  const id = useParams().id as string;
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPhoto = async () => {
      try {
        setLoading(true);
        const {
          data: { content },
        } = await photoService.getPhotoById(id);
        if (isMounted) {
          setPhoto(content);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as ApiErrorResponse).message || "Failed to fetch photo.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchPhoto();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!photo) {
    void navigate("/not-found", { replace: true });
    return null;
  }

  return (
    <>
      <NewTitle>Edit Photo</NewTitle>
      <NewForm type="photos" initial={photo} editMode />
    </>
  );
}
