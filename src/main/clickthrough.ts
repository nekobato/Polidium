import { BrowserWindow, nativeTheme, Tray } from 'electron';
import path from 'path';
import * as types from '../mutation-types';
import { assetPath } from './env';
import logger from './log';

// https://electronjs.org/docs/tutorial/mojave-dark-mode-guide
const mode = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
const trayIconOn = path.join(assetPath, `tray_icon_${mode}_on.png`);
const trayIconOff = path.join(assetPath, `tray_icon_${mode}_off.png`);

export const toggleClickThrough = (
  mainWindow: BrowserWindow,
  controllerWindow: BrowserWindow,
  tray: Tray
) => {
  const isOn = mainWindow.isAlwaysOnTop() ? true : false;
  logger.debug('tray is clicked', { isOn: isOn });

  mainWindow.webContents.send(isOn ? types.WINDOW_TRANSPARENT_OFF : types.WINDOW_TRANSPARENT_ON);
  controllerWindow.webContents.send(
    isOn ? types.WINDOW_TRANSPARENT_OFF : types.WINDOW_TRANSPARENT_ON
  );
  mainWindow.setIgnoreMouseEvents(isOn ? false : true);
  mainWindow.setVisibleOnAllWorkspaces(isOn ? false : true);
  mainWindow.setAlwaysOnTop(isOn ? false : true);
  tray.setImage(isOn ? trayIconOff : trayIconOn);
};

export default toggleClickThrough;
