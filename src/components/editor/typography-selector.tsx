"use client";

import { Check, Type, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { BULLETIN_FONTS, BULLETIN_FONT_SIZES } from "@/lib/themes/bulletin-fonts";
import type { BulletinFontFamily, BulletinFontSize } from "@/types/bulletin";

type TypographySelectorProps = {
  fontFamily: BulletinFontFamily;
  fontSize: BulletinFontSize;
  onFontChange: (font: BulletinFontFamily) => void;
  onSizeChange: (size: BulletinFontSize) => void;
};

export function TypographySelector({
  fontFamily,
  fontSize,
  onFontChange,
  onSizeChange,
}: TypographySelectorProps) {
  return (
    <div className="space-y-5">
      {/* Font Family Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-primary-light" />
          <h3 className="font-bold text-on-surface">Pilihan Jenis Font (Mas Stefanus Request)</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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

      {/* Font Size Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <ZoomIn className="h-4 w-4 text-primary-light" />
          <h3 className="font-bold text-on-surface">Ukuran Font Buletin (Perbesar Teks)</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {BULLETIN_FONT_SIZES.map((size) => {
            const isActive = fontSize === size.id;
            return (
              <button
                key={size.id}
                type="button"
                onClick={() => onSizeChange(size.id)}
                className={cn(
                  "group relative flex items-center justify-between rounded-xl border-2 p-3 text-left transition-all duration-200",
                  isActive
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/60 bg-surface hover:border-primary/40 hover:bg-surface-hover"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">{size.name}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                        isActive
                          ? "bg-primary text-white"
                          : "bg-border/60 text-on-surface-muted"
                      )}
                    >
                      {size.scaleLabel}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-on-surface-muted">{size.description}</p>
                </div>
                {isActive && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
