import { Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';

import { STATIC_RESOURCE_FIELDS } from '../../constants/application.contants.js';
import { RouteInterface } from '../../types/interfaces/route.interface.js';
import {
  getFullServerPath,
  transformObject,
} from '../../utils/commonFunctions.js';
import { ConfigInterface } from '../config/config.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ControllerInterface } from './controller.interface.js';

@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly configService: ConfigInterface
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  protected addStaticPath(data: Record<string, unknown>): void {
    const port = this.configService.get('PORT');
    const host = this.configService.get('HOST');
    const staticDirname = this.configService.get('STATIC_DIRECTORY');
    const uploadDirname = this.configService.get('UPLOAD_DIRECTORY');

    const fullServerPath = getFullServerPath(host, port);
    transformObject(
      STATIC_RESOURCE_FIELDS,
      `${fullServerPath}${staticDirname}`,
      `${fullServerPath}${uploadDirname}`,
      data
    );
  }

  addRoute<T extends string>(route: RouteInterface<T>) {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map((middleware) =>
      asyncHandler(middleware.execute.bind(middleware))
    );

    const allHandlers = middlewares
      ? [...middlewares, routeHandler]
      : routeHandler;
    this._router[route.method](route.path, allHandlers);
    this.logger.info(
      `Зарегистрирован путь: ${route.method.toUpperCase()} ${route.path}`
    );
  }

  send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(Object(data));
    res.type('application/json').status(statusCode).json(data);
  }

  created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
