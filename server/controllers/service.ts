import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Service } from '../entities';

interface ControllerReturnProps {
  list: (ctx: Context) => Promise<Service[] | undefined>;
  get: (ctx: Context) => Promise<Service | undefined>;
}

export default (): ControllerReturnProps => {
  const serviceRepo = getManager().getRepository(Service);

  const list = async (ctx: Context) => {
    const data = await serviceRepo.find({
      relations: ['category'],
    });
    return (ctx.body = data);
  };

  const get = async (ctx: Context) => {
    const { id } = ctx.params;
    const data = await serviceRepo.findOne({
      relations: ['category'],
      where: { id },
    });
    return (ctx.body = data);
  };

  return {
    list,
    get,
  };
};
