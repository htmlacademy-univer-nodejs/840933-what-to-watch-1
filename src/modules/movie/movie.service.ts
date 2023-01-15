import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/types/component.type.js';
import { TGenre } from '../../types/types/genre.type.js';
import { CreateMovieDto } from './dto/createMovie.dto.js';
import { UpdateMovieDto } from './dto/updateMovie.dto.js';
import { MovieServiceInterface } from './movieService.interface.js';
import { MovieEntity } from './movie.entity.js';
import { MAX_MOVIES_COUNT } from '../../constants/moviesCount.constant.js';

@injectable()
export class MovieService implements MovieServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.MovieModel)
    private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  async create(
    dto: CreateMovieDto,
    user: string
  ): Promise<DocumentType<MovieEntity>> {
    const movie = await (await this.movieModel.create({ ...dto, user })).populate('user');
    this.logger.info(`Создан новый фильм: ${dto.title}`);
    return movie;
  }

  async findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findById(movieId).populate('user');
  }

  async find(limit?: number): Promise<DocumentType<MovieEntity>[]> {
    const movies = await this.movieModel.aggregate([
      { $addFields: { id: { $toString: '$_id' } } },
      { $sort: { publishingDate: 1 } },
      { $limit: limit || MAX_MOVIES_COUNT },
    ]);
    return this.movieModel.populate(movies, 'user');
  }

  async updateById(
    movieId: string,
    dto: UpdateMovieDto
  ): Promise<DocumentType<MovieEntity> | null> {
    this.logger.info(`Обновляю фильм: ${dto.title}`);
    return this.movieModel
      .findByIdAndUpdate(movieId, dto, { new: true })
      .populate('user');
  }

  async deleteById(movieId: string): Promise<void | null> {
    return this.movieModel.findByIdAndDelete(movieId);
  }

  async findByGenre(
    genre: TGenre,
    limit?: number
  ): Promise<DocumentType<MovieEntity>[]> {
    const movies = await this.movieModel.aggregate([
      { $match: { genre } },
      { $addFields: { id: { $toString: '$_id' } } },
      { $sort: { publishingDate: 1 } },
      { $limit: limit || MAX_MOVIES_COUNT },
    ]);
    return this.movieModel.populate(movies, 'user');
  }

  async findPromo(): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findOne({ isPromo: true }).populate('user');
  }

  async incCommentsCount(movieId: string): Promise<void | null> {
    return this.movieModel.findByIdAndUpdate(movieId, {
      $inc: { commentsCount: 1 },
    });
  }

  async updateMovieRating(
    movieId: string,
    newRating: number
  ): Promise<void | null> {
    const oldValues = await this.movieModel
      .findById(movieId)
      .select('rating commentsCount');
    const oldRating = oldValues?.['rating'] ?? 0;
    const oldCommentsCount = oldValues?.['commentsCount'] ?? 0;
    const newCommentsCount = (oldRating * oldCommentsCount + newRating) / (oldCommentsCount + 1);
    return this.movieModel.findByIdAndUpdate(movieId, {
      rating: newCommentsCount,
    });
  }

  async exists(documentId: string): Promise<boolean> {
    return (await this.movieModel.exists({ _id: documentId })) !== null;
  }
}
