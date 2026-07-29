import { Heart } from "lucide-react";
import { formatDatetime } from "../../utils/formatDatetime";

export function CardFooter({
  likeCount,
  createdAt,
  onClick,
  liked,
  disabled,
}: {
  likeCount: number;
  createdAt: string;
  onClick?: () => void;
  liked?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-between mt-2">
      <div className="flex items-center">
        <button
          disabled={disabled}
          onClick={onClick}
          className="cursor-pointer"
        >
          <Heart
            size={16}
            color={liked ? "#432dd7" : "#e5e5e5"}
            fill={liked ? "#432dd7" : "#e5e5e5"}
            strokeWidth={1}
          />
        </button>
        <div className="text-slate-300 text-xs md:text-sm">{likeCount}</div>
      </div>
      <div className="text-zinc-300 text-xs md:text-sm">
        {formatDatetime(createdAt)}
      </div>
    </div>
  );
}
