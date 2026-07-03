import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  imageClassName,
  textClassName,
  size = 40,
  stacked = false,
}: {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  size?: number;
  stacked?: boolean;
}) {
  return (
    <div className={cn("flex", stacked ? "flex-col items-center text-center" : "items-center gap-3", className)}>
      <Image
        src="/logos/tidar2-logo.png"
        alt="Advent Jemaat Tidar 2"
        width={size}
        height={size}
        priority={size >= 56}
        className={cn("shrink-0 rounded-md object-contain", imageClassName)}
      />
      <div className={cn("font-bold tracking-wide", textClassName)}>SabatFlow</div>
    </div>
  );
}
