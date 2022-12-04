import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ExceptionFilter } from './exception-filter.type.js';
import { Logger } from '../common/logger/logger.type.js';
import { HttpError } from './http.errors.js';
import { Component } from '../types/component.type.js';
import { createError } from '../utils/error.js';

@injectable()
export class ExceptionFilterService implements ExceptionFilter {
  constructor(@inject(Component.Logger) private logger: Logger) {
    this.logger.info('Зарегистрирован фильтр исключений !');
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response) {
    this.logger.error(
      `[${error.detail}]: ${error.httpStatusCode} — ${error.message}`
    );
    res.status(error.httpStatusCode).json(createError(error.message));
  }

  private handleOtherError(error: Error, _req: Request, res: Response) {
    this.logger.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createError(error.message));
  }

  public catch(error: Error | HttpError, req: Request, res: Response): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res);
    }

    this.handleOtherError(error, req, res);
  }
}
