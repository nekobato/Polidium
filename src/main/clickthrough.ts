import { BrowserWindow, systemPreferences, Tray } from 'electron';
import path from 'path';
import * as types from '../mutation-types';
import { assetPath } from './env';
import logger from './log';

// https://electronjs.org/docs/tutorial/mojave-dark-mode-guide
const mode = systemPreferences.isDarkMode() ? 'dark' : 'light';
const trayIconOn = path.join(assetPath, `tray_icon_${mode}_on.png`);
const trayIconOff = path.join(assetPath, `tray_icon_${mode}_off.png`);

export const toggleClickThrough = (window: BrowserWindow, tray: Tray) => {
  const isOn = window.isAlwaysOnTop() ? true : false;
  logger.debug('tray is clicked', { isOn: isOn });

  window.webContents.send(isOn ? types.WINDOW_TRANSPARENT_OFF : types.WINDOW_TRANSPARENT_ON);
  window.setIgnoreMouseEvents(isOn ? false : true);
  window.setVisibleOnAllWorkspaces(isOn ? false : true);
  window.setAlwaysOnTop(isOn ? false : true);
  tray.setImage(isOn ? trayIconOff : trayIconOn);
};

export default toggleClickThrough;