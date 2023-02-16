import electron, { app, BrowserWindow, ipcMain } from 'electron';
import os, { release } from 'node:os';
import { join } from 'node:path';
import { createControllerWindow } from './controllerWindow';
import { createViewerWindow } from './viewerWindow';

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

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let viewerWindow: BrowserWindow | null = null;
let controllerWindow: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

app.on('window-all-closed', () => {
  viewerWindow = null;
  if (process.platform !== 'darwin') app.quit();
});

// app.on('activate', () => {
//   const allWindows = BrowserWindow.getAllWindows();
//   if (allWindows.length) {
//     // allWindows[0].focus();
//   } else {
//     createViewerWindow('/viewer');
//   }
// });

app
  .whenReady()
  .then(async () => {
    viewerWindow = await createViewerWindow('/viewer');
    controllerWindow = await createControllerWindow('/controller');
  })
  .then(() => {
    ipcMain.on('renderer-envet', (_, event, payload) => {
      if (process.env.NODE_ENV === 'development') console.log('ipcMain', payload);
      switch (event) {
        case 'viewer:fit-to-screen':
          var screen = electron.screen;
          var size = screen.getPrimaryDisplay().workAreaSize;
          viewerWindow.setSize(size.width, size.height - 24);
          break;
        case 'viewer:resize':
          viewerWindow.setIgnoreMouseEvents(!payload.mode);
          viewerWindow.setResizable(payload.mode);
          viewerWindow.setMovable(payload.mode);
          if (MAC) viewerWindow.setVisibleOnAllWorkspaces(!payload.mode);
          if (payload.mode) {
            viewerWindow.focus();
          } else {
            viewerWindow.blur();
          }
          break;
        case 'viewer:hide':
          viewerWindow.hide();
          break;
        case 'viewer:show':
          viewerWindow.show();
          break;
        // Viewer側でpayload解釈
        case 'viewer:settings':
        case 'viewer:web':
        case 'viewer:video':
          viewerWindow?.webContents.send('main-process-message', payload);
          break;
        default:
          break;
        case 'quit':
          app.quit();
      }
    });
  });
