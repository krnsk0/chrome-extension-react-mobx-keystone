/// <reference types="vitest" />
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

import manifest from './manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ tsDecorators: true }), crx({ manifest })],
  server: {
    strictPort: true,
    port: 5173,
    hmr: {
      clientPort: 5173,
    },
  },
  test: {
    includeSource: ['src/**/*.{js,ts}'],
    environment: 'jsdom',
    setupFiles: ['./testing/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      clean: true,
    },
  },
});
