/**
 * Expand common abbreviations in schedule text.
 * RT = Rumah Tangga, PP = Pelayanan Perorangan
 */
export function expandAbbreviations(text: string | null | undefined): string | null {
  if (!text || typeof text !== "string") return text ?? null;

  let result = text.trim();
  if (!result) return null;

  // Expand standalone abbreviations (case-insensitive, word boundary)
  result = result.replace(/\bRT\b/gi, "Rumah Tangga");
  result = result.replace(/\bPP\b/gi, "Pelayanan Perorangan");

  return result;
}

export type PromosiPpRumahTangga = {
  label: "Pelayanan Perorangan" | "Rumah Tangga";
  value: string | null;
};

const promotionTypes: Array<{
  label: PromosiPpRumahTangga["label"];
  pattern: RegExp;
}> = [
  {
    label: "Rumah Tangga",
    pattern: /\(\s*(?:RT|Rumah\s+Tangga)\s*\)|\b(?:RT|Rumah\s+Tangga)\b/i,
  },
  {
    label: "Pelayanan Perorangan",
    pattern:
      /\(\s*(?:PP|Pelayanan\s+Perorangan)\s*\)|\b(?:PP|Pelayanan\s+Perorangan)\b/i,
  },
];

/**
 * Convert the PP/RT marker into the bulletin label and keep only the person's name.
 */
export function parsePromosiPpRumahTangga(
  text: string | null | undefined,
): PromosiPpRumahTangga {
  const value = typeof text === "string" ? text.trim() : "";
  const promotionType = promotionTypes.find(({ pattern }) => pattern.test(value));

  if (!promotionType) {
    return {
      label: "Pelayanan Perorangan",
      value: value || null,
    };
  }

  const name = value
    .replace(promotionType.pattern, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s:;,/\\-]+|[\s:;,/\\-]+$/g, "")
    .trim();

  return {
    label: promotionType.label,
    value: name || null,
  };
}

/**
 * Check if a date is the first Sabbath (Saturday) of its month.
 */
export function isFirstSabbathOfMonth(date: string | Date): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = d.getUTCDate();
  const dayOfWeek = d.getUTCDay(); // 0=Sun, 6=Sat

  // First Saturday of the month is between 1-7
  if (dayOfWeek !== 6) return false;
  return day <= 7;
}
