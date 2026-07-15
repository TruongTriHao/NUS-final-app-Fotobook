export function ProfileTabButtons({
  amount,
  label,
  active,
  onClick,
}: {
  amount: number;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const activeStyle = "text-indigo-800 text-xs md:text-lg font-bold p-1 md:p-2";
  const inactiveStyle =
    "text-zinc-500 text-xs md:text-lg p-1 md:p-2 hover:opacity-70 cursor-pointer";

  return (
    <button className={active ? activeStyle : inactiveStyle} onClick={onClick}>
      {amount} {label}
    </button>
  );
}
