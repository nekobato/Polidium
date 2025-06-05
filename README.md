[![GitHub issues](https://img.shields.io/github/release/nekobato/Polidium.svg)](https://github.com/nekobato/Polidium/release)

# Polidium

Polidiumは半透明ウィンドウとカーソル操作の透過を備えたメディアプレイヤーおよびブラウザです。

![](https://github.com/nekobato/Polidium/blob/master/imageSource/screenshot0.jpg?raw=true)

## Download

- Mac: https://github.com/nekobato/Polidium/releases/latest
- Windows: TBD

## 機能

### 操作方法

起動するとメニューバーにアイコンが現れます。アイコンをクリックでコントローラーが表示され、そこから操作できます。

### メディアプレイヤー

- D&D操作による動画プレイリスト
- コントローラーからのファイルの再生・停止・再生位置操作
- 動画終了時の自動次送り

<img src="https://github.com/nekobato/Polidium/blob/master/imageSource/screenshot1.jpg?raw=true" width="363" height="343" />

### Webブラウザ

- URL入力からのブラウザ表示
- ポインター操作透過のON/OFFスイッチ

<img src="https://github.com/nekobato/Polidium/blob/master/imageSource/screenshot2.jpg?raw=true" width="352" height="342" />


### 操作パネル

- プレイヤーの透過度調整
- プレイヤーのりサイズ・移動モードへの切り替え
- アプリケーションの終了もこちらから

## Release Notes

https://github.com/nekobato/Polidium/releases

## Development

```
Clone this Repository
cd Polidium
pnpm install
pnpm run dev
```

Sentry を利用する場合は、環境変数 `VITE_SENTRY_DSN` に DSN を設定してください。
