import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import asyncHandler from 'express-async-handler';

import { Route } from '../types/route.type.js';
import { Logger } from '../common/logger/logger.type.js';
import { Controller } from './controller.type.js';

@injectable()
export abstract class ControllerService implements Controller {
  private readonly _router: Router;

  constructor(protected readonly logger: Logger) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  addRoute<T extends string>(route: Route<T>) {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );

    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this._router[route.method](route.path, allHandlers);

    this.logger.info(
      `Маршруты зарегистрированы: ${route.method.toUpperCase()} ${route.path}`
    );
  }

  send<T>(res: Response, statusCode: number, data: T): void {
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
