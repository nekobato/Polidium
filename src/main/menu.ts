import electron from 'electron';
import * as types from '../shared/mutation-types';

const menuTemplate: (electron.MenuItemConstructorOptions | electron.MenuItem)[] = [
  // @ts-ignore: appMenu is not defined in d.ts
  {
    label: 'Polidium',
    submenu: [
      {
        id: 'reset_opacity',
        label: 'Reset Opacity',
        click(_: any, browserWindow) {
          browserWindow.setOpacity(1);
          browserWindow.webContents.send(types.SET_OPACITY, 100);
        },
      },
      {
        id: 'switch_hide_taskbar',
        label: 'Hide on Taskbar',
        type: 'checkbox',
        click(menuItem, browserWindow) {
          browserWindow.setSkipTaskbar(menuItem.checked);
          browserWindow.webContents.send(types.SET_HIDE_ON_TASKBAR, menuItem.checked);
        },
      },
      {
        type: 'separator',
      },
      {
        id: 'quit',
        label: 'Quit Polidium',
        role: 'quit',
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', role: 'undo' },
      { label: 'Redo', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', role: 'cut' },
      { label: 'Copy', role: 'copy' },
      { label: 'Paste', role: 'paste' },
      { label: 'Select All', role: 'selectall' },
    ],
  },
  // @ts-ignore: viewMenu is not defined in d.ts
  {
    label: 'View',
    role: 'viewMenu',
  },
];

export default menuTemplate;
