export const getRandomValue = (min: number, max: number, numAfterDigit = 0) =>
  Number(((Math.random() * (max - min)) + min).toFixed(numAfterDigit));

export const getRandomItems = <T>(items: T[]): T[] => {
  const startPosition = getRandomValue(0, items.length - 1);
  const endPosition = startPosition + getRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
};

export const getRandomItem = <T>(items: T[]): T => items[getRandomValue(0, items.length - 1)];

export const getRandomDate = (from: Date, to: Date) => {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
};
