import { LucideSearchX } from "lucide-react";

export function NotFoundMessage({ itemType = "items" }: { itemType?: string }) {
  return (
    <div className="flex flex-col items-center justify-center mb-2 md:mb-4">
      <LucideSearchX />
      <div className="text-xs md:text-base font-bold capitalize">
        No {itemType} found
      </div>
    </div>
  );
}
