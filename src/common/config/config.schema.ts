import convict from 'convict';
import validator from 'convict-format-with-validator';

import { ConfigSchema } from './config.type.schema';

convict.addFormats(validator);

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Порт для исходящих запросов',
    format: 'port',
    env: 'PORT',
    default: 8000
  },
  DB_HOST: {
    doc: 'IP адрес базы данных MongoDB',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  SALT: {
    doc: '«Соль» для хеширования паролей',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_USER: {
    doc: 'Пользователь БД MongoDB',
    format: String,
    env: 'DB_USER',
    default: null
  },
  DB_PASSWORD: {
    doc: 'Пароль для базы MongoDB',
    format: String,
    env: 'DB_PASSWORD',
    default: null
  },
  DB_PORT: {
    doc: 'Порт БД MongoDB',
    format: 'port',
    env: 'DB_PORT',
    default: 27017
  },
  DB_NAME: {
    doc: 'Имя БД MongoDB',
    format: String,
    env: 'DB_NAME',
    default: 'what-to-watch'
  },
  UPLOAD_DIRECTORY: {
    doc: 'Папка для загрузки',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null
  }
});
