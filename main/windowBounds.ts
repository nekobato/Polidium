import { app } from "electron";
import * as fs from "fs";
import * as path from "path";

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getConfigPath(): string {
  const userDataPath = app.getPath("userData");
  return path.join(userDataPath, "polidium-config.json");
}

export function saveWindowBounds(bounds: WindowBounds): void {
  const configPath = getConfigPath();

  try {
    // 設定ディレクトリが存在しない場合は作成
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 既存の設定を読み込み
    let config: any = {};
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, "utf8");
      config = JSON.parse(data);
    }

    // ウィンドウバウンドを更新
    config.windowBounds = bounds;

    // ファイルに保存
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Failed to save window bounds:", error);
  }
}

export function loadWindowBounds(): WindowBounds | null {
  const configPath = getConfigPath();

  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, "utf8");
      const config = JSON.parse(data);
      return config.windowBounds || null;
    }
  } catch (error) {
    console.error("Failed to load window bounds:", error);
  }

  return null;
}
