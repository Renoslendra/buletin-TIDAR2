"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, FileClock, FileText, Home, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/schedules", label: "Jadwal", icon: CalendarDays },
  { href: "/schedules/new", label: "Upload", icon: UploadCloud },
  { href: "/bulletins/new", label: "Buletin", icon: FileText },
  { href: "/history", label: "Riwayat", icon: FileClock },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-lg backdrop-blur-xl lg:hidden">
      <nav className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium leading-none transition-all duration-300",
                isActive
                  ? "text-primary-light"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 rounded-xl border border-white/10 bg-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon
                className={cn(
                  "relative z-10 h-5 w-5 transition-transform duration-300",
                  isActive && "-translate-y-0.5 scale-110"
                )}
              />
              <span className="relative z-10 max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
