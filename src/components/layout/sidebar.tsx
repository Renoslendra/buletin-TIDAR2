"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  FileClock,
  FileText,
  Home,
  UploadCloud,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/schedules", label: "Jadwal", icon: CalendarDays },
  { href: "/schedules/new", label: "Upload", icon: UploadCloud },
  { href: "/bulletins/new", label: "Buletin Baru", icon: FileText },
  { href: "/history", label: "Riwayat", icon: FileClock },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden min-h-screen w-64 shrink-0 border-r border-white/5 bg-background/50 px-4 py-5 text-on-surface backdrop-blur-xl lg:block relative z-20",
        className,
      )}
    >
      <div className="mb-8 px-2 flex items-center gap-3">
        <BrandLogo
          size={36}
          imageClassName="h-9 w-9 border border-white/10 rounded-xl shadow-glow"
          textClassName="text-lg font-bold tracking-tight bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent"
        />
      </div>
      <div className="mb-6 px-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Menu Utama</div>
      </div>
      <nav className="space-y-1.5 relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300",
                isActive
                  ? "text-primary-light"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className={cn("relative z-10 h-5 w-5 transition-transform duration-300 group-hover:scale-110", isActive && "text-primary-light")} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
