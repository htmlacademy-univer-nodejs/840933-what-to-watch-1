import { Expose } from 'class-transformer';

export class UserResponse {
  @Expose()
  public id!: string;

  @Expose()
  public email!: string;

  @Expose()
  public name!: string;

  @Expose()
  public avatarPath?: string;
}
