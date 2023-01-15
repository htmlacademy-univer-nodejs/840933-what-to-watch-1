import { Expose, Type } from 'class-transformer';

import { TGenre } from '../../../types/types/genre.type.js';
import { UserResponse } from '../../user/response/user.response.js';

export class MovieListItemResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public publishingDate!: number;

  @Expose()
  public genre!: TGenre;

  @Expose()
  public previewPath!: string;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterPath!: string;

  @Expose()
  public commentsCount!: number;
}
