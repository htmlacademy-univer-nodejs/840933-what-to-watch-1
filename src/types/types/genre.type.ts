import { StatusCodes } from 'http-status-codes';

import { HttpError } from '../../common/errors/http.error.js';

export const GENRE_ARRAY = [
  'comedy',
  'crime',
  'documentary',
  'drama',
  'horror',
  'family',
  'romance',
  'scifi',
  'thriller',
];

export type TGenre = typeof GENRE_ARRAY[number];

export function getGenre(value: string): TGenre | never {
  if (!GENRE_ARRAY.includes(value)) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Unrecognised genre: ${value}.`,
      'getGenre'
    );
  }

  return value;
}

export enum GenreEnum {
  Comedy = 'comedy',
  Crime = 'crime',
  Documentary = 'documentary',
  Drama = 'drama',
  Horror = 'horror',
  Family = 'family',
  Romance = 'romance',
  Scifi = 'scifi',
  Thriller = 'thriller',
}
