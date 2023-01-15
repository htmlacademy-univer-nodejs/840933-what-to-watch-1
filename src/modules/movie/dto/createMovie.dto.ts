import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

import { GenreEnum, TGenre } from '../../../types/types/genre.type.js';

export class CreateMovieDto {
  @IsString({ message: 'Название обязательно' })
  @Length(2, 100, { message: 'Длина названия от 2 до 100' })
  public title!: string;

  @IsString({ message: 'Описание является обязательным' })
  @Length(20, 1024, {
    message: 'Описание может быть от 20 до 1024 символов',
  })
  public description!: string;

  @IsDateString({}, { message: 'Должно соответствовать формату ISO' })
  public publishingDate!: Date;

  @IsEnum(GenreEnum, {
    message:
      'Жанр должен быть \'comedy\', \'crime\', \'documentary\', \'drama\', \'horror\', \'family\', \'romance\', \'scifi\', \'thriller\'',
  })
  public genre!: TGenre;

  @IsInt({ message: 'Год должен быть целым числом' })
  @Min(1895, { message: 'Первый фильм вышел в 1895' })
  @Max(2022, { message: 'Крайний фильм вышел 2023' })
  public releaseYear!: number;

  @IsString({ message: 'Превью фильма является обязательным' })
  public previewPath!: string;

  @IsString({ message: 'Путь к фильму является обязательным' })
  public moviePath!: string;

  @IsArray({ message: 'Актеры — список строк' })
  public actors!: string[];

  @IsString({ message: 'Продюсер является обязательным полем' })
  public director!: string;

  @IsInt({ message: 'Длительность это целое число минут' })
  @Min(0, { message: 'Длительность не может быть меньше 0' })
  public duration!: number;

  @Matches(/(\S+(\.jpg)$)/, { message: 'Постер должно быть формата .jpg или .jpeg' })
  @IsString({ message: 'Постер — обязательное поле' })
  public posterPath!: string;

  @Matches(/(\S+(\.(jpg|jpeg))$)/, {
    message: 'Фоновое изображение должно быть формата .jpg или .jpeg',
  })
  @IsString({ message: 'Фоновое изображение является обязательным' })
  public backgroundImagePath!: string;

  @IsString({ message: 'Цвет фона является обязательынм' })
  public backgroundColor!: string;

  @IsOptional()
  @IsBoolean({ message: 'isPromo это булево значение' })
  public isPromo?: boolean;
}
