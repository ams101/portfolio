import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// The GenRicTravel Ops app is built separately from the portfolio and served at
// /apps/supply/. It uses hash routing, so no server rewrites are needed.
const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: here,
  base: '/apps/supply/',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        (await import('tailwindcss')).default({ config: path.join(here, 'tailwind.config.js') }),
        (await import('autoprefixer')).default(),
      ],
    },
  },
  build: {
    outDir: path.resolve(here, '../../dist/apps/supply'),
    emptyOutDir: true,
  },
});
