import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
 
import EnvironmentPlugin from "vite-plugin-environment";
export default defineConfig({
  optimizeDeps: {
    include: ["recharts"],
  },
  plugins: [
    react(),
    EnvironmentPlugin(["BACKEND_PATH_API_URL","REACT_APP_API_URL", "REACT_APP_NAME"]),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // ✅ safe alias
    },
  },
});
 