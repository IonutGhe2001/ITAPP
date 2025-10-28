const DEFAULT_API_BASE_URL = '/api';

export function resolveApiBaseUrl(): string {
  const explicitUrl = import.meta.env.VITE_API_URL;

  if (explicitUrl) {
    return explicitUrl;
  }

  const mode = import.meta.env.MODE;

  if (mode === 'development' || mode === 'test') {
    console.warn(
      `VITE_API_URL is not defined. Falling back to "${DEFAULT_API_BASE_URL}" for ${mode} mode.`,
    );
    return DEFAULT_API_BASE_URL;
  }

  throw new Error('VITE_API_URL is not defined');
}