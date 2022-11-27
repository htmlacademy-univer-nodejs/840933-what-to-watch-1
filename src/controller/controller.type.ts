import { Response, Router } from 'express';

import { Route } from '../types/route.type';

export type Controller = {
  readonly router: Router;

  addRoute<T extends string>(route: Route<T>): void;
  send<T>(res: Response, statusCode: number, data: T): void;
  ok<T>(res: Response, data: T): void;
  created<T>(res: Response, data: T): void;
  noContent<T>(res: Response, data: T): void;
}
