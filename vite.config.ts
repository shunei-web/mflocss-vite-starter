import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // MPA モード: 各 HTML を独立したエントリーポイントとして扱う
  appType: 'mpa',

  // ソースのルートを src/ に設定
  root: 'src',

  // ルートパスで出力（HTML 内の絶対パスリンクと整合）
  base: '/',

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        philosophy: resolve(__dirname, 'src/philosophy/index.html'),
        layers: resolve(__dirname, 'src/layers/index.html'),
        contact: resolve(__dirname, 'src/contact/index.html'),
      },
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },

  // public/ は src/ の外（プロジェクトルート）に配置
  publicDir: resolve(__dirname, 'public'),

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
