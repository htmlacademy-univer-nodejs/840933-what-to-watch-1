import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types.js';

import { CommentServiceInterface } from './comment.interface.js';
import { Component } from '../../types/component.type.js';
import { CommentEntity } from './comment.entity.js';
import { CommentDto } from './dto/comment.dto.js';
import { FilmServiceInterface } from '../film/film.interface.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.FilmServiceInterface)
    private readonly movieService: FilmServiceInterface
  ) {}

  public async create(
    dto: CommentDto
  ): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    await this.movieService.updateRating(dto.filmId, dto.rating);
    await this.movieService.incrementComments(dto.filmId);
    return comment.populate('userId');
  }

  public async findByFilmId(
    filmId: string
  ): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({
      filmId
    }).populate('userId');
  }
}
