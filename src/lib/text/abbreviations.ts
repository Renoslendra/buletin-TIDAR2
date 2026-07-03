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
