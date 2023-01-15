import { ConfigInterface } from '../common/config/config.interface.js';
import ConfigService from '../common/config/config.service.js';
import { DatabaseInterface } from '../common/dbClient/db.interface.js';
import MongoDBService from '../common/dbClient/mongodb.service.js';
import { TSVFileReader } from '../common/fileReader/tsvFileReader.js';
import { ConsoleLoggerService } from '../common/logger/consoleLogger.service.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { MovieServiceInterface } from '../modules/movie/movieService.interface.js';
import { MovieModel } from '../modules/movie/movie.entity.js';
import { MovieService } from '../modules/movie/movie.service.js';
import { UserServiceInterface } from '../modules/user/userService.interface.js';
import { UserModel } from '../modules/user/user.entity.js';
import { UserService } from '../modules/user/user.service.js';
import { Movie } from '../types/types/movie.type.js';
import { createMovie } from '../utils/movie.js';
import { getDBConnectionURI } from '../utils/db.js';
import { CliCommandInterface } from './cliCommand.interface.js';
import { DEFAULT_USER_PASSWORD } from '../constants/defaultPassword.constant.js';

export class ImportCommand implements CliCommandInterface {
  readonly name = '--import';
  private userService!: UserServiceInterface;
  private movieService!: MovieServiceInterface;
  private databaseService!: DatabaseInterface;
  private salt!: string;
  private readonly logger: LoggerInterface;
  private readonly config: ConfigInterface;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.movieService = new MovieService(this.logger, MovieModel);
    this.userService = new UserService(this.logger, UserModel, MovieModel);
    this.databaseService = new MongoDBService(this.logger);
    this.config = new ConfigService(this.logger);
  }

  async execute(filename: string): Promise<void> {
    const uri = getDBConnectionURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    this.salt = this.config.get('SALT');
    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`Не получается прочитать файл (: ${err.message}`);
      }
    }
  }

  private async saveMovie(movie: Movie) {
    const user = await this.userService.findOrCreate(
      {
        ...movie.user,
        password: process.env.DB_PASSWORD || DEFAULT_USER_PASSWORD,
      },
      this.salt
    );

    await this.movieService.create(movie, user.id);
  }

  private async onLine(line: string, resolve: () => void) {
    const movie = createMovie(line);
    this.logger.info(`Создан новый фильм: ${movie}`);
    await this.saveMovie(movie);
    resolve();
  }

  private onComplete(count: number) {
    this.logger.info(`${count} строк записано в файл !`);
    this.databaseService.disconnect();
  }
}
