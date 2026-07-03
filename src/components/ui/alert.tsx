import type { HTMLAttributes } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  info: "border-primary/20 bg-primary/5 text-on-surface",
  warning: "border-warning/30 bg-warning/5 text-warning",
  danger: "border-error/20 bg-error/5 text-error",
};

export function Alert({
  className,
  tone = "info",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: keyof typeof tones }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-sm",
        tones[tone],
        className,
      )}
      {...props}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
