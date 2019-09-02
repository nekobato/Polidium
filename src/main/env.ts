import path from 'path';

export const DEBUG = process.env.DEBUG;
export const isMac = process.platform === 'darwin';
export const assetPath = path.resolve(__dirname, '../../public/assets');
