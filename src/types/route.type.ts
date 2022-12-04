import { NextFunction, Request, Response } from 'express';

import { MiddlewareInterface } from '../middlewares/middleware.interface';
import { HttpMethod } from '../utils/http.enum';

export type Route<Path extends string> = {
  path: Path;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: MiddlewareInterface[];
}
