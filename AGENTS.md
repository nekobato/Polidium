# Polidium コードベースガイドライン

## ビルド・開発コマンド

- 開発環境: `pnpm run dev`
- ビルド: `pnpm run build`
- リント: `pnpm run lint` (TypeScript 型チェック＆Vue 型チェック)
- リリース: `pnpm run release`

## コードスタイル

- **型定義**: 厳格な型付けを使用 (`strict: true`)、未使用変数・パラメータは許可しない
- **インポート**:
  - パス別名: `@/*` → `src/*`
  - 型インポートには `import type` を使用
  - コンポーネントはパスカルケース (`VideoPlayer.vue`)
- **命名規則**:
  - 変数・関数: キャメルケース (`videoTimeupdate`)
  - 定数: スネークケース大文字 (`CONNECT_STATE`)
  - コンポーネントプロパティ: キャメルケース
- **Vue**: Vue 3 + Composition API + `<script setup>` 構文
- **スタイル**: SCSS、コンポーネントごとに `scoped` 使用

## アーキテクチャ

- **状態管理**: Pinia ストア
- **通信**: Electron IPC 経由でメインプロセス ⇔ レンダラープロセス間通信
- **エラー処理**: Sentry による監視（`VITE_SENTRY_DSN`環境変数が必要）
