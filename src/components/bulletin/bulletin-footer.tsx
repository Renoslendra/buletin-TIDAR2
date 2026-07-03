import type { BulletinFooterData } from "@/types/bulletin";

export function BulletinFooter({ footer }: { footer: BulletinFooterData }) {
  return (
    <footer className="mt-auto px-[10mm] pb-[5mm] pt-[2mm] text-center">
      <span className="sr-only">{footer.tagline}</span>
    </footer>
  );
}
