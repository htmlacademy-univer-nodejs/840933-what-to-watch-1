import { types } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { inject, injectable } from 'inversify';

import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/createUser.dto.js';
import { Component } from '../../types/component.type.js';
import { Logger } from '../../common/logger/logger.type.js';
import { FilmEntity } from '../film/film.entity.js';
import { UserServiceType } from './user.type.js';
import { LoginUserDto } from './dto/loginUser.dto.js';

@injectable()
export class UserService implements UserServiceType {
  constructor(
    @inject(Component.Logger) private logger: Logger,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.FilmModel)
    private readonly filmModel: types.ModelType<FilmEntity>
  ) {}

  async create(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`Создан новый пользователь: ${user.email}`);

    return result;
  }

  async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  async findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  async findListFilmToWatch(userId: string): Promise<DocumentType<FilmEntity>[]> {
    const listFilmToWatch = await this.userModel.findById(userId).select('listFilmToWatch');
    return this.filmModel.find({
      _id: {
        $in: listFilmToWatch?.listFilmToWatch
      }
    });
  }

  async addFilmToWatch(movieId: string, userId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, {
      $addToSet: {
        listFilmToWatch: movieId
      }
    });
  }

  async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);
    if (user && user.verifyPassword(dto.password, salt)) {
      return user;
    }
    return null;
  }

  async deleteFilmToWatch(movieId: string, userId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, {
      $pull: {moviesToWatch: movieId}
    });
  }
}
