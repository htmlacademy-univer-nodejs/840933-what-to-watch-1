import {DocumentType} from '@typegoose/typegoose';
import {DocumentExistsInterface} from '../../types/interfaces/document-exists.interface.js';
import CreateMovieDto from './dto/createMovie.dto.js';
import UpdateMovieDto from './dto/updateMovie.dto.js';
import {MovieEntity} from './movie.entity.js';

export interface MovieServiceInterface extends DocumentExistsInterface {
  create(dto: CreateMovieDto, userId: string): Promise<DocumentType<MovieEntity>>;
  findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  find(limit?: number): Promise<DocumentType<MovieEntity>[]>;
  updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
  deleteById(movieId: string): Promise<void | null>;
  findByGenre(genre: string, limit?: number): Promise<DocumentType<MovieEntity>[]>;
  findPromo(): Promise<DocumentType<MovieEntity> | null>;
  incCommentsCount(movieId: string): Promise<void | null>;
  updateMovieRating(movieId: string, newRating: number): Promise<void | null>;
}
