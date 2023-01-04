import chalk from 'chalk';

import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { createFilm } from '../utils/film.constructor.js';
import { UserServiceType } from '../modules/user/user.type.js';
import { DBInterface } from '../common/db/db.interface.js';
import { Logger } from '../common/logger/logger.type.js';
import { FilmServiceInterface } from '../modules/film/film.interface.js';
import { UserModel } from '../modules/user/user.entity.js';
import { UserService } from '../modules/user/user.service.js';
import { FilmService } from '../modules/film/film.service.js';
import { FilmModel } from '../modules/film/film.entity.js';
import { DBService } from '../common/db/db.service.js';
import { Film } from '../types/film.type.js';
import { ConsoleLog } from '../loggers/loggers.console.js';
import { getDBConnectionURI } from '../utils/db.connection.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import ConfigService from '../common/config/config.service.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceType;
  private filmService!: FilmServiceInterface;
  private databaseService!: DBInterface;
  private readonly logger: Logger;
  private readonly config: ConfigInterface;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLog();
    this.config = new ConfigService(this.logger);

    this.filmService = new FilmService(this.logger, FilmModel);
    this.userService = new UserService(this.logger, UserModel, FilmModel);
    this.databaseService = new DBService(this.logger);
  }

  async execute(filename: string): Promise<void> {
    const uri = getDBConnectionURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      if (err instanceof Error) {
        this.logger.info(
          `${chalk.red('Невозможно прочитатать файл')}: ${err.message}`
        );
      }
    }
  }

  private async saveFilm(film: Film) {
    const pass = this.config.get('DB_PASSWORD') || 'password';
    const { name, email, avatarPath } = film.user;

    const user = await this.userService.findOrCreate(
      {
        name,
        email,
        avatarPath,
        password: pass
      },
      this.config.get('SALT')
    );

    await this.filmService.create({
      ...film,
      userId: user.id,
      posterPath: '',
      backgroundColor: ''
    });
  }

  private async onLine(line: string, resolve: () => void) {
    const movie = createFilm(line);
    await this.saveFilm(movie);
    resolve();
  }

  private onComplete(count: number) {
    this.logger.info(`${chalk.cyan(count)} строк было прочитано.`);
    this.databaseService.disconnect();
  }
}
