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
    id: "majestic_maroon",
    name: "Majestic Maroon",
    description: "Merah marun anggun, kesan khidmat dan sakral",
    previewColors: {
      primary: "#5c1d24",
      secondary: "#e8c8cc",
      accent: "#7a2832",
    },
  },
  {
    id: "charcoal_slate",
    name: "Charcoal Slate",
    description: "Abu gelap sleek, kesan ultra modern dan minimalis",
    previewColors: {
      primary: "#2d3748",
      secondary: "#cbd5e0",
      accent: "#4a5568",
    },
  },
  {
    id: "deep_espresso",
    name: "Deep Espresso",
    description: "Cokelat kopi tua klasik bergaya perkamen formal",
    previewColors: {
      primary: "#3b2b24",
      secondary: "#d6c7be",
      accent: "#574137",
    },
  },
  {
    id: "royal_gold" as any,
    name: "Royal Gold",
    description: "Emas mewah & aksen gelap bergaya keagungan sakral",
    previewColors: {
      primary: "#4a3b18",
      secondary: "#e3d8c1",
      accent: "#6b5523",
    },
  },
  {
    id: "sunset_bronze" as any,
    name: "Sunset Bronze",
    description: "Perpaduan tembaga hangat & keanggunan senja berwibawa",
    previewColors: {
      primary: "#5e3023",
      secondary: "#e6cfc8",
      accent: "#894d3a",
    },
  },
  {
    id: "ocean_teal" as any,
    name: "Ocean Teal",
    description: "Biru samudra segar, sejuk & kontemporer elegan",
    previewColors: {
      primary: "#1a4a4f",
      secondary: "#c3e2e5",
      accent: "#2c6f77",
    },
  },
  {
    id: "warm_olive" as any,
    name: "Warm Olive",
    description: "Hijau zaitun hangat eksklusif & teduh menenangkan",
    previewColors: {
      primary: "#3e4229",
      secondary: "#dcdfd1",
      accent: "#5d633e",
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
