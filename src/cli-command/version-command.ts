import { readFileSync } from 'fs';
import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';

export default class VersionCommand implements CliCommandInterface {
  readonly name = '--version';

  async execute(): Promise<void> {
    console.log(chalk.green(this.readVersion()));
  }

  private readVersion(): string {
    const contentPageJSON = readFileSync('./package.json', 'utf-8');
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }
}
