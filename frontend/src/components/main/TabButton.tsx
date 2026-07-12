export function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const activeStyle =
    "text-white bg-indigo-800 font-bold border-2 border-indigo-800 rounded-xs p-2 text-xs md:text-base";
  const inactiveStyle =
    "text-indigo-800 bg-white font-bold border-2 border-indigo-800 rounded-xs p-2 text-xs md:text-base hover:opacity-70 cursor-pointer";

  return (
    <button className={active ? activeStyle : inactiveStyle} onClick={onClick}>
      {label}
    </button>
  );
}
