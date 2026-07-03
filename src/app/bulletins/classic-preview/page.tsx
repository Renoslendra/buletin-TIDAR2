import React from "react";
import type { Metadata } from "next";
import { ClassicBulletinPreview } from "@/components/bulletin/ClassicBulletinPreview";

export const metadata: Metadata = {
  title: "Classic Bulletin Preview | SabatFlow",
  description: "1:1 Classic Sabbath Bulletin Template Preview",
};

export default function ClassicPreviewPage() {
  return (
    <main className="min-h-screen bg-neutral-100">
      <ClassicBulletinPreview />
    </main>
  );
}
