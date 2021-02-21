import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Theme } from '../entities';

interface ControllerReturnProps {
  list: (ctx: Context) => Promise<Theme[] | undefined>;
  get: (ctx: Context) => Promise<Theme | undefined>;
}

export default (): ControllerReturnProps => {
  const themeRepo = getManager().getRepository(Theme);

  const list = async (ctx: Context) => {
    const data = await themeRepo.find({});
    return (ctx.body = data);
  };

  const get = async (ctx: Context) => {
    const { id } = ctx.params;
    const data = await themeRepo.findOne({
      where: { id },
    });
    return (ctx.body = data);
  };

  return {
    list,
    get,
  };
};
