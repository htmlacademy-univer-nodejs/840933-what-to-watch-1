import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';

import { Component } from '../../types/types/component.type.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { DatabaseInterface } from './db.interface.js';

@injectable()
export default class MongoDBService implements DatabaseInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface
  ) {}

  async connect(uri: string): Promise<void> {
    this.logger.info('Подключение к БД MongoDB.');
    await mongoose.connect(uri);
    this.logger.info('Соединение было успешно установлено.');
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Соединение с базой данных было прервано.');
  }
}
