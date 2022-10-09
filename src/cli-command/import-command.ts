import chalk from 'chalk';

import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { createFilm } from '../utils/film-constructor.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', (line) => console.log(createFilm(line)));
    fileReader.on('end', (count) => console.log(`${count} rows imported.`));

    try {
      await fileReader.read();
    } catch (err) {
      if (err instanceof Error) {
        console.error(chalk.bgRed(chalk.black(`Не удалось импортировать данные из файла из-за ошибки: «${err.message}»`)));
      }
      console.error(`Can't read the file: ${chalk.red(err)}`);
    }
  }
}
