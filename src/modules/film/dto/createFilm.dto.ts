import {
  IsArray,
  IsDateString,
  IsInt,
  IsEnum,
  IsMongoId,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

import { Genre, GenreEnum, genreArray } from '../../../types/genre.type';
import { imageRegex } from '../constants/movie.const';

export class CreateFilmDto {
  @Length(2, 100, {message: 'Название должно быть от 2 до 100 символов'})
  public name!: string;

  @Length(20, 1024, {message: 'Описание от 20 до 1024 символов'})
  public description!: string;

  @IsDateString({}, {message: 'Дата выпуска фильма должна соответствовать формату ISO'})
  public publicationDate!: Date;

  @IsEnum(GenreEnum, {message: `Жанры: ${genreArray.join(', ')}`})
  public genre!: Genre;

  @IsInt({message: 'Год выхода обязательно целов число'})
  @Min(1895, {message: 'Дата выхода первого фильма 1895'})
  @Max(2022, {message: 'Пока крайний год когда выходили новые фильмы 2022'})
  public releaseYear!: number;

  @IsString({message: 'Превью является обязательным'})
  public previewLink!: string;

  @IsString({message: 'Путь до фильма обязателен'})
  public videoLink!: string;

  @IsArray({message: 'Список актеров обязателен'})
  public actors!: string[];

  @IsArray({message: 'Продюсер обязателен'})
  public producer!: string;

  @IsInt({message: 'Длительность фильма является целым числом'})
  @Min(0, {message: 'Длительность должна быть больше 0'})
  public duration!: number;

  @IsMongoId({message: 'Идентификатор пользователя должен быть валидным MongoId'})
  public userId!: string;

  @Matches(imageRegex, {message: 'Плакат фильма должен быть в формате .jpg'})
  public posterPath!: string;

  @Matches(imageRegex, {message: 'Задний план должен быть в формате .jpg'})
  public backgroundImage!: string;

  @IsString({message: 'Цвет фона является обязательным'})
  public backgroundColor!: string;
}
