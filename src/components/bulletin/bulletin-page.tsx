import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function BulletinPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      id="bulletin-page"
      style={{ fontFamily: '"Century Gothic", "Tw Cen MT", "Josefin Sans", sans-serif' }}
      className={cn(
        "relative isolate flex h-[297mm] w-[210mm] flex-col overflow-hidden bg-white text-black print:shadow-none",
        className,
      )}
    >
      {/* Advent mark — solid gray on the right side of top info block, exact 1:1 match */}
      <Image
        src="/bulletin-reference/advent-mark.png"
        alt=""
        width={320}
        height={340}
        className="pointer-events-none absolute right-[18mm] top-[24mm] -z-10 h-[32mm] w-[32mm] object-contain opacity-[0.55] grayscale contrast-75"
      />
      <div className="z-10 flex min-h-0 flex-1 flex-col">
        {children}
      </div>
    </article>
  );
}
