import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@assets": resolve(__dirname, "src/assets"),
      "@pages": resolve(__dirname, "src/pages"),
      "@components": resolve(__dirname, "src/components"),
      "@layouts": resolve(__dirname, "src/layouts"),
      "@services": resolve(__dirname, "src/services"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // backend Express
        changeOrigin: true,
      },
    },
  },
});
