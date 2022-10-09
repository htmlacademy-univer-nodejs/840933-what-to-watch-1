import { Film } from '../types/film.type.js';
import { genreConstructor } from '../types/genre.type.js';
import { getRandomValue } from './random-function.js';

export const createFilm = (row: string): Film => {
  const [
    name,
    description,
    publicationDate,
    genre,
    releaseYear,
    rating,
    previewLink,
    videoLink,
    actors,
    producer,
    duration,
    userName,
    email,
    password,
    avatarPath,
    poster,
    backgroundImage,
    backgroungColor
  ] = row.replace('\n', '').split('\t');

  return {
    name,
    description,
    publicationDate: new Date(publicationDate),
    genre: genreConstructor(genre),
    releaseYear: Number(releaseYear),
    rating: Number(rating),
    previewLink,
    videoLink,
    actors: actors.split(','),
    producer,
    duration: Number(duration),
    commentCount: getRandomValue(0, 10_000),
    user: {
      name: userName,
      email,
      password,
      avatarPath
    },
    poster,
    backgroundImage,
    backgroungColor
  };
};
