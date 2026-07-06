import { Heart } from "lucide-react";
import { formatDatetime } from "../../utils/formatDatetime";

export function CardFooter({
  likeCount,
  createdAt,
}: {
  likeCount: number;
  createdAt: string;
}) {
  return (
    <div className="flex justify-between mt-2">
      <div className="flex items-center">
        <Heart size={14} color="#3730A3" fill="#3730A3" strokeWidth={1} />
        <div className="text-slate-300 text-xs md:text-sm">{likeCount}</div>
      </div>
      <div className="text-zinc-300 text-xs md:text-sm">
        {formatDatetime(createdAt)}
      </div>
    </div>
  );
}
