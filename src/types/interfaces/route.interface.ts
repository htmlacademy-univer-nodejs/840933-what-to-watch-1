import {NextFunction, Request, Response} from 'express';
import {HttpMethod} from '../enums/http-method.enum.js';
import {MiddlewareInterface} from './middleware.interface.js';

export interface RouteInterface<Path extends string> {
  path: Path;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: MiddlewareInterface[];
}
