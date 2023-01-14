import got from 'got';

import { MockData } from '../types/types/mock-data.type.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { MovieGenerator } from '../common/movieGenerator/movieGenerator.js';
import { TSVFileWriter } from '../common/fileWriter/fileWriter.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData?: MockData;

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const movieCount = parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(`Can't fetch data from ${url}.`);
    }

    const movieGeneratorString = new MovieGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < movieCount; i++) {
      await tsvFileWriter.write(movieGeneratorString.generate());
    }

    console.log(`File ${filepath} was created!`);
  }
}
