export function NewTitle({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <div className="font-bold m-2.25 md:m-4.5 text-xs md:text-base">
        {children}
      </div>
      <hr className="mx-2.25 md:mx-4.5" />
    </>
  );
}
