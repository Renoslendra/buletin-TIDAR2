import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-[48px] w-full rounded-xl border border-white/10 bg-white/5 px-4 text-on-surface shadow-inner backdrop-blur-sm outline-none transition-all duration-300 placeholder:text-on-surface-variant/50 focus:border-primary-light focus:bg-white/10 focus:ring-4 focus:ring-primary/20",
        className,
      )}
      {...props}
    />
  );
}
