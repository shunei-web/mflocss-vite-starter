# コーディングガイド

このプロジェクトで使用する CSS 設計（mFLOCSS）のルールです。

## 命名規則

### プレフィックス

| プレフィックス | レイヤー | 例 |
|-------------|---------|-----|
| `l-` | Layout | `l-section`, `l-inner` |
| `c-` | Component | `c-button`, `c-section-heading` |
| `p-` | Project | `p-header`, `p-footer` |
| `u-` | Utility | `u-hidden-sp`, `u-visually-hidden` |

Token, Reset, Foundation, Animation はプレフィックスなし。

### BEM + .-modifier

```
.c-button              → Block
.c-button__icon        → Element
.c-button.-primary     → Modifier（BEM の -- ではなく .- を使用）
```

### 状態クラス

JavaScript で切り替える状態は `.is-*` を使用:

```
.is-visible
.is-loading
```

## レイヤー判断フロー

1. デザイントークン（色・フォント・余白の変数）→ **Token**
2. ブラウザリセット → **Reset**
3. 要素セレクタのデフォルト → **Foundation**
4. ページの骨格（セクション幅・コンテナ）→ **Layout**
5. 複数ページで使い回すパーツ → **Component**
6. 特定のページ・機能でしか使わないパーツ → **Project**
7. 装飾的アニメーション（なくても機能する演出）→ **Animation**
8. 上記で対処できない局所的な調整 → **Utility**

## プライベート変数（`--_`）

`--_` プレフィックスの変数はそのブロック内でのみ使用する内部変数です。外部から参照しません。

```css
.c-hamburger {
  --_line-width: 20px;   /* このコンポーネント内でのみ使用 */
  --_line-height: 2px;
}
```

例外: `color.css` 内の `--_` パレット変数は同ファイルのセマンティック変数から参照されます（primitive → semantic 変換）。

## 単位の使い分け

| 単位 | 記法 | 対象 |
|------|------|------|
| **rem** | `calc(N * var(--px))` | フォントサイズ・余白・ヘッダー高さ等、ユーザーのフォント設定に追従すべき値 |
| **px** | `Npx` | 角丸・シャドウ・ボーダー幅・コンテンツ幅上限・タップ領域等、物理的な制約に紐づく値 |

## ファイル追加手順

1. 対応するレイヤーのディレクトリに `プレフィックス-名前.css` を作成
2. `src/css/style.css` に `@import './ディレクトリ/ファイル名.css' layer(レイヤー名);` を追加

## コミットメッセージ

```
<prefix>: 変更内容を日本語で簡潔に
```

### prefix

| prefix | 用途 | 例 |
|--------|------|-----|
| `feat` | 新機能・新コンポーネント追加 | `feat: FAQ セクションにアコーディオンを追加` |
| `fix` | バグ修正・表示崩れ修正 | `fix: SP でハンバーガーメニューが閉じない問題を修正` |
| `refactor` | 動作を変えないコード改善 | `refactor: p-header の CSS 変数をトークン参照に統一` |
| `style` | フォーマット・空白・セミコロン等 | `style: Prettier による自動整形` |
| `docs` | ドキュメントのみの変更 | `docs: README にダークモード無効化手順を追加` |
| `chore` | ビルド・設定・依存関係 | `chore: Stylelint を v17 に更新` |

### ルール

- prefix は英語、タイトルは日本語
- 「何を変えたか」ではなく「何が変わるか」を書く
- 1行目は 72 文字以内を目安に
