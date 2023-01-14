import pino, { Logger } from 'pino';
import { injectable } from 'inversify';

import { LoggerInterface } from './logger.interface.js';

@injectable()
export default class LoggerService implements LoggerInterface {
  private readonly logger: Logger;

  constructor() {
    this.logger = pino();
    this.logger.info('Logger created.');
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
