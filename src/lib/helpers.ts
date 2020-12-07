/**
 * Pause code exectuiton for target time in seconds
 */
const sleep = (seconds: number): Promise<string> => {
  return new Promise((resolve) => {
    if (isNaN(seconds)) {
      throw new Error('milliseconds not a number');
    }

    setTimeout(() => resolve('done!'), seconds * 1000);
  });
};

export { sleep };
