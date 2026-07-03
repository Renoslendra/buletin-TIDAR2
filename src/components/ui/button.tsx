import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-light shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]",
  secondary:
    "border border-white/10 bg-white/5 text-on-surface hover:bg-white/10 hover:border-white/20",
  accent: "bg-accent text-background hover:bg-accent-light shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]",
  ghost: "text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
  danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-[36px] px-4 text-xs",
  md: "min-h-[44px] px-5 text-sm sm:px-6",
  lg: "min-h-[52px] px-6 text-base sm:px-8",
  icon: "min-h-[44px] min-w-[44px] p-0 rounded-full",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 active:scale-95",
        "max-w-full text-center leading-tight",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
