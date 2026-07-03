import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-outline bg-surface-bright p-8 text-center">
      <h2 className="text-base font-bold text-on-surface">{title}</h2>
      {description ? <p className="mt-2 text-sm text-on-surface-variant">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
