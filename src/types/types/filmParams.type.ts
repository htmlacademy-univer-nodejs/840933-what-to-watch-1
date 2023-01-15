import { TGenre } from './genre.type';

export type ParamsGetMovie = {
  movieId: string;
};

export type QueryParamsGetMovies = {
  limit?: string;
  genre?: TGenre;
};
