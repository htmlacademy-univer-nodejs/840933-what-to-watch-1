import mongoose from 'mongoose';
import {inject, injectable} from 'inversify';

import {Component} from '../types/component.type.js';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {DatabaseInterface} from './database.interface.js';

@injectable()
export default class DatabaseService implements DatabaseInterface {
  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface)
  {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Подключение к БД...');
    await mongoose.connect(uri);
    this.logger.info('Подключение установлено !');
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Соединение с БД остановлено :(');
  }
}
