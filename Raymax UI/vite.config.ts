import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/llm': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          // Enable CORS for all origins
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Access-Control-Allow-Origin', '*');
          });
        },
      },
    },
  },
});
