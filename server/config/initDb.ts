/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
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
}

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
      console.log(`✔ Default ${entityName} exists`);
      return;
    } catch (e) {
      await manager.insert(entity, data);
      console.log(`Seeding default ${entityName} ---> `, '✨ Done!');
      return;
    }
  };

  return { seed };
};

const initDb = async () => {
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
    });

    await seedManager.seed({
      entity: Config,
      data: [SAMPLE_CONFIG],
      idKey: 'id',
    });

    await seedManager.seed({
      entity: Category,
      data: SAMPLE_CATEGORIES,
      idKey: 'id',
    });

    await seedManager.seed({
      entity: Service,
      data: SAMPLE_SERVICES,
      idKey: 'id',
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
