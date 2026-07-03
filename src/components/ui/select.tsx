import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-[48px] w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-on-surface shadow-inner outline-none transition placeholder:text-on-surface-variant/50 focus:border-primary-light focus:bg-white/10 focus:ring-4 focus:ring-primary/20",
        className,
      )}
      {...props}
    />
  );
}
