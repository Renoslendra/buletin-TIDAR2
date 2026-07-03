import { Alert } from "@/components/ui/alert";

export function ValidationWarnings({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <Alert tone="warning">
      <div className="space-y-1">
        <div className="font-semibold">Peringatan validasi</div>
        <ul className="list-inside list-disc space-y-1">
          {warnings.slice(0, 8).map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </div>
    </Alert>
  );
}
