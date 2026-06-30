import { useAuth } from "../../hooks/useAuth";

export function Logo() {
  const { user } = useAuth();

  return (
    <div className="text-white font-bold text-right text-xs md:text-xl p-2">
      {`Fotobook${user?.role === "admin" ? " Admin" : ""}`}
    </div>
  );
}
