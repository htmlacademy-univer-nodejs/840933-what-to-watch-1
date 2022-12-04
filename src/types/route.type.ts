import { NextFunction, Request, Response } from 'express';

import { HttpMethod } from '../utils/http.enum';

export type Route<Path extends string> = {
  path: Path;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
}
