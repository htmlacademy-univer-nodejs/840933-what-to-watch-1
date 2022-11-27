import got from 'got';
import chalk from 'chalk';

import FilmGenerator from '../common/movie-generator/film-generator.js';
import TSVFileWriter from '../common/file-writer/file-writer.js';
import { Logger } from '../common/logger/logger.type.js';
import { MockData } from '../types/mock-data.type.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { ConsoleLog } from '../loggers/loggers.console.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData?: MockData;
  private logger: Logger;

  constructor() {
    this.logger = new ConsoleLog();
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const movieCount = parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw Error(`Can't fetch data from ${chalk.red(url)}.`);
    }

    const movieGeneratorInstance = new FilmGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < movieCount; i++) {
      await tsvFileWriter.write(movieGeneratorInstance.generate());
    }

    this.logger.info(`Файл ${chalk.cyan(filepath)} создан!`);
  }
}
