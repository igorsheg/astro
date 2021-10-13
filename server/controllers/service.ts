import { Context } from 'koa';
import omit from 'lodash/omit';
import path from 'path';
import { getManager } from 'typeorm';
import check from 'uptime-check';
import { PingLog, Service } from '../entities';

interface ControllerReturnProps {
  list: (ctx: Context) => Promise<Service[] | undefined>;
  get: (ctx: Context) => Promise<Service | undefined>;
  post: (ctx: Context) => Promise<Service | undefined>;
  deleteEntity: (ctx: Context) => Promise<boolean>;
  update: (ctx: Context) => Promise<boolean>;
  ping: (ctx: Context) => Promise<any>;
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
    try {
      return getManager()
        .createQueryBuilder()
        .update(Service)
        .set({
          ...omit(reqBody, ['ping']),
          logo: path.basename(reqBody.logo as string),
        })
        .where('id = :id', { id: reqBody.id })
        .execute()
        .then(res => (ctx.body = res));
    } catch (err: any) {
      return (ctx.body = err.message);
    }
  };

  const deleteEntity = async (ctx: Context) => {
    const { id } = ctx.params;
    try {
      await serviceRepo.delete(id);
      return (ctx.body = true);
    } catch {
      return (ctx.body = false);
    }
  };

  const ping = async (ctx: Context) => {
    const services = await serviceRepo.find();

    await Promise.all(
      services.map(async service => {
        if (!service.url) return;

        const pingRes = await check({
          url: service.url,
          redirectsLimit: 10,
        });

        getManager()
          .createQueryBuilder()
          .insert()
          .into(PingLog)
          .values({
            latency: parseInt((pingRes.totalTime * 60).toFixed(), 10),
            service,
            alive: pingRes.status,
          })
          .execute();
      }),
    )
      .then(() => (ctx.body = 'Pinged Monitored Services'))
      .catch(err => ((ctx.body = 'Failed Pinging Services'), err));
  };

  return {
    list,
    get,
    deleteEntity,
    post,
    update,
    ping,
  };
};
