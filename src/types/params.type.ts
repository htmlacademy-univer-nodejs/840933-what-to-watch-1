import { Genre } from './genre.type';

export type ParamsToGetFilm = {
  id: string;
}

export type ParamsToGetFilms = {
  limit?: number;
  genre?: Genre;
}
