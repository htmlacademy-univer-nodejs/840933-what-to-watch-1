import chalk from 'chalk';

import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
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
