import path from 'path';

export const DEBUG = process.env.DEBUG;
export const isMac = process.platform === 'darwin';
export const assetPath = DEBUG
  ? path.resolve('public/assets')
  : path.resolve('../../public/assets');
