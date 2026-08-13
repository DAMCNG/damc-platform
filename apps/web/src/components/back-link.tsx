"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@damc/ui";

/**
 * A styled-like-a-Link "back" control. When `canGoBack` is true (we know the
 * user arrived here via an internal link, see the `from` query param on the
 * member profile page), it uses real browser back navigation so the
 * previous page's scroll position is restored - a plain <Link> to a fixed
 * href is a fresh navigation and always lands at the top. Falls back to a
 * normal Link when we can't be sure there's a same-session page to return
 * to (direct visits, shared links).
 */
export function BackLink({ href, label, canGoBack }: { href: string; label: string; canGoBack: boolean }) {
  const router = useRouter();
  const className = buttonVariants({ variant: "ghost", size: "sm" });

  if (canGoBack) {
    return (
      <button type="button" onClick={() => router.back()} className={className}>
        <ArrowLeft size={16} className="mr-1.5" /> {label}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      <ArrowLeft size={16} className="mr-1.5" /> {label}
    </Link>
  );
}
