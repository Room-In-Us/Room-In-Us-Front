import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import mkcert from 'vite-plugin-mkcert';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, '');

  return {
    plugins: [react(), svgr(), mkcert()],
    server: {
      https: true,
      proxy: {
        '/api': {
          target: env.VITE_SERVER_URL_API,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      cors: {
        origin: 'https://localhost:5173',
        credentials: true,
      },
    },
  };
});