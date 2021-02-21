/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import figlet from 'figlet';
import { createConnection, EntityManager, EntityTarget } from 'typeorm';
import { Category, Config, Service, Theme } from '../entities';
import DB_CONFIG from './dbConfig';
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
  index: number;
}

const SeedManager = (manager: EntityManager) => {
  const seed = async <T>({ entity, idKey, data, index }: SeedProps<T>) => {
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
  figlet.text('Astro', { font: 'Larry 3D' }, (err, data) => {
    console.log(data);
    console.log('Initiating database', '');
  });

  const connection = await createConnection(DB_CONFIG);
  await connection.synchronize();

  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const seedManager = SeedManager(queryRunner.manager);

  try {
    await seedManager.seed({
      entity: Theme,
      data: [SAMPLE_THEMES.dark, SAMPLE_THEMES.light],
      idKey: 'id',
      index: 0,
    });

    await seedManager.seed({
      entity: Config,
      data: [SAMPLE_CONFIG],
      idKey: 'id',
      index: 1,
    });

    await seedManager.seed({
      entity: Category,
      data: SAMPLE_CATEGORIES,
      idKey: 'id',
      index: 2,
    });

    await seedManager.seed({
      entity: Service,
      data: SAMPLE_SERVICES,
      idKey: 'id',
      index: 3,
    });

    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};

initDb();

export default initDb;
