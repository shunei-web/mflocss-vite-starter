# コーディングガイド

このプロジェクトで使用する CSS 設計（mFLOCSS）のルールです。

## 命名規則

### プレフィックス

| プレフィックス | レイヤー | 例 |
|-------------|---------|-----|
| `l-` | Layout | `l-section`, `l-section__inner` |
| `c-` | Component | `c-button-cta`, `c-section-heading` |
| `p-` | Project | `p-header`, `p-footer` |
| `a-` | Animation | `a-fade-in-activate` |
| `u-` | Utility | `u-hidden-sp`, `u-visually-hidden` |

### BEM + .-modifier

```
.c-button-cta           → Block
.c-button-cta__icon      → Element
.c-button-cta.-large     → Modifier（BEM の -- ではなく .- を使用）
```

### 状態クラス

JavaScript で切り替える状態は `.is-*` を使用:

```
.is-active
.is-open
.is-hidden
```

## レイヤー判断フロー

1. デザイントークン？ → プリミティブな値の定義なら **Tokens**、セマンティックなマッピングなら **Theme**
2. ブラウザ環境の初期化・要素の基本スタイル？ → **Foundation**
3. 配置と空間だけ？（色・文字・装飾に触れない？） → **Layout**
4. 別のサイトにそのまま持っていける？（Portability Test） → Yes: **Component** / No: **Project**
5. `prefers-reduced-motion` で無効化すべき動き？ → **Animation**
6. 局所的な単一目的の微調整？ → **Utility**

**Portability Test**: 「そのパーツを別のサイトにそのまま持っていけるか？」で Component と Project を判定する。判断が曖昧な場合は **Responsibility Test**（「パーツ自身の視覚的責任か？使う側のデザイン要件か？」）を補助的に使用する。

## ファイル追加手順

1. 対応するレイヤーのディレクトリに `プレフィックス-名前.css` を作成
2. スタイルを記述（`@layer` で囲む必要はない）
3. `src/css/style.css` に `@import './レイヤー名/ファイル名.css' layer(レイヤー名);` で追加

## コミットメッセージ

```
feat: 日本語でタイトルを書く
fix: 日本語で修正内容を書く
```

prefix は英語、タイトル・本文は日本語。
