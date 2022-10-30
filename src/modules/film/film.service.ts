import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { FilmServiceInterface } from './film.interface.js';
import { CreateFilmDto } from './dto/film.js';
import { FilmEntity } from './film.entity.js';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';

@injectable()
export class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.FilmModel)
    private readonly movieModel: types.ModelType<FilmEntity>
  ) {}

  async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const movie = await this.movieModel.create(dto);
    this.logger.info(`Создан новый фильм: ${dto.name}`);

    return movie;
  }

  async findById(movieId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.movieModel.findById(movieId).exec();
  }
}
