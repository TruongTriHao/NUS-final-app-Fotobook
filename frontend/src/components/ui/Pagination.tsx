import { cn } from "../../utils/cn";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  return (
    <nav className={cn("flex items-center justify-center", className)}>
      <button
        onClick={() => {
          onPageChange(currentPage - 1);
        }}
        disabled={currentPage <= 1}
        className="text-indigo-800 text-sm md:text-base rounded-sm hover:opacity-70 active:opacity-50 border-2 border-gray-100 shadow-lg p-1.25 md:p-2.5 disabled:text-stone-300 disabled:pointer-events-none"
      >
        Previous
      </button>
      <div className="text-indigo-800 text-sm md:text-base border-2 border-gray-100 shadow-lg rounded-sm p-1.25 md:p-2.5">{`Page ${currentPage.toString()} of ${totalPages.toString()}`}</div>
      <button
        onClick={() => {
          onPageChange(currentPage + 1);
        }}
        disabled={currentPage >= totalPages}
        className="text-indigo-800 text-sm md:text-base rounded-sm hover:opacity-70 active:opacity-50 border-2 border-gray-100 shadow-lg p-1.25 md:p-2.5 disabled:text-stone-300 disabled:pointer-events-none"
      >
        Next
      </button>
    </nav>
  );
}
