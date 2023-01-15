import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';

import { ConfigInterface } from '../common/config/config.interface.js';
import { ControllerInterface } from '../common/controller/controller.interface';
import { DatabaseInterface } from '../common/dbClient/db.interface.js';
import { ExceptionFilterInterface } from '../filters/exceptionFilter.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { AuthenticateMiddleware } from '../middlewares/authenticate.middleware.js';
import { Component } from '../types/types/component.type.js';
import { getFullServerPath } from '../utils/commonFunctions.js';
import { getDBConnectionURI } from '../utils/db.js';

@injectable()
export class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private dbClient: DatabaseInterface,
    @inject(Component.MovieController)
    private movieController: ControllerInterface,
    @inject(Component.ExceptionFilterInterface)
    private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.UserController)
    private userController: ControllerInterface,
    @inject(Component.CommentController)
    private commentController: ControllerInterface,
  ) {
    this.expressApp = express();
  }

  initRoutes() {
    this.expressApp.use('/movies', this.movieController.router);
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  initMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use(
      '/upload',
      express.static(`.${this.config.get('UPLOAD_DIRECTORY')}`)
    );
    this.expressApp.use(
      '/static',
      express.static(`.${this.config.get('STATIC_DIRECTORY')}`)
    );

    const authenticateMiddleware = new AuthenticateMiddleware(
      this.config.get('JWT_SECRET')
    );
    this.expressApp.use(
      authenticateMiddleware.execute.bind(authenticateMiddleware)
    );
    this.expressApp.use(cors());
  }

  initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  async init() {
    const port = this.config.get('PORT');
    const dbUser = this.config.get('DB_USER');
    const dbPasswd = this.config.get('DB_PASSWORD');
    const dbHost = this.config.get('DB_HOST');
    const dbPort = this.config.get('DB_PORT');
    const dbName = this.config.get('DB_NAME');
    const host = this.config.get('HOST');

    this.logger.info(`Приложение было запущено на порту: ${port}.`);

    const uri = getDBConnectionURI(
      dbUser,
      dbPasswd,
      dbHost,
      dbPort,
      dbName
    );

    await this.dbClient.connect(uri);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();

    this.expressApp.listen(port, () =>
      this.logger.info(`Сервер был запущен на url -> ${getFullServerPath(host, port)}`)
    );
  }
}
