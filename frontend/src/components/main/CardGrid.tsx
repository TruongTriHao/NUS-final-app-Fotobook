export function CardGrid({ children }: { children?: React.ReactNode }) {
  return <div className="grid md:grid-cols-1 lg:grid-cols-2">{children}</div>;
}
