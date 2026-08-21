"use client";

import * as React from "react";
import { Eye, Heart } from "lucide-react";
import { cn } from "@damc/ui";

const LIKED_STORAGE_KEY = "damc-liked-albums";

function readLikedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LIKED_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function GalleryEngagement({
  id,
  initialViews,
  initialLikes,
}: {
  id: string;
  initialViews: number;
  initialLikes: number;
}) {
  const [views, setViews] = React.useState(initialViews);
  const [likes, setLikes] = React.useState(initialLikes);
  const [liked, setLiked] = React.useState(false);
  const pinged = React.useRef(false);

  React.useEffect(() => {
    setLiked(readLikedIds().includes(id));

    if (pinged.current) return;
    pinged.current = true;
    fetch(`/api/gallery/${id}/view`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.views === "number") setViews(data.views);
      })
      .catch(() => {});
  }, [id]);

  async function toggleLike() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((n) => n + (nextLiked ? 1 : -1));

    const current = readLikedIds();
    const next = nextLiked ? [...current, id] : current.filter((s) => s !== id);
    localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(next));

    try {
      const res = await fetch(`/api/gallery/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextLiked ? "like" : "unlike" }),
      });
      const data = await res.json();
      if (typeof data.likes === "number") setLikes(data.likes);
    } catch {
      setLiked(!nextLiked);
      setLikes((n) => n - (nextLiked ? 1 : -1));
    }
  }

  return (
    <div className="flex items-center gap-5 text-sm text-bronze dark:text-parchment/60">
      <span className="flex items-center gap-1.5">
        <Eye size={16} /> {views.toLocaleString()} views
      </span>
      <button
        onClick={toggleLike}
        className={cn(
          "flex items-center gap-1.5 transition-colors",
          liked ? "text-gold-deep dark:text-gold-bright" : "hover:text-gold-deep dark:hover:text-gold-bright"
        )}
        aria-pressed={liked}
      >
        <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likes.toLocaleString()}
      </button>
    </div>
  );
}
