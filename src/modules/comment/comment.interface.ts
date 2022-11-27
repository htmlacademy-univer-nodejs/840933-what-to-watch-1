import { DocumentType } from '@typegoose/typegoose/lib/types.js';

import { CommentEntity } from './comment.entity.js';
import { CommentDto } from './dto/comment.dto.js';

export interface CommentServiceInterface {
  findByFilmId(filmId: string): Promise<DocumentType<CommentEntity>[]>;
  create(dto: CommentDto): Promise<DocumentType<CommentEntity>>;
}
