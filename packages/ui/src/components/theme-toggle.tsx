"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "../lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));

    // ThemeScript only checks the OS preference once, at initial page load.
    // If the user hasn't made an explicit choice (no stored override), keep
    // following the OS setting live - e.g. Windows/Android switching to dark
    // mode on a schedule while the site is already open in a tab.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function handleChange(e: MediaQueryListEvent) {
      if (localStorage.getItem("damc-theme")) return;
      setIsDark(e.matches);
      document.documentElement.classList.toggle("dark", e.matches);
    }
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("damc-theme", next ? "dark" : "light");
  }

  if (!mounted) {
    return <div className={cn("h-9 w-9", className)} aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 dark:text-parchment dark:hover:bg-parchment/10",
        className
      )}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
