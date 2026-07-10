export type ProgramItemSource =
  | "default"
  | "sekolah_sabat"
  | "khotbah"
  | "manual"
  | "ai";

export type ProgramItem = {
  label: string;
  value: string;
  is_required: boolean;
  source: ProgramItemSource;
  warning?: string;
};

export type BulletinHeaderData = {
  title: string;
  church_name: string;
  date: string;
  date_text: string;
};

export type BulletinSermonData = {
  label: string;
  title: string;
  preacher: string;
  verse: string;
  offsetX?: number;
};

export type BulletinTheme =
  | "classic"
  | "elegant_navy"
  | "nature_green"
  | "majestic_maroon"
  | "charcoal_slate"
  | "deep_espresso";

export type BulletinFontFamily =
  | "poppins"
  | "inter"
  | "cormorant"
  | "century_gothic";

export type BulletinFontSize = "normal" | "large" | "xlarge";

export type BulletinFooterData = {
  tagline: string;
  template: string;
  theme?: BulletinTheme;
  fontFamily?: BulletinFontFamily;
  fontSize?: BulletinFontSize;
};

export type BulletinSourceTrace = {
  sekolah_sabat_row_id?: string | null;
  khotbah_row_id?: string | null;
  selected_date: string;
};

export type BulletinData = {
  header: BulletinHeaderData;
  top_info: ProgramItem[];
  sekolah_sabat_items: ProgramItem[];
  khotbah_items: ProgramItem[];
  sermon: BulletinSermonData;
  closing_items: ProgramItem[];
  footer: BulletinFooterData;
  validation_notes: string[];
  source_trace: BulletinSourceTrace;
};

export type BulletinSettings = {
  churchName: string;
  sabbathSchoolTime: string;
  sermonServiceTime: string;
  footerTagline: string;
  activeTemplate: string;
  defaultSongs: Record<string, string>;
  defaultBulletinItems: Record<string, string>;
};
