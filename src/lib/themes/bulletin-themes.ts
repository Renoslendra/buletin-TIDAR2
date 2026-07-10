import type { BulletinTheme } from "@/types/bulletin";

export type ThemeConfig = {
  id: BulletinTheme;
  name: string;
  description: string;
  /** Preview colors for theme selector UI */
  previewColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
};

export const BULLETIN_THEMES: ThemeConfig[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Hitam-putih formal, seperti buletin biasa",
    previewColors: {
      primary: "#111111",
      secondary: "#e7e7e7",
      accent: "#505050",
    },
  },
  {
    id: "elegant_navy",
    name: "Elegant Navy",
    description: "Biru navy elegan, kesan profesional",
    previewColors: {
      primary: "#1e3a5f",
      secondary: "#c8d8e8",
      accent: "#3d5a80",
    },
  },
  {
    id: "nature_green",
    name: "Nature Green",
    description: "Hijau alami, kesan segar dan tenang",
    previewColors: {
      primary: "#2d5a3d",
      secondary: "#c8e0d0",
      accent: "#4a7c59",
    },
  },
  {
    id: "royal_purple",
    name: "Royal Purple",
    description: "Ungu kerajaan, kesan mewah dan sakral",
    previewColors: {
      primary: "#4a2d6b",
      secondary: "#d8c8e8",
      accent: "#6b5a80",
    },
  },
];

export function getThemeConfig(theme?: BulletinTheme): ThemeConfig {
  return BULLETIN_THEMES.find((t) => t.id === theme) ?? BULLETIN_THEMES[0];
}

export function getThemeCssClass(theme?: BulletinTheme): string {
  if (!theme || theme === "classic") return "";
  return `theme-${theme.replace(/_/g, "-")}`;
}
