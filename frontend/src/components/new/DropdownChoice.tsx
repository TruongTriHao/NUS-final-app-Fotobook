export function DropdownChoice({
  id,
  name,
  initial,
}: {
  id?: string;
  name?: string;
  initial?: "public" | "private";
}) {
  return (
    <select
      id={id}
      name={name}
      className="font-bold mx-2 md:mx-4 px-1.25 md:px-2.5 py-1 md:py-2 self-start border-2 border-neutral-200 rounded-sm text-xs md:text-base"
      defaultValue={initial}
    >
      <option value="public">Public</option>
      <option value="private">Private</option>
    </select>
  );
}
