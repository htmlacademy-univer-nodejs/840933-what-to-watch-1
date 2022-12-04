import { IsEmail, IsString, Length, Matches } from 'class-validator';

import { avatarRegex } from '../constants/user.const.js';

export class CreateUserDto {
  @IsEmail({}, {message: 'Неверный формат адреса электронной почты'})
  public email!: string;

  @IsString({message: 'Имя является обязательным полем'})
  public name!: string;

  @IsString()
  @Length(6, 12, {message: 'Минимальная длина пароля 6, максимальная 12'})
  public password!: string;

  @Matches(avatarRegex, {message: 'Фото должно быть в форматах .jpg или .png'})
  public avatarPath?: string;
}
