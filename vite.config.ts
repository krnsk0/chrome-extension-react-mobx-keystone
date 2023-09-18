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
    environment: 'jsdom',
    setupFiles: ['./testing/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      extension: ['js', 'ts', 'tsx'],
      all: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/popup/main.tsx', '**/**.d.ts'],
    },
  },
});
