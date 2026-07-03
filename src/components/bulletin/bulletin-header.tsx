import type { BulletinHeaderData } from "@/types/bulletin";

export function BulletinHeader({ header }: { header: BulletinHeaderData }) {
  return (
    <header className="relative px-[10mm] pb-[2mm] pt-[5mm]">
      {/* Top row: Script title left + Church name right */}
      <div className="flex items-start justify-between">
        {/* Left: Script title */}
        <div className="whitespace-nowrap font-script text-[58px] italic leading-[0.88] text-black">
          {header.title}
        </div>

        {/* Right: Church name + date */}
        <div className="pt-[1mm] text-right">
          <div className="text-[16px] font-extrabold uppercase leading-[1.2] tracking-[0.03em] text-black">
            {header.church_name.toUpperCase()}
          </div>
          <div className="mt-[1.5mm] text-[13px] font-bold uppercase leading-none tracking-[0.04em] text-black underline decoration-[1.5px] underline-offset-[2px]">
            {header.date_text.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
