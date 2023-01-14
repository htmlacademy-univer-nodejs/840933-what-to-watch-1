import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Проверьте формат электронной почты' })
  public email!: string;

  @IsString({ message: 'Вы должны обязательно указать пароль' })
  public password!: string;
}
