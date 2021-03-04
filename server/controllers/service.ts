import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Service } from '../entities';
import path from 'path';

interface ControllerReturnProps {
  list: (ctx: Context) => Promise<Service[] | undefined>;
  get: (ctx: Context) => Promise<Service | undefined>;
  post: (ctx: Context) => Promise<Service | undefined>;
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

  const post = async (ctx: Context) => {
    const reqBody: Service = ctx.request.body;

    const draftService = serviceRepo.create({
      ...reqBody,
      logo: path.basename(reqBody.logo as string),
    });

    try {
      return serviceRepo.insert(draftService).then(res => (ctx.body = res));
    } catch (err) {
      return (ctx.body = err.message);
    }
  };

  return {
    list,
    get,
    post,
  };
};
