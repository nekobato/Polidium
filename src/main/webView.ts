import { BrowserView, BrowserWindow } from 'electron';
import * as types from '../mutation-types';

export function createWebView(
  mainWindow: BrowserWindow,
  controllerWindow: BrowserWindow,
): BrowserView {
  const webView = new BrowserView();
  mainWindow.setBrowserView(webView);
  const { width, height } = mainWindow.getBounds();
  webView.setBounds({ x: 0, y: 0, width, height });
  webView.webContents.loadURL('https://google.com');
  webView.webContents.on('did-navigate', (_, url) => {
    setUrl(url);
  });
  webView.webContents.on('did-navigate-in-page', (_, url) => {
    setUrl(url);
  });

  function setUrl(url: string): void {
    if (!mainWindow || !webView) return;
    mainWindow.webContents.send(types.SET_URL, {
      url,
      canGoBack: webView.webContents.canGoBack(),
      canGoForward: webView.webContents.canGoForward(),
    });
    controllerWindow.webContents.send(types.SET_URL, {
      url,
      canGoBack: webView.webContents.canGoBack(),
      canGoForward: webView.webContents.canGoForward(),
    });
  }

  return webView;
}
