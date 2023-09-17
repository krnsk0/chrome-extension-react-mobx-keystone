/* eslint-disable no-console */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeLogger, pauseLogger, resumeLogger } from './makeLogger';

describe('createLogger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
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

  it('should not log when temporarily disabled', () => {
    const logger = makeLogger('test');
    pauseLogger();
    logger.log('hello');
    expect(console.log).not.toHaveBeenCalled();
    resumeLogger();
    logger.log('hi');
    expect(console.log).toHaveBeenCalledWith('[test]', 'hi');
  });
});
