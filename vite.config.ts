
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Adjusted for custom domain reader.pello.io
  server: {
    open: true,
  },
});
