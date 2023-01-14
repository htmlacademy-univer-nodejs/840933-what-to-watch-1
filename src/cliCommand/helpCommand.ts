import chalk from 'chalk';

import { CliCommandInterface } from './cliCommand.interface.js';
import { ConsoleLoggerService } from '../common/logger/consoleLogger.service.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';

export class HelpCommand implements CliCommandInterface {
  readonly name = '--help';
  private readonly logger: LoggerInterface;

  constructor() {
    this.logger = new ConsoleLoggerService();
  }

  async execute(): Promise<void> {
    this.logger.info(chalk.underline('Программа для подготовки данных для REST API сервера.\n'));
    this.logger.info('Пример:');
    this.logger.info(chalk.cyanBright(`
    cli.js --<command> [--arguments]
    `));
    this.logger.info('Команды:');
    this.logger.info(chalk.cyan(`
    --version                   # выводит номер версии
    --help                      # печатает этот текст
    --import <path>             # импортирует данные из TSV
    `));
  }
}
