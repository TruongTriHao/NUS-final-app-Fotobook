import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminPhotoCard } from "../components/admin/AdminPhotoCard";
import { Loading } from "../components/ui/Loading";
import { NotFoundMessage } from "../components/ui/NotFoundMessage";
import { Pagination } from "../components/ui/Pagination";
import { photoService } from "../services/photoService";
import type { Photo as PhotoType } from "../types/Photo";
import type { ApiErrorResponse } from "../types/api";

export function ManagePhotosPage() {
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 40;

  useEffect(() => {
    let isMounted = true;
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const {
          data: { photos, total },
        } = await photoService.getPhotos(currentPage, ITEMS_PER_PAGE);
        if (isMounted) {
          setPhotos(photos);
          setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as ApiErrorResponse).message || "Failed to fetch photos.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchPhotos();

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  if (loading) {
    return <Loading />;
  }

  if (photos.length === 0) {
    return <NotFoundMessage itemType="photos" />;
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
        {photos.map((photo) => (
          <AdminPhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="my-3.75 md:my-7.5"
      />
    </>
  );
}
