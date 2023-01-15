import {config} from 'dotenv';
import {inject, injectable} from 'inversify';

import {ConfigInterface} from './config.interface.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {CONFIG_SCHEMA, ConfigSchema} from './config.schema.js';
import { Component } from '../../types/types/component.type.js';

@injectable()
export class ConfigService implements ConfigInterface {
  private readonly config: ConfigSchema;

  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Cannot read .env file.');
    }

    CONFIG_SCHEMA.load({});
    CONFIG_SCHEMA.validate({allowed: 'strict', output: this.logger.info});

    this.config = CONFIG_SCHEMA.getProperties();

    this.logger.info('.env файл был успешно прочитан.');
  }

  get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key];
  }
}
