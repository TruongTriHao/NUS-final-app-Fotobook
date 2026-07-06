import { NavLink } from "react-router-dom";

export function Sidebar({ type }: { type: "user" | "admin" }) {
  const activeStyle = "text-indigo-800 font-bold text-xs md:text-base";
  const inactiveStyle =
    "text-neutral-400 font-bold text-xs md:text-base hover:opacity-70";

  return (
    <div className="flex flex-col fixed top-12 w-[15%] h-screen">
      <div className="flex flex-col gap-2 mt-10 m-auto">
        {type === "user" ? (
          <>
            <NavLink
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
              to="/feeds"
            >
              Feeds
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
              to="/discover"
            >
              Discover
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
              to="/admin/photos"
            >
              Manage Photos
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
              to="/admin/albums"
            >
              Manage Albums
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
              to="/admin/users"
            >
              Manage Users
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}
