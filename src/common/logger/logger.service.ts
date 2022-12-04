import * as pino from 'pino';
import { injectable } from 'inversify';

import { Logger } from './logger.type.js';

@injectable()
export default class LoggerService implements Logger {
  private logger!: Logger;

  constructor() {
    this.logger = pino.pino();
    this.logger.info('Подключение логирования…');
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
