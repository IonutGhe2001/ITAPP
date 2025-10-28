export type AppConfig = { pvGenerationMode: 'auto' | 'manual' };

let cachedConfig: AppConfig | null = null;

export async function getConfig(): Promise<AppConfig> {
  if (cachedConfig !== null) return cachedConfig;
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api$/, '');
  const res = await fetch(`${baseUrl}/config`);
  if (!res.ok) throw new Error('Failed to load config');
  const config: AppConfig = await res.json();
  cachedConfig = config;
  return config;
}
