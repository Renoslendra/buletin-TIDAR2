import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type {
  BulletinData,
  BulletinHeaderData,
  BulletinSermonData,
  ProgramItem,
} from "@/types/bulletin";
import "@/styles/bulletin-classic.css";

export function BulletinWatermarkClassic() {
  return (
    <>
      <Image
        src="/bulletin-reference/advent-mark.png"
        alt=""
        width={180}
        height={180}
        className="classic-watermark classic-watermark-top"
      />
      <Image
        src="/bulletin-reference/advent-mark.png"
        alt=""
        width={420}
        height={420}
        className="classic-watermark classic-watermark-bottom"
      />
    </>
  );
}

export function BulletinHeaderClassic({ header }: { header: BulletinHeaderData }) {
  return (
    <header className="classic-header">
      <div className="classic-title">
        <Image
          src="/bulletin-reference/ibadah-sabat-title.png"
          alt={header.title || "Ibadah Sabat"}
          width={298}
          height={62}
          className="classic-title-image"
          priority
        />
      </div>
      <div className="classic-church-block">
        <div className="classic-church-name">
          {header.church_name || "GMAHK TIDAR 2 SURABAYA"}
        </div>
        <div className="classic-date">{header.date_text || "24 JANUARI 2026"}</div>
      </div>
    </header>
  );
}

export function BulletinTopInfoClassic({ items }: { items: ProgramItem[] }) {
  return (
    <section className="classic-top-info">
      {items.map((item, index) => (
        <p key={`${item.label}-${index}`} className="classic-line classic-top-line">
          <span className="classic-label">{item.label}</span>
          <span> : </span>
          <span>{item.value}</span>
        </p>
      ))}
    </section>
  );
}

export function BulletinSectionBarClassic({ title }: { title: string }) {
  return (
    <div className="classic-section-bar">
      <h2>{title}</h2>
    </div>
  );
}

function renderInlineValue(value: string) {
  const quotedTitleMatch = value.match(/^(".*?")(\s+ayat\s+\d+)?$/i);

  if (!quotedTitleMatch) {
    return value;
  }

  return (
    <>
      <strong>{quotedTitleMatch[1]}</strong>
      {quotedTitleMatch[2] ? <span>{quotedTitleMatch[2]}</span> : null}
    </>
  );
}

export function BulletinProgramListClassic({
  items,
  compact = false,
  children,
}: {
  items: ProgramItem[];
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={cn("classic-program-list", compact && "classic-program-list-compact")}>
      {items.map((item, index) => (
        <p
          key={`${item.label}-${index}`}
          className={cn(
            "classic-line",
            compact ? "classic-program-line-compact" : "classic-program-line",
            item.label.trim().toUpperCase() === "KHOTBAH" && "classic-sermon-preacher-line",
          )}
        >
          <span className="classic-label">{item.label}</span>
          {item.label.trim().toUpperCase().startsWith("LSEL") ? (
            <>
              <span> </span>
              <span>{renderInlineValue(item.value)}</span>
            </>
          ) : (
            <>
              <span> : </span>
              <span>{renderInlineValue(item.value)}</span>
            </>
          )}
        </p>
      ))}
      {children}
    </div>
  );
}

export function BulletinSermonTitleClassic({ sermon }: { sermon: BulletinSermonData }) {
  return <div className="classic-sermon-title">{sermon.title || "SETIA SAMPAI AKHIR"}</div>;
}

export function BulletinPreviewPageClassic({ children }: { children: ReactNode }) {
  return (
    <article id="bulletin-page" className="classic-bulletin-container shadow-sm print:shadow-none">
      {children}
    </article>
  );
}

export function BulletinTemplateClassic({ data }: { data: BulletinData }) {
  const khotbahRows: ProgramItem[] = [
    ...data.khotbah_items,
    {
      label: data.sermon.label ? data.sermon.label.toUpperCase() : "KHOTBAH",
      value: data.sermon.preacher,
      is_required: true,
      source: "khotbah" as const,
    },
  ];

  return (
    <BulletinPreviewPageClassic>
      <BulletinWatermarkClassic />
      <BulletinHeaderClassic header={data.header} />
      <BulletinTopInfoClassic items={data.top_info} />
      <BulletinSectionBarClassic title="Ibadah Sekolah Sabat (09.00 WIB - 10.15 WIB)" />
      <BulletinProgramListClassic items={data.sekolah_sabat_items} />
      <BulletinSectionBarClassic title="Ibadah Khotbah (10.20 WIB - 12.00 WIB)" />
      <BulletinProgramListClassic items={khotbahRows} compact />
      <BulletinSermonTitleClassic sermon={data.sermon} />
      <BulletinProgramListClassic items={data.closing_items} compact />
    </BulletinPreviewPageClassic>
  );
}

export const ClassicBulletinTemplate = BulletinTemplateClassic;
