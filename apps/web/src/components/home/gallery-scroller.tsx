import Link from "next/link";
import { Play, Images } from "lucide-react";
import { AutoScrollRow } from "@damc/ui";
import { AlbumCoverSlideshow } from "@/components/gallery/album-cover-slideshow";
import { albumCoverUrls } from "@/lib/gallery-cover";
import type { AlbumListData } from "@/components/gallery/gallery-grid";

export function GalleryScroller({ albums }: { albums: AlbumListData[] }) {
  if (albums.length === 0) return null;

  return (
    <AutoScrollRow ariaLabel="Recent gallery albums">
      {albums.map((album) => (
        <Link
          key={album.id}
          href={`/gallery/${album.id}`}
          className="group relative block h-48 w-64 flex-shrink-0 overflow-hidden rounded-xl2"
        >
          <AlbumCoverSlideshow photoUrls={albumCoverUrls(album)} alt={album.title} />
          {album.videos.length > 0 && (
            <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/60 text-parchment">
              <Play size={14} fill="currentColor" />
            </span>
          )}
          {album.photos.length > 1 && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-ink/60 px-2 py-1 text-[11px] font-semibold text-parchment">
              <Images size={12} /> {album.photos.length}
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-2.5 text-left text-xs font-medium text-parchment opacity-0 transition-opacity group-hover:opacity-100">
            {album.title}
          </span>
        </Link>
      ))}
    </AutoScrollRow>
  );
}
