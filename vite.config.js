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
        '/storage-proxy': {
          target: 'https://firebasestorage.googleapis.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/storage-proxy/, ''),
        },
        '/pstatic-proxy': {
          target: 'https://naverbooking-phinf.pstatic.net',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/pstatic-proxy/, ''),
        },
        '/jigubyeol-proxy': {
          target: 'https://xn--2e0b040a4xj.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/jigubyeol-proxy/, ''),
        },
      },
      cors: {
        origin: 'https://localhost:5173',
        credentials: true,
      },
    },
  };
});
