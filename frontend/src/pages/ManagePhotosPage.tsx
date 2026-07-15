import { useEffect, useState } from "react";
import { AdminPhotoCard } from "../components/admin/AdminPhotoCard";
import { Alert } from "../components/ui/Alert";
import { Loading } from "../components/ui/Loading";
import { Pagination } from "../components/ui/Pagination";
import { photoService } from "../services/photoService";
import type { Photo as PhotoType } from "../types/Photo";

export function ManagePhotosPage() {
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 40;

  useEffect(() => {
    let isMounted = true;
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, totalItems] = await Promise.all([
          photoService.getAllPhotos(currentPage, ITEMS_PER_PAGE),
          photoService.getAllCount(),
        ]);
        if (isMounted) {
          setPhotos(data);
          setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Error fetching photos");
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

  if (error) {
    return <Alert message={error} />;
  }

  if (photos.length === 0) {
    return <div>No photos found.</div>;
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
