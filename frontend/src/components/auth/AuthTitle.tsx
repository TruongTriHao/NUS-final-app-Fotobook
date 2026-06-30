export function AuthTitle({ children }: { children?: React.ReactNode }) {
  return (
    <div className="font-bold text-2xl md:text-4xl text-indigo-800">
      {children}
    </div>
  );
}
