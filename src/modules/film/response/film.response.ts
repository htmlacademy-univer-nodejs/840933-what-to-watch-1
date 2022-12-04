import { Expose } from 'class-transformer';
import { Genre } from '../../../types/genre.type';

export class FilmResponse {
  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publishingDate!: number;

  @Expose()
  public genre!: Genre;

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
  public durationInMinutes!: number;

  @Expose()
  public userId!: string;

  @Expose()
  public posterPath!: string;

  @Expose()
  public backgroundImagePath!: string;

  @Expose()
  public backgroundColor!: string;
}
