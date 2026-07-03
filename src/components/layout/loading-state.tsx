export function LoadingState({ label = "Memuat data" }: { label?: string }) {
  return (
    <div className="rounded-xl border border-outline bg-surface-bright p-5 text-sm text-on-surface-variant">
      {label}
    </div>
  );
}
