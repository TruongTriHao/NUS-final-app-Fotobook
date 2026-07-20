export function AddButton({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="self-end bg-green-600 text-emerald-100 border-2 rounded-full hover:opacity-70 active:opacity-50 text-xs md:text-base font-bold px-1.25 md:px-2.5 py-1 md:py-2 m-1.5 md:m-3 cursor-pointer"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
