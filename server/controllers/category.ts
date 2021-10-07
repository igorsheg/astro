import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Category } from '../entities';

interface ControllerReturnProps {
  list: (ctx: Context) => Promise<Category[] | undefined>;
  get: (ctx: Context) => Promise<Category | undefined>;
  post: (ctx: Context) => Promise<Category | undefined>;
}

export default (): ControllerReturnProps => {
  const serviceRepo = getManager().getRepository(Category);

  const list = async (ctx: Context) => {
    const data = await serviceRepo.find({
      relations: ['services'],
    });
    return (ctx.body = data);
  };

  const get = async (ctx: Context) => {
    const { id } = ctx.params;
    const data = await serviceRepo.findOne({
      relations: ['services'],
      where: { id },
    });
    return (ctx.body = data);
  };

  const post = async (ctx: Context) => {
    const reqBody: Category = ctx.request.body;

    const draftService = serviceRepo.create({
      ...reqBody,
    });

    try {
      return serviceRepo.insert(draftService).then(res => (ctx.body = res));
    } catch (err: any) {
      return (ctx.body = err.message);
    }
  };

  return {
    list,
    get,
    post,
  };
};
