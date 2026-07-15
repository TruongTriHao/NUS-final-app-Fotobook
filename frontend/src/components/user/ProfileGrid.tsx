export function ProfileGrid({ children }: { children?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 justify-items-center">
      {children}
    </div>
  );
}
