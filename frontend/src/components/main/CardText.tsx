export function CardText({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col overflow-auto mt-2">
      <div className="font-bold text-xs md:text-sm">{title}</div>
      <div className="mt-2 text-xs md:text-sm">{description}</div>
    </div>
  );
}
