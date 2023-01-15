import { getGenre } from '../types/types/genre.type.js';

export const createMovie = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    title,
    description,
    publishingDate,
    genre,
    releaseYear,
    rating,
    previewPath,
    moviePath,
    actors,
    director,
    duration,
    userName,
    email,
    posterPath,
    backgroundImagePath,
    backgroundColor,
  ] = tokens;
  return {
    title,
    description,
    publishingDate: new Date(publishingDate),
    genre: getGenre(genre),
    releaseYear: Number(releaseYear),
    rating: Number(rating),
    previewPath,
    moviePath,
    actors: actors.split(';'),
    director,
    duration: Number(duration),
    commentsCount: 0,
    user: { email, name: userName },
    posterPath,
    backgroundImagePath,
    backgroundColor,
  };
};
