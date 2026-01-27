
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/reader/', // Matches your repository name: https://pxai.github.io/reader/
  server: {
    open: true,
  },
});
