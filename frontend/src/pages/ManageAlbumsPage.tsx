import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminAlbumCard } from "../components/admin/AdminAlbumCard";
import { Loading } from "../components/ui/Loading";
import { NotFoundMessage } from "../components/ui/NotFoundMessage";
import { Pagination } from "../components/ui/Pagination";
import { albumService } from "../services/albumService";
import type { Album as AlbumType } from "../types/Album";
import type { ApiErrorResponse } from "../types/api";

export function ManageAlbumsPage() {
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 40;

  useEffect(() => {
    let isMounted = true;
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const {
          data: { albums, total },
        } = await albumService.getAlbums(currentPage, ITEMS_PER_PAGE);
        if (isMounted) {
          setAlbums(albums);
          setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
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
  }, [currentPage]);

  if (loading) {
    return <Loading />;
  }

  if (albums.length === 0) {
    return <NotFoundMessage itemType="albums" />;
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
