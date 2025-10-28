import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_API_URL || 'http://localhost:8080/api';

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.svg',
          'favicon.ico',
          'logo.png',
          'robots.txt',
          'pwa-192x192.png',
          'pwa-512x512.png',
        ],
        manifest: {
          name: 'IT APP',
          short_name: 'IT APP',
          description: 'IT APP progressive web application',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
    optimizeDeps: {
      include: [
        'recharts',
        'recharts-scale',
        'd3-scale',
        'd3-shape',
        'd3-format',
        'd3-time-format',
      ],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@components': resolve(__dirname, 'src/components'),
        '@layouts': resolve(__dirname, 'src/layouts'),
        '@services': resolve(__dirname, 'src/services'),
        '@shared': resolve(__dirname, '../shared'),
      },
    },
    ssr: {
      noExternal: ['recharts'],
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.ts',
    },
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
