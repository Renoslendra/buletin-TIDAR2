import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-light shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]",
  secondary:
    "border border-white/10 bg-white/5 text-on-surface hover:bg-white/10 hover:border-white/20",
  ghost: "text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
};

export function LinkButton({
  className,
  variant = "primary",
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof variants }) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-[44px] max-w-full items-center justify-center gap-2 rounded-full px-5 text-center text-sm font-medium leading-tight transition-all duration-300 active:scale-95 sm:px-6",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
