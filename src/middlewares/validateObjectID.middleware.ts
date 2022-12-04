import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { HttpError } from '../errors/http.errors.js';
import { MiddlewareInterface } from './middleware.interface.js';

const { ObjectId } = mongoose.Types;

export class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(private param: string) {}

  public execute({params}: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} неверное значение идентификатора`,
      'ValidateObjectIdMiddleware'
    );
  }
}
