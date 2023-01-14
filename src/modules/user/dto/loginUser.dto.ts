import {IsEmail, IsString} from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, {message: 'email must be valid address'})
  public email!: string;

  @IsString({message: 'password is required'})
  public password!: string;
}
