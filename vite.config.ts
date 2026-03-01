import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // MPA モード: 各 HTML を独立したエントリーポイントとして扱う
  appType: 'mpa',

  // ソースのルートを src/ に設定
  root: 'src',

  // 相対パスで出力（サブディレクトリ配置・zip 納品対応）
  base: './',

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/about/index.html'),
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
