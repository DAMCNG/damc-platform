export function albumCoverUrls(item: { photos: { url: string }[] }): string[] {
  return item.photos.length > 0 ? item.photos.map((p) => p.url) : ["/placeholders/gallery-photo.svg"];
}
