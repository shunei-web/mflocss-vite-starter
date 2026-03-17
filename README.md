# mflocss/starter

Zenn 技術書「そのFLOCSS、なぜそこに書いた？ —— mFLOCSS で迷わない CSS 設計の判断基準」付属のリファレンス実装。

mFLOCSS × Vite × モダン CSS で作る、崩れない CSS 設計のリファレンス実装です。

## 必要環境

- Node.js 20 以上
- pnpm 9 以上（npm / yarn でも動きます）

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
pnpm install
```

### 4. 開発サーバーを起動

```bash
pnpm dev
```

ブラウザで http://localhost:5173 が開きます。
ファイルを編集すると自動でリロードされます。

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動（HMR 有効） |
| `pnpm build` | 本番ビルド（dist/ に出力） |
| `pnpm preview` | ビルド結果のプレビュー |
| `pnpm lint:css` | Stylelint でスタイルを検査 |
| `pnpm lint:js` | ESLint でスクリプトを検査 |
| `pnpm format` | Prettier でコードを整形 |

## mFLOCSS の 8 層アーキテクチャ

FLOCSS の 3 層（Foundation / Layout / Object）を、モダン CSS に対応させた 8 層構成です。
CSS `@layer` で優先順位をブラウザが明示的に制御するため、詳細度の事故が起きません。

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
| Animation | `a-` | animation | スクロールアニメーション等 |
| Utility | `u-` | utility | 補助クラス（常に最優先で適用） |

## スタイルを追加する

「どのレイヤーに書くか迷う」という場合は、本の第3章を参照してください。

### 新しい Component を追加する場合

1. `src/css/component/c-新しい名前.css` を作成（`@layer` で囲む必要はない）
2. `src/css/style.css` の Component セクションに追加:
   ```css
   @import './component/c-新しい名前.css' layer(component);
   ```

他の層（Layout, Project, Animation, Utility）も同様に `@import layer()` 方式で追加します。

### ファイルを削除する場合

1. `src/css/style.css` から該当の `@import` 行を削除
2. 対応する CSS ファイルを削除

### 新しいページを追加する場合

1. `src/pages/新ページ名/index.html` を作成
2. `vite.config.ts` の `build.rollupOptions.input` に追加

## 設計ガイド

### @import layer() のネスト伝播

`@import layer()` による層指定は、インポートされたファイル内の `@import` には**伝播しません**。

```css
/* style.css */
@import './foundation/index.css' layer(foundation);
```

```css
/* foundation/index.css — ここで layer(foundation) が適用されるのはこのファイルの直接の内容のみ */
@layer foundation.reset, foundation.base;

/* 内部の @import には layer() が伝播しないため、明示的にサブレイヤーを指定する */
@import './reset.css' layer(foundation.reset);
@import './base.css' layer(foundation.base);
```

この挙動はネスト構造を持つ場合に注意が必要です。サブレイヤーを使う場合は、中間ファイル（index.css）で明示的に `layer()` を指定してください。

### Container Queries（CQ）

Container Queries 内のサイズ指定には `cqi`（container query inline-size）の使用を推奨します。`vw` はビューポート基準であり、コンテナ基準の設計と矛盾します。

```css
@container (inline-size >= 40em) {
  .c-card {
    font-size: clamp(0.875rem, 2cqi, 1.125rem);
  }
}
```

### container-name の命名規則

Layout 層のコンテナには、役割に応じた名前を付与しています。

| クラス | container-name | 用途 |
|--------|---------------|------|
| `.l-viewport` | `viewport` | ビューポート全体（`<html>` に付与） |
| `.l-section` | `section` | セクション単位のコンテナ |
| `.l-container` | `container` | コンテンツ幅コンテナ |

`@container section` のように名前付きで参照すると、意図しない祖先コンテナへの参照を防げます。

### 流体計算ヘルパー

`tokens/structure.css` で定義される 3 つのカスタムプロパティは、`clamp()` で連続的なレスポンシブを実現するヘルパーです。

| プロパティ | 役割 |
|-----------|------|
| `--px` | `px` を `rem` に変換する係数（`1rem / 16`） |
| `--vp-range` | ビューポートの変動幅（`max - min`） |
| `--vp-offset` | 現在のビューポート幅と最小幅の差分 |

使用例（`l-section.css`）:

```css
.l-section {
  --_min: 60;
  --_max: 100;

  padding-block: clamp(
    calc(var(--_min) * var(--px)),
    calc((var(--_max) - var(--_min)) / var(--vp-range) * var(--vp-offset) + var(--_min) * var(--px)),
    calc(var(--_max) * var(--px))
  );
}
```

`--_min` と `--_max` に単位なしの数値を指定するだけで、ビューポート幅に応じた滑らかな値変化を得られます。Project 層からこれらのプライベートカスタムプロパティを上書きすることで、セクションごとの余白調整が可能です。

### Utility

`u-hidden.css` には以下のユーティリティが含まれます。

| クラス | 用途 |
|--------|------|
| `.u-hidden-pc` | PC 表示時に非表示（768px 以上） |
| `.u-hidden-sp` | SP 表示時に非表示（768px 未満） |
| `.u-visually-hidden` | 視覚的に非表示（スクリーンリーダーには読まれる） |

`u-visually-hidden` はアクセシビリティ対応の標準パターンで、論理プロパティ（`inline-size` / `block-size`）を使用しています。

### カラートークン設計（参考）

本リファレンス実装では、カラートークンを以下の 4 層で管理しています。これは仕様の必須要件ではなく、設計の参考情報です。

| 層 | 例 | 役割 |
|----|-----|------|
| キーカラー | `--slate-*`, `--vermilion-*` | ブランドを構成する色相スケール |
| 共通カラー | `--neutral-*`, `--white`, `--black` | ブランド非依存の汎用色 |
| 機能カラー | `--error-*` | 状態を表す機能的な色 |
| セマンティックカラー | `--color-main`, `--color-text` | Theme 層で意味を付与（`light-dark()` で切替） |

キーカラー・共通カラー・機能カラーは Tokens 層（`tokens/color.css`）で値を定義し、セマンティックカラーは Theme 層（`theme/color.css`）で `light-dark()` を使ってマッピングします。ブランドが変わったときは Tokens の値を差し替えるだけで、Theme 以降の層は変更不要です。

## この本について

[そのFLOCSS、なぜそこに書いた？ —— mFLOCSS で迷わない CSS 設計の判断基準](https://zenn.dev/shunei/books/mflocss-design)

公式サイト: [mflocss.dev](https://mflocss.dev)

## ライセンス

MIT
