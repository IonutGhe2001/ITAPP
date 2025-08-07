export default function flattenMetadata(
  metadata: Record<string, unknown>,
  prefix = ''
): [string, string][] {
  return Object.entries(metadata).flatMap(([key, value]) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenMetadata(value as Record<string, unknown>, prefixedKey);
    }

    if (Array.isArray(value)) {
      return [
        [
          prefixedKey,
          value
            .map((item) =>
              item && typeof item === 'object' ? JSON.stringify(item) : String(item)
            )
            .join(', '),
        ],
      ];
    }

    return [[prefixedKey, String(value)]];
  });
}