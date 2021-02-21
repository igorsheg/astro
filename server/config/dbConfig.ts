import { ConnectionOptions } from 'typeorm';
import { Category, Config, Link, Note, Service, Theme } from '../entities';

const isProduction = process.env.NODE_ENV === 'production';

const DB_CONFIG: ConnectionOptions = {
  type: 'sqlite',
  database: './data/db.sqlite3',
  entities: [Config, Note, Link, Service, Category, Theme],
  logging: !isProduction,
  logger: 'debug',
};

export default DB_CONFIG;
