import { BulletinTemplate } from "@/components/bulletin/bulletin-template";
import type { BulletinData } from "@/types/bulletin";
import { cn } from "@/lib/utils";

export function BulletinPreviewFrame({
  data,
  compact = false,
  className,
}: {
  data: BulletinData;
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <div className={className}>
        <BulletinTemplate data={data} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bulletin-preview-fit max-w-full overflow-auto rounded-xl border border-outline bg-surface-dim p-2 sm:p-4",
        className,
      )}
    >
      <div className="bulletin-preview-viewport mx-auto overflow-hidden">
        <div className="bulletin-preview-page">
          <BulletinTemplate data={data} />
        </div>
      </div>
    </div>
  );
}
