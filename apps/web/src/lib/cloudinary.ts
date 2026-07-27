/**
 * Cloudinary serves images at whatever resolution they were uploaded at unless
 * asked to transform them. Inserting a transform segment right after `/upload/`
 * gets an auto-format (WebP/AVIF), auto-quality, capped-width variant generated
 * and cached by Cloudinary on first request — the original upload is untouched.
 * Non-Cloudinary URLs (local placeholders, YouTube thumbnails, anything else)
 * pass through unchanged.
 */
export function optimizedImageUrl(url: string, width: number): string {
  if (!url.includes("res.cloudinary.com/") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}
