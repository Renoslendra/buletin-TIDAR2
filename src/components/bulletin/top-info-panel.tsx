import type { ProgramItem } from "@/types/bulletin";

export function TopInfoPanel({ items }: { items: ProgramItem[] }) {
  return (
    <section className="space-y-[1.2mm] py-[1.5mm]">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-baseline text-[12px] leading-[1.35]"
        >
          <div className="w-[58mm] shrink-0 text-right font-bold text-black">
            {item.label}
          </div>
          <div className="mx-[1.5mm] font-bold text-black">:</div>
          <div className="min-w-0 font-normal text-black">{item.value}</div>
        </div>
      ))}
    </section>
  );
}
