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
    message: 'description length must be from 20 to 1024 symbols',
  })
  public description!: string;

  @IsDateString({}, { message: 'postDate must be valid ISO date' })
  public publishingDate!: Date;

  @IsEnum(GenreEnum, {
    message:
      'genre must be one of: \'comedy\', \'crime\', \'documentary\', \'drama\', \'horror\', \'family\', \'romance\', \'scifi\', \'thriller\'',
  })
  public genre!: TGenre;

  @IsInt({ message: 'releaseYear must be an integer' })
  @Min(1895, { message: 'Minimum releaseYear is 1895' })
  @Max(2022, { message: 'Maximum releaseYear is 2022' })
  public releaseYear!: number;

  @IsString({ message: 'previewPath is required' })
  public previewPath!: string;

  @IsString({ message: 'moviePath is required' })
  public moviePath!: string;

  @IsArray({ message: 'Field actors must be an array' })
  public actors!: string[];

  @IsString({ message: 'director is required' })
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
