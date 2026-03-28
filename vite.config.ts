import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  appType: 'mpa',
  root: 'src',
  base: '/',

  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        contact: resolve(__dirname, 'src/contact/index.html'),
        thanks: resolve(__dirname, 'src/thanks/index.html'),
        privacy: resolve(__dirname, 'src/privacy/index.html'),
      },
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },

  publicDir: resolve(__dirname, 'public'),

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
