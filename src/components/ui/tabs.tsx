import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex rounded-xl border border-outline bg-surface-dim p-1",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  active,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:text-on-surface",
        active && "bg-primary text-white",
        className,
      )}
      {...props}
    />
  );
}
