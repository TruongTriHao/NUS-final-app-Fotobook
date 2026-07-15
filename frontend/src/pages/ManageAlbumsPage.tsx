import { useEffect, useState } from "react";
import { AdminAlbumCard } from "../components/admin/AdminAlbumCard";
import { Alert } from "../components/ui/Alert";
import { Loading } from "../components/ui/Loading";
import { Pagination } from "../components/ui/Pagination";
import { albumService } from "../services/albumService";
import type { Album as AlbumType } from "../types/Album";

export function ManageAlbumsPage() {
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 40;

  useEffect(() => {
    let isMounted = true;
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, totalItems] = await Promise.all([
          albumService.getAllAlbums(currentPage, ITEMS_PER_PAGE),
          albumService.getAllCount(),
        ]);
        if (isMounted) {
          setAlbums(data);
          setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
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
  }, [currentPage]);

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mx-2 md:mx-4">
        {albums.map((album) => (
          <AdminAlbumCard key={album.id} album={album} />
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
