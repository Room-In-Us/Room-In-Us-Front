import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react(), svgr(), mkcert()], // mkcert 추가
  server: {
    https: true, // HTTPS 활성화
    proxy: {
      '/api': {
        target: 'https://roominus-server.store',
        changeOrigin: true,
        secure: false,
      },
    },
    cors: {
      origin: 'https://localhost:5173',
      credentials: true,
    },
  },
});