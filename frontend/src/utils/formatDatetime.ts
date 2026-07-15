export function formatDatetime(datetime: string): string {
  return new Date(datetime).toLocaleDateString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}
