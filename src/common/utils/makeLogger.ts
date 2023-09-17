export const makeLogger = (prefix: string) => {
  return {
    log: (...args: unknown[]) => {
      if (import.meta.env.DEV) {
        console.log(`[${prefix}]`, ...args);
      }
    },
    fork: (newPrefix: string) => {
      return makeLogger(`${prefix}::${newPrefix}`);
    },
  };
};
