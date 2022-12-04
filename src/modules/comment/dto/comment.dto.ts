import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';

export class CommentDto {
  @IsString({ message: 'Должен быть строкой' })
  @Length(5, 1024, { message: 'Длина от 5 до 1024 символов' })
  public text!: string;

  @IsInt({ message: 'Рейтинг должен быть числом' })
  @Min(0, { message: 'От 0' })
  @Max(10, { message: 'До 10' })
  public rating!: number;

  @IsMongoId({ message: 'Должен быть валидным MongoId' })
  public filmId!: string;

  @IsMongoId({ message: 'Должен быть валидным UserId' })
  public userId!: string;
}
