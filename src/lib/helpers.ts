/**
 * Pause code exectuiton for target time in miliseconds
 */
const sleep = (milliseconds: number): Promise<string> => {
  return new Promise((resolve) => {
    if (isNaN(milliseconds)) {
      throw new Error('milliseconds not a number');
    }

    setTimeout(() => resolve('done!'), milliseconds);
  });
};

export { sleep };
