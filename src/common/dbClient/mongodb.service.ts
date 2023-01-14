import mongoose from 'mongoose';
import {inject, injectable} from 'inversify';
import {COMPONENT} from '../../types/types/component.type.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {DatabaseInterface} from './db.interface.js';

@injectable()
export default class MongoDBService implements DatabaseInterface {
  constructor(@inject(COMPONENT.LoggerInterface) private logger: LoggerInterface) {}

  async connect(uri: string): Promise<void> {
    this.logger.info('Connecting to MongoDB.');
    await mongoose.connect(uri);
    this.logger.info('Database connection established.');
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Database connection closed.');
  }
}
