import 'reflect-metadata';
import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Logger } from './common/logger/logger.type.js';
import LoggerService from './common/logger/logger.service.js';
import { Component } from './types/component.type.js';
import { ConfigInterface } from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';
import Application from './app/application.js';
import { DBService } from './common/db/db.service.js';
import { DBInterface } from './common/db/db.interface.js';
import { UserService } from './modules/user/user.service.js';
import { UserServiceType } from './modules/user/user.type.js';
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
import { ExceptionFilter } from './errors/exception-filter.type.js';
import { Controller } from './controller/controller.type.js';
import { FilmController } from './modules/film/film.controller.js';
import { ExceptionFilterService } from './errors/exception-filter.service.js';
import { UserController } from './modules/user/user.controller.js';

const applicationContainer = new Container();

applicationContainer
  .bind<Application>(Component.Application)
  .to(Application)
  .inSingletonScope();

applicationContainer
  .bind<Logger>(Component.Logger)
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
  .bind<UserServiceType>(Component.UserService)
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

applicationContainer
  .bind<Controller>(Component.FilmController)
  .to(FilmController)
  .inSingletonScope();

applicationContainer
  .bind<ExceptionFilter>(Component.ExceptionFilter)
  .to(ExceptionFilterService)
  .inSingletonScope();

applicationContainer
  .bind<Controller>(Component.UserController)
  .to(UserController)
  .inSingletonScope();

const application = applicationContainer.get<Application>(
  Component.Application
);

await application.init();
