import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default {
  plugins: [react()],
  server: {
    proxy: {
      '/llm': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
};

