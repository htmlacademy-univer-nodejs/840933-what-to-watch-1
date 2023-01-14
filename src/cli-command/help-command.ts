import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';

export default class HelpCommand implements CliCommandInterface {
  readonly name = '--help';

  async execute(): Promise<void> {
    console.log(chalk.underline('Программа для подготовки данных для REST API сервера.\n'));
    console.log('Пример:');
    console.log(chalk.yellowBright(`
    cli.js --<command> [--arguments]
    `));
    console.log('Команды:');
    console.log(chalk.yellowBright(`
    --version                   # выводит номер версии
    --help                      # печатает этот текст
    --import <path>             # импортирует данные из TSV
    `));
  }
}
