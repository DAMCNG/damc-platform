"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { BrandMark, ThemeToggle } from "@damc/ui";
import type { AdminSession } from "@/lib/permissions";
import { SidebarNav } from "./sidebar-nav";
import { signOutAction } from "@/app/(dashboard)/actions";

export function DashboardShell({
  user,
  children,
}: {
  user: AdminSession;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-64 flex-shrink-0 border-r border-ink/8 bg-white p-5 dark:border-parchment/10 dark:bg-ink-soft/20 lg:block">
        <div className="mb-8 flex items-center gap-2.5 px-1 font-display text-lg font-semibold text-ink dark:text-parchment">
          <BrandMark size={28} />
          <span className="text-gold-deep dark:text-gold-bright">DAMC</span> Admin
        </div>
        <SidebarNav user={user} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-white p-5 dark:bg-ink">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink dark:text-parchment">
                <BrandMark size={34} />
                <span className="text-gold-deep dark:text-gold-bright">DAMC</span> Admin
              </div>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-ink dark:text-parchment">
                <X size={20} />
              </button>
            </div>
            <SidebarNav user={user} />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink/8 bg-parchment-paper px-5 py-3 dark:border-parchment/10 dark:bg-ink">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="text-ink dark:text-parchment lg:hidden"
          >
            <Menu size={22} />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right">
              <div className="text-sm font-semibold text-ink dark:text-parchment">{user.name}</div>
              <div className="text-xs text-bronze dark:text-parchment/60">
                {user.role === "SUPER_ADMIN" ? "Super Admin" : "Content Manager"}
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-sm font-semibold text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                aria-label="Sign out"
                className="rounded-full p-2 text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink dark:text-parchment/60 dark:hover:bg-parchment/10 dark:hover:text-parchment"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
