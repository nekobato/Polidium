# Polidium プロジェクト概要

Polidium は Electron と Vue を組み合わせて作られた、透過ウィンドウ上で動作するメディアプレイヤー兼ブラウザです。メインのプレイヤーウィンドウは常に最前面に表示され、デフォルトではマウス操作を透過します。コントローラウィンドウを通して動画の再生制御やブラウザモードの切り替えが可能です。

## 主な機能

- ドラッグ&ドロップによる動画ファイルの登録とプレイリスト管理
- コントローラからの再生・停止・再生位置の操作
- 動画終了後の自動次送り
- URL 入力による Web ブラウズ
- プレイヤーウィンドウの透過度調整、リサイズ・移動モード切り替え
- マウスのポインター操作透過の ON/OFF

## ディレクトリ構成

- `src/main` - Electron のメインプロセス。`player.ts` と `controller.ts` がプレイヤー・コントローラウィンドウを生成します。
  - `src/main/player.ts` - プレイヤーウィンドウの初期化と制御。
  - `src/main/controller.ts` - コントローラウィンドウの初期化と制御。
- `src/renderer` - Vue / Element Plus によるフロントエンド。`Controller` と `Player` コンポーネントで UI を提供します。
  - `src/renderer/Controller` - コントローラウィンドウの Vue コンポーネント。
  - `src/renderer/Player` - プレイヤーウィンドウの Vue コンポーネント。
  - `src/renderer/store` - Pinia を用いた状態管理。
- `imageSource` - アプリアイコン等の画像リソース。

## 開発

```bash
pnpm install
pnpm run dev
```

Sentry を利用する場合は `VITE_SENTRY_DSN` 環境変数に DSN を設定してください。
