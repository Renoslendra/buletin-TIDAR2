import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ScheduleUploadForm } from "@/components/schedules/schedule-upload-form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewSchedulePage() {
  return (
    <AppShell>
      <PageHeader
        title="Upload Jadwal"
        description="Upload file jadwal Sekolah Sabat atau Khotbah untuk diekstrak menjadi data terstruktur."
      />
      <Card className="max-w-3xl mx-auto">
        <CardContent>
          <ScheduleUploadForm />
        </CardContent>
      </Card>
    </AppShell>
  );
}
