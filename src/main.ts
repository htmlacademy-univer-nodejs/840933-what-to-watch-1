import 'reflect-metadata';
import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { LoggerInterface } from './common/logger/logger.interface.js';
import LoggerService from './common/logger/logger.service.js';
import { Component } from './types/component.type.js';
import { ConfigInterface } from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';
import Application from './app/application.js';
import { DBService } from './common/db/db.service.js';
import { DBInterface } from './common/db/db.interface.js';
import { UserService } from './modules/user/user.service.js';
import { UserServiceInterface } from './modules/user/user.interface.js';
import { UserEntity, UserModel } from './modules/user/user.entity.js';
import { FilmService } from './modules/film/film.service.js';
import { FilmServiceInterface } from './modules/film/film.interface.js';
import { FilmEntity, FilmModel } from './modules/film/film.entity.js';
import CommentService from './modules/comment/comment.service.js';
import {
  CommentEntity,
  CommentModel,
} from './modules/comment/comment.entity.js';
import { CommentServiceInterface } from './modules/comment/comment.interface.js';

const applicationContainer = new Container();

applicationContainer
  .bind<Application>(Component.Application)
  .to(Application)
  .inSingletonScope();

applicationContainer
  .bind<LoggerInterface>(Component.LoggerInterface)
  .to(LoggerService)
  .inSingletonScope();

applicationContainer
  .bind<ConfigInterface>(Component.ConfigInterface)
  .to(ConfigService)
  .inSingletonScope();

applicationContainer
  .bind<DBInterface>(Component.DBInterface)
  .to(DBService)
  .inSingletonScope();

applicationContainer
  .bind<UserServiceInterface>(Component.UserServiceInterface)
  .to(UserService);

applicationContainer
  .bind<FilmServiceInterface>(Component.FilmServiceInterface)
  .to(FilmService);

applicationContainer
  .bind<types.ModelType<UserEntity>>(Component.UserModel)
  .toConstantValue(UserModel);

applicationContainer
  .bind<types.ModelType<FilmEntity>>(Component.FilmModel)
  .toConstantValue(FilmModel);

applicationContainer
  .bind<CommentServiceInterface>(Component.CommentServiceInterface)
  .to(CommentService);

applicationContainer
  .bind<types.ModelType<CommentEntity>>(Component.CommentModel)
  .toConstantValue(CommentModel);

const application = applicationContainer.get<Application>(
  Component.Application
);
await application.init();
