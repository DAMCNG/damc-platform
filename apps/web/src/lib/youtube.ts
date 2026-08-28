export function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return match ? match[1]! : null;
}

// Shorts are regular videos underneath, but shot vertically (9:16) - worth
// knowing so the embed can use a taller player instead of a 16:9 box that'd
// letterbox it down to a sliver.
export function isYouTubeShort(url: string): boolean {
  return /youtube\.com\/shorts\//.test(url);
}

export function youtubeThumbnailUrl(url: string, size: "hqdefault" | "mqdefault" | "default" = "hqdefault") {
  const videoId = extractYouTubeId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/${size}.jpg` : null;
}
