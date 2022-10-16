import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
}

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
  }
});