import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Config } from '../entities';

interface ControllerReturnProps {
  list: (ctx: Context) => Promise<Config[] | undefined>;
  get: (ctx: Context) => Promise<Config | undefined>;
  update: (ctx: Context) => Promise<Response['status']>;
}

export default (): ControllerReturnProps => {
  const configRepo = getManager().getRepository(Config);

  const list = async (ctx: Context) => {
    const data = await configRepo.find({});
    return (ctx.body = data);
  };

  const get = async (ctx: Context) => {
    const { id } = ctx.params;
    const data = await configRepo.findOne({
      where: { id },
    });
    return (ctx.body = data);
  };

  const update = async (ctx: Context) => {
    const { id } = ctx.params;

    try {
      await configRepo
        .createQueryBuilder()
        .update(Config)
        .set(ctx.request.body)
        .where({ id })
        .execute();

      return (ctx.status = 200);
    } catch (err: any) {
      throw new Error(err);
    }
  };

  return {
    list,
    get,
    update,
  };
};
