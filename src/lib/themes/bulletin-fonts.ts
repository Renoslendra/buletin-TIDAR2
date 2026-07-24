import type { BulletinFontFamily, BulletinFontSize } from "@/types/bulletin";

export type FontConfig = {
  id: BulletinFontFamily;
  name: string;
  description: string;
  sampleText: string;
};

export type FontSizeConfig = {
  id: BulletinFontSize;
  name: string;
  description: string;
  scaleLabel: string;
};

export const BULLETIN_FONTS: FontConfig[] = [
  {
    id: "poppins",
    name: "Poppins",
    description: "Modern, bersih & rapi (Bawaan)",
    sampleText: "SabatFlow GMAHK",
  },
  {
    id: "inter",
    name: "Inter Sans",
    description: "Sangat tajam & jelas dibaca",
    sampleText: "SabatFlow GMAHK",
  },
  {
    id: "georgia",
    name: "Georgia Serif",
    description: "Serif klasik formal yang tegas & jelas",
    sampleText: "SabatFlow GMAHK",
  },
  {
    id: "trebuchet",
    name: "Trebuchet Humanist",
    description: "Sans-serif hangat yang sangat nyaman dibaca",
    sampleText: "SabatFlow GMAHK",
  },
  {
    id: "palatino",
    name: "Palatino Serif",
    description: "Serif sakral agung yang elegan & berwibawa",
    sampleText: "SabatFlow GMAHK",
  },
  {
    id: "segoe",
    name: "Segoe Modern",
    description: "Sans-serif kontemporer ramah & jernih",
    sampleText: "SabatFlow GMAHK",
  },
  {
    id: "times" as any,
    name: "Times New Roman",
    description: "Serif gerejawi tradisional formal & universal",
    sampleText: "SabatFlow GMAHK",
  },
  {
    id: "garamond" as any,
    name: "Garamond Sacred",
    description: "Serif sastra antik yang khidmat & agung",
    sampleText: "SabatFlow GMAHK",
  },
  {
    id: "cambria" as any,
    name: "Cambria Classic",
    description: "Serif akademis elegan berwibawa & tajam",
    sampleText: "SabatFlow GMAHK",
  },
  {
    id: "verdana" as any,
    name: "Verdana Clean",
    description: "Sans-serif ekstra lebar super jernih",
    sampleText: "SabatFlow GMAHK",
  },
  {
    id: "coco" as any,
    name: "Coco Gothic",
    description: "Geometric sans-serif elegan bergaya modern & bersih",
    sampleText: "SabatFlow GMAHK",
  },
];

export function getFontConfig(font?: BulletinFontFamily | "coco"): FontConfig {
  return BULLETIN_FONTS.find((f) => f.id === font) ?? BULLETIN_FONTS[0];
}

export const BULLETIN_FONT_SIZES: FontSizeConfig[] = [
  {
    id: "normal",
    name: "Standar",
    description: "Ukuran normal 1 halaman A4",
    scaleLabel: "100%",
  },
  {
    id: "large",
    name: "Lebih Besar",
    description: "Teks lebih jelas & nyaman dibaca",
    scaleLabel: "+10%",
  },
  {
    id: "xlarge",
    name: "Ekstra Besar",
    description: "Maksimal jelas untuk lansia & jemaat",
    scaleLabel: "+18%",
  },
];

export function getFontCssClass(font?: BulletinFontFamily): string {
  if (!font || font === "poppins") return "";
  return `font-${font.replace(/_/g, "-")}`;
}

export function getSizeCssClass(size?: BulletinFontSize): string {
  if (!size || size === "normal") return "";
  return `size-${size}`;
}
