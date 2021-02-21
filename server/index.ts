/* eslint-disable no-console */
import Router from '@koa/router';
import Koa from 'koa';
import next from 'next';
import { createConnection } from 'typeorm';
import DB_CONFIG from './config/dbConfig';
import apiRouter from './routes';
import bodyParser from 'koa-body';

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();

  server.use(bodyParser());
  server.use(apiRouter.routes());

  await createConnection(DB_CONFIG);

  router.all('(.*)', async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
