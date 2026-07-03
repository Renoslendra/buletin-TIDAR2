import type { ReactNode } from "react";
import type { ProgramItem } from "@/types/bulletin";
import { ProgramRow } from "@/components/bulletin/program-row";

export function ProgramSection({
  title,
  subtitle,
  items,
  compact = false,
  children,
}: {
  title: string;
  subtitle?: string;
  items: ProgramItem[];
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="mt-[2mm]">
      {/* Section header: light gray banner bar with centered title */}
      <div className="rounded-[3px] bg-[#e5e7eb] py-[1.6mm] text-center">
        <h2 className="text-[13.5px] font-extrabold leading-none tracking-[0.01em] text-black">
          {title}
          {subtitle ? (
            <span className="ml-[1.5mm] font-extrabold">({subtitle})</span>
          ) : null}
        </h2>
      </div>

      {/* Section body: program rows */}
      <div className="px-[2mm]">
        {items.map((item, index) => (
          <ProgramRow key={`${item.label}-${index}`} item={item} compact={compact} />
        ))}
        {children ? <div className="mt-[1mm]">{children}</div> : null}
      </div>
    </section>
  );
}
