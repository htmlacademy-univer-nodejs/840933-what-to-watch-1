import { Expose } from 'class-transformer';

import { Genre } from '../../../types/genre.type';

export default class FilmListResponse {
  @Expose()
  public name!: string;

  @Expose()
  public publicationDate!: Date;

  @Expose()
  public genre!: Genre;

  @Expose()
  public previewLink!: string;

  @Expose()
  public userId!: string;

  @Expose()
  public poster!: string;

  @Expose()
  public commentCount!: number;
}
