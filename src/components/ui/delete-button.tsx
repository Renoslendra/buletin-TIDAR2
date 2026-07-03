"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  id,
  type,
  title,
}: {
  id: string;
  type: "schedule" | "bulletin";
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Hapus "${title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setLoading(true);
    const endpoint =
      type === "schedule"
        ? `/api/schedules/${id}`
        : `/api/bulletins/${id}`;

    const response = await fetch(endpoint, { method: "DELETE" });
    setLoading(false);

    if (response.ok) {
      router.refresh();
    } else {
      alert("Gagal menghapus.");
    }
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      title="Hapus"
      disabled={loading}
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  );
}
