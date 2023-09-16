const DEBUG = true;

export const createLogger = (prefix: string) => {
  return {
    log: (...args: unknown[]) => {
      if (DEBUG) {
        console.log(`[${prefix}]`, ...args);
      }
    },
    fork: (newPrefix: string) => {
      return createLogger(`${prefix}::${newPrefix}`);
    }
  }
}
