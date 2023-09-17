export type Logger = ReturnType<typeof makeLogger>;

export let temporaryDisableLogger = false;

export const pauseLogger = () => {
  temporaryDisableLogger = true;
};

export const resumeLogger = () => {
  temporaryDisableLogger = false;
};

const invokeLogger =
  (methodName: 'log' | 'error' | 'warn' | 'info', prefix: string) =>
  (...args: unknown[]) => {
    if (import.meta.env.DEV && !temporaryDisableLogger) {
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
