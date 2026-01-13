const DEFAULT_API_BASE_PATH = '/api';

function buildAbsoluteUrlFromPath(path: string): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return new URL(path, window.location.origin).toString();
  }

  if (typeof globalThis !== 'undefined') {
    const maybeLocation = (globalThis as { location?: { origin?: string } }).location;
    if (maybeLocation?.origin) {
      return new URL(path, maybeLocation.origin).toString();
    }
  }

  // Fallback for non-browser environments (e.g. SSR/tests without window)
  return path;
}

export function resolveApiBaseUrl(): string {
  const explicitUrl = import.meta.env.VITE_API_URL;

  if (explicitUrl) {
    return explicitUrl;
  }

  const mode = import.meta.env.MODE;

  if (mode === 'development' || mode === 'test') {
    const fallbackUrl = buildAbsoluteUrlFromPath(DEFAULT_API_BASE_PATH);
    console.warn(`VITE_API_URL is not defined. Falling back to "${fallbackUrl}" for ${mode} mode.`);
    return fallbackUrl;
  }

  throw new Error('VITE_API_URL is not defined');
}
