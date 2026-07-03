import { getCurrentUser } from "@/lib/auth/current-user";
import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoutButton } from "@/components/layout/logout-button";

export async function Topbar() {
  const user = await getCurrentUser().catch(() => null);

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <BrandLogo
          size={34}
          className="min-w-0 lg:hidden"
          imageClassName="h-8 w-8 rounded-lg border border-white/10"
          textClassName="truncate text-sm font-bold text-on-surface"
        />
        <div className="hidden min-w-0 items-center gap-3 lg:flex">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
              <span className="text-sm font-bold text-primary-light">
                {(user?.name ?? "A")[0].toUpperCase()}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-on-surface">
              {user?.name ?? "Admin"}
            </div>
            <div className="truncate text-xs text-on-surface-variant">
              {user?.email ?? "SabatFlow"}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-primary-light lg:hidden">
            {(user?.name ?? "A")[0].toUpperCase()}
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
