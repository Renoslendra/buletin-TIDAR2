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
    id: "cormorant",
    name: "Cormorant Serif",
    description: "Anggun & khidmat bergaya liturgi",
    sampleText: "SabatFlow GMAHK",
  },
  {
    id: "century_gothic",
    name: "Century Gothic",
    description: "Klasik modern berkarakter bulat",
    sampleText: "SabatFlow GMAHK",
  },
];

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
    scaleLabel: "+6%",
  },
  {
    id: "xlarge",
    name: "Ekstra Besar",
    description: "Maksimal jelas untuk lansia & jemaat",
    scaleLabel: "+12%",
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
