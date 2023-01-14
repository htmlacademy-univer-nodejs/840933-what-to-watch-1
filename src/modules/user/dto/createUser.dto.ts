import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'email must be valid address' })
  public email!: string;

  @IsString({ message: 'name is required' })
  @Length(1, 15, { message: 'Min length for name is 1, max is 15' })
  public name!: string;

  @IsString({ message: 'password is required' })
  @Length(6, 12, { message: 'Min length for password is 6, max is 12' })
  public password!: string;

  @IsOptional()
  public avatar?: Buffer;
}
