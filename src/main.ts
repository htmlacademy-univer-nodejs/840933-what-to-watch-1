import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import 'reflect-metadata';

import Application from './app/application.js';
import { ConfigInterface } from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';
import { ControllerInterface } from './common/controller/controller.interface.js';
import { DatabaseInterface } from './common/dbClient/db.interface.js';
import MongoDBService from './common/dbClient/mongodb.service.js';
import { ExceptionFilterInterface } from './filters/exceptionFilter.interface.js';
import ExceptionFilter from './filters/exception.filter.js';
import { LoggerInterface } from './common/logger/logger.interface.js';
import LoggerService from './common/logger/logger.service.js';
import { CommentServiceInterface } from './modules/comment/commentService.interface.js';
import CommentController from './modules/comment/comment.controller.js';
import {
  CommentEntity,
  CommentModel,
} from './modules/comment/comment.entity.js';
import { CommentService } from './modules/comment/comment.service.js';
import { MovieServiceInterface } from './modules/movie/movieService.interface.js';
import { MovieController } from './modules/movie/movie.controller.js';
import { MovieEntity, MovieModel } from './modules/movie/movie.entity.js';
import { MovieService } from './modules/movie/movie.service.js';
import { UserServiceInterface } from './modules/user/userService.interface.js';
import { UserController } from './modules/user/user.controller.js';
import { UserEntity, UserModel } from './modules/user/user.entity.js';
import { UserService } from './modules/user/user.service.js';
import { COMPONENT } from './types/types/component.type.js';

const applicationContainer = new Container();

applicationContainer
  .bind<Application>(COMPONENT.Application)
  .to(Application)
  .inSingletonScope();
applicationContainer
  .bind<LoggerInterface>(COMPONENT.LoggerInterface)
  .to(LoggerService)
  .inSingletonScope();
applicationContainer
  .bind<ConfigInterface>(COMPONENT.ConfigInterface)
  .to(ConfigService)
  .inSingletonScope();
applicationContainer
  .bind<DatabaseInterface>(COMPONENT.DatabaseInterface)
  .to(MongoDBService)
  .inSingletonScope();
applicationContainer
  .bind<UserServiceInterface>(COMPONENT.UserServiceInterface)
  .to(UserService);
applicationContainer
  .bind<types.ModelType<UserEntity>>(COMPONENT.UserModel)
  .toConstantValue(UserModel);
applicationContainer
  .bind<MovieServiceInterface>(COMPONENT.MovieServiceInterface)
  .to(MovieService);
applicationContainer
  .bind<types.ModelType<MovieEntity>>(COMPONENT.MovieModel)
  .toConstantValue(MovieModel);
applicationContainer
  .bind<CommentServiceInterface>(COMPONENT.CommentServiceInterface)
  .to(CommentService);
applicationContainer
  .bind<types.ModelType<CommentEntity>>(COMPONENT.CommentModel)
  .toConstantValue(CommentModel);

applicationContainer
  .bind<ControllerInterface>(COMPONENT.MovieController)
  .to(MovieController)
  .inSingletonScope();
applicationContainer
  .bind<ExceptionFilterInterface>(COMPONENT.ExceptionFilterInterface)
  .to(ExceptionFilter)
  .inSingletonScope();
applicationContainer
  .bind<ControllerInterface>(COMPONENT.UserController)
  .to(UserController)
  .inSingletonScope();
applicationContainer
  .bind<ControllerInterface>(COMPONENT.CommentController)
  .to(CommentController)
  .inSingletonScope();

const application = applicationContainer.get<Application>(
  COMPONENT.Application
);
await application.init();
