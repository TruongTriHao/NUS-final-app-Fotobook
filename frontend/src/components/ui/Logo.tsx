export function Logo({ isAdmin }: { isAdmin?: boolean }) {
  return (
    <div className="text-white font-bold text-right text-xs md:text-xl p-2">
      {`Fotobook${isAdmin ? " Admin" : ""}`}
    </div>
  );
}
