import got from 'got';

import { MockData } from '../types/types/mockData.type.js';
import { CliCommandInterface } from './cliCommand.interface.js';
import { MovieGenerator } from '../common/movieGenerator/movieGenerator.js';
import { TSVFileWriter } from '../common/fileWriter/fileWriter.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ConsoleLoggerService } from '../common/logger/consoleLogger.service.js';

export class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData?: MockData;
  private readonly logger: LoggerInterface;

  constructor() {
    this.logger = new ConsoleLoggerService();
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const movieCount = parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return this.logger.error(`Не получается получить данные по адресу ${url}.`);
    }

    const movieGeneratorString = new MovieGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < movieCount; i++) {
      await tsvFileWriter.write(movieGeneratorString.generate());
    }

    this.logger.info(`Файл с мок данным ${filepath} был успешно создан`);
  }
}
