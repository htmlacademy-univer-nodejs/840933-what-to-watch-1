import { Expose } from 'class-transformer';
import { Genre } from '../../../types/genre.type';

export class FilmResponse {
  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publicationDate!: number;

  @Expose()
  public genre!: Genre;

  @Expose()
  public releaseYear!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public previewLink!: string;

  @Expose()
  public videoLink!: string;

  @Expose()
  public actors!: string[];

  @Expose()
  public producer!: string;

  @Expose()
  public duration!: number;

  @Expose()
  public userId!: string;

  @Expose()
  public poster!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;
}
