import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { HttpError } from '../common/errors/http.error.js';
import { UserServiceInterface } from '../modules/user/userService.interface.js';
import { MiddlewareInterface } from '../types/interfaces/middleware.interface.js';

export class PrivateRouteMiddleware implements MiddlewareInterface {
  constructor(private readonly userService: UserServiceInterface) {}

  async execute(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    } else {
      const user = await this.userService.findById(req.user.id);
      if (!user) {
        throw new HttpError(
          StatusCodes.UNAUTHORIZED,
          'Unauthorized',
          'PrivateRouteMiddleware'
        );
      }
    }
    return next();
  }
}
