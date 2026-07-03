import type { BulletinSermonData } from "@/types/bulletin";

export function SermonHighlight({ sermon }: { sermon: BulletinSermonData }) {
  return (
    <section className="py-[1.5mm] text-center">
      <h2 className="text-[18px] font-extrabold uppercase leading-[1.1] tracking-[0.02em] text-black">
        {sermon.title}
      </h2>
    </section>
  );
}
