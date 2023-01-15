import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { Component } from '../types/types/component.type.js';
import { ServiceError } from '../types/enums/serviceError.enum.js';
import { createErrorObject } from '../utils/transform.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ExceptionFilterInterface } from './exceptionFilter.interface.js';
import { HttpError } from '../common/errors/http.error.js';
import { ValidationError } from '../common/errors/validation.error.js';

@injectable()
export class ExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface
  ) {
    this.logger.info('Созданы ExceptionFilter');
  }

  catch(
    error: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    } else if (error instanceof ValidationError) {
      return this.handleValidationError(error, req, res, next);
    }

    this.handleOtherError(error, req, res, next);
  }

  private handleHttpError(
    error: HttpError,
    _req: Request,
    res: Response,
    _: NextFunction
  ) {
    this.logger.error(
      `[${error.detail}]: ${error.httpStatusCode} — ${error.message}`
    );

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ServiceError.CommonError, error.message));
  }

  private handleOtherError(
    error: Error,
    _req: Request,
    res: Response,
    _: NextFunction
  ) {
    this.logger.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ServiceError.ServiceError, error.message));
  }

  private handleValidationError(
    error: ValidationError,
    _req: Request,
    res: Response,
    _: NextFunction
  ) {
    this.logger.error(`[Ошибка]: ${error.message}`);

    error.details.forEach((errorField) =>
      this.logger.error(`[${errorField.property}] –> ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createErrorObject(
          ServiceError.ValidationError,
          error.message,
          error.details
        )
      );
  }
}
