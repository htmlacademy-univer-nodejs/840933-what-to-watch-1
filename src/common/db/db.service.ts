import mongoose from 'mongoose';
import {inject, injectable} from 'inversify';

import {Component} from '../../types/component.type.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {DBInterface} from './db.interface.js';

@injectable()
export class DBService implements DBInterface {
  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {}

  async connect(uri: string): Promise<void> {
    this.logger.info('Подключение к БД.');
    await mongoose.connect(uri);
    this.logger.info('Соединение установлено.');
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Соединение закрыто.');
  }
}