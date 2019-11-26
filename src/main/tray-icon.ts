import { BrowserWindow, systemPreferences, Tray } from 'electron';
import path from 'path';
import * as types from '../mutation-types';
// import { assetPath } from './env';
import logger from './log';

export function setTrayIcon(mainWindow: BrowserWindow): Tray {
  // https://electronjs.org/docs/tutorial/mojave-dark-mode-guide
  const darkOrLight = systemPreferences.isDarkMode() ? 'dark' : 'light';
  const trayIconOn = path.join(__static, `tray_icon_${darkOrLight}_on.png`);
  const trayIconOff = path.join(__static, `tray_icon_${darkOrLight}_off.png`);

  const tray = new Tray(trayIconOff);

  tray.on('click', () => {
    // Click through
    const isOn = mainWindow.isAlwaysOnTop() ? true : false;
    logger.debug('tray is clicked', { isOn: isOn });

    mainWindow.webContents.send(isOn ? types.WINDOW_TRANSPARENT_OFF : types.WINDOW_TRANSPARENT_ON);
    mainWindow.setIgnoreMouseEvents(isOn ? false : true);
    mainWindow.setVisibleOnAllWorkspaces(isOn ? false : true);
    mainWindow.setAlwaysOnTop(isOn ? false : true);
    tray.setImage(isOn ? trayIconOff : trayIconOn);
  });

  return tray;
}
