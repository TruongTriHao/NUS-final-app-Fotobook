import { X } from "lucide-react";
import { useState } from "react";

export function Alert({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  return visible ? (
    <div className="relative bg-red-50 border border-red-200 text-red-800 rounded shadow-lg text-xs md:text-base px-3 md:px-6 py-0.5 md:py-1 my-0.5 md:my-1 ">
      {message}
      <X
        className="absolute top-0.5 md:top-1 right-0 cursor-pointer size-3 md:size-6"
        onClick={() => {
          setVisible(false);
        }}
      />
    </div>
  ) : null;
}
