"use client";

import { Check, Type, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { BULLETIN_FONTS } from "@/lib/themes/bulletin-fonts";
import type { BulletinFontFamily, BulletinFontSize } from "@/types/bulletin";

type TypographySelectorProps = {
  fontFamily: BulletinFontFamily;
  fontSize?: BulletinFontSize | number;
  onFontChange: (font: BulletinFontFamily) => void;
  onSizeChange: (size: BulletinFontSize | number) => void;
};

export function TypographySelector({
  fontFamily,
  fontSize,
  onFontChange,
  onSizeChange,
}: TypographySelectorProps) {
  let currentPercent = 100;
  if (typeof fontSize === "number") {
    currentPercent = fontSize;
  } else if (fontSize === "large") {
    currentPercent = 118;
  } else if (fontSize === "xlarge") {
    currentPercent = 135;
  }

  return (
    <div className="space-y-6">
      {/* Font Family Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-primary-light" />
          <h3 className="font-bold text-on-surface">Pilihan Jenis Font</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BULLETIN_FONTS.map((font) => {
            const isActive = fontFamily === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => onFontChange(font.id)}
                className={cn(
                  "group relative flex flex-col justify-between rounded-xl border-2 p-3 text-left transition-all duration-200",
                  isActive
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/60 bg-surface hover:border-primary/40 hover:bg-surface-hover"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface">{font.name}</span>
                    {isActive && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-on-surface-muted">{font.description}</p>
                </div>
                <div className="mt-2.5 rounded border border-border/40 bg-white px-2 py-1 text-xs font-semibold text-gray-800 shadow-inner">
                  {font.sampleText}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continuous Font Size Manual Slider (Just like Geser Posisi Judul) */}
      <div className="space-y-3 rounded-2xl border border-border/60 bg-surface/50 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ZoomIn className="h-4 w-4 text-primary-light" />
            <h3 className="font-bold text-on-surface">
              Perbesar Ukuran Teks Buletin (Kiri/Kanan)
            </h3>
          </div>
          <span className="rounded-lg bg-primary/10 border border-primary/30 px-3 py-1 font-mono text-sm font-bold text-primary-light shadow-inner">
            {currentPercent}%
          </span>
        </div>

        {/* Desktop Layout: [-] Slider [+] in one row */}
        <div className="hidden sm:flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => onSizeChange(Math.max(100, currentPercent - 1))}
            disabled={currentPercent <= 100}
            className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-border bg-surface-hover px-3.5 py-2 text-xs font-bold text-on-surface hover:border-primary hover:bg-primary/10 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shrink-0 shadow-sm"
          >
            <span className="text-base leading-none">−</span>
            Perkecil
          </button>

          <div className="relative flex-1 flex items-center py-2">
            <input
              type="range"
              min={100}
              max={135}
              step={1}
              value={currentPercent}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-600 dark:bg-gray-500 border border-gray-400/30 accent-primary focus:outline-none shadow-inner"
            />
          </div>

          <button
            type="button"
            onClick={() => onSizeChange(Math.min(135, currentPercent + 1))}
            disabled={currentPercent >= 135}
            className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-border bg-surface-hover px-3.5 py-2 text-xs font-bold text-on-surface hover:border-primary hover:bg-primary/10 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shrink-0 shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Perbesar
          </button>
        </div>

        {/* Mobile HP Layout: Slider full width on top, buttons 2-columns below */}
        <div className="sm:hidden space-y-3 pt-1">
          <div className="relative flex items-center py-1">
            <input
              type="range"
              min={100}
              max={135}
              step={1}
              value={currentPercent}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="h-3.5 w-full cursor-pointer appearance-none rounded-full bg-gray-600 dark:bg-gray-500 border border-gray-400/30 accent-primary focus:outline-none shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onSizeChange(Math.max(100, currentPercent - 1))}
              disabled={currentPercent <= 100}
              className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-border bg-surface-hover py-2.5 text-xs font-bold text-on-surface hover:border-primary hover:bg-primary/10 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
            >
              <span className="text-base leading-none">−</span>
              Perkecil
            </button>
            <button
              type="button"
              onClick={() => onSizeChange(Math.min(135, currentPercent + 1))}
              disabled={currentPercent >= 135}
              className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-border bg-surface-hover py-2.5 text-xs font-bold text-on-surface hover:border-primary hover:bg-primary/10 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
            >
              <span className="text-base leading-none">+</span>
              Perbesar
            </button>
          </div>
        </div>

        {/* Labels underneath the slider */}
        <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-on-surface-muted select-none pt-1">
          <span
            onClick={() => onSizeChange(100)}
            className="cursor-pointer hover:text-primary transition-colors px-1 py-0.5 rounded hover:bg-surface-hover"
          >
            ← Standar (100%)
          </span>
          <span
            onClick={() => onSizeChange(118)}
            className="cursor-pointer hover:text-primary transition-colors px-1 py-0.5 rounded hover:bg-surface-hover"
          >
            Tengah (118%)
          </span>
          <span
            onClick={() => onSizeChange(135)}
            className="cursor-pointer hover:text-primary transition-colors px-1 py-0.5 rounded hover:bg-surface-hover"
          >
            Maksimal (135%) →
          </span>
        </div>
      </div>
    </div>
  );
}
