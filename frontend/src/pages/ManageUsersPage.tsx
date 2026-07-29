import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserTable } from "../components/admin/UserTable";
import { Loading } from "../components/ui/Loading";
import { NotFoundMessage } from "../components/ui/NotFoundMessage";
import { Pagination } from "../components/ui/Pagination";
import { userService } from "../services/userService";
import type { ApiErrorResponse } from "../types/api";
import type { AdminUserData } from "../types/User";

export function ManageUsersPage() {
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 40;
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteUser = async (id: string) => {
    try {
      setDeleteLoading(true);
      const { message } = await userService.deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "Failed to delete user. Please try again.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const {
          data: { users, total },
          message,
        } = await userService.getUsers(currentPage, ITEMS_PER_PAGE);
        if (isMounted) {
          setUsers(users);
          setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
          toast.success(message);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as ApiErrorResponse).message ||
              "Failed to fetch users. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  if (loading) {
    return <Loading />;
  }

  if (users.length === 0) {
    return <NotFoundMessage itemType="users" />;
  }

  return (
    <div className="overflow-auto">
      <UserTable
        users={users}
        onDelete={(id: string) => void handleDeleteUser(id)}
        deleteLoading={deleteLoading}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="my-3.75 md:my-7.5"
      />
    </div>
  );
}
