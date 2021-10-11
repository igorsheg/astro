import { Context } from 'koa';
import path from 'path';
import { getManager } from 'typeorm';
import { Service } from '../entities';

interface ControllerReturnProps {
  list: (ctx: Context) => Promise<Service[] | undefined>;
  get: (ctx: Context) => Promise<Service | undefined>;
  post: (ctx: Context) => Promise<Service | undefined>;
  deleteEntity: (ctx: Context) => Promise<boolean>;
  update: (ctx: Context) => Promise<boolean>;
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
    } catch (err: any) {
      return (ctx.body = err.message);
    }
  };

  const update = async (ctx: Context) => {
    const reqBody: Service = ctx.request.body;
    console.log('From Patch --->');
    try {
      return await serviceRepo
        .update(
          { id: reqBody.id },
          { ...reqBody, logo: path.basename(reqBody.logo as string) },
        )
        .then(res => (ctx.body = res));
    } catch (err: any) {
      return (ctx.body = err.message);
    }
  };

  const deleteEntity = async (ctx: Context) => {
    const { id } = ctx.params;
    console.log('From Delete --->');

    try {
      await serviceRepo.delete(id);
      return (ctx.body = true);
    } catch {
      return (ctx.body = false);
    }
  };

  return {
    list,
    get,
    deleteEntity,
    post,
    update,
  };
};
