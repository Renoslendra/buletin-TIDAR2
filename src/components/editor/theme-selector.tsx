"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { BULLETIN_THEMES, getThemeConfig } from "@/lib/themes/bulletin-themes";
import type { BulletinTheme } from "@/types/bulletin";

export function ThemeSelector({
  value,
  onChange,
}: {
  value: BulletinTheme;
  onChange: (theme: BulletinTheme) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedTheme = getThemeConfig(value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-primary-light" />
        <h2 className="font-bold text-on-surface">Tema Buletin</h2>
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 rounded-xl border-2 border-outline bg-surface-dim px-4 py-3 text-left hover:border-primary/60 hover:bg-surface-bright transition-all shadow-sm group"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Color Preview Badge */}
          <div className="flex gap-1 shrink-0 rounded-md p-1 bg-white/10 border border-white/15">
            <div
              className="h-5 w-4 rounded-sm"
              style={{ background: selectedTheme.previewColors.primary }}
            />
            <div
              className="h-5 w-4 rounded-sm"
              style={{ background: selectedTheme.previewColors.secondary }}
            />
            <div
              className="h-5 w-3 rounded-sm"
              style={{ background: selectedTheme.previewColors.accent }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-on-surface uppercase tracking-wider">
                {selectedTheme.name}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant truncate">
              {selectedTheme.description}
            </p>
          </div>
        </div>

        <ChevronDown
          className={cn(
            "h-5 w-5 text-on-surface-variant transition-transform duration-200 shrink-0",
            isOpen && "rotate-180 text-primary-light",
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-80 overflow-y-auto rounded-2xl border-2 border-border bg-[#141418] p-2 shadow-2xl backdrop-blur-xl space-y-1">
          {BULLETIN_THEMES.map((theme) => {
            const isActive = value === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  onChange(theme.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition-all",
                  isActive
                    ? "bg-primary/20 border border-primary/50 text-on-surface"
                    : "hover:bg-surface-bright text-on-surface-variant hover:text-on-surface",
                )}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Color preview bars */}
                  <div className="flex gap-1 shrink-0 rounded-md p-0.5 bg-white/5 border border-white/10">
                    <div
                      className="h-5 w-4 rounded-sm"
                      style={{ background: theme.previewColors.primary }}
                    />
                    <div
                      className="h-5 w-4 rounded-sm"
                      style={{ background: theme.previewColors.secondary }}
                    />
                    <div
                      className="h-5 w-3 rounded-sm"
                      style={{ background: theme.previewColors.accent }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs uppercase tracking-wider text-on-surface">
                      {theme.name}
                    </div>
                    <p className="text-[11px] text-on-surface-variant/80 truncate">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <Check className="h-4 w-4 text-primary-light shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
