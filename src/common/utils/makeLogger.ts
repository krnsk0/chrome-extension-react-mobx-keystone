const invokeLogger =
  (methodName: 'log' | 'error' | 'warn' | 'info', prefix: string) =>
  (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console[methodName](`[${prefix}]`, ...args);
    }
  };

export const makeLogger = (prefix: string) => {
  return {
    log: invokeLogger('log', prefix),
    error: invokeLogger('error', prefix),
    warn: invokeLogger('warn', prefix),
    info: invokeLogger('info', prefix),
    fork: (newPrefix: string) => {
      return makeLogger(`${prefix}::${newPrefix}`);
    },
  };
};
