import { Badge } from "@/components/ui/badge";

const statusTone = {
  pending: "neutral",
  processing: "warning",
  success: "success",
  failed: "danger",
  reviewed: "navy",
} as const;

const statusLabel = {
  pending: "Pending",
  processing: "Processing",
  success: "Success",
  failed: "Failed",
  reviewed: "Reviewed",
};

export function ScheduleStatusBadge({
  status,
}: {
  status: keyof typeof statusTone;
}) {
  return <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>;
}
