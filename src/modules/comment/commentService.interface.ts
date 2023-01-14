import { DocumentType } from '@typegoose/typegoose/lib/types.js';

import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/createComment.dto.js';

export interface CommentServiceInterface {
  findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]>;
  create(
    dto: CreateCommentDto,
    user: string
  ): Promise<DocumentType<CommentEntity>>;
}
