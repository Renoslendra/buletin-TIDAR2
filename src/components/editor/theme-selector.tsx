"use client";

import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { BULLETIN_THEMES } from "@/lib/themes/bulletin-themes";
import type { BulletinTheme } from "@/types/bulletin";

export function ThemeSelector({
  value,
  onChange,
}: {
  value: BulletinTheme;
  onChange: (theme: BulletinTheme) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-primary-light" />
        <h2 className="font-bold text-on-surface">Tema Buletin</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {BULLETIN_THEMES.map((theme) => {
          const isActive = value === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              className={cn(
                "group relative flex flex-col gap-2 rounded-xl border-2 p-3 text-left transition-all duration-200",
                isActive
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                  : "border-outline bg-surface-dim hover:border-outline-variant hover:bg-surface-bright",
              )}
            >
              {/* Color preview bars */}
              <div className="flex gap-1.5">
                <div
                  className="h-8 flex-1 rounded-md shadow-sm"
                  style={{ background: theme.previewColors.primary }}
                />
                <div
                  className="h-8 flex-1 rounded-md shadow-sm"
                  style={{ background: theme.previewColors.secondary }}
                />
                <div
                  className="h-8 w-5 rounded-md shadow-sm"
                  style={{ background: theme.previewColors.accent }}
                />
              </div>

              {/* Mini layout preview */}
              <div className="flex flex-col gap-0.5 rounded-md border border-outline/50 bg-white p-1.5">
                {/* Mini header line */}
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-5 rounded-sm bg-gray-300" />
                  <div
                    className="h-1.5 flex-1 rounded-sm"
                    style={{ background: theme.previewColors.primary }}
                  />
                </div>
                {/* Mini section bar */}
                <div
                  className="mt-0.5 h-2 w-full rounded-sm"
                  style={{ background: theme.previewColors.primary === "#111111" ? "#e7e7e7" : theme.previewColors.primary }}
                />
                {/* Mini rows */}
                <div className="flex items-center gap-1">
                  <div
                    className="h-1 w-8 rounded-sm"
                    style={{ background: theme.previewColors.primary, opacity: 0.5 }}
                  />
                  <div className="h-1 w-0.5 rounded-full bg-gray-300" />
                  <div
                    className="h-1 flex-1 rounded-sm"
                    style={{ background: theme.previewColors.accent, opacity: 0.4 }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="h-1 w-6 rounded-sm"
                    style={{ background: theme.previewColors.primary, opacity: 0.5 }}
                  />
                  <div className="h-1 w-0.5 rounded-full bg-gray-300" />
                  <div
                    className="h-1 flex-1 rounded-sm"
                    style={{ background: theme.previewColors.accent, opacity: 0.4 }}
                  />
                </div>
              </div>

              {/* Theme name */}
              <div>
                <span
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    isActive ? "text-primary-light" : "text-on-surface-variant",
                  )}
                >
                  {theme.name}
                </span>
                <p className="mt-0.5 text-[10px] leading-tight text-on-surface-variant">
                  {theme.description}
                </p>
              </div>

              {/* Active checkmark */}
              {isActive && (
                <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-md">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
