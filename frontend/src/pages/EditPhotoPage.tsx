import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NewForm } from "../components/new/NewForm";
import { Alert } from "../components/ui/Alert";
import { Loading } from "../components/ui/Loading";
import { NewTitle } from "../components/ui/NewTitle";
import { PhotoInput } from "../components/ui/PhotoInput";
import { photoService } from "../services/photoService";
import type { Photo } from "../types/Photo";

export function EditPhotoPage() {
  const id = useParams().id as string;
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPhoto = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await photoService.getPhotoById(id);
        if (isMounted) {
          setPhoto(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Error fetching photo");
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

  if (error) {
    return <Alert message={error} />;
  }

  if (!photo) {
    return <Alert message="Photo not found." />;
  }

  return (
    <>
      <NewTitle>Edit Photo</NewTitle>
      <NewForm type="photo" initial={photo} editMode>
        <PhotoInput initial={photo.imageUrl} name="photo" />
      </NewForm>
    </>
  );
}
