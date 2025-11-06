/**
 * Utility function for Romanian pluralization
 * @param count - The number to determine pluralization
 * @param singular - The singular form (e.g., "minut")
 * @param plural - The plural form (e.g., "minute")
 * @returns The appropriate form based on count
 */
export function romanianPlural(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

/**
 * Formats a relative time string in Romanian
 * @param minutes - Number of minutes ago
 * @returns Formatted relative time string, or empty string if time is too far in the past (caller should format as date)
 */
export function formatRelativeTime(minutes: number): string {
  const ONE_HOUR = 60;
  const ONE_DAY = 1440;
  
  if (minutes < 1) return 'Acum';
  if (minutes < ONE_HOUR) return `Acum ${minutes} ${romanianPlural(minutes, 'minut', 'minute')}`;
  
  const hours = Math.floor(minutes / ONE_HOUR);
  if (hours === 1) return 'Acum 1 oră';
  if (minutes < ONE_DAY) return `Acum ${hours} ore`;
  
  const days = Math.floor(minutes / ONE_DAY);
  if (days === 1) return 'Ieri';
  if (days < 7) return `Acum ${days} ${romanianPlural(days, 'zi', 'zile')}`;
  
  return ''; // Return empty string when time is too far in past - caller should format as date
}
