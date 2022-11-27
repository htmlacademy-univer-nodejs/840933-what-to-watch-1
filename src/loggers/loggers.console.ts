import { Logger } from '../common/logger/logger.type.js';

export class ConsoleLog implements Logger {
  public debug(message: string, ...args: unknown[]): void {
    console.debug(message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    console.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    console.error(message, ...args);
  }
}
