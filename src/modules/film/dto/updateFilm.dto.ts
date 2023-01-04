import {
  IsArray,
  IsDateString,
  IsInt,
  IsMongoId,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  IsOptional
} from 'class-validator';

import { Genre, genreArray } from '../../../types/genre.type';
import { imageRegex } from '../constants/movie.const';

export class UpdateFilmDto {
  @IsOptional()
  @Length(2, 100, { message: 'Название должно быть от 2 до 100 символов' })
  public name!: string;

  @IsOptional()
  @Length(20, 1024, { message: 'Описание от 20 до 1024 символов' })
  public description!: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Дата выпуска фильма должна соответствовать формату ISO' }
  )
  public publicationDate!: Date;

  @IsOptional()
  @IsString({ message: `genre must be one of: ${genreArray.join(', ')}` })
  public genre!: Genre;

  @IsOptional()
  @IsInt({ message: 'Год выхода обязательно целов число' })
  @Min(1895, { message: 'Дата выхода первого фильма 1895' })
  @Max(2022, { message: 'Пока крайний год когда выходили новые фильмы 2022' })
  public releaseYear!: number;

  @IsOptional()
  @IsString({ message: 'Превью является обязательным' })
  public previewLink!: string;

  @IsOptional()
  @IsString({ message: 'Путь до фильма обязателен' })
  public videoLink!: string;

  @IsOptional()
  @IsArray({ message: 'Список актеров обязателен' })
  public actors!: string[];

  @IsOptional()
  @IsArray({ message: 'Продюсер обязателен' })
  public producer!: string;

  @IsOptional()
  @IsInt({ message: 'Длительность фильма является целым числом' })
  @Min(0, { message: 'Длительность должна быть больше 0' })
  public duration!: number;

  @IsOptional()
  @IsMongoId({
    message: 'Идентификатор пользователя должен быть валидным MongoId',
  })
  public userId!: string;

  @IsOptional()
  @Matches(imageRegex, { message: 'Плакат фильма должен быть в формате .jpg' })
  public posterPath!: string;

  @IsOptional()
  @Matches(imageRegex, { message: 'Задний план должен быть в формате .jpg' })
  public backgroundImage!: string;

  @IsOptional()
  @IsString({ message: 'Цвет фона является обязательным' })
  public backgroundColor!: string;
}
