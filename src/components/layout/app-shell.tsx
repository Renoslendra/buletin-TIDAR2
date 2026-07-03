import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";

export async function AppShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser().catch(() => null);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary/30">
      {/* Subtle background glow/mesh effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 -top-40 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] sm:h-[600px] sm:w-[600px]" />
        <div className="absolute right-[-140px] top-1/4 h-[320px] w-[320px] rounded-full bg-accent/5 blur-[100px] sm:right-0 sm:h-[400px] sm:w-[400px]" />
      </div>

      <div className="relative z-10 flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Topbar />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:pb-8">
            {children}
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
