export const nextTick = async () => {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
};
