import chalk from 'chalk';
import { readFileSync } from 'fs';

import { CliCommandInterface } from './cliCommand.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ConsoleLoggerService } from '../common/logger/consoleLogger.service.js';

export class VersionCommand implements CliCommandInterface {
  readonly name = '--version';
  private readonly logger: LoggerInterface;

  constructor() {
    this.logger = new ConsoleLoggerService();
  }

  async execute(): Promise<void> {
    this.logger.info(chalk.cyan(this.readVersion()));
  }

  private readVersion(): string {
    const contentPageJSON = readFileSync('./package.json', 'utf-8');
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }
}
