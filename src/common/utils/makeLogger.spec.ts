import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeLogger } from './makeLogger';

describe('createLogger', () => {
  const oldConsoleLog = console.log;
  const oldConsoleWarn = console.warn;
  const oldConsoleError = console.error;
  const oldConsoleInfo = console.info;
  beforeEach(() => {
    console.log = vi.fn();
    console.error = vi.fn();
    console.warn = vi.fn();
    console.info = vi.fn();
  });
  afterEach(() => {
    console.log = oldConsoleLog;
    console.error = oldConsoleError;
    console.warn = oldConsoleWarn;
    console.info = oldConsoleInfo;
  });

  it.each(['log', 'error', 'warn', 'info'])(
    `should create a logger with a prefix for log %s`,
    (method: string) => {
      const methodName = method as 'log' | 'error' | 'warn' | 'info';
      const logger = makeLogger('test');
      logger[methodName]('hello');
      expect(console[methodName]).toHaveBeenCalledWith('[test]', 'hello');
    }
  );

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
