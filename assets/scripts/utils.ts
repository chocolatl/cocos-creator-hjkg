/**
 * 生成一个min到max之间的随机整数，不包括max
 * @param min
 * @param max
 */
export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;
