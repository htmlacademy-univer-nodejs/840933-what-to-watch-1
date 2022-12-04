import chalk from 'chalk';

import { Logger } from '../common/logger/logger.type.js';
import { ConsoleLog } from '../loggers/loggers.console.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';
  private logger: Logger;

  constructor() {
    this.logger = new ConsoleLog();
  }

  public async execute(): Promise<void> {
    this.logger.info(`
        Программа для подготовки данных для ${chalk.bold('REST API сервера')}.

        Пример:
            ${chalk.bold.red('main.js --<command> [--arguments]')}

        Команды:
            ${chalk.magenta('--version')}:                     # выводит номер версии
            ${chalk.gray('--help')}:                        # печатает этот текст
            ${chalk.cyan('--import <path>')}:               # импортирует данные из TSV
            ${chalk.green('--generator <n> <path> <url>')}:  # генерирует произвольное количество тестовых данных
    `);
  }
}
