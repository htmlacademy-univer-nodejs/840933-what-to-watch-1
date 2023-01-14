import { types } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { inject, injectable } from 'inversify';

import { Component } from '../../types/types/component.type.js';
import { MovieServiceInterface } from '../movie/movieService.interface.js';
import { CommentServiceInterface } from './commentService.interface.js';
import { CommentEntity } from './comment.entity.js';
import { MAX_COMMENTS_COUNT } from './comment.models.js';
import { CreateCommentDto } from './dto/createComment.dto.js';

@injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.MovieServiceInterface)
    private readonly movieService: MovieServiceInterface
  ) {}

  public async create(
    dto: CreateCommentDto,
    user: string
  ): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({ ...dto, user });
    await this.movieService.updateMovieRating(dto.movieId, dto.rating);
    await this.movieService.incCommentsCount(dto.movieId);
    return comment.populate('user');
  }

  public async findByMovieId(
    movieId: string
  ): Promise<DocumentType<CommentEntity>[]> {
    const movieComments = await this.commentModel
      .find({ movieId })
      .sort({ createdAt: -1 })
      .limit(MAX_COMMENTS_COUNT);
    return this.commentModel.populate(movieComments, 'user');
  }
}
