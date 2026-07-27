export function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return match ? match[1]! : null;
}

export function youtubeThumbnailUrl(url: string, size: "hqdefault" | "mqdefault" | "default" = "hqdefault") {
  const videoId = extractYouTubeId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/${size}.jpg` : null;
}
