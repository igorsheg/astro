import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import {
  Category,
  Config,
  Link,
  Note,
  Service,
  Theme,
  PingLog,
} from '../entities';

dotenv.config({ path: '.env' });

const isDevMode = process.env.NODE_ENV === 'development';

export interface ServerConfig {
  port: number;
  dbConnectionOptions: ConnectionOptions;
}

const dbConnectionOptions: ConnectionOptions = {
  type: 'sqlite',
  database: './data/db.sqlite3',
  entities: [Config, Note, Link, Service, Category, Theme, PingLog],
  logging: isDevMode,
};

const serverConfig: ServerConfig = {
  port: +(process.env.PORT || 3000),
  dbConnectionOptions,
};

export { serverConfig, isDevMode };
