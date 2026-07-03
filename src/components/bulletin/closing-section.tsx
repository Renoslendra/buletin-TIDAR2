import type { ProgramItem } from "@/types/bulletin";
import { ProgramRow } from "@/components/bulletin/program-row";

export function ClosingSection({
  items,
  compact = false,
}: {
  items: ProgramItem[];
  compact?: boolean;
}) {
  return (
    <section>
      <div>
        {items.map((item, index) => (
          <ProgramRow key={`${item.label}-${index}`} item={item} compact={compact} />
        ))}
      </div>
    </section>
  );
}
