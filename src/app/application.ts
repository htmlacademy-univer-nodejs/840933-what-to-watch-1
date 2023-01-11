import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import chalk from 'chalk';

import { Logger } from '../common/logger/logger.type.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { Component } from '../types/component.type.js';
import { getDBConnectionURI } from '../utils/db.connection.js';
import { DBInterface } from '../common/db/db.interface.js';
import { Controller } from '../controller/controller.type.js';
import { ExceptionFilter } from '../errors/exception-filter.type.js';
import { AuthenticateMiddleware } from '../middlewares/auth.middleware.js';

@injectable()
export default class Application {
  private readonly expressApp: Express;

  constructor(
    @inject(Component.Logger) private logger: Logger,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DBInterface) private dbClient: DBInterface,
    @inject(Component.FilmController) private filmController: Controller,
    @inject(Component.ExceptionFilter) private exceptionFilter: ExceptionFilter,
    @inject(Component.UserController) private userController: Controller,
    @inject(Component.CommentController) private commentController: Controller,
  ) {
    this.expressApp = express();
  }

  initRoutes() {
    this.expressApp.use('/films', this.filmController.router);
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  initMiddleware() {
    const authenticateMiddlewareInstance = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));

    this.expressApp.use(express.json());
    this.expressApp.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.expressApp.use(authenticateMiddlewareInstance.execute.bind(authenticateMiddlewareInstance));
  }

  initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('Приложение создано :)');
    this.logger.info(`Порт: ${this.config.get('PORT')}`);
    this.logger.info(`Хост базы данных: ${this.config.get('DB_HOST')}`);

    const uri = getDBConnectionURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();

    const port = this.config.get('PORT');

    this.expressApp.listen(port, () => {
      this.logger.info(`Сервер запущен на http://localhost:${chalk.red(port)}`);
    });

    await this.dbClient.connect(uri);
  }
}
