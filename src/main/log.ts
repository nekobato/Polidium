import { DEBUG } from './env';

export default {
  debug(msssage: string, data: { [K: string]: any }) {
    if (DEBUG) {
      console.debug('# DEBUG:', msssage, data);
    }
  },
};
