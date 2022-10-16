import 'reflect-metadata';
import {inject, injectable} from 'inversify';

import {LoggerInterface} from '../common/logger/logger.interface.js';
import {ConfigInterface} from '../common/config/config.interface.js';
import {Component} from '../types/component.type.js';

@injectable()
export default class Application {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface) {
  }

  public async init() {
    this.logger.info('Происходит запуск приложения');
    this.logger.info(`Порт: ${this.config.get('PORT')}`);
    this.logger.info(`Хост: ${this.config.get('DB_HOST')}`);
  }
}