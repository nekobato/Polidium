const DEBUG = process.env.DEBUG;

export const debug = (...args: any[]): void => {
  if (DEBUG) {
    console.log(...args);
  }
};

export default debug;
