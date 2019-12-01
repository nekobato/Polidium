import { systemPreferences, Tray } from 'electron';
import path from 'path';
import logger from './log';

export function setTrayIcon(): Tray {
  // https://electronjs.org/docs/tutorial/mojave-dark-mode-guide
  const darkOrLight = systemPreferences.isDarkMode() ? 'dark' : 'light';
  const trayIconOff = path.join(__static, `tray_icon_${darkOrLight}_off.png`);

  const tray = new Tray(trayIconOff);
  return tray;
}
