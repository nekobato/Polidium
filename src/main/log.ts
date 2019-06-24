export default {
  debug(msssage: string, data: { [K: string]: any }) {
    if (process.env.DEBUG) {
      console.debug('# DEBUG:', msssage, data);
    }
  },
};
