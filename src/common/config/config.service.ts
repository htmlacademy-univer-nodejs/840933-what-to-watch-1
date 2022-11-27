import { config } from 'dotenv';
import { inject, injectable } from 'inversify';

import { ConfigInterface } from './config.interface.js';
import { Logger } from '../logger/logger.type.js';
import { ConfigSchema, configSchema } from './config.schema.js';
import { Component } from '../../types/component.type.js';

@injectable()
export default class ConfigService implements ConfigInterface {
  private readonly config: ConfigSchema;

  constructor(
    @inject(Component.LoggerInterface) private logger: Logger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Не получается прочитать .env файл.');
    }

    configSchema.load({});
    configSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configSchema.getProperties();
    this.logger.info('.env файл успешно прочитан');
  }

  get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key];
  }
}
