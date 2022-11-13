import 'reflect-metadata';
import {inject, injectable} from 'inversify';

import {LoggerInterface} from '../common/logger/logger.interface.js';
import {ConfigInterface} from '../common/config/config.interface.js';
import {Component} from '../types/component.type.js';
import {getDBConnectionURI} from '../utils/db-connection.js';
import {DBInterface} from '../common/db/db.interface.js';

@injectable()
export default class Application {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DBInterface) private dbClient: DBInterface) {
  }

  public async init() {
    this.logger.info('Приложение создано :)');
    this.logger.info(`Порт: ${this.config.get('PORT')}`);
    this.logger.info(`Хост базы данных: ${this.config.get('DB_HOST')}`);

    const uri = getDBConnectionURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    await this.dbClient.connect(uri);
  }
}
