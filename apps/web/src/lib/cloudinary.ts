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

/**
 * Same as optimizedImageUrl, but pre-crops server-side to a square with
 * Cloudinary's subject/face-aware gravity, instead of leaving the crop to the
 * browser's CSS object-cover (a dumb center-crop that can cut off the top of
 * a portrait photo when it's forced into a square or shorter box). Use for
 * member avatar-style photos; not for full images like post/gallery photos
 * that should show uncropped.
 */
export function squareAvatarUrl(url: string, size: number): string {
  if (!url.includes("res.cloudinary.com/") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_fill,g_auto,ar_1:1,w_${size}/`);
}
