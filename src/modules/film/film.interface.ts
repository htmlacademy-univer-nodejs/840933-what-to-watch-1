import { DocumentType } from '@typegoose/typegoose';

import { CreateFilmDto } from './dto/film.js';
import { FilmEntity } from './film.entity.js';
import { UpdateFilmDto } from './dto/updateFilm.js';

export interface FilmServiceInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findById(movieId: string): Promise<DocumentType<FilmEntity> | null>;
  find(): Promise<DocumentType<FilmEntity>[]>;
  updateById(movieId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  deleteById(movieId: string): Promise<void | null>;
  findByGenre(genre: string, limit?: number): Promise<DocumentType<FilmEntity>[]>;
  findPromo(): Promise<DocumentType<FilmEntity> | null>;
  incrementComments(movieId: string): Promise<void | null>;
  updateRating(movieId: string, newRating: number): Promise<void | null>;
}
