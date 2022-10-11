export function getRandomValue(min: number, max: number, numAfterDigit = 0) {
  return Number(((Math.random() * (max - min)) + min).toFixed(numAfterDigit));
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = getRandomValue(0, items.length - 1);
  const endPosition = startPosition + getRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]): T {
  return items[getRandomValue(0, items.length - 1)];
}

export function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
