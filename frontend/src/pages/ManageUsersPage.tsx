import { useEffect, useState } from "react";
import { UserTable } from "../components/admin/UserTable";
import { Alert } from "../components/ui/Alert";
import { Loading } from "../components/ui/Loading";
import { Pagination } from "../components/ui/Pagination";
import { userService } from "../services/userService";
import type { User } from "../types/User";

export function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 40;

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, totalItems] = await Promise.all([
          userService.getAllUsers(currentPage, ITEMS_PER_PAGE),
          userService.getAllCount(),
        ]);
        if (isMounted) {
          setUsers(data);
          setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Error fetching users");
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

  if (error) {
    return <Alert message={error} />;
  }

  if (users.length === 0) {
    return <div>No users found.</div>;
  }

  return (
    <div className="overflow-auto">
      <UserTable users={users} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="my-3.75 md:my-7.5"
      />
    </div>
  );
}
