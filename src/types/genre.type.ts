export enum GenreEnum {
  COMEDY = 'comedy',
  CRIME = 'crime',
  FAMILY = 'family',
  ROMANCE = 'romance',
  SCIFI = 'scifi',
  THRILLER = 'thriller',
  DOCUMENTARY = 'documentary',
  DRAMA = 'drama',
  HORROR = 'horror',
}

export const genreArray = [
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
  if (!genreArray.includes(input)) {
    throw Error(`Жанр ${input} не существует`);
  }

  return input;
};
