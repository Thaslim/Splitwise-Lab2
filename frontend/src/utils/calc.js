/* eslint-disable implicit-arrow-linebreak */
export const roundToTwo = (num) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const reducedSum = (arr) => {
  // get sum of msgCount prop across all objects in array
  const balanceTotal = arr.reduce((prev, cur) => prev + cur, 0);
  return balanceTotal;
};
