import { nativeTheme, Tray } from 'electron';
import path from 'path';

export function setTrayIcon(): Tray {
  // https://electronjs.org/docs/tutorial/mojave-dark-mode-guide
  const darkOrLight = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  const trayIconOff = path.join(__static, `tray_icon_${darkOrLight}_off.png`);

  const tray = new Tray(trayIconOff);
  return tray;
}
