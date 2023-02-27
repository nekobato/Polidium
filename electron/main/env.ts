import os from 'node:os';

export const DEBUG = process.env.NODE_ENV !== 'production';
export const MAC = os.type() === 'Darwin' ? true : false;
