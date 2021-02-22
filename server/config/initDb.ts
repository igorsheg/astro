/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
import chalk from 'chalk';
import figlet from 'figlet';
import { createConnection, EntityManager, EntityTarget } from 'typeorm';
import { Category, Config, Service, Theme } from '../entities';
import { serverConfig } from './serverConfig';

import {
  SAMPLE_CATEGORIES,
  SAMPLE_CONFIG,
  SAMPLE_SERVICES,
  SAMPLE_THEMES,
} from './seed-data';

interface SeedProps<T> {
  entity: EntityTarget<T>;
  data: T[];
  idKey: keyof T;
}

const seeds: SeedProps<any>[] = [
  {
    entity: Theme,
    data: [SAMPLE_THEMES.dark, SAMPLE_THEMES.light],
    idKey: 'id',
  },

  {
    entity: Config,
    data: [SAMPLE_CONFIG],
    idKey: 'id',
  },

  {
    entity: Category,
    data: SAMPLE_CATEGORIES,
    idKey: 'id',
  },

  {
    entity: Service,
    data: SAMPLE_SERVICES,
    idKey: 'id',
  },
];

const SeedManager = (manager: EntityManager) => {
  const seed = async <T>({ entity, idKey, data }: SeedProps<T>) => {
    const entityName = ('' + entity.toString())
      .split('function ')[1]
      .split('(')[0];

    try {
      await Promise.all(
        data.map(dataEntity =>
          manager.findOneOrFail(entity, dataEntity[idKey]),
        ),
      );
      console.log(chalk`• Default ${entityName} ---> {green ✔ Exists} `);
      return;
    } catch (e) {
      await manager.insert(entity, data);
      console.log(chalk`• Default ${entityName} ---> {green ✔ Done seeding!}`);
      return;
    }
  };
  return { seed };
};

const initDb = async () => {
  figlet.text('Astro', { font: 'Slant' }, (_, data) => {
    console.log(data);
    console.log('Initiating database', '\n');
  });

  const connection = await createConnection(serverConfig.dbConnectionOptions);
  await connection.synchronize();

  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const seedManager = SeedManager(queryRunner.manager);

  try {
    for (let i = 0; i <= seeds.length - 1; i++) {
      setTimeout(
        i => {
          seedManager.seed(seeds[i]);
        },
        200 * i,
        i,
      );
    }

    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};

initDb();

export default initDb;
