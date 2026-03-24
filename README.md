# LP Starter

mFLOCSS で設計された LP（ランディングページ）スターターテンプレート。コンテンツを差し替えるだけで、自分の LP として使える出発点です。

## 必要環境

- Node.js 24 以上（Vite 8 の動作確認バージョン）

## 5分で始める

### 1. リポジトリをテンプレートとして使用

GitHub の [Use this template] ボタンから新しいリポジトリを作成してください。

### 2. クローン

```bash
git clone https://github.com/あなたのユーザー名/あなたのリポジトリ名.git
cd あなたのリポジトリ名
```

### 3. 依存パッケージをインストール

```bash
npm install
```

pnpm なら `pnpm install`。pnpm を使う場合は `corepack enable` で自動セットアップされます。

npm でも pnpm でも動作します。使用するパッケージマネージャーの lockfile のみ残してください。

### 4. 開発サーバーを起動

```bash
npm run dev
```

ターミナルに表示された URL をブラウザで開いてください。ファイルを編集すると自動でリロードされます。

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（HMR 有効） |
| `npm run build` | 本番ビルド（dist/ に出力） |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run lint:css` | Stylelint でスタイルを検査 |
| `npm run lint:js` | ESLint でスクリプトを検査 |
| `npm run format` | Prettier でコードを整形 |

## デプロイ

- ビルドコマンド: `npm run build`
- 公開ディレクトリ: `dist`

サブディレクトリに配置する場合は `vite.config.ts` の `base` を変更してください:

```ts
base: '/lp/campaign/'
```

## カスタマイズの始め方

1. **リセット CSS を差し替える**: `src/css/foundation/reset.css` をお好みのリセット CSS に差し替え → `foundation/index.css` の import を変更
2. **ブランドカラーを変える**: `src/css/tokens/color.css` のカスタムプロパティを差し替え。デザインカンプの hex 値をそのまま指定できます（oklch への変換は不要）
3. **フォントを変える**: `src/css/tokens/typography.css` を変更。Web フォントを使う場合は Tokens 層に追加
4. **セクションを削除する**: HTML からセクションを削除 → 対応する `p-{セクション名}.css` を削除 → そのセクション専用の Component があれば一緒に削除（grep で確認） → `style.css` の import を削除
5. **セクションを追加する**: HTML に `<section>` を追加 → `src/css/project/p-{セクション名}.css` を作成 → `src/css/style.css` の Project 層に import を追加
6. **Component を追加する**: Portability Test（他のページでも使えるか？）で層を判断 → `src/css/component/c-{名前}.css` を作成 → `style.css` に import を追加
7. **ページを追加する**: `src/{ページ名}/index.html` を作成 → `vite.config.ts` の input に追加
8. **Contact フォームの送信先を設定する**: フォームは HTML のみで送信先は含まれていません。バックエンドの実装またはフォーム送信サービスの接続が必要です

`@layer` で優先順位が制御されているため、`style.css` の import 順序はスタイルの適用に影響しません。

## アニメーション

HTML 要素に `data-animate` 属性を付けるだけでスクロールアニメーションが有効になります。

```html
<h2 data-animate="fade-in-slide-up">見出し</h2>
<div data-stagger="fade-in-slide-up">子要素が順に表示</div>
```

| アニメーション名 | 効果 |
|----------------|------|
| `fade-in` | フェードイン |
| `fade-in-slide-up` | フェードイン + 下から上へスライド |
| `fade-in-slide-right` | フェードイン + 左から右へスライド |
| `scale-in` | フェードイン + 拡大 |

- `prefers-reduced-motion: reduce` 環境ではアニメーション無効
- JS 無効環境ではコンテンツが常時表示

## ダークモード

- OS のダークモード設定に自動追従（トグルなし）
- Theme 層の `light-dark()` で一括管理
- カスタマイズ: `src/css/theme/color.css` のセマンティック変数を変更
- ライトモードに固定する場合: `src/css/theme/color.css` の `color-scheme` を `light` に、HTML の `<meta name="color-scheme">` を `light` に変更

## mFLOCSS の 8 層アーキテクチャ

FLOCSS の 3 層（Foundation / Layout / Object）を、モダン CSS に対応させた 8 層構成です。
CSS `@layer` で優先順位をブラウザが明示的に制御するため、層間の詳細度の事故が起きません。

```
src/css/
├── tokens/       デザイントークン（色・フォント・余白等の設計変数）
├── theme/        セマンティックカラー・ダークモード
├── foundation/   リセット・ベーススタイル
├── layout/       セクション・サイトレイアウト
├── component/    汎用パーツ（ボタン・見出し等）
├── project/      ページ固有パーツ
├── animation/    アニメーション（reduced-motion 対応）
└── utility/      補助クラス
```

| 層 | プレフィックス | @layer | 役割 |
|----|-------------|--------|------|
| Tokens | — | tokens | デザイントークン（色・フォント・余白等の設計変数） |
| Theme | — | theme | セマンティックカラー・ダークモード |
| Foundation | — | foundation | カスタムリセット + ベーススタイル |
| Layout | `l-` | layout | セクション・サイトレイアウト |
| Component | `c-` | component | 複数ページで使い回す汎用パーツ |
| Project | `p-` | project | 特定のページ・機能に使うパーツ |
| Animation | `data-animate` / `data-stagger` | animation | スクロールアニメーション等 |
| Utility | `u-` | utility | 補助クラス（常に最優先で適用） |

## 設計ガイド

mFLOCSS の設計原則と詳細な実装ガイドは以下を参照してください。

- **mFLOCSS 仕様**: https://github.com/mflocss/spec
- **書籍（設計の詳細解説）**: https://zenn.dev/shunei/books/mflocss-design



## ライセンス

MIT
