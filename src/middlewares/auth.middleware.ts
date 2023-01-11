import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as jose from 'jose';
import { TextEncoder } from 'node:util';

import { HttpError } from '../errors/http.errors.js';
import { MiddlewareInterface } from './middleware.interface.js';

export class AuthenticateMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string) {}

  async execute(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    let { user }: any = req;

    if (!authorizationHeader) {
      return next();
    }

    const [token] = authorizationHeader;

    try {
      const { payload } = await jose.jwtVerify(
        token,
        new TextEncoder().encode(this.jwtSecret)
      );

      if (!payload.email || !payload.id) {
        return next(
          new HttpError(
            StatusCodes.BAD_REQUEST,
            'Email and id is required',
            'AuthenticateMiddleware'
          )
        );
      }

      user = { email: payload.email, id: payload.id };
      return next();
    } catch {
      return next(
        new HttpError(
          StatusCodes.UNAUTHORIZED,
          'Invalid token',
          'AuthenticateMiddleware'
        )
      );
    }
  }
}
