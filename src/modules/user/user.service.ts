import { types } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { inject, injectable } from 'inversify';

import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { COMPONENT } from '../../types/types/component.type.js';
import { MovieEntity } from '../movie/movie.entity.js';
import { CreateUserDto } from './dto/createUser.dto.js';
import { LoginUserDto } from './dto/loginUser.dto.js';
import { UserServiceInterface } from './userService.interface.js';
import { UserEntity } from './user.entity.js';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject(COMPONENT.LoggerInterface) private logger: LoggerInterface,
    @inject(COMPONENT.UserModel)
    private readonly userModel: types.ModelType<UserEntity>,
    @inject(COMPONENT.MovieModel)
    private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  async create(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId);
  }

  async setUserAvatarPath(
    userId: string,
    avatarPath: string
  ): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, { avatarPath });
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

  async findToWatch(userId: string): Promise<DocumentType<MovieEntity>[]> {
    const moviesToWatch = await this.userModel
      .findById(userId)
      .select('moviesToWatch');
    return this.movieModel
      .find({ _id: { $in: moviesToWatch?.moviesToWatch } })
      .populate('user');
  }

  async addToWatch(movieId: string, userId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { moviesToWatch: movieId },
    });
  }

  async deleteToWatch(movieId: string, userId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, {
      $pull: { moviesToWatch: movieId },
    });
  }

  async verifyUser(
    dto: LoginUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);
    if (user && user.verifyPassword(dto.password, salt)) {
      return user;
    }
    return null;
  }
}
