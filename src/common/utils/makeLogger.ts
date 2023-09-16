
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

if (import.meta.vitest) {
  const { describe, it, beforeEach, expect, vi, afterEach } = import.meta.vitest;

describe('createLogger', () => {
  const oldConsoleLog = console.log;
  beforeEach(() => {
    console.log = vi.fn();
  });
  afterEach(() => {
    console.log = oldConsoleLog;
  });

  it('should create a logger with a prefix', () => {
    const logger = makeLogger('test');
    logger.log('hello');
    logger.log('world');
    expect(console.log).toHaveBeenCalledWith('[test]', 'hello');
    expect(console.log).toHaveBeenCalledWith('[test]', 'world');
  });

  it('should allow forking a logger', () => {
    const logger = makeLogger('test');
    const logger2 = logger.fork('test2');
    logger.log('hello');
    logger2.log('world');
    expect(console.log).toHaveBeenCalledWith('[test]', 'hello');
    expect(console.log).toHaveBeenCalledWith('[test::test2]', 'world');
  });

  it('should not log in production', () => {
    const oldDev = import.meta.env.DEV;
    import.meta.env.DEV = false;
    const logger = makeLogger('test');
    logger.log('hello');
    expect(console.log).not.toHaveBeenCalled();
    import.meta.env.DEV = oldDev;
  });
});

}
