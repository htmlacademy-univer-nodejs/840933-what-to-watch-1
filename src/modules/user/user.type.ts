import { DocumentType } from '@typegoose/typegoose';

import { CreateUserDto } from './dto/createUser.dto.js';
import { UserEntity } from './user.entity.js';
import { FilmEntity } from '../film/film.entity.js';
import { LoginUserDto } from './dto/loginUser.dto.js';

export type UserServiceType = {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findListFilmToWatch(userId: string): Promise<DocumentType<FilmEntity>[]>;
  addFilmToWatch(movieId: string, userId: string): Promise<void | null>;
  deleteFilmToWatch(movieId: string, userId: string): Promise<void | null>;
  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
}
