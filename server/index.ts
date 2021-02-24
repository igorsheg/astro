/* eslint-disable no-console */
import Router from '@koa/router';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import next from 'next';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import winston from 'winston';
import { logger } from './config/logger';
import { isDevMode, serverConfig } from './config/serverConfig';
import apiRouter from './routes';

const app = next({ dev: isDevMode });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();

  server.use(logger(winston));
  server.use(apiRouter.routes());
  server.use(bodyParser());

  await createConnection(serverConfig.dbConnectionOptions);

  router.all(/^\/(?!api).*/, async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  router.get('/manage', async ctx => {
    await app.render(ctx.req, ctx.res, '/b', ctx.query);
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });
  server.use(router.routes());

  server.listen(serverConfig.port, () => {
    console.log(`> Ready on http://localhost:${serverConfig.port}`);
  });
});
