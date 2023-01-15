import { Expose, Type } from 'class-transformer';

import { TGenre } from '../../../types/types/genre.type.js';
import { UserResponse } from '../../user/response/user.response.js';

export class MovieResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publishingDate!: number;

  @Expose()
  public genre!: TGenre;

  @Expose()
  public releaseYear!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public previewPath!: string;

  @Expose()
  public moviePath!: string;

  @Expose()
  public actors!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public duration!: number;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterPath!: string;

  @Expose()
  public backgroundImagePath!: string;

  @Expose()
  public backgroundColor!: string;

  @Expose()
  public commentsCount!: number;
}
