const genreArray = [
  'comedy',
  'documentary',
  'drama',
  'horror',
  'family',
  'romance',
  'scifi',
  'thriller'
];

type GenreTuple = typeof genreArray;
export type Genre = GenreTuple[number];

export const genreConstructor = (input: string): Genre | never => {
  if (!input.includes(input)) {
    throw Error(`Жанр ${input} не существует`);
  }

  return input;
};
