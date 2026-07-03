const MONTHS: Record<string, number> = {
  januari: 1,
  jan: 1,
  februari: 2,
  feb: 2,
  maret: 3,
  mar: 3,
  april: 4,
  apr: 4,
  mei: 5,
  juni: 6,
  jun: 6,
  juli: 7,
  jul: 7,
  agustus: 8,
  agu: 8,
  ags: 8,
  august: 8,
  september: 9,
  sep: 9,
  sept: 9,
  oktober: 10,
  okt: 10,
  november: 11,
  nov: 11,
  desember: 12,
  des: 12,
};

const DISPLAY_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function normalizeDateInput(value: string | Date) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const cleaned = trimmed
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

  const match = cleaned.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i);
  if (!match) {
    throw new Error(`Tanggal tidak dikenali: ${value}`);
  }

  const day = Number(match[1]);
  const month = MONTHS[match[2]];
  const year = Number(match[3]);

  if (!month || day < 1 || day > 31) {
    throw new Error(`Tanggal tidak valid: ${value}`);
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;
}

export function dateStringToDate(value: string) {
  const normalized = normalizeDateInput(value);
  return new Date(`${normalized}T00:00:00.000Z`);
}

export function formatDateIndonesian(value: string | Date) {
  const normalized = normalizeDateInput(value);
  const [year, month, day] = normalized.split("-").map(Number);
  return `${String(day).padStart(2, "0")} ${DISPLAY_MONTHS[month - 1]} ${year}`;
}

export function formatDateIndonesianUpper(value: string | Date) {
  return formatDateIndonesian(value).toUpperCase();
}
