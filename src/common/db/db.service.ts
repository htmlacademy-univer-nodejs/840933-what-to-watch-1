import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';

import { Component } from '../../types/component.type.js';
import { Logger } from '../logger/logger.type.js';
import { DBInterface } from './db.interface.js';

@injectable()
export class DBService implements DBInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: Logger
  ) {}

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
