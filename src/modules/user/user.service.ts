import {types} from '@typegoose/typegoose';
import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import {inject, injectable} from 'inversify';

import {UserEntity} from './user.entity.js';
import CreateUserDto from './dto/user.js';
import {UserServiceInterface} from './user.interface.js';
import {Component} from '../../types/component.type.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface,
              @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>) {}

  async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`Создан новый пользователь: ${user.email}`);

    return result;
  }

  async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
