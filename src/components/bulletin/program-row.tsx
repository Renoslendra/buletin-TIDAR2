import type { ProgramItem } from "@/types/bulletin";
import { cn } from "@/lib/utils";

export function ProgramRow({
  item,
  compact = false,
}: {
  item: ProgramItem;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline text-black",
        compact
          ? "min-h-[4.4mm] text-[11.2px] leading-[1.25]"
          : "min-h-[5.2mm] text-[12px] leading-[1.3]",
        item.warning && "text-amber-700",
      )}
    >
      <div
        className={cn(
          "shrink-0 text-right font-bold",
          "w-[58mm]",
        )}
      >
        {item.label}
      </div>
      <div className="mx-[1.5mm] font-bold">:</div>
      <div className="min-w-0 break-words font-normal">{item.value}</div>
    </div>
  );
}
