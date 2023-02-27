import electron, { app, ipcMain } from 'electron';
import os, { release } from 'node:os';
import { join } from 'node:path';
import { createControllerWindow, Controller } from './controller';
import { createViewerWindow, Viewer } from './viewer';

process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

const MAC = os.type() === 'Darwin' ? true : false;

let viewer: Viewer = null;
let controller: Controller = null;

app.on('window-all-closed', () => {
  viewer = null;
  controller = null;
  if (process.platform !== 'darwin') app.quit();
});

app
  .whenReady()
  .then(() => {
    viewer = createViewerWindow('/viewer');
    controller = createControllerWindow('/controller');
  })
  .then(() => {
    ipcMain.on('renderer-envet', (_, event, payload) => {
      if (process.env.NODE_ENV === 'development') console.log('ipcMain', payload);
      switch (event) {
        case 'mode:web':
          viewer.setWebView(true);
          break;
        case 'mode:video':
          viewer.setWebView(false);
          break;
        case 'mode:resize':
          viewer.resizeMode(payload);
          break;
        case 'viewer:fit-to-screen':
          var screen = electron.screen;
          var size = screen.getPrimaryDisplay().workAreaSize;
          viewer.win.setSize(size.width, size.height - 24);
          break;
        case 'viewer:hide':
          viewer.win.hide();
          break;
        case 'viewer:show':
          viewer.win.show();
          break;
        // Viewer側でpayload解釈
        case 'viewer:settings':
        case 'viewer:web':
        case 'viewer:video':
          viewer.win.webContents.send('main-process-message', payload);
          break;
        default:
          break;
        case 'quit':
          app.quit();
      }
    });
  });
