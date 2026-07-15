import type { User } from "../../types/User";
import { formatDatetime } from "../../utils/formatDatetime";
import { DeleteButton } from "../ui/DeleteButton";
import { EditButton } from "../ui/EditButton";

export function UserTable({ users }: { users: User[] }) {
  return (
    <div className="mx-2.25 md:mx-4.5 my-2.5 md:my-5">
      <table className="w-full border-separate border-spacing-x-5 md:border-spacing-x-0">
        <thead className="border-b-2 border-gray-200 text-left">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Last login</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>
                {user.lastLogin ? formatDatetime(user.lastLogin) : "Never"}
              </td>
              <td>
                <EditButton
                  text="Edit"
                  to={`/admin/users/${user.id}/edit`}
                  className="static bg-green-600 px-1.25 mx-0.375 md:mx-0.75 md:px-2.5 py-1 md:py-2 rounded-sm hover:opacity-70 active:opacity-50 md:text-base"
                />
                <DeleteButton className="mx-0.375 md:mx-0.75 my-0.375 md:my-0.75" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
