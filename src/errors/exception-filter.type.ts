import { NextFunction, Request, Response } from 'express';

export type ExceptionFilter = {
  catch(error: Error, req: Request, res: Response, next: NextFunction): void;
};
