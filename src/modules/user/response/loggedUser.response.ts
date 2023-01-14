import {Expose} from 'class-transformer';

export class LoggedUserResponse {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;

  @Expose()
  public name!: string;

  @Expose()
  public avatarPath?: string;
}
