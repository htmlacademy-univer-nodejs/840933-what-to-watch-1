import {MockData} from '../types/mock-data.type.js';
import {CliCommandInterface} from './cli-command.interface.js';
import got from 'got';
import chalk from 'chalk';
import MovieGenerator from '../common/movie-generator/movie-generator.js';
import TSVFileWriter from '../common/file-writer/file-writer.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData?: MockData;

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const movieCount = parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw Error(`Can't fetch data from ${chalk.red(url)}.`);
    }

    const movieGeneratorInstance = new MovieGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < movieCount; i++) {
      await tsvFileWriter.write(movieGeneratorInstance.generate());
    }

    console.log(`File ${chalk.cyan(filepath)} was created!`);
  }
}
