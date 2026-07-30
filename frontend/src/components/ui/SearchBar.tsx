import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const value = search.trim();
    void navigate({
      pathname: location.pathname === "/feeds" ? "/feeds" : "/discover",
      search: value ? `?search=${encodeURIComponent(value)}` : "",
    });
  };

  return (
    <input
      className="bg-white text-black placeholder:text-stone-300 text-xs md:text-base px-2.5 md:px-5 py-1.5 rounded-xs w-42.5 md:w-85"
      type="search"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
      }}
      onKeyDown={handleKeyDown}
      placeholder="Search Photo / Album"
    />
  );
}
