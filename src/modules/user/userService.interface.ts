import { DocumentType } from '@typegoose/typegoose';

import { MovieEntity } from '../movie/movie.entity.js';
import { CreateUserDto } from './dto/createUser.dto.js';
import { LoginUserDto } from './dto/loginUser.dto.js';
import { UserEntity } from './user.entity.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>>;
  getMyList(userId: string): Promise<DocumentType<MovieEntity>[]>;
  addToMyList(movieId: string, userId: string): Promise<void | null>;
  deleteFromMyList(movieId: string, userId: string): Promise<void | null>;
  verifyUser(
    dto: LoginUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity> | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  setUserAvatarPath(userId: string, avatarPath: string): Promise<void | null>;
}
