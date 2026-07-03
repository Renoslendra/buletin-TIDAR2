import { BulletinTemplateClassic } from "@/components/bulletin/ClassicBulletinTemplate";
import type { BulletinData } from "@/types/bulletin";

export function BulletinTemplate({ data }: { data: BulletinData }) {
  return <BulletinTemplateClassic data={data} />;
}
