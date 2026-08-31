export function albumCoverUrls(item: { photos: { url: string }[] }): string[] {
  return item.photos.length > 0 ? item.photos.map((p) => p.url) : ["/placeholders/gallery-photo.svg"];
}

// Per-card start delay (ms) for AlbumCoverSlideshow so a grid/row of covers
// cascades one after another instead of every card flipping in lockstep.
// Wraps every 10 cards so far-down items don't queue up an ever-growing wait.
export function staggerDelay(index: number): number {
  return (index % 10) * 300;
}
