import { LoaderCircle } from "lucide-react";

export function Loading() {
  return (
    <LoaderCircle
      className="animate-spin m-auto size-7.5 md:size-15 my-1.75 md:my-3.5"
      color="#a8a29e"
    />
  );
}
