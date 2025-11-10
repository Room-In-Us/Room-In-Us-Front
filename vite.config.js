import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '', '');

  return {
    plugins: [react(), svgr(), mkcert()],
    server: {
      https: true,
      proxy: {
        '/api': {
          target: env.VITE_SERVER_URL_API,
          changeOrigin: true,
          secure: false,
        },
      },
      cors: {
        origin: 'https://localhost:5173',
        credentials: true,
      },
    },
  };
});