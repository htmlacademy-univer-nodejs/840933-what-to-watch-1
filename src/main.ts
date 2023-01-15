import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import 'reflect-metadata';

import { Application } from './app/application.js';
import { ConfigInterface } from './common/config/config.interface.js';
import { ConfigService } from './common/config/config.service.js';
import { ControllerInterface } from './common/controller/controller.interface.js';
import { DatabaseInterface } from './common/dbClient/db.interface.js';
import { MongoDBService } from './common/dbClient/mongodb.service.js';
import { ExceptionFilterInterface } from './filters/exceptionFilter.interface.js';
import { ExceptionFilter } from './filters/exception.filter.js';
import { LoggerInterface } from './common/logger/logger.interface.js';
import { LoggerService } from './common/logger/logger.service.js';
import { CommentServiceInterface } from './modules/comment/commentService.interface.js';
import { CommentController } from './modules/comment/comment.controller.js';
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
import { Component } from './types/types/component.type.js';

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
  .bind<DatabaseInterface>(Component.DatabaseInterface)
  .to(MongoDBService)
  .inSingletonScope();

applicationContainer
  .bind<UserServiceInterface>(Component.UserServiceInterface)
  .to(UserService);

applicationContainer
  .bind<types.ModelType<UserEntity>>(Component.UserModel)
  .toConstantValue(UserModel);

applicationContainer
  .bind<MovieServiceInterface>(Component.MovieServiceInterface)
  .to(MovieService);

applicationContainer
  .bind<types.ModelType<MovieEntity>>(Component.MovieModel)
  .toConstantValue(MovieModel);

applicationContainer
  .bind<CommentServiceInterface>(Component.CommentServiceInterface)
  .to(CommentService);

applicationContainer
  .bind<types.ModelType<CommentEntity>>(Component.CommentModel)
  .toConstantValue(CommentModel);

applicationContainer
  .bind<ControllerInterface>(Component.MovieController)
  .to(MovieController)
  .inSingletonScope();

applicationContainer
  .bind<ExceptionFilterInterface>(Component.ExceptionFilterInterface)
  .to(ExceptionFilter)
  .inSingletonScope();

applicationContainer
  .bind<ControllerInterface>(Component.UserController)
  .to(UserController)
  .inSingletonScope();

applicationContainer
  .bind<ControllerInterface>(Component.CommentController)
  .to(CommentController)
  .inSingletonScope();

const application = applicationContainer.get<Application>(
  Component.Application
);
await application.init();
