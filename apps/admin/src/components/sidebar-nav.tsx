"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Home,
  Users,
  Crown,
  Newspaper,
  CalendarClock,
  Trophy,
  Images,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@damc/ui";
import type { AdminSession } from "@/lib/permissions";
import { canManageContent, canSeeEnquiries, isSuperAdmin } from "@/lib/permissions";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

export function SidebarNav({ user }: { user: AdminSession }) {
  const pathname = usePathname();

  const overview: NavItem[] = [{ href: "/", label: "Dashboard", icon: LayoutDashboard }];

  const inbox: NavItem[] = canSeeEnquiries(user)
    ? [{ href: "/enquiries", label: "Enquiries", icon: Inbox }]
    : [];

  const content: NavItem[] = canManageContent(user)
    ? [
        { href: "/content", label: "Site pages", icon: Home },
        { href: "/executives", label: "Executives", icon: Crown },
        { href: "/members", label: "Members", icon: Users },
        { href: "/news", label: "News & blog", icon: Newspaper },
        { href: "/roster", label: "Roster", icon: CalendarClock },
        { href: "/achievements", label: "Achievements", icon: Trophy },
        { href: "/gallery", label: "Gallery", icon: Images },
      ]
    : [];

  const admin: NavItem[] = isSuperAdmin(user)
    ? [{ href: "/team", label: "Team", icon: ShieldCheck }]
    : [];

  const groups = [
    { title: null, items: overview },
    { title: "Inbox", items: inbox },
    { title: "Content", items: content },
    { title: "Administration", items: admin },
  ].filter((g) => g.items.length > 0);

  return (
    <nav className="flex flex-col gap-6">
      {groups.map((group, i) => (
        <div key={i}>
          {group.title && (
            <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-bronze-soft dark:text-parchment/40">
              {group.title}
            </div>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-gold/15 text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright"
                      : "text-ink/70 hover:bg-ink/5 dark:text-parchment/70 dark:hover:bg-parchment/10"
                  )}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
