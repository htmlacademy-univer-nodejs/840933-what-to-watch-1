import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, {message: 'Невалидный email'})
  public email!: string;

  @IsString({message: 'Пароль является обязательным полем'})
  public password!: string;
}
