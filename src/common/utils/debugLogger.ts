const DEBUG = true;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logger = (...args: any) => {
  if (DEBUG) {
    console.log(...args);
  }
};
