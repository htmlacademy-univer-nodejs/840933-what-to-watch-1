import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'Текст обязательно должен быть в комментарии' })
  @Length(5, 1024, { message: 'Длина текста в комментарии должна от 5 и до 1024 символов' })
  public text!: string;

  @IsInt({ message: 'Рейтинг — целое число' })
  @Min(0, { message: 'Минимальный рейтинг — 0' })
  @Max(10, { message: 'Максимальный рейтинг — 10' })
  public rating!: number;

  @IsMongoId({ message: 'movieId должен быть вылидным MongoID индексом' })
  public movieId!: string;
}
