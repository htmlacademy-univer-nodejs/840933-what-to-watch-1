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

  @IsInt({ message: 'duration must be an integer' })
  @Min(0, { message: 'duration can not be less than 0' })
  public duration!: number;

  @Matches(/(\S+(\.jpg)$)/, { message: 'posterPath must be .jpg format image' })
  @IsString({ message: 'posterPath is required' })
  public posterPath!: string;

  @Matches(/(\S+(\.(jpg|jpeg))$)/, {
    message: 'backgroundImagePath must be .jpg format image',
  })
  @IsString({ message: 'backgroundImagePath is required' })
  public backgroundImagePath!: string;

  @IsString({ message: 'backgroundColor is required' })
  public backgroundColor!: string;

  public user!: {
    id: string;
    email: string;
  };

  @IsOptional()
  @IsBoolean({ message: 'isPromo should be boolean' })
  public isPromo?: boolean;
}
