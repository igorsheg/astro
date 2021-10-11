import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Category, Service } from '../entities';

interface ControllerReturnProps {
  list: (ctx: Context) => Promise<Category[] | undefined>;
  get: (ctx: Context) => Promise<Category | undefined>;
  post: (ctx: Context) => Promise<Category | undefined>;
  del: (ctx: Context) => Promise<boolean>;
  update: (ctx: Context) => Promise<boolean>;
}

export default (): ControllerReturnProps => {
  const categoryRepo = getManager().getRepository(Category);

  const list = async (ctx: Context) => {
    const data = await categoryRepo.find({
      relations: ['services'],
    });
    return (ctx.body = data);
  };

  const get = async (ctx: Context) => {
    const { id } = ctx.params;
    const data = await categoryRepo.findOne({
      relations: ['services'],
      where: { id },
    });
    return (ctx.body = data);
  };

  const post = async (ctx: Context) => {
    const reqBody: Category = ctx.request.body;

    const draftService = categoryRepo.create({
      ...reqBody,
    });

    try {
      return categoryRepo.insert(draftService).then(res => (ctx.body = res));
    } catch (err: any) {
      return (ctx.body = err.message);
    }
  };

  const update = async (ctx: Context) => {
    const reqBody: Category = ctx.request.body;

    try {
      return await categoryRepo
        .update({ id: reqBody.id }, reqBody)
        .then(res => (ctx.body = res));
    } catch (err: any) {
      return (ctx.body = err.message);
    }
  };

  const del = async (ctx: Context) => {
    const { id } = ctx.params;

    try {
      getManager()
        .createQueryBuilder()
        .delete()
        .from(Service)
        .where('category.id = :id', { id })
        .delete()
        .from(Category)
        .where('id = :id', { id })
        .execute();

      return (ctx.body = true);
    } catch {
      return (ctx.body = false);
    }
  };

  return {
    list,
    get,
    post,
    update,
    del,
  };
};
