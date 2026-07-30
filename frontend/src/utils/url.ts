export function getPublicIdFromCloudinarySignedUrl(url: string): string {
  const pathname = new URL(url).pathname;
  const marker = "/v1/";
  const index = pathname.indexOf(marker);
  // For demonstration purposes, uncomment to throw error in production
  if (index === -1) {
    // if (import.meta.env.PROD) {
    //   throw new Error("Invalid Cloudinary signed URL.");
    // }
    return url;
  }
  return decodeURIComponent(pathname.slice(index + marker.length));
}
