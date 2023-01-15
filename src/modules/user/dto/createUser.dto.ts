import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email не проходит по формату' })
  public email!: string;

  @IsString({ message: 'Имя является обязательным полем' })
  @Length(1, 15, { message: 'Длина имени от 1 до 15 символов' })
  public name!: string;

  @IsString({ message: 'Пароль — обязательное поле' })
  @Length(6, 12, { message: 'Пароль может быть по длине от 6 до 12 символов' })
  public password!: string;

  @IsOptional()
  public avatar?: Buffer;
}
