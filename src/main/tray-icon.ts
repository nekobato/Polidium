import { BrowserWindow, systemPreferences, Tray } from 'electron';
import path from 'path';
import * as types from '../shared/mutation-types';
import { assetPath } from './env';
import logger from './log';

export function setTrayIcon(mainWindow: BrowserWindow): Tray {
  // https://electronjs.org/docs/tutorial/mojave-dark-mode-guide
  const mode = systemPreferences.isDarkMode() ? 'dark' : 'light';
  const trayIconOn = path.join(assetPath, `tray_icon_${mode}_on.png`);
  const trayIconOff = path.join(assetPath, `tray_icon_${mode}_off.png`);

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
